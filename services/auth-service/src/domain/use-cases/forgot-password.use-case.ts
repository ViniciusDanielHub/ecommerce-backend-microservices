import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IUserRepository } from '../../infrastructure/repositories/user.repository';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../../infrastructure/email/email.service';
import * as crypto from 'crypto';

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: IUserRepository,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) { }

  async execute(email: string): Promise<{ message: string; token?: string }> {
    // Buscar usuário pelo email
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      // Por segurança, não informar se o email existe ou não
      return {
        message: 'Se o email existir, um link de recuperação será enviado',
      };
    }

    // Gerar token único
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Definir expiração (1 hora)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Salvar token no banco
    await this.userRepository.saveResetToken(user.id, resetToken, expiresAt);

    //  ENVIAR EMAIL COM O LINK
    try {
      await this.emailService.sendResetPasswordEmail(email, resetToken);
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      // Não lançar erro para o usuário por segurança
    }

    // Em desenvolvimento, retornar o token (remover em produção)
    const isDev = this.configService.get('NODE_ENV') === 'development';

    return {
      message: 'Se o email existir, um link de recuperação será enviado',
      ...(isDev && { token: resetToken, devNote: 'Token retornado apenas em desenvolvimento' }),
    };
  }
}