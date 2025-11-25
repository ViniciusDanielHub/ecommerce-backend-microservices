import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { IUserRepository } from '../../infrastructure/repositories/user.repository';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: IUserRepository,
  ) { }

  async execute(userId: string): Promise<{ message: string }> {
    // Verificar se usuário existe
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Remover refresh token do usuário (invalida todas as sessões)
    await this.userRepository.updateRefreshToken(userId, null);

    return {
      message: 'Logout realizado com sucesso',
    };
  }
}