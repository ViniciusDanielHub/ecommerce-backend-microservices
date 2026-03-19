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

@Controller('upload')
@UseGuards(JwtAuthGuard, AdminGuard)
export class FileController {
  private readonly fileServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.fileServiceUrl = this.configService.get('services.file.url');
  }

  // GET /api/upload — lista arquivos
  @Get()
  async listFiles(@Req() req: Request, @Res() res: Response) {
    await this.proxyRequest(req, res);
  }

  // GET /api/upload/my-files
  @Get('my-files')
  async getMyFiles(@Req() req: Request, @Res() res: Response) {
    await this.proxyRequest(req, res);
  }

  // GET /api/upload/:fileId
  @Get(':fileId')
  async getFile(@Req() req: Request, @Res() res: Response) {
    await this.proxyRequest(req, res);
  }

  // POST /api/upload/single
  // POST /api/upload/multiple
  // DELETE /api/upload/:fileId
  @All('*')
  async handleMutations(@Req() req: Request, @Res() res: Response) {
    if (req.method === 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    await this.proxyRequest(req, res);
  }

  private async proxyRequest(req: Request, res: Response) {
    try {
      const path = req.url.replace('/api/upload', '') || '';
      const url = `${this.fileServiceUrl}/upload${path}`;

      console.log(`[FileGateway] Proxying ${req.method} ${url}`);

      const headers = { ...req.headers };
      delete headers.host;
      // Não remover content-length em uploads multipart — o axios recalcula
      if (!headers['content-type']?.toString().includes('multipart')) {
        delete headers['content-length'];
      }

      const response = await firstValueFrom(
        this.httpService.request({
          method: req.method as any,
          url,
          data: req.body,
          headers,
          params: req.query,
          timeout: 30000, // upload pode demorar mais
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }),
      );

      res.status(response.status).json(response.data);
    } catch (error) {
      console.error(`[FileGateway] Proxy error:`, error.message);

      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({
          message: 'File service unavailable',
          error: error.message,
        });
      }
    }
  }
}