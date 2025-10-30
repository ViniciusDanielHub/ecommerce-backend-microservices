import { Injectable, ConflictException, Inject } from '@nestjs/common';
import { IUserRepository } from '../../infrastructure/repositories/user.repository';
import { Role } from '../../shared/types'; // ✅ Import do Role
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: IUserRepository,
    private readonly configService: ConfigService,
  ) { }

  async execute(data: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
    role?: Role
  }) {
    // Verificar se usuário já existe
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    // Hash da senha
    const saltRounds = this.configService.get<number>('bcrypt.saltRounds');
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const { confirmPassword, ...userData } = data;

    // Criar usuário
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    // Remover senha do retorno
    const { password, ...userWithoutPassword } = user;

    return {
      message: 'Usuário criado com sucesso',
      user: userWithoutPassword,
    };
  }
}