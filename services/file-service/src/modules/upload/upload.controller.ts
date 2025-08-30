import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { SingleFileUpload, MultipleFilesUpload } from '../../shared/decorators/upload.decorator';
import { UploadFilesUseCase } from '../../domain/use-cases/upload-files.use-case';
import { DeleteFileUseCase } from '../../domain/use-cases/delete-file.use-case';
import { UploadFileDto, DeleteFileDto } from './dto/upload.dto';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(
    private readonly uploadFilesUseCase: UploadFilesUseCase,
    private readonly deleteFileUseCase: DeleteFileUseCase,
  ) {}

  @Post('single')
  @SingleFileUpload('file')
  async uploadSingle(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadFileDto,
    @Request() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    const userId = req.user.sub;
    const result = await this.uploadFilesUseCase.uploadSingle(
      file,
      userId,
      dto.metadata,
    );

    return {
      message: 'Arquivo enviado com sucesso',
      file: result,
    };
  }

  @Post('multiple')
  @MultipleFilesUpload('files', 10)
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: UploadFileDto,
    @Request() req: any,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    const userId = req.user.sub;
    const results = await this.uploadFilesUseCase.uploadMultiple(
      files,
      userId,
      dto.metadata,
    );

    return {
      message: 'Arquivos enviados com sucesso',
      files: results,
    };
  }

  @Delete(':fileId')
  async deleteFile(@Param('fileId') fileId: string) {
    await this.deleteFileUseCase.execute(fileId);

    return {
      message: 'Arquivo deletado com sucesso',
    };
  }
}
