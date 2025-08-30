import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { IUploadProvider, UploadResult } from '../../shared/interfaces/upload.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CloudinaryUploadProvider implements IUploadProvider {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('cloudinary.cloudName'),
      api_key: this.configService.get('cloudinary.apiKey'),
      api_secret: this.configService.get('cloudinary.apiSecret'),
    });
  }

  async uploadSingle(file: Express.Multer.File): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'products',
          resource_type: 'image',
          transformation: [
            { quality: 'auto:good' },
            { format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) return reject(error);

          resolve({
            id: uuidv4(),
            url: result!.secure_url,
            publicId: result!.public_id,
            originalName: file.originalname,
            filename: result!.public_id,
            size: result!.bytes,
            mimetype: file.mimetype,
            provider: 'CLOUDINARY',
          });
        }
      ).end(file.buffer);
    });
  }

  async uploadMultiple(files: Express.Multer.File[]): Promise<UploadResult[]> {
    const uploadPromises = files.map(file => this.uploadSingle(file));
    return Promise.all(uploadPromises);
  }

  async delete(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.warn(`Failed to delete from Cloudinary: ${publicId}`, error);
    }
  }

  getUrl(publicId: string): string {
    return cloudinary.url(publicId);
  }
}
