import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { gatewayConfig } from './config/app.config';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { HealthModule } from './modules/health/health.module';
import { UserModule } from './modules/user/user.module'; 
import { AdminModule } from './modules/admin/admin.module'; 
import { FileModule } from './modules/file/file.module'; 

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
    AuthModule,
    CategoryModule,
    ProductModule,
    HealthModule,
    UserModule,
    AdminModule,
    FileModule,
  ],
})
export class AppModule { }