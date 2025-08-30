import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

export function SingleFileUpload(fieldName: string = 'file') {
  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName)),
  );
}

export function MultipleFilesUpload(fieldName: string = 'files', maxCount: number = 10) {
  return applyDecorators(
    UseInterceptors(FilesInterceptor(fieldName, maxCount)),
  );
}
