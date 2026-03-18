import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface CategoryFieldConfigData {
  categoryId: string;
  slug: string;
  fields: Record<string, string[]>;
}

export interface FieldConfiguration {
  baseFields: string[];
  extraFields: string[];
  allFields: string[];
}

@Injectable()
export class CategoryFieldsRepository implements OnModuleInit {
  private baseFieldsCache: string[] = [];
  private extraContainersCache: string[] = []; // ✨ Cache dinâmico

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Inicializa cache ao iniciar
   */
  async onModuleInit() {
    await this.loadBaseFields();
    await this.loadExtraContainers(); // ✨ Carregar containers do banco
  }

  /**
   * ✨ Carrega containers de campos extras do banco
   */
  private async loadExtraContainers(): Promise<void> {
    const containers = await this.prisma.extraFieldContainer.findMany({
      where: { isActive: true },
      orderBy: { priority: 'desc' }
    });

    this.extraContainersCache = containers.map(c => c.name);
    
    if (this.extraContainersCache.length > 0) {
      console.log(`✅ Extra field containers loaded: ${this.extraContainersCache.join(', ')}`);
    } else {
      console.warn('⚠️  No extra field containers found!');
    }
  }

  /**
   * ✨ Retorna lista de containers ativos
   */
  async getExtraContainers(): Promise<string[]> {
    if (this.extraContainersCache.length === 0) {
      await this.loadExtraContainers();
    }
    return [...this.extraContainersCache];
  }

  /**
   * Carrega campos base do banco
   */
  private async loadBaseFields(): Promise<void> {
    const baseConfig = await this.prisma.categoryFieldConfig.findFirst({
      where: { 
        isDefault: true,
        isActive: true 
      },
      orderBy: { priority: 'desc' }
    });

    if (baseConfig) {
      this.baseFieldsCache = baseConfig.fields as string[];
      console.log(`✅ Base fields loaded: ${this.baseFieldsCache.length} fields`);
    } else {
      console.warn('⚠️  No base fields configuration found!');
      this.baseFieldsCache = [];
    }
  }

  /**
   * Retorna campos base
   */
  async getBaseFields(): Promise<string[]> {
    if (this.baseFieldsCache.length === 0) {
      await this.loadBaseFields();
    }
    return [...this.baseFieldsCache];
  }

  /**
   * Retorna quantidade de campos base
   */
  getBaseFieldsCount(): number {
    return this.baseFieldsCache.length;
  }

  /**
   * Busca configuração COMPLETA por slug
   */
  async getFieldConfigBySlug(slug: string): Promise<FieldConfiguration> {
    const normalizedSlug = this.normalizeSlug(slug);
    
    const config = await this.prisma.categoryFieldConfig.findFirst({
      where: { 
        slug: normalizedSlug,
        isActive: true,
        isDefault: false
      }
    });

    const baseFields = await this.getBaseFields();

    if (!config) {
      return {
        baseFields,
        extraFields: [],
        allFields: baseFields
      };
    }

    const extraFields = config.fields as string[];
    
    return {
      baseFields,
      extraFields,
      allFields: [...new Set([...baseFields, ...extraFields])]
    };
  }

  /**
   * Busca configuração por slug (apenas lista - compatibilidade)
   */
  async getFieldsBySlug(slug: string): Promise<string[]> {
    const config = await this.getFieldConfigBySlug(slug);
    return config.allFields;
  }

  /**
   * Busca configuração COMPLETA por categoryId
   */
  async getFieldConfigByCategoryId(categoryId: string): Promise<FieldConfiguration> {
    const config = await this.prisma.categoryFieldConfig.findFirst({
      where: { 
        categoryId,
        isActive: true,
        isDefault: false
      }
    });

    const baseFields = await this.getBaseFields();

    if (!config) {
      return {
        baseFields,
        extraFields: [],
        allFields: baseFields
      };
    }

    const extraFields = config.fields as string[];
    
    return {
      baseFields,
      extraFields,
      allFields: [...new Set([...baseFields, ...extraFields])]
    };
  }

  /**
   * Busca configuração por categoryId (apenas lista - compatibilidade)
   */
  async getFieldsByCategoryId(categoryId: string): Promise<string[]> {
    const config = await this.getFieldConfigByCategoryId(categoryId);
    return config.allFields;
  }

  /**
   * Cria ou atualiza configuração de categoria
   */
  async upsertConfig(data: CategoryFieldConfigData): Promise<void> {
    const normalizedSlug = this.normalizeSlug(data.slug);

    const availableContainers = await this.getExtraContainers();
    const usedContainers = Object.keys(data.fields);

    const invalidContainers = usedContainers.filter(
      container => !availableContainers.includes(container)
    );

    if (invalidContainers.length > 0) {
      throw new Error(
        `Invalid containers: ${invalidContainers.join(', ')}. ` +
        `Available: ${availableContainers.join(', ')}`
      );
    }

    await this.prisma.categoryFieldConfig.upsert({
      where: { categoryId: data.categoryId },
      update: {
        slug: normalizedSlug,
        fields: data.fields,
        isDefault: false,
        priority: 10,
        updatedAt: new Date()
      },
      create: {
        categoryId: data.categoryId, //seria tipo criar os campos pra categoria que ja existe
        slug: normalizedSlug,
        fields: data.fields,
        isDefault: false,
        isActive: true,
        priority: 10
      } 
    });
  }

  /**
   * Atualiza campos base globais
   */
  async updateBaseFields(fields: string[]): Promise<void> {
    const baseConfig = await this.prisma.categoryFieldConfig.findFirst({
      where: { isDefault: true }
    });

    if (baseConfig) {
      await this.prisma.categoryFieldConfig.update({
        where: { id: baseConfig.id },
        data: {
          fields,
          updatedAt: new Date()
        }
      });
    } else {
      await this.prisma.categoryFieldConfig.create({
        data: {
          categoryId: null,
          slug: null,
          fields,
          isDefault: true,
          isActive: true,
          priority: 0
        }
      });
    }

    await this.loadBaseFields();
  }

  /**
   * ✨ Gerenciar containers de campos extras
   */
  async addExtraContainer(name: string, description?: string): Promise<void> {
    await this.prisma.extraFieldContainer.create({
      data: {
        name,
        description,
        isActive: true,
        priority: 10
      }
    });

    await this.loadExtraContainers();
  }

  async removeExtraContainer(name: string): Promise<void> {
    await this.prisma.extraFieldContainer.updateMany({
      where: { name },
      data: { isActive: false }
    });

    await this.loadExtraContainers();
  }

  /**
   * Lista todas as configurações
   */
  async listAll(): Promise<CategoryFieldConfigData[]> {
    const configs = await this.prisma.categoryFieldConfig.findMany({
      where: { 
        isActive: true,
        isDefault: false
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return configs.map(config => ({
      categoryId: config.categoryId || '',
      slug: config.slug || '',
      fields: config.fields as Record<string, string[]> 
    }));
  }

  /**
   * Deleta configuração (soft delete)
   */
  async deleteConfig(categoryId: string): Promise<void> {
    await this.prisma.categoryFieldConfig.updateMany({
      where: { categoryId },
      data: { isActive: false }
    });
  }

  /**
   * Normaliza slug
   */
  private normalizeSlug(slug: string): string {
    return slug
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}