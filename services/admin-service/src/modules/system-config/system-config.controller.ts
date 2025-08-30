import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { AdminGuard } from '../../shared/guards/admin.guard';
import { ManageSystemConfigUseCase } from '../../domain/use-cases/manage-system-config.use-case';
import { UpdateDefaultStoreNameDto, UpdateUploadConfigDto } from './dto/update-config.dto';
import { ResponseUtil } from '../../shared/utils/response.util';

@Controller('admin/config')
@UseGuards(JwtAuthGuard, AdminGuard)
export class SystemConfigController {
  constructor(
    private readonly manageSystemConfigUseCase: ManageSystemConfigUseCase,
  ) {}

  @Get('default-store-name')
  async getDefaultStoreName() {
    const defaultStoreName = await this.manageSystemConfigUseCase.getDefaultStoreName();
    return ResponseUtil.success({ defaultStoreName });
  }

  @Post('default-store-name')
  async updateDefaultStoreName(
    @Request() req: any,
    @Body() dto: UpdateDefaultStoreNameDto,
  ) {
    const adminId = req.user.sub;
    await this.manageSystemConfigUseCase.setDefaultStoreName(adminId, dto.defaultStoreName);
    return ResponseUtil.success(
      { defaultStoreName: dto.defaultStoreName },
      'Nome padrão da loja atualizado com sucesso',
    );
  }

  @Get('upload')
  async getUploadConfig() {
    const config = await this.manageSystemConfigUseCase.getUploadConfig();
    return ResponseUtil.success(config);
  }

  @Post('upload')
  async updateUploadConfig(
    @Request() req: any,
    @Body() dto: UpdateUploadConfigDto,
  ) {
    const adminId = req.user.sub;
    await this.manageSystemConfigUseCase.setUploadConfig(
      adminId,
      dto.provider,
      dto.maxFileSize,
      dto.allowedFormats,
    );
    return ResponseUtil.success(dto, 'Configurações de upload atualizadas com sucesso');
  }
}
