import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../../infrastructure/repositories/user.repository';
import { EmailService } from '../../infrastructure/email/email.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserEntity } from '../entities/user.entity';

type UserPublicData = ReturnType<UserEntity['toPublic']>;

@Injectable()
export class VerifyPhoneUseCase {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: IUserRepository,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) { }

  async execute(
    email: string,
    code: string,
  ): Promise<{
    message: string;
    access_token: string;
    refresh_token: string;
    user: UserPublicData;
  }> {
    // 1. Localizar usuário pelo email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Conta não encontrada');
    }

    // 2. Verificar se tem código pendente
    if (!user.phoneVerificationCode || !user.phoneVerificationExpires) {
      throw new BadRequestException(
        'Nenhuma verificação pendente. Solicite um novo código.',
      );
    }

    // 3. Verificar expiração
    if (user.phoneVerificationExpires < new Date()) {
      throw new BadRequestException(
        'Código expirado. Solicite um novo código.',
      );
    }

    // 4. Comparar hashes (timing-safe — previne timing attacks)
    const hashedInput = crypto
      .createHash('sha256')
      .update(code.trim())
      .digest('hex');

    const codesMatch = crypto.timingSafeEqual(
      Buffer.from(hashedInput),
      Buffer.from(user.phoneVerificationCode),
    );

    if (!codesMatch) {
      throw new BadRequestException('Código inválido');
    }

    // 5. Marcar telefone como verificado
    await this.userRepository.markPhoneAsVerified(user.id);

    // 6. Emitir tokens de acesso — primeiro login completo
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.updateRefreshToken(user.id, hashedRefreshToken);

    // 7. Email de boas-vindas completo (não bloqueia o fluxo se falhar)
    try {
      await this.emailService.sendAccountFullyVerifiedEmail(
        user.email,
        user.name,
      );
    } catch (err) {
      console.error('Erro ao enviar email de conta ativa:', err.message);
    }

    return {
      message: 'Telefone verificado! Sua conta está totalmente ativa.',
      access_token: accessToken,
      refresh_token: refreshToken,
      user: user.toPublic(),
    };
  }
}