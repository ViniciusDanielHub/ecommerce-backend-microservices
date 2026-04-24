import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MicroserviceClientService } from '../../shared/services/microservice-client.service';
import { firstValueFrom } from 'rxjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendPhoneVerificationDto, VerifyPhoneDto } from './dto/phone-verification.dto';
import {
  RegisterResponse,
  VerifyEmailResponse,
  LoginResponse,
  RefreshTokenResponse,
  LogoutResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  ValidateTokenResponse,
  SendPhoneVerificationResponse,
  VerifyPhoneResponse,
} from './interfaces/index'

type ServiceError = {
  response?: {
    status?: number;
    data?: { message?: string; error?: string };
  };
};

@Injectable()
export class AuthService {
  constructor(
    private readonly microserviceClient: MicroserviceClientService,
  ) { }

  async register(registerData: RegisterDto): Promise<RegisterResponse> {
    try {
      return await firstValueFrom(
        this.microserviceClient.post<RegisterResponse>('auth', '/auth/register', registerData),
      );
    } catch (error) {
      this.handleServiceError(error, 'Erro ao registrar usuário');
    }
  }

  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    try {
      return await firstValueFrom(
        this.microserviceClient.get<VerifyEmailResponse>('auth', `/auth/verify-email?token=${token}`),
      );
    } catch (error) {
      this.handleServiceError(error, 'Erro ao verificar email');
    }
  }

  async login(loginData: LoginDto): Promise<LoginResponse> {
    try {
      return await firstValueFrom(
        this.microserviceClient.post<LoginResponse>('auth', '/auth/login', loginData),
      );
    } catch (error) {
      this.handleServiceError(error, 'Erro ao fazer login');
    }
  }

  async refreshToken(refreshData: RefreshTokenDto): Promise<RefreshTokenResponse> {
    try {
      return await firstValueFrom(
        this.microserviceClient.post<RefreshTokenResponse>('auth', '/auth/refresh', refreshData),
      );
    } catch (error) {
      this.handleServiceError(error, 'Erro ao renovar token');
    }
  }

  async logout(authorization: string): Promise<LogoutResponse> {
    try {
      const headers = { Authorization: authorization };
      const data = await firstValueFrom(
        this.microserviceClient.post<unknown>('auth', '/auth/logout', {}, headers),
      );

      return { success: true, message: 'Logout realizado com sucesso', data };
    } catch (error) {
      this.handleServiceError(error, 'Erro ao fazer logout');
    }
  }

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    try {
      return await firstValueFrom(
        this.microserviceClient.post<ForgotPasswordResponse>('auth', '/auth/forgot-password', { email }),
      );
    } catch (error) {
      this.handleServiceError(error, 'Erro ao solicitar recuperação de senha');
    }
  }

  async resetPassword(resetData: ResetPasswordDto): Promise<ResetPasswordResponse> {
    try {
      return await firstValueFrom(
        this.microserviceClient.post<ResetPasswordResponse>('auth', '/auth/reset-password', resetData),
      );
    } catch (error) {
      this.handleServiceError(error, 'Erro ao resetar senha');
    }
  }

  async validateToken(token: string): Promise<ValidateTokenResponse> {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      return await firstValueFrom(
        this.microserviceClient.get<ValidateTokenResponse>('auth', '/auth/validate', headers),
      );
    } catch (error) {
      throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);
    }
  }

  async sendPhoneVerification(data: SendPhoneVerificationDto): Promise<SendPhoneVerificationResponse> {
    try {
      return await firstValueFrom(
        this.microserviceClient.post<SendPhoneVerificationResponse>('auth', '/auth/send-phone-verification', data),
      );
    } catch (error) {
      this.handleServiceError(error, 'Erro ao enviar verificação de telefone');
    }
  }

  async verifyPhone(data: VerifyPhoneDto): Promise<VerifyPhoneResponse> {
    try {
      return await firstValueFrom(
        this.microserviceClient.post<VerifyPhoneResponse>('auth', '/auth/verify-phone', data),
      );
    } catch (error) {
      this.handleServiceError(error, 'Erro ao verificar telefone');
    }
  }

  async resendPhoneVerification(data: SendPhoneVerificationDto): Promise<SendPhoneVerificationResponse> {
    try {
      return await firstValueFrom(
        this.microserviceClient.post<SendPhoneVerificationResponse>('auth', '/auth/resend-phone-verification', data),
      );
    } catch (error) {
      this.handleServiceError(error, 'Erro ao reenviar verificação de telefone');
    }
  }

  private handleServiceError(error: ServiceError, message: string): never {
    const status = error.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const errorMessage = error.response?.data?.message ?? message;

    throw new HttpException(
      {
        message: errorMessage,
        error: error.response?.data?.error ?? 'Service Error',
        statusCode: status,
      },
      status,
    );
  }
}