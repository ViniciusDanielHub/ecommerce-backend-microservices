import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { RegisterUseCase } from '../../domain/use-cases/register.use-case';
import { LoginUseCase } from '../../domain/use-cases/login.use-case';
import { LogoutUseCase } from '../../domain/use-cases/logout.use-case';
import { ForgotPasswordUseCase } from '../../domain/use-cases/forgot-password.use-case';
import { ResetPasswordUseCase } from '../../domain/use-cases/reset-password.use-case';
import { VerifyEmailUseCase } from '../../domain/use-cases/verify-email.use-case';
import { SendPhoneVerificationUseCase } from '../../domain/use-cases/send-phone-verification.use-case';
import { VerifyPhoneUseCase } from '../../domain/use-cases/verify-phone.use-case';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { EmailService } from '../../infrastructure/email/email.service';
import { PhoneService } from '../../infrastructure/phone/phone.service';

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
    PhoneService,
    VerifyEmailUseCase,
    SendPhoneVerificationUseCase,
    VerifyPhoneUseCase,
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
export class AuthModule { }