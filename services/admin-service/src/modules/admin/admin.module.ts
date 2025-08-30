import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminController } from './admin.controller';
import { PromoteUserUseCase } from '../../domain/use-cases/promote-user.use-case';
import { GetAllUsersUseCase } from '../../domain/use-cases/get-all-users.use-case';
import { AdminRepository } from '../../infrastructure/repositories/admin.repository';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AdminController],
  providers: [
    PrismaService,
    AdminRepository,
    PromoteUserUseCase,
    GetAllUsersUseCase,
  ],
})
export class AdminModule {}
