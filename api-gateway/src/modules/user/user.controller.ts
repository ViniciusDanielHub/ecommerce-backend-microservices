import {
  Controller,
  All,
  Req,
  Res,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  private readonly userServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.userServiceUrl = this.configService.get('services.user.url');
  }

  // GET /api/users/me — qualquer usuário autenticado
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: Request, @Res() res: Response) {
    await this.proxyRequest(req, res);
  }

  // PUT /api/users/me — qualquer usuário autenticado
  @All('me')
  @UseGuards(JwtAuthGuard)
  async updateMe(@Req() req: Request, @Res() res: Response) {
    if (req.method === 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    await this.proxyRequest(req, res);
  }

  // POST /api/users/create-profile — qualquer usuário autenticado
  @All('create-profile')
  @UseGuards(JwtAuthGuard)
  async createProfile(@Req() req: Request, @Res() res: Response) {
    await this.proxyRequest(req, res);
  }

  private async proxyRequest(req: Request, res: Response) {
    try {
      const path = req.url.replace('/api/users', '') || '';
      const url = `${this.userServiceUrl}/users${path}`;

      console.log(`[UserGateway] Proxying ${req.method} ${url}`);

      const headers = { ...req.headers };
      delete headers.host;
      delete headers['content-length'];

      const response = await firstValueFrom(
        this.httpService.request({
          method: req.method as any,
          url,
          data: req.body,
          headers,
          params: req.query,
          timeout: 10000,
        }),
      );

      res.status(response.status).json(response.data);
    } catch (error) {
      console.error(`[UserGateway] Proxy error:`, error.message);

      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({
          message: 'User service unavailable',
          error: error.message,
        });
      }
    }
  }
}