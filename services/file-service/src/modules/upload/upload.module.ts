import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadController } from './upload.controller';
import { UploadFilesUseCase } from '../../domain/use-cases/upload-files.use-case';
import { DeleteFileUseCase } from '../../domain/use-cases/delete-file.use-case';
import { UploadRepository } from '../../infrastructure/repositories/upload.repository';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { UploadFactoryService } from '../../infrastructure/upload/upload-factory.service';
import { LocalUploadProvider } from '../../infrastructure/upload/local-upload.provider';
import { CloudinaryUploadProvider } from '../../infrastructure/upload/cloudinary-upload.provider';
import { AwsUploadProvider } from '../../infrastructure/upload/aws-upload.provider';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UploadController],
  providers: [
    PrismaService,
    UploadRepository,
    UploadFilesUseCase,
    DeleteFileUseCase,
    UploadFactoryService,
    LocalUploadProvider,
    CloudinaryUploadProvider,
    AwsUploadProvider,
  ],
})
export class UploadModule {}
