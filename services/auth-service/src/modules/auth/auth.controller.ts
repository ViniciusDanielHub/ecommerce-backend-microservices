import { Controller, Post, Body } from '@nestjs/common';
import { RegisterUseCase } from '../../domain/use-cases/register.use-case';
import { LoginUseCase } from '../../domain/use-cases/login.use-case';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role as PrismaRole } from '@prisma/client';
import { Role as DomainRole } from '../../shared/types';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
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
}