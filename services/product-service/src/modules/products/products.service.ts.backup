import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { CreateProductDto, UpdateProductDto } from '../../shared/interfaces/product.interface';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    // Verificar se a categoria existe
    await this.validateCategory(createProductDto.categoryId);

    // Verificar se slug já existe
    const existingProduct = await this.prisma.product.findUnique({
      where: { slug: createProductDto.slug },
    });

    if (existingProduct) {
      throw new BadRequestException('Product with this slug already exists');
    }

    const { images, ...productData } = createProductDto;

    const product = await this.prisma.product.create({
      data: {
        ...productData,
        images: images ? {
          create: images.map((img, index) => ({
            ...img,
            order: img.order ?? index,
            isMain: img.isMain ?? index === 0,
          })),
        } : undefined,
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return {
      message: 'Product created successfully',
      product,
    };
  }

  async findAll(filters: { page: number; limit: number; categoryId?: string }) {
    const { page, limit, categoryId } = filters;
    const skip = (page - 1) * limit;

    const where = categoryId ? { categoryId } : {};

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          images: {
            where: { isMain: true },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const existingProduct = await this.findOne(id);

    if (updateProductDto.categoryId) {
      await this.validateCategory(updateProductDto.categoryId);
    }

    if (updateProductDto.slug && updateProductDto.slug !== existingProduct.slug) {
      const slugExists = await this.prisma.product.findUnique({
        where: { slug: updateProductDto.slug },
      });

      if (slugExists) {
        throw new BadRequestException('Product with this slug already exists');
      }
    }

    const { images, ...productData } = updateProductDto;

    const product = await this.prisma.product.update({
      where: { id },
      data: productData,
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return {
      message: 'Product updated successfully',
      product,
    };
  }

  async remove(id: string) {
    await this.findOne(id); // Verificar se existe

    await this.prisma.product.delete({
      where: { id },
    });

    return {
      message: 'Product deleted successfully',
    };
  }

  private async validateCategory(categoryId: string) {
  try {
    const categoryServiceUrl = this.configService.get('categoryServiceUrl');
    console.log('Category Service URL:', categoryServiceUrl);
    console.log('Validating category ID:', categoryId);
    
    const response = await firstValueFrom(
      this.httpService.get(`${categoryServiceUrl}/categories/${categoryId}`),
    );
    
    console.log('Category validation response:', response.status);
    
    if (!response.data) {
      throw new BadRequestException('Category not found');
    }
  } catch (error) {
    console.error('Category validation error:', error.message);
    throw new BadRequestException('Invalid category or category service unavailable');
  }
 }
}
