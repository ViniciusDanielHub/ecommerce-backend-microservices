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
  NotFoundException,
  Get,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { SingleFileUpload, MultipleFilesUpload } from '../../shared/decorators/upload.decorator';
import { UploadFilesUseCase } from '../../domain/use-cases/upload-files.use-case';
import { DeleteFileUseCase } from '../../domain/use-cases/delete-file.use-case';
import { UploadFileDto, DeleteFileDto } from './dto/upload.dto';
import { UploadRepository } from '@/infrastructure/repositories/upload.repository';
import { AdminGuard } from '@/shared/guards/admin.guard';

@Controller('upload')
  @UseGuards(JwtAuthGuard, AdminGuard)
export class UploadController {
  constructor(
    private readonly uploadFilesUseCase: UploadFilesUseCase,
    private readonly deleteFileUseCase: DeleteFileUseCase,
    private readonly uploadRepository: UploadRepository, 
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

  @Get()
  async listFiles(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [files, total] = await Promise.all([
      this.uploadRepository.findAll(skip, limitNum),
      this.uploadRepository.count(),
    ]);

    return {
      message: 'Arquivos listados com sucesso',
      files: files.map(file => ({
        id: file.id,
        url: file.url,
        originalName: file.originalName,
        size: file.size,
        mimetype: file.mimetype,
        createdAt: file.createdAt,
      })),
      pagination: {
        total,
        totalPages: Math.ceil(total / limitNum),
        currentPage: pageNum,
        limit: limitNum,
      },
    };
  }

  @Get('my-files')
  async getMyFiles(
    @Request() req: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    const userId = req.user.sub;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const files = await this.uploadRepository.findByUserId(userId);

    // Paginação manual
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum; 
    const paginatedFiles = files.slice(startIndex, endIndex);

    return {
      message: 'Seus arquivos',
      files: paginatedFiles.map(file => ({
        id: file.id,
        url: file.url,
        originalName: file.originalName,
        size: file.size,
        mimetype: file.mimetype,
        createdAt: file.createdAt,
      })),
      pagination: {
        total: files.length,
        totalPages: Math.ceil(files.length / limitNum),
        currentPage: pageNum,
        limit: limitNum,
      },
    };
  }

  @Get(':fileId')
  async getFile(@Param('fileId') fileId: string) {
    // Busca no banco (uploaded_files)
    const file = await this.uploadRepository.findById(fileId);

    if (!file) {
      throw new NotFoundException('Arquivo não encontrado');
    }

    // Retorna os dados
    return {
      message: 'Arquivo encontrado',
      file: {
        id: file.id,
        url: file.url,
        originalName: file.originalName,
        size: file.size,
        mimetype: file.mimetype,
        createdAt: file.createdAt,
      },
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
