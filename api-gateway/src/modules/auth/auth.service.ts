import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MicroserviceClientService } from '../../shared/services/microservice-client.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly microserviceClient: MicroserviceClientService,
  ) {}

  async register(registerData: any) {
    try {
      const result = await firstValueFrom(
        this.microserviceClient.post('auth', '/auth/register', registerData)
      );
      return result;
    } catch (error) {
      this.handleServiceError(error, 'Erro ao registrar usuário');
    }
  }

  async login(loginData: any) {
    try {
      const result = await firstValueFrom(
        this.microserviceClient.post('auth', '/auth/login', loginData)
      );
      return result;
    } catch (error) {
      this.handleServiceError(error, 'Erro ao fazer login');
    }
  }

  async refreshToken(refreshData: any) {
    try {
      const result = await firstValueFrom(
        this.microserviceClient.post('auth', '/auth/refresh', refreshData)
      );
      return result;
    } catch (error) {
      this.handleServiceError(error, 'Erro ao renovar token');
    }
  }

  async logout(authorization: string) {
    try {
      const headers = { Authorization: authorization };
      const result = await firstValueFrom(
        this.microserviceClient.post('auth', '/auth/logout', {}, headers)
      );
      return result;
    } catch (error) {
      this.handleServiceError(error, 'Erro ao fazer logout');
    }
  }

  async forgotPassword(email: string) {
    try {
      const result = await firstValueFrom(
        this.microserviceClient.post('auth', '/auth/forgot-password', { email })
      );
      return result;
    } catch (error) {
      this.handleServiceError(error, 'Erro ao solicitar recuperação de senha');
    }
  }

  async resetPassword(resetData: any) {
    try {
      const result = await firstValueFrom(
        this.microserviceClient.post('auth', '/auth/reset-password', resetData)
      );
      return result;
    } catch (error) {
      this.handleServiceError(error, 'Erro ao resetar senha');
    }
  }

  async validateToken(token: string) {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const result = await firstValueFrom(
        this.microserviceClient.get('auth', '/auth/validate', headers)
      );
      return result;
    } catch (error) {
      throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);
    }
  }

  private handleServiceError(error: any, message: string) {
    const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const errorMessage = error.response?.data?.message || message;
    
    throw new HttpException(
      {
        message: errorMessage,
        error: error.response?.data?.error || 'Service Error',
        statusCode: status,
      },
      status,
    );
  }
}
