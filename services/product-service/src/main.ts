import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configurar CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Obter configurações
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  const serviceName = configService.get<string>('serviceName');

  await app.listen(port);
  console.log(`🚀 ${serviceName} running on port ${port}`);
  console.log(`�� Health check: http://localhost:${port}/products`);
}

bootstrap();
