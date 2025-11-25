import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { IUserRepository } from '../../infrastructure/repositories/user.repository';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../../infrastructure/email/email.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: IUserRepository,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) { }

  async execute(token: string, newPassword: string): Promise<{ message: string }> {
    // Buscar usuário pelo token
    const user = await this.userRepository.findByResetToken(token);

    if (!user) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    // Verificar se token expirou
    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Token expirado');
    }

    // Hash da nova senha
    const saltRounds = this.configService.get<number>('bcrypt.saltRounds');
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Atualizar senha e limpar token
    await this.userRepository.updatePassword(user.id, hashedPassword);
    await this.userRepository.clearResetToken(user.id);

    // ✅ ENVIAR EMAIL DE CONFIRMAÇÃO
    try {
      await this.emailService.sendPasswordChangedEmail(user.email, user.name);
    } catch (error) {
      console.error('Erro ao enviar email de confirmação:', error);
      // Não lançar erro, senha já foi alterada
    }

    return {
      message: 'Senha redefinida com sucesso',
    };
  }
}