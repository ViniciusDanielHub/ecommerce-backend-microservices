import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadFactoryService } from '../../infrastructure/upload/upload-factory.service';
import { UploadRepository } from '../../infrastructure/repositories/upload.repository';
import { UploadResult } from '../../shared/interfaces/upload.interface';

@Injectable()
export class UploadFilesUseCase {
  private readonly maxFileSize: number;
  private readonly allowedFormats: string[];

  constructor(
    private readonly configService: ConfigService,
    private readonly uploadFactory: UploadFactoryService,
    private readonly uploadRepository: UploadRepository,
  ) {
    this.maxFileSize = this.configService.get('upload.maxFileSize');
    this.allowedFormats = this.configService.get('upload.allowedFormats');
  }

  private validateFile(file: Express.Multer.File): void {
    // Verificar tamanho
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(`Arquivo muito grande. Máximo permitido: ${this.maxFileSize / 1024 / 1024}MB`);
    }

    // Verificar formato
    const extension = file.originalname.split('.').pop()?.toLowerCase();
    if (!extension || !this.allowedFormats.includes(extension)) {
      throw new BadRequestException(`Formato não permitido. Formatos aceitos: ${this.allowedFormats.join(', ')}`);
    }

    // Verificar MIME type
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Arquivo deve ser uma imagem');
    }
  }

  async uploadSingle(file: Express.Multer.File, userId?: string, metadata?: any): Promise<any> {
    this.validateFile(file);
    
    const uploadProvider = this.uploadFactory.getUploadProvider();
    const result = await uploadProvider.uploadSingle(file);

    // Salvar no banco
    const uploadedFile = await this.uploadRepository.create({
      originalName: result.originalName,
      filename: result.filename,
      publicId: result.publicId,
      url: result.url,
      mimetype: result.mimetype,
      size: result.size,
      provider: result.provider,
      userId,
      metadata,
    });

    return {
      id: uploadedFile.id,
      url: uploadedFile.url,
      originalName: uploadedFile.originalName,
      size: uploadedFile.size,
      mimetype: uploadedFile.mimetype,
    };
  }

  async uploadMultiple(files: Express.Multer.File[], userId?: string, metadata?: any): Promise<any[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    // Validar todos os arquivos
    files.forEach(file => this.validateFile(file));

    const uploadProvider = this.uploadFactory.getUploadProvider();
    const results = await uploadProvider.uploadMultiple(files);

    // Salvar todos no banco
    const uploadedFiles = [];
    for (const result of results) {
      const uploadedFile = await this.uploadRepository.create({
        originalName: result.originalName,
        filename: result.filename,
        publicId: result.publicId,
        url: result.url,
        mimetype: result.mimetype,
        size: result.size,
        provider: result.provider,
        userId,
        metadata,
      });

      uploadedFiles.push({
        id: uploadedFile.id,
        url: uploadedFile.url,
        originalName: uploadedFile.originalName,
        size: uploadedFile.size,
        mimetype: uploadedFile.mimetype,
      });
    }

    return uploadedFiles;
  }
}
