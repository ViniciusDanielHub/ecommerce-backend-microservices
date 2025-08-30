import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, map, timeout } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class HealthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async checkAllServices() {
    const services = this.configService.get('services');
    const results = [];

    for (const [serviceName, config] of Object.entries(services)) {
      const serviceHealth = await this.checkService(serviceName, config as any);
      results.push(serviceHealth);
    }

    const overallStatus = results.every(service => service.status === 'UP') ? 'UP' : 'DEGRADED';

    return {
      status: overallStatus,
      gateway: 'UP',
      services: results,
      timestamp: new Date().toISOString(),
    };
  }

  private async checkService(serviceName: string, config: { url: string }) {
    try {
      const response = await this.httpService
        .get(`${config.url}/health`, { timeout: 5000 })
        .pipe(
          timeout(5000),
          map(res => res.data),
          catchError(() => of({ status: 'DOWN' }))
        )
        .toPromise();

      return {
        service: serviceName,
        status: response.status || 'DOWN',
        url: config.url,
      };
    } catch (error) {
      return {
        service: serviceName,
        status: 'DOWN',
        url: config.url,
        error: error.message,
      };
    }
  }
}
