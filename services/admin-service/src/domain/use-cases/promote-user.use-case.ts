import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminRepository } from '../../infrastructure/repositories/admin.repository';
import axios from 'axios';

@Injectable()
export class PromoteUserUseCase {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly configService: ConfigService,
  ) {}

  async execute(adminId: string, userId: string, newRole: string): Promise<any> {
    const authServiceUrl = this.configService.get('services.authService');

    try {
      // Chamar o auth-service para promover o usuário
      const response = await axios.put(`${authServiceUrl}/admin/promote-user`, {
        userId,
        newRole,
      });

      // Log da ação administrativa
      await this.adminRepository.logAdminAction({
        adminId,
        action: 'promote_user',
        targetId: userId,
        targetType: 'user',
        description: `Usuário promovido para ${newRole}`,
        metadata: { previousRole: response.data.previousRole, newRole },
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException('Usuário não encontrado');
      }
      if (error.response?.status === 400) {
        throw new BadRequestException(error.response.data.message);
      }
      throw error;
    }
  }
}
