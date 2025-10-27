import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { User } from '../entities/user.entity';
import { UpdateUserProfileData } from '../../infrastructure/repositories/user.repository';

@Injectable()
export class UpdateUserProfileInternalUseCase {
  constructor(private readonly userRepository: UserRepository) { }

  async execute(userId: string, updateData: Partial<UpdateUserProfileData & { role?: string }>): Promise<User> {
    // Verificar se o usuário existe
    const existingUser = await this.userRepository.findByUserId(userId);
    if (!existingUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Validações específicas de role se fornecida
    let roleChanged = false;
    if (updateData.role) {
      // Validar se a role é válida
      const validRoles = ['USER', 'ADMIN', 'SELLER'];
      if (!validRoles.includes(updateData.role)) {
        throw new BadRequestException(`Role inválida. Roles válidas: ${validRoles.join(', ')}`);
      }

      // Verificar se a role realmente mudou
      roleChanged = updateData.role !== existingUser.role;

      // Se role não mudou, remover do updateData para evitar update desnecessário
      if (!roleChanged) {
        const { role, ...dataWithoutRole } = updateData;
        updateData = dataWithoutRole;
      }
    }

    // Validações específicas para outros campos (se necessário)
    if (updateData.birthDate) {
      const birthDate = new Date(updateData.birthDate);
      const today = new Date();
      if (birthDate > today) {
        throw new BadRequestException('Data de nascimento não pode ser no futuro');
      }
    }

    // Se não há dados para atualizar, retornar usuário existente
      if (Object.keys(updateData).length === 0) {
        return existingUser;
      }

    // Processar dados (incluindo birthDate se fornecida)
    const processedData = {
      ...updateData,
      birthDate: updateData.birthDate ? new Date(updateData.birthDate) : undefined,
    };

    // AQUI ACONTECE A ALTERAÇÃO REAL NO BANCO
    const updatedUser = await this.userRepository.updateProfile(userId, processedData);

    // Determinar tipo de ação para log baseado no que foi realmente alterado
    const action = roleChanged ? 'role_update' : 'profile_update_internal';

    let description: string;
    if (roleChanged) {
      description = `Role alterada de ${existingUser.role} para ${updateData.role}`;
    } else {
      const updatedFieldsNames = Object.keys(updateData).join(', ');
      description = `Perfil atualizado internamente. Campos: ${updatedFieldsNames}`;
    }

    // Preparar metadata detalhada para o log
    const logMetadata = {
      updatedFields: Object.keys(updateData),
      totalFieldsUpdated: Object.keys(updateData).length,
      ...(roleChanged && {
        previousRole: existingUser.role,
        newRole: updateData.role,
        roleChangeConfirmed: true,
      }),
      // Incluir valores anteriores para auditoria (opcional)
      previousValues: roleChanged ? {
        role: existingUser.role
      } : undefined
    };

    // Log da atividade
    await this.userRepository.logActivity(userId, action, description, logMetadata);

    return updatedUser;
  }
}