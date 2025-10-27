import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './modules/products/products.module';
import { HealthModule } from './modules/health/health.module'; // ← ADICIONAR
import { PrismaService } from './database/prisma.service';
import { appConfig } from './config/app.config';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
    }),
    ProductsModule,
    HealthModule, 
  ],
  providers: [PrismaService],
})
export class AppModule { }