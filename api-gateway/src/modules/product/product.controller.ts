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

@Controller('products')
export class ProductController {
  private readonly productServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.productServiceUrl = this.configService.get('services.product.url');
  }

  @Get('*')
  async handleGet(@Req() req: Request, @Res() res: Response) {
    await this.proxyRequest(req, res);
  }

  @Get()
  async handleGetRoot(@Req() req: Request, @Res() res: Response) {
    await this.proxyRequest(req, res);
  }

  // 🔒 POST, PUT, DELETE - Apenas ADMIN
  @All('*')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async handleProtected(@Req() req: Request, @Res() res: Response) {
    // Bloquear GET (já tratado acima)
    if (req.method === 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    await this.proxyRequest(req, res);
  }


  private async proxyRequest(req: Request, res: Response) {
    try {
      // Remover /api/products do path
      const path = req.url.replace('/api/products', '') || '';
      const url = `${this.productServiceUrl}/products${path}`;
      
      console.log(`Proxying request to: ${url}`);
      
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
      console.error(`Proxy error:`, error.message);
      
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({
          message: 'Service unavailable',
          error: error.message,
        });
      }
    }
  }
}
