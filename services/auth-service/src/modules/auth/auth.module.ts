import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { RegisterUseCase } from '../../domain/use-cases/register.use-case';
import { LoginUseCase } from '../../domain/use-cases/login.use-case';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { LogoutUseCase } from 'src/domain/use-cases/logout.use-case';
import { ForgotPasswordUseCase } from 'src/domain/use-cases/forgot-password.use-case';
import { ResetPasswordUseCase } from 'src/domain/use-cases/reset-password.use-case';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { EmailService } from 'src/infrastructure/email/email.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: configService.get<string>('jwt.expiresIn') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    RegisterUseCase,
    LoginUseCase,
    LogoutUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
    JwtAuthGuard,
    EmailService,
    {
      provide: 'USER_REPOSITORY',
      useClass: UserRepository,
    },
  ],
  exports: [
    {
      provide: 'USER_REPOSITORY',
      useClass: UserRepository,
    },
  ],
})
export class AuthModule {}
