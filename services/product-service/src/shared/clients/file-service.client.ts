import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { UploadedFileResponse } from '../interfaces/product.interface';

@Injectable()
export class FileServiceClient {
  private readonly fileServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.fileServiceUrl = this.configService.get('fileServiceUrl');
  }

  /**
   * Busca informações de um arquivo pelo ID
   */
  async getFileById(fileId: string, token?: string): Promise<UploadedFileResponse> {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await firstValueFrom(
        this.httpService.get(`${this.fileServiceUrl}/upload/${fileId}`, {
          headers,
        }),
      );

      return response.data;
    } catch (error) {
      console.error(`Error fetching file ${fileId}:`, error.message);
      throw new BadRequestException(`File not found: ${fileId}`);
    }
  }

  /**
   * Busca múltiplos arquivos por IDs
   */
  async getFilesByIds(fileIds: string[], token?: string): Promise<UploadedFileResponse[]> {
    const promises = fileIds.map(id => this.getFileById(id, token));
    return Promise.all(promises);
  }
}