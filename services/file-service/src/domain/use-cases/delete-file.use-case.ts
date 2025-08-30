import { Injectable, NotFoundException } from '@nestjs/common';
import { UploadFactoryService } from '../../infrastructure/upload/upload-factory.service';
import { UploadRepository } from '../../infrastructure/repositories/upload.repository';

@Injectable()
export class DeleteFileUseCase {
  constructor(
    private readonly uploadFactory: UploadFactoryService,
    private readonly uploadRepository: UploadRepository,
  ) {}

  async execute(fileId: string): Promise<void> {
    // Buscar arquivo no banco
    const file = await this.uploadRepository.findById(fileId);
    if (!file) {
      throw new NotFoundException('Arquivo não encontrado');
    }

    // Deletar do provider (local, cloudinary, aws)
    const uploadProvider = this.uploadFactory.getUploadProvider();
    if (file.publicId) {
      await uploadProvider.delete(file.publicId);
    }

    // Soft delete no banco
    await this.uploadRepository.softDelete(fileId);
  }
}
