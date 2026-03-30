import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { IUserRepository } from '../../infrastructure/repositories/user.repository';
import { EmailService } from '../../infrastructure/email/email.service';

@Injectable()
export class VerifyEmailUseCase {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: IUserRepository,
    private readonly emailService: EmailService,
  ) { }

  async execute(token: string): Promise<{ message: string }> {
    const user = await this.userRepository.findByEmailVerificationToken(token);

    if (!user) {
      throw new BadRequestException('Token de verificação inválido ou expirado');
    }

    await this.userRepository.markEmailAsVerified(user.id);

    // Agora sim envia o boas-vindas
    try {
      await this.emailService.sendWelcomeEmail(user.email, user.name);
    } catch (error) {
      console.error('Erro ao enviar email de boas-vindas:', error.message);
    }

    return { message: 'Email verificado com sucesso! Você já pode fazer login.' };
  }
}