import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { IUploadProvider, UploadResult } from '../../shared/interfaces/upload.interface';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class AwsUploadProvider implements IUploadProvider {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get('aws.bucketName');

    this.s3Client = new S3Client({
      region: this.configService.get('aws.region'),
      credentials: {
        accessKeyId: this.configService.get('aws.accessKeyId'),
        secretAccessKey: this.configService.get('aws.secretAccessKey'),
      },
    });
  }

  async uploadSingle(file: Express.Multer.File): Promise<UploadResult> {
    const filename = `products/${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: filename,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);

    const url = `https://${this.bucketName}.s3.amazonaws.com/${filename}`;

    return {
      id: uuidv4(),
      url,
      publicId: filename,
      originalName: file.originalname,
      filename,
      size: file.size,
      mimetype: file.mimetype,
      provider: 'AWS',
    };
  }

  async uploadMultiple(files: Express.Multer.File[]): Promise<UploadResult[]> {
    const uploadPromises = files.map(file => this.uploadSingle(file));
    return Promise.all(uploadPromises);
  }

  async delete(publicId: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: publicId,
      });

      await this.s3Client.send(command);
    } catch (error) {
      console.warn(`Failed to delete from AWS S3: ${publicId}`, error);
    }
  }

  getUrl(publicId: string): string {
    return `https://${this.bucketName}.s3.amazonaws.com/${publicId}`;
  }
}
