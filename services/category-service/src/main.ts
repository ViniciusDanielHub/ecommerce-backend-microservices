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
  const port = configService.get<number>('SERVICE_PORT', 3004);

  // Fastify escuta em 0.0.0.0 por padrão no NestJS,
  // mas precisamos passar explicitamente para funcionar no Docker
  await app.listen(port, '0.0.0.0');
  console.log(`Category Service (Fastify) running on port ${port}`);
}

bootstrap();