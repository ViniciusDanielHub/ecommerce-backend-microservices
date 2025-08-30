import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CategoryController } from './category.controller';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
  ],
  controllers: [CategoryController],
})
export class CategoryModule {}
