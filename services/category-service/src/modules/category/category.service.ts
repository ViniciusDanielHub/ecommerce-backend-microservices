import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

const MAX_CATEGORIES = 50;
const MAX_SUBCATEGORIES = 50;

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createCategoryDto: CreateCategoryDto) {
    // Verificar se slug já existe
    const existingCategory = await this.prisma.category.findUnique({
      where: { slug: createCategoryDto.slug },
    });

    if (existingCategory) {
      throw new ConflictException('Slug já está em uso');
    }

    if (createCategoryDto.parentId) {
      // Verificar se parent existe
      const parentCategory = await this.prisma.category.findUnique({
        where: { id: createCategoryDto.parentId },
        include: { children: true },
      });

      if (!parentCategory) {
        throw new NotFoundException('Categoria pai não encontrada');
      }

      // Limite de subcategorias por categoria pai
      if (parentCategory.children.length >= MAX_SUBCATEGORIES) {
        throw new BadRequestException(
          `Limite de ${MAX_SUBCATEGORIES} subcategorias por categoria atingido`,
        );
      }
    } else {
      // Limite de categorias raiz
      const rootCount = await this.prisma.category.count({
        where: { parentId: null },
      });

      if (rootCount >= MAX_CATEGORIES) {
        throw new BadRequestException(
          `Limite de ${MAX_CATEGORIES} categorias atingido`,
        );
      }
    }

    const category = await this.prisma.category.create({
      data: {
        ...createCategoryDto,
        isActive: createCategoryDto.isActive ?? true,
      },
      include: {
        parent: true,
        children: true,
      },
    });

    return {
      message: 'Categoria criada com sucesso',
      category,
    };
  }

  async findAll(page = 1, limit = 10) {
    // Limitar o máximo de itens retornados por página
    const safeLimi = Math.min(limit, MAX_CATEGORIES);
    const skip = (page - 1) * safeLimi;

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        skip,
        take: safeLimi,
        include: {
          parent: true,
          // Limitar subcategorias retornadas
          children: {
            take: MAX_SUBCATEGORIES,
          },
        },
        orderBy: { name: 'asc' },
      }),
      this.prisma.category.count(),
    ]);

    return {
      categories,
      pagination: {
        total,
        totalPages: Math.ceil(total / safeLimi),
        currentPage: page,
        limit: safeLimi,
      },
    };
  }

  async getTree() {
    const categories = await this.prisma.category.findMany({
      where: { parentId: null },
      take: MAX_CATEGORIES, // Limite de categorias raiz
      include: {
        children: {
          take: MAX_SUBCATEGORIES, // Limite de subcategorias nível 1
          include: {
            children: {
              take: MAX_SUBCATEGORIES, // Limite de subcategorias nível 2
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return {
      message: 'Árvore de categorias',
      categories,
    };
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          take: MAX_SUBCATEGORIES,
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    // Verificar slug se foi alterado
    if (updateCategoryDto.slug && updateCategoryDto.slug !== category.slug) {
      const existingCategory = await this.prisma.category.findUnique({
        where: { slug: updateCategoryDto.slug },
      });

      if (existingCategory) {
        throw new ConflictException('Slug já está em uso');
      }
    }

      // Se está mudando o parentId, verificar limite de subcategorias do novo pai
      if (
        updateCategoryDto.parentId &&
        updateCategoryDto.parentId !== category.parentId
      ) {
        const newParent = await this.prisma.category.findUnique({
          where: { id: updateCategoryDto.parentId },
          include: { children: true },
        });

        if (!newParent) {
          throw new NotFoundException('Categoria pai não encontrada');
        }

        if (newParent.children.length >= MAX_SUBCATEGORIES) {
          throw new BadRequestException(
            `Limite de ${MAX_SUBCATEGORIES} subcategorias por categoria atingido`,
          );
        }
      }

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
      include: {
        parent: true,
        children: {
          take: MAX_SUBCATEGORIES,
        },
      },
    });

    return {
      message: 'Categoria atualizada com sucesso',
      category: updatedCategory,
    };
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    if (category.children.length > 0) {
      throw new ConflictException('Não é possível deletar categoria que possui subcategorias');
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return {
      message: 'Categoria deletada com sucesso',
    };
  }
}
