import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaService } from '../../database/prisma.service';
import { FileServiceClient } from '../../shared/clients/file-service.client';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    PrismaService,
    FileServiceClient, 
  ],
  exports: [ProductsService],
})
export class ProductsModule { }