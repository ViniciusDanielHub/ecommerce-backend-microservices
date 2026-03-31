import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );

  // Validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS
  await app.register(require('@fastify/cors'), {
    origin: true,
    credentials: true,
  });

  // Configurações
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  const serviceName = configService.get<string>('serviceName');

  await app.listen(port, '0.0.0.0');
  console.log(`🚀 ${serviceName} (Fastify) running on port ${port}`);
}

bootstrap();