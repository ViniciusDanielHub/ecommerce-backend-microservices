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
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  private readonly adminServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.adminServiceUrl = this.configService.get('services.admin.url');
  }

  // GET /api/admin/users
  @Get('users')
  async getUsers(@Req() req: Request, @Res() res: Response) {
    await this.proxyRequest(req, res);
  }

  // PUT /api/admin/users/:userId/promote
  @All('users/*')
  async handleUserActions(@Req() req: Request, @Res() res: Response) {
    await this.proxyRequest(req, res);
  }

  // GET /api/admin/config/default-store-name
  // POST /api/admin/config/default-store-name
  // GET /api/admin/config/upload
  // POST /api/admin/config/upload
  @All('config/*')
  async handleConfig(@Req() req: Request, @Res() res: Response) {
    await this.proxyRequest(req, res);
  }

  @Get('config')
  async getConfig(@Req() req: Request, @Res() res: Response) {
    await this.proxyRequest(req, res);
  }

  private async proxyRequest(req: Request, res: Response) {
    try {
      const path = req.url.replace('/api/admin', '') || '';
      const url = `${this.adminServiceUrl}/admin${path}`;

      console.log(`[AdminGateway] Proxying ${req.method} ${url}`);

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
      console.error(`[AdminGateway] Proxy error:`, error.message);

      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({
          message: 'Admin service unavailable',
          error: error.message,
        });
      }
    }
  }
}