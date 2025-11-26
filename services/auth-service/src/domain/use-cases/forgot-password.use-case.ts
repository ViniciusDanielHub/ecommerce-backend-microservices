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
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return {
        message: 'Se o email existir, um link de recuperação será enviado',
      };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.userRepository.saveResetToken(user.id, resetToken, expiresAt);

    try {
      await this.emailService.sendResetPasswordEmail(email, resetToken);
    } catch (error) {
      console.error('Erro ao enviar email:', error);
    }

    const isDev = this.configService.get('NODE_ENV') === 'development';

    return {
      message: 'Se o email existir, um link de recuperação será enviado',
      ...(isDev && { 
        token: resetToken, 
        devNote: 'Token retornado apenas em desenvolvimento' 
      }),
    };
  }
}
