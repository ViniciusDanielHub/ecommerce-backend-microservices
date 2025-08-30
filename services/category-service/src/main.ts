import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validação global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // CORS
  app.enableCors();

  // Configurações
  const configService = app.get(ConfigService);
  const port = configService.get<number>('SERVICE_PORT', 3004);

  await app.listen(port);
  console.log(`Category Service running on port ${port}`);
}

bootstrap();
