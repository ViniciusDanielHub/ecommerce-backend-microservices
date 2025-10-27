import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { AdminGuard } from '../../shared/guards/admin.guard';
import { PromoteUserUseCase } from '../../domain/use-cases/promote-user.use-case';
import { GetAllUsersUseCase } from '../../domain/use-cases/get-all-users.use-case';
import { PromoteUserDto } from './dto/promote-user.dto';
import { ResponseUtil } from '../../shared/utils/response.util';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(
    private readonly promoteUserUseCase: PromoteUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
  ) { }

  @Get('users')
  async getAllUsers(@Request() req: any) {
    const adminId = req.user.sub;
    const users = await this.getAllUsersUseCase.execute(adminId);
    return ResponseUtil.success(users, 'Lista de usuários recuperada');
  }

  @Put('users/:userId/promote')
  async promoteUser(
    @Request() req: any,
    @Param('userId') userId: string,
    @Body() promoteUserDto: PromoteUserDto,
  ): Promise<{ success: boolean; message: string; data?: any }> {
    const adminId = req.user.sub;
    const result: any = await this.promoteUserUseCase.execute(
      adminId,
      userId,
      promoteUserDto.newRole,
    );
    return ResponseUtil.success(result, 'Usuário promovido com sucesso');
  }
}