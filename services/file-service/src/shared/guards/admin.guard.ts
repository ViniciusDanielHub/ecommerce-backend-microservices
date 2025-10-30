import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Verificar se o usuário existe e tem role ADMIN
    if (!user || user.role !== 'ADMIN') {
      throw new ForbiddenException('Acesso restrito a administradores');
    }

    return true;
  }
}