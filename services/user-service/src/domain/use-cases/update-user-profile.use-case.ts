import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { User } from '../entities/user.entity';
import { UpdateProfileDto } from '../../modules/user/dto/update-profile.dto';

@Injectable()
export class UpdateUserProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string, updateData: UpdateProfileDto): Promise<User> {
    // Verificar se o usuário existe
    const existingUser = await this.userRepository.findByUserId(userId);
    if (!existingUser) {
      throw new NotFoundException('Perfil de usuário não encontrado');
    }

    // Converter birthDate string para Date se fornecida
    const processedData = {
      ...updateData,
      birthDate: updateData.birthDate ? new Date(updateData.birthDate) : undefined,
    };

    // Atualizar perfil
    const updatedUser = await this.userRepository.updateProfile(userId, processedData);

    // Registrar atividade
    await this.userRepository.logActivity(
      userId,
      'profile_update',
      'Perfil atualizado pelo usuário',
      { updatedFields: Object.keys(updateData) }
    );

    return updatedUser;
  }
}
