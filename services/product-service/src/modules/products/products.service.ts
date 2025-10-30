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

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly fileServiceClient: FileServiceClient,
  ) { }

  async create(createProductDto: CreateProductDto, authToken?: string) {
    // Verificar se a categoria existe
    await this.validateCategory(createProductDto.categoryId);

    // Verificar se slug já existe
    const existingProduct = await this.prisma.product.findUnique({
      where: { slug: createProductDto.slug },
    });

    if (existingProduct) {
      throw new BadRequestException('Product with this slug already exists');
    }

    // Processar imagens
    const processedImages = await this.processProductImages(
      createProductDto.images,  // ← CORRETO: usar 'images'
      createProductDto.fileIds,
      authToken,
    );

    // Extrair dados do produto (sem images e fileIds para o Prisma)
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
   * Processa as imagens do produto
   * Aceita URLs diretas (via images) ou IDs de arquivos do File Service (via fileIds)
   */
  private async processProductImages(
    images?: CreateProductImageDto[],  // ← CORRETO: 'images'
    fileIds?: string[],
    authToken?: string,
  ): Promise<CreateProductImageDto[]> {
    const processedImages: CreateProductImageDto[] = [];

    // 1. Adicionar imagens com URLs diretas
    if (images && images.length > 0) {
      processedImages.push(...images);
    }

    // 2. Buscar arquivos pelo ID no File Service e converter para URLs
    if (fileIds && fileIds.length > 0) {
      try {
        const files = await this.fileServiceClient.getFilesByIds(fileIds, authToken);

        const fileImages = files.map((file, index) => ({
          url: file.url,
          alt: file.originalName,
          isMain: processedImages.length === 0 && index === 0, // primeira é main se não há outras
          order: processedImages.length + index,
        }));

        processedImages.push(...fileImages);
      } catch (error) {
        throw new BadRequestException('Error fetching files from File Service');
      }
    }

    // Validar se há pelo menos uma imagem
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

    // Remover images e fileIds da atualização (por enquanto)
    const { images, fileIds, ...productData } = updateProductDto;  // ← CORRETO

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
    await this.findOne(id);

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