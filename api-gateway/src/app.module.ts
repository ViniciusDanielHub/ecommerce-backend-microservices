import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { gatewayConfig } from './config/app.config';
// Módulos dos diferentes serviços
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [gatewayConfig],
    }),
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
    // Módulos dos serviços
    AuthModule,
    HealthModule,
    CategoryModule,
    ProductModule,
  ],
})
export class AppModule {}
