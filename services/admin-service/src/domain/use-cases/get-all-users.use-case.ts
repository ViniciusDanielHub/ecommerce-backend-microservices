import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminRepository } from '../../infrastructure/repositories/admin.repository';
import axios from 'axios';

@Injectable()
export class GetAllUsersUseCase {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly configService: ConfigService,
  ) {}

  async execute(adminId: string): Promise<any> {
    const authServiceUrl = this.configService.get('services.authService');

    try {
      // Chamar o auth-service para buscar todos os usuários
      const response = await axios.get(`${authServiceUrl}/admin/users`);

      // Log da ação administrativa
      await this.adminRepository.logAdminAction({
        adminId,
        action: 'list_users',
        description: 'Listagem de todos os usuários',
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
