import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UploadFileDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  metadata?: any;
}

export class DeleteFileDto {
  @IsUUID()
  fileId: string;
}
