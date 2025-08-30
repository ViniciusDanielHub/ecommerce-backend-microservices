import { Injectable, ConflictException } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { User } from '../entities/user.entity';

@Injectable()
export class CreateUserProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: {
    userId: string;
    name: string;
    email: string;
    role: string;
  }): Promise<User> {
    // Verificar se já existe um perfil para este usuário
    const existingUser = await this.userRepository.findByUserId(data.userId);
    if (existingUser) {
      throw new ConflictException('Perfil já existe para este usuário');
    }

    // Criar perfil
    const user = await this.userRepository.createProfile(data);

    // Registrar atividade
    await this.userRepository.logActivity(
      data.userId,
      'profile_created',
      'Perfil criado automaticamente'
    );

    return user;
  }
}
