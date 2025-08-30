import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

enum UploadProvider {
  LOCAL = 'LOCAL',
  CLOUDINARY = 'CLOUDINARY',
  AWS = 'AWS',
}

export class UpdateDefaultStoreNameDto {
  @IsString()
  @IsNotEmpty()
  defaultStoreName: string;
}

export class UpdateUploadConfigDto {
  @IsEnum(UploadProvider)
  provider: UploadProvider;

  @IsString()
  @IsNotEmpty()
  maxFileSize: string;

  @IsString()
  @IsNotEmpty()
  allowedFormats: string;
}
