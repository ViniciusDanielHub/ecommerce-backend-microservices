import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { FileServiceClient } from '../../shared/clients/file-service.client';
import {
  CreateProductDto,
  UpdateProductDto,
  CreateProductImageDto
} from '../../shared/interfaces/product.interface';
import { firstValueFrom } from 'rxjs';
import { ProductResponseService } from '../../shared/services/product-response.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly fileServiceClient: FileServiceClient,
    private readonly productResponseService: ProductResponseService,
  ) { }

  async create(createProductDto: CreateProductDto, authToken?: string) {
    await this.validateCategory(createProductDto.categoryId);

    const existingProduct = await this.prisma.product.findUnique({
      where: { slug: createProductDto.slug },
    });

    if (existingProduct) {
      throw new BadRequestException('Product with this slug already exists');
    }

    const processedImages = await this.processProductImages(
      createProductDto.images,
      createProductDto.fileIds,
      authToken,
    );

    const { images, fileIds, ...productData } = createProductDto;

    const product = await this.prisma.product.create({
      data: {
        ...productData,
        images: processedImages.length > 0 ? {
          create: processedImages.map((img, index) => ({
            url: img.url,
            alt: img.alt || `${productData.name} - Image ${index + 1}`,
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

  /**
   * Processa as imagens do produto.
   * Aceita URLs diretas (via images) ou IDs de arquivos do File Service (via fileIds).
   */
  private async processProductImages(
    images?: CreateProductImageDto[],
    fileIds?: string[],
    authToken?: string,
  ): Promise<CreateProductImageDto[]> {
    const processedImages: CreateProductImageDto[] = [];

    if (images && images.length > 0) {
      processedImages.push(...images);
    }

    if (fileIds && fileIds.length > 0) {
      try {
        const files = await this.fileServiceClient.getFilesByIds(fileIds, authToken);

        const fileImages = files.map((file, index) => ({
          url: file.url,
          alt: file.originalName,
          isMain: processedImages.length === 0 && index === 0,
          order: processedImages.length + index,
        }));

        processedImages.push(...fileImages);
      } catch (error) {
        throw new BadRequestException('Error fetching files from File Service');
      }
    }

    if (processedImages.length === 0) {
      throw new BadRequestException('At least one image is required (images or fileIds)');
    }

    return processedImages;
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

    const categoryIds = [...new Set(products.map(p => p.categoryId))];
    const categoryDataMap = await this.fetchCategoriesData(categoryIds);

    const filteredProducts = await this.productResponseService.filterListByCategory(
      products,
      categoryDataMap
    );

    return {
      products: filteredProducts,
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

    const categoryData = await this.fetchCategoryData(product.categoryId);

    const filteredProduct = await this.productResponseService.filterByCategory(
      product,
      categoryData
    );

    return filteredProduct;
  }

  /**
   * Busca o produto RAW do banco, sem filtragem de categoria.
   * Usado internamente para operações de update/delete onde precisamos
   * de todos os campos originais, não do objeto filtrado.
   */
  private async findOneRaw(id: string) {
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

  async update(id: string, updateProductDto: UpdateProductDto, authToken?: string) {
    // Busca raw para ter acesso a todos os campos originais sem filtragem
    const existingProduct = await this.findOneRaw(id);

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

    const { images, fileIds, ...productData } = updateProductDto;

    let imageUpdateData = {};

    if (images || fileIds) {
      const processedImages = await this.processProductImages(
        images,
        fileIds,
        authToken,
      );

      imageUpdateData = {
        images: {
          deleteMany: {},
          create: processedImages.map((img, index) => ({
            url: img.url,
            alt: img.alt || `${productData.name || existingProduct.name} - Image ${index + 1}`,
            order: img.order ?? index,
            isMain: img.isMain ?? index === 0,
          })),
        },
      };
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        ...imageUpdateData,
      },
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
    // Usa findOneRaw para não precisar fazer a chamada de categoria desnecessariamente
    await this.findOneRaw(id);

    await this.prisma.product.delete({
      where: { id },
    });

    return {
      message: 'Product deleted successfully',
    };
  }

  private async fetchCategoryData(categoryId: string): Promise<any> {
    try {
      const categoryServiceUrl = this.configService.get('categoryServiceUrl');
      const response = await firstValueFrom(
        this.httpService.get(`${categoryServiceUrl}/categories/${categoryId}`),
      );

      return response.data;
    } catch (error) {
      console.warn(`Could not fetch category ${categoryId}:`, error.message);
      return { id: categoryId, name: 'Unknown', slug: 'default' };
    }
  }

  private async fetchCategoriesData(categoryIds: string[]): Promise<Map<string, any>> {
    const categoryDataMap = new Map<string, any>();

    await Promise.all(
      categoryIds.map(async categoryId => {
        const data = await this.fetchCategoryData(categoryId);
        categoryDataMap.set(categoryId, data);
      })
    );

    return categoryDataMap;
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