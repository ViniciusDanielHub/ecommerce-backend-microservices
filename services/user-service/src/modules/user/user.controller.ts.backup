import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { GetUserProfileUseCase } from '../../domain/use-cases/get-user-profile.use-case';
import { UpdateUserProfileUseCase } from '../../domain/use-cases/update-user-profile.use-case';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ResponseUtil } from '../../shared/utils/response.util';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
  ) {}

  @Get('me')
  async getProfile(@Request() req: any) {
    const userId = req.user.sub; // O JWT contém o userId no campo 'sub'
    const user = await this.getUserProfileUseCase.execute(userId);
    return ResponseUtil.success(user, 'Perfil recuperado com sucesso');
  }

  @Put('me')
  async updateProfile(
    @Request() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = req.user.sub;
    const user = await this.updateUserProfileUseCase.execute(userId, updateProfileDto);
    return ResponseUtil.success(user, 'Perfil atualizado com sucesso');
  }
}
