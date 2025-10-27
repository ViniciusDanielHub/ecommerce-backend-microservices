import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { GetUserProfileUseCase } from '../../domain/use-cases/get-user-profile.use-case';
import { UpdateUserProfileUseCase } from '../../domain/use-cases/update-user-profile.use-case';
import { CreateUserProfileUseCase } from '../../domain/use-cases/create-user-profile.use-case';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ResponseUtil } from '../../shared/utils/response.util';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
    private readonly createUserProfileUseCase: CreateUserProfileUseCase,
  ) {}

  @Get('me')
  async getProfile(@Request() req: any) {
    const userId = req.user.sub;
    
    try {
      const user = await this.getUserProfileUseCase.execute(userId);
      return ResponseUtil.success(user, 'Perfil recuperado com sucesso');
    } catch (error) {
      // Se não encontrar perfil, criar automaticamente
      if (error.message === 'Perfil de usuário não encontrado') {
        const newProfile = await this.createUserProfileUseCase.execute({
          userId: req.user.sub,
          name: req.user.name || 'Usuário',
          email: req.user.email,
          role: req.user.role || 'USER',
        });
        
        return ResponseUtil.success(newProfile, 'Perfil criado automaticamente');
      }
      throw error;
    }
  }

  @Put('me')
  async updateProfile(
    @Request() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = req.user.sub;
    
    try {
      const user = await this.updateUserProfileUseCase.execute(userId, updateProfileDto);
      return ResponseUtil.success(user, 'Perfil atualizado com sucesso');
    } catch (error) {
      // Se não encontrar perfil para atualizar, criar primeiro
      if (error.message === 'Perfil de usuário não encontrado') {
        await this.createUserProfileUseCase.execute({
          userId: req.user.sub,
          name: req.user.name || updateProfileDto.name || 'Usuário',
          email: req.user.email,
          role: req.user.role || 'USER',
        });
        
        // Agora tentar atualizar novamente
        const user = await this.updateUserProfileUseCase.execute(userId, updateProfileDto);
        return ResponseUtil.success(user, 'Perfil criado e atualizado com sucesso');
      }
      throw error;
    }
  }

  @Post('create-profile')
  async createProfile(
    @Request() req: any,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    const userId = req.user.sub;
    
    const profileData = {
      userId,
      name: createProfileDto.name || req.user.name || 'Usuário',
      email: createProfileDto.email || req.user.email,
      role: createProfileDto.role || req.user.role || 'USER',
    };
    
    const user = await this.createUserProfileUseCase.execute(profileData);
    return ResponseUtil.success(user, 'Perfil criado com sucesso');
  }
}
