import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Headers,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { ResponseUtil } from '../../shared/utils/response.util';

@Controller('internal')
export class InternalController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) { }

  /**
   * Buscar usuário por ID (para outros microserviços)
   */
  @Get('users/:id')
  async getUser(
    @Param('id') userId: string,
    @Headers('x-service-token') serviceToken: string,
    @Headers('x-calling-service') callingService: string,
  ) {
    // Validar token interno
    this.validateInternalCall(serviceToken, callingService);

    try {
      const user = await this.userService.findById(userId);

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      return ResponseUtil.success(user, 'Usuário encontrado');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Atualizar role do usuário (para admin-service)
   */
  @Put('users/:id/role')
  async updateUserRole(
    @Param('id') userId: string,
    @Body() { newRole }: { newRole: string },
    @Headers('x-service-token') serviceToken: string,
    @Headers('x-calling-service') callingService: string,
  ) {
    // Validar token interno
    this.validateInternalCall(serviceToken, callingService);

    // Validar role
    const validRoles = ['USER', 'ADMIN', 'SELLER'];
    if (!validRoles.includes(newRole)) {
      throw new UnauthorizedException('Role inválida');
    }

    try {
      // Buscar usuário atual para obter previousRole
      const currentUser = await this.userService.findById(userId);
      if (!currentUser) {
        throw new NotFoundException('Usuário não encontrado');
      }

      const previousRole = currentUser.role;

      // Verificar se role é diferente
      if (previousRole === newRole) {
        return ResponseUtil.success(
          { userId, previousRole, newRole, changed: false },
          'Usuário já possui esta role'
        );
      }

      // Atualizar role
      const updatedUser = await this.userService.updateRole(userId, newRole);

      return ResponseUtil.success(
        {
          userId,
          previousRole, // ← Este valor vai para o admin-service
          newRole,
          user: updatedUser,
          changed: true,
        },
        `Role alterada de ${previousRole} para ${newRole} com sucesso`
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Listar todos os usuários (para admin-service)
   */
  @Get('users')
  async getAllUsers(
    @Headers('x-service-token') serviceToken: string,
    @Headers('x-calling-service') callingService: string,
  ) {
    // Validar token interno
    this.validateInternalCall(serviceToken, callingService);

    try {
      const users = await this.userService.findAll();
      return ResponseUtil.success(users, 'Lista de usuários recuperada');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Validar se a chamada é de um serviço interno autorizado
   */
  private validateInternalCall(serviceToken: string, callingService: string) {
    // Verificar token interno
    const expectedToken = this.configService.get<string>('internalServiceToken') || 'internal-service-call';
    if (serviceToken !== expectedToken) {
      throw new UnauthorizedException('Token de serviço interno inválido');
    }

    // Verificar serviço autorizado
    const authorizedServices = ['admin-service', 'auth-service'];
    if (!callingService || !authorizedServices.includes(callingService)) {
      throw new ForbiddenException(`Serviço '${callingService}' não autorizado para chamadas internas`);
    }
  }
}