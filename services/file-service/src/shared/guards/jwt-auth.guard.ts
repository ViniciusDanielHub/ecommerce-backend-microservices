import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) { }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token não fornecido');
    }

    try {
      // Decodificar JWT manualmente (sem verificar assinatura - confiamos no API Gateway)
      const payload = this.decodeJwt(token);

      if (!payload || !payload.sub) {
        throw new UnauthorizedException('Token inválido');
      }

      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private decodeJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        Buffer.from(base64, 'base64')
          .toString()
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new UnauthorizedException('Erro ao decodificar token');
    }
  }
}