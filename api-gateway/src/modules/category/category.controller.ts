import {
  Controller,
  All,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Controller('categories')
export class CategoryController {
  private readonly categoryServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.categoryServiceUrl = this.configService.get('services.category.url');
  }

  @All('*')
  async handleAll(@Req() req: Request, @Res() res: Response) {
    await this.proxyRequest(req, res);
  }

  @All()
  async handleRoot(@Req() req: Request, @Res() res: Response) {
    await this.proxyRequest(req, res);
  }

  private async proxyRequest(req: Request, res: Response) {
    try {
      // Remover /api/categories do path
      const path = req.url.replace('/api/categories', '') || '';
      const url = `${this.categoryServiceUrl}/categories${path}`;
      
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
