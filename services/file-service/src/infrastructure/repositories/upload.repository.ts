import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UploadedFile } from '../../domain/entities/uploaded-file.entity';

@Injectable()
export class UploadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    originalName: string;
    filename: string;
    publicId?: string;
    url: string;
    mimetype: string;
    size: number;
    provider: string;
    path?: string;
    userId?: string;
    metadata?: any;
  }): Promise<UploadedFile> {
    const uploadedFile = await this.prisma.uploadedFile.create({
      data: {
        originalName: data.originalName,
        filename: data.filename,
        publicId: data.publicId,
        url: data.url,
        mimetype: data.mimetype,
        size: data.size,
        provider: data.provider as any,
        path: data.path,
        userId: data.userId,
        metadata: data.metadata,
      },
    });

    return new UploadedFile(
      uploadedFile.id,
      uploadedFile.originalName,
      uploadedFile.filename,
      uploadedFile.url,
      uploadedFile.mimetype,
      uploadedFile.size,
      uploadedFile.provider,
      uploadedFile.publicId,
      uploadedFile.path,
      uploadedFile.userId,
      uploadedFile.metadata,
      uploadedFile.createdAt,
      uploadedFile.updatedAt,
      uploadedFile.deletedAt,
    );
  }

  async findById(id: string): Promise<UploadedFile | null> {
    const file = await this.prisma.uploadedFile.findUnique({
      where: { id, deletedAt: null },
    });

    if (!file) return null;

    return new UploadedFile(
      file.id,
      file.originalName,
      file.filename,
      file.url,
      file.mimetype,
      file.size,
      file.provider,
      file.publicId,
      file.path,
      file.userId,
      file.metadata,
      file.createdAt,
      file.updatedAt,
      file.deletedAt,
    );
  }

  async findByUserId(userId: string): Promise<UploadedFile[]> {
    const files = await this.prisma.uploadedFile.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    return files.map(file => new UploadedFile(
      file.id,
      file.originalName,
      file.filename,
      file.url,
      file.mimetype,
      file.size,
      file.provider,
      file.publicId,
      file.path,
      file.userId,
      file.metadata,
      file.createdAt,
      file.updatedAt,
      file.deletedAt,
    ));
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.uploadedFile.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
