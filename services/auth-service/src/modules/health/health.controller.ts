import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'UP',
      service: 'auth-service',
      timestamp: new Date().toISOString(),
    };
  }
}