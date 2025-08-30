import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUploadProvider } from '../../shared/interfaces/upload.interface';
import { LocalUploadProvider } from './local-upload.provider';
import { CloudinaryUploadProvider } from './cloudinary-upload.provider';
import { AwsUploadProvider } from './aws-upload.provider';

@Injectable()
export class UploadFactoryService {
  constructor(
    private readonly configService: ConfigService,
    private readonly localUploadProvider: LocalUploadProvider,
    private readonly cloudinaryUploadProvider: CloudinaryUploadProvider,
    private readonly awsUploadProvider: AwsUploadProvider,
  ) {}

  getUploadProvider(): IUploadProvider {
    const provider = this.configService.get<string>('upload.provider');

    switch (provider) {
      case 'CLOUDINARY':
        return this.cloudinaryUploadProvider;
      case 'AWS':
        return this.awsUploadProvider;
      case 'LOCAL':
      default:
        return this.localUploadProvider;
    }
  }
}
