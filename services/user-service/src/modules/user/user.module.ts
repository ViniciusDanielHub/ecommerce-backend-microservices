import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserController } from './user.controller';
import { GetUserProfileUseCase } from '../../domain/use-cases/get-user-profile.use-case';
import { UpdateUserProfileUseCase } from '../../domain/use-cases/update-user-profile.use-case';
import { CreateUserProfileUseCase } from '../../domain/use-cases/create-user-profile.use-case';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { InternalController } from './internal.controller'; 
import { UserService } from './user.service'; 
import { UpdateUserProfileInternalUseCase } from '@/domain/use-cases/update-user-profile-internal.use-case';


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
  controllers: [UserController, InternalController,],
  providers: [
    PrismaService,
    UserRepository,
    GetUserProfileUseCase,
    UpdateUserProfileUseCase,
    UpdateUserProfileInternalUseCase,
    CreateUserProfileUseCase,
    UserService, 
  ],
  exports: [
    UserRepository,
    CreateUserProfileUseCase,
    UpdateUserProfileInternalUseCase,
    UserService,
  ],
})
export class UserModule {}
