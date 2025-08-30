import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar validação global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Configurar CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Configurar prefixo global
  app.setGlobalPrefix('api');

  // Obter configurações
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');

  await app.listen(port);
  console.log(`🚀 API Gateway running on port ${port}`);
  console.log(`📡 Gateway URL: http://localhost:${port}/api`);
}

bootstrap();
