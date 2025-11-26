import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [
    AuthModule,
    CategoryModule,
  ],
})
export class AppModule {}
