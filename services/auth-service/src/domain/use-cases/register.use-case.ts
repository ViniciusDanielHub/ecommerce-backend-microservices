import { Injectable, ConflictException, Inject } from '@nestjs/common';
import { IUserRepository } from '../../infrastructure/repositories/user.repository';
import { Role } from '../../shared/types';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/infrastructure/email/email.service';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: IUserRepository,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) { }

  async execute(data: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
    role?: Role
  }) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    const saltRounds = this.configService.get<number>('bcrypt.saltRounds');
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    const { confirmPassword, ...userData } = data;

    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    // Gerar token de verificação
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await this.userRepository.saveEmailVerificationToken(user.id, verificationToken, expiresAt);

    try {
      await this.emailService.sendEmailVerificationEmail(user.email, user.name, verificationToken);
      console.log(`✅ Email de verificação enviado para ${user.email}`);
    } catch (error) {
      console.error('❌ Erro ao enviar email de verificação:', error.message);
    }

    const { password, ...userWithoutPassword } = user;

    return {
      message: 'Usuário criado! Verifique seu email para ativar a conta.',
      user: userWithoutPassword,
    };
  }
}