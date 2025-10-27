import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminRepository } from '../../../../admin-service/src/infrastructure/repositories/admin.repository'
import axios from 'axios';

interface UserRoleUpdateData {
  userId: string;
  previousRole: string;
  newRole: string;
  user: any;
  changed: boolean;
}

interface UserServiceResponse {
  success: boolean;
  message: string;
  data: UserRoleUpdateData;
}

@Injectable()
export class PromoteUserUseCase {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly configService: ConfigService,
  ) { }

  async execute(adminId: string, userId: string, newRole: string): Promise<any> {
    const userServiceUrl = this.configService.get('services.userService');
    const internalToken = this.configService.get('internalServiceToken') || 'secure-internal-token-2024';

    try {
      // Headers para comunicação interna
      const internalHeaders = {
        'X-Service-Token': internalToken,
        'X-Calling-Service': 'admin-service',
        'Content-Type': 'application/json'
      };

      // Atualizar role do usuário via endpoint interno
      const response = await axios.put<UserServiceResponse>(
        `${userServiceUrl}/internal/users/${userId}/role`,
        { newRole },
        { headers: internalHeaders }
      );

      // Extrair dados da resposta
      const { previousRole, newRole: updatedRole, changed } = response.data.data;

      // Log da ação administrativa
      await this.adminRepository.logAdminAction({
        adminId,
        action: 'promote_user',
        targetId: userId,
        targetType: 'user',
        description: changed
          ? `Usuário promovido de ${previousRole} para ${updatedRole}`
          : `Tentativa de promoção - usuário já possui role ${updatedRole}`,
        metadata: { previousRole, newRole: updatedRole, changed },
      });

      return response.data;
    } catch (error) {
      // Tratamento de erros
      if (error.response?.status === 404) {
        throw new NotFoundException('Usuário não encontrado');
      }
      if (error.response?.status === 400) {
        throw new BadRequestException(error.response.data.message || 'Dados inválidos');
      }
      if (error.response?.status === 401) {
        throw new BadRequestException('Token de serviço interno inválido');
      }
      if (error.response?.status === 403) {
        throw new BadRequestException('Serviço não autorizado para esta operação');
      }

      console.error('Erro ao promover usuário:', error.message);
      throw new Error('Erro interno no serviço de usuários');
    }
  }
}