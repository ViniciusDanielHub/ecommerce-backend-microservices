import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminRepository } from '../../infrastructure/repositories/admin.repository';
import axios from 'axios';

@Injectable()
export class GetAllUsersUseCase {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly configService: ConfigService,
  ) { }

  async execute(adminId: string): Promise<any> {
    const userServiceUrl = this.configService.get('services.userService');
    const internalToken = this.configService.get('internalServiceToken') || 'internal-service-call';

    try {
      const response = await axios.get(
        `${userServiceUrl}/internal/users`,
        {
          headers: {
            'X-Service-Token': internalToken,
            'X-Calling-Service': 'admin-service',
            'Content-Type': 'application/json'
          }
        }
      );

      const result: any = response.data;
      const users: any[] = result.data || [];

      // Log da ação
      await this.adminRepository.logAdminAction({
        adminId,
        action: 'list_users',
        description: 'Listagem de todos os usuários',
        metadata: { totalUsers: users.length },
      });

      return result;

    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Token de serviço interno inválido');
      }
      if (error.response?.status === 403) {
        throw new Error('Serviço não autorizado para esta operação');
      }

      console.error('Erro ao buscar usuários:', error.message);
      throw new Error('Erro interno no serviço de usuários');
    }
  }
}