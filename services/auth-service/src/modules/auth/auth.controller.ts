import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { RegisterUseCase } from '../../domain/use-cases/register.use-case';
import { LoginUseCase } from '../../domain/use-cases/login.use-case';
import { LogoutUseCase } from 'src/domain/use-cases/logout.use-case'; 
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role as PrismaRole } from '@prisma/client';
import { Role as DomainRole } from '../../shared/types';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { ForgotPasswordUseCase } from 'src/domain/use-cases/forgot-password.use-case';
import { ResetPasswordUseCase } from 'src/domain/use-cases/reset-password.use-case';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,   
    private readonly resetPasswordUseCase: ResetPasswordUseCase, 
  ) { }

  // ✅ Método privado para converter role
  private convertRole(prismaRole?: PrismaRole): DomainRole | undefined {
    if (!prismaRole) return undefined;

    const roleMap: Record<PrismaRole, DomainRole> = {
      USER: DomainRole.USER,
      ADMIN: DomainRole.ADMIN,
      SELLER: DomainRole.SELLER,
    };

    return roleMap[prismaRole];
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    // ✅ Converter role antes de passar para o use case
    const userData = {
      name: registerDto.name,
      email: registerDto.email,
      password: registerDto.password,
      role: this.convertRole(registerDto.role),
    };

    return this.registerUseCase.execute(userData);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.loginUseCase.execute(loginDto.email, loginDto.password);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req: any) {
    const userId = req.user.sub;
    return this.logoutUseCase.execute(userId);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.forgotPasswordUseCase.execute(forgotPasswordDto.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.resetPasswordUseCase.execute(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }
}