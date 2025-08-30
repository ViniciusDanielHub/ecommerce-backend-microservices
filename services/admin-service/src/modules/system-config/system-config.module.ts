import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SystemConfigController } from './system-config.controller';
import { ManageSystemConfigUseCase } from '../../domain/use-cases/manage-system-config.use-case';
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
  controllers: [SystemConfigController],
  providers: [
    PrismaService,
    AdminRepository,
    ManageSystemConfigUseCase,
  ],
})
export class SystemConfigModule {}
