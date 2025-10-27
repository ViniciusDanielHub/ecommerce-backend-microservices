import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './modules/admin/admin.module';
import { SystemConfigModule } from './modules/system-config/system-config.module';
import { adminConfig } from './config/app.config';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [adminConfig],
    }),
    AdminModule,
    SystemConfigModule,
    HealthModule,
  ],
})
export class AppModule {}
