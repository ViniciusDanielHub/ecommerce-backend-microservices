import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { UpdateUserProfileInternalUseCase } from '../../domain/use-cases/update-user-profile-internal.use-case';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly updateUserProfileInternalUseCase: UpdateUserProfileInternalUseCase,
  ) { }

  async findById(userId: string): Promise<User | null> {
    return this.userRepository.findByUserId(userId);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  // REFATORADO: Usar Use Case para update de role
  async updateRole(userId: string, newRole: string): Promise<User> {
    return this.updateUserProfileInternalUseCase.execute(userId, {
      role: newRole.toUpperCase() as Role
    });
  }

  // NOVO: Método genérico para update de perfil (usado por serviços internos)
  async updateProfile(userId: string, updateData: any): Promise<User> {
    return this.updateUserProfileInternalUseCase.execute(userId, updateData);
  }

  async createProfile(data: {
    userId: string;
    name: string;
    email: string;
    role: string;
  }): Promise<User> {
    return this.userRepository.createProfile(data);
  }
}