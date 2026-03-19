import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
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

const MAX_FIELDS = 50;        // Limite de campos permitidos por categoria
const MAX_SUBFIELDS = 50;   

@Injectable()
export class CategoryFieldsRepository implements OnModuleInit {
  private baseFieldsCache: string[] = [];
  private extraContainersCache: string[] = [];

  constructor(private readonly prisma: PrismaService) { }

  /**
   * Inicializa caches ao subir o módulo.
   * Falhas aqui são logadas mas não impedem a aplicação de iniciar —
   * os métodos de leitura recarregam sob demanda se o cache estiver vazio.
   */
  async onModuleInit() {
    try {
      await this.loadBaseFields();
    } catch (err) {
      console.error('CategoryFieldsRepository: failed to load base fields on init', err);
    }

    try {
      await this.loadExtraContainers();
    } catch (err) {
      console.error('CategoryFieldsRepository: failed to load extra containers on init', err);
    }
  }

  // ──────────────────────────────────────────────
  // CACHE LOADERS
  // ──────────────────────────────────────────────

  private async loadBaseFields(): Promise<void> {
    const baseConfig = await this.prisma.categoryFieldConfig.findFirst({
      where: { isDefault: true, isActive: true },
      orderBy: { priority: 'desc' },
    });

    if (baseConfig) {
      this.baseFieldsCache = baseConfig.fields as string[];
      console.log(`✅ Base fields loaded: ${this.baseFieldsCache.length} fields`);
    } else {
      console.warn('⚠️  No base fields configuration found in DB!');
      this.baseFieldsCache = [];
    }
  }

  private async loadExtraContainers(): Promise<void> {
    const containers = await this.prisma.extraFieldContainer.findMany({
      where: { isActive: true },
      orderBy: { priority: 'desc' },
    });

    this.extraContainersCache = containers.map(c => c.name);

    if (this.extraContainersCache.length > 0) {
      console.log(`✅ Extra field containers loaded: ${this.extraContainersCache.join(', ')}`);
    } else {
      console.warn('⚠️  No extra field containers found in DB!');
    }
  }

  // ──────────────────────────────────────────────
  // PUBLIC READERS — reload on empty cache
  // ──────────────────────────────────────────────

  async getBaseFields(): Promise<string[]> {
    if (this.baseFieldsCache.length === 0) {
      await this.loadBaseFields();
    }
    return [...this.baseFieldsCache];
  }

  getBaseFieldsCount(): number {
    return this.baseFieldsCache.length;
  }

  async getExtraContainers(): Promise<string[]> {
    if (this.extraContainersCache.length === 0) {
      await this.loadExtraContainers();
    }
    return [...this.extraContainersCache];
  }

  // ──────────────────────────────────────────────
  // FIELD CONFIG — by slug
  // ──────────────────────────────────────────────

  async getFieldConfigBySlug(slug: string): Promise<FieldConfiguration> {
    const normalizedSlug = this.normalizeSlug(slug);

    const config = await this.prisma.categoryFieldConfig.findFirst({
      where: { slug: normalizedSlug, isActive: true, isDefault: false },
    });

    const baseFields = await this.getBaseFields();

    if (!config) {
      return { baseFields, extraFields: [], allFields: baseFields };
    }

    const extraFields = config.fields as string[];

    return {
      baseFields,
      extraFields,
      allFields: [...new Set([...baseFields, ...extraFields])],
    };
  }

  /** Compatibilidade — retorna apenas a lista plana */
  async getFieldsBySlug(slug: string): Promise<string[]> {
    const config = await this.getFieldConfigBySlug(slug);
    return config.allFields;
  }

  // ──────────────────────────────────────────────
  // FIELD CONFIG — by categoryId
  // ──────────────────────────────────────────────

  async getFieldConfigByCategoryId(categoryId: string): Promise<FieldConfiguration> {
    const config = await this.prisma.categoryFieldConfig.findFirst({
      where: { categoryId, isActive: true, isDefault: false },
    });

    const baseFields = await this.getBaseFields();

    if (!config) {
      return { baseFields, extraFields: [], allFields: baseFields };
    }

    const extraFields = config.fields as string[];

    return {
      baseFields,
      extraFields,
      allFields: [...new Set([...baseFields, ...extraFields])],
    };
  }

  /** Compatibilidade — retorna apenas a lista plana */
  async getFieldsByCategoryId(categoryId: string): Promise<string[]> {
    const config = await this.getFieldConfigByCategoryId(categoryId);
    return config.allFields;
  }

  // ──────────────────────────────────────────────
  // WRITE OPERATIONS
  // ──────────────────────────────────────────────

  async upsertConfig(data: CategoryFieldConfigData): Promise<void> {
    const normalizedSlug = this.normalizeSlug(data.slug);

    const availableContainers = await this.getExtraContainers();
    const usedContainers = Object.keys(data.fields);
    const invalidContainers = usedContainers.filter(c => !availableContainers.includes(c));

    if (invalidContainers.length > 0) {
      throw new Error(
        `Invalid containers: ${invalidContainers.join(', ')}. ` +
        `Available: ${availableContainers.join(', ')}`,
      );
    }

    // Validar limite de subcampos por container
    for (const [container, fields] of Object.entries(data.fields)) {
      if (fields.length > MAX_SUBFIELDS) {
        throw new BadRequestException(
          `Container "${container}" excede o limite de ${MAX_SUBFIELDS} subcampos. ` +
          `Enviados: ${fields.length}`,
        );
      }
    }

    // Validar limite total de campos
    const totalFields = Object.values(data.fields).flat().length;
    if (totalFields > MAX_FIELDS) {
      throw new BadRequestException(
        `Total de campos (${totalFields}) excede o limite de ${MAX_FIELDS} por categoria`,
      );
    }

    await this.prisma.categoryFieldConfig.upsert({
      where: { categoryId: data.categoryId },
      update: {
        slug: normalizedSlug,
        fields: data.fields,
        isDefault: false,
        priority: 10,
        updatedAt: new Date(),
      },
      create: {
        categoryId: data.categoryId,
        slug: normalizedSlug,
        fields: data.fields,
        isDefault: false,
        isActive: true,
        priority: 10,
      },
    });
  }

  async updateBaseFields(fields: string[]): Promise<void> {
    if (fields.length > MAX_FIELDS) {
      throw new BadRequestException(
        `Total de campos base (${fields.length}) excede o limite de ${MAX_FIELDS}`,
      );
    }

    const baseConfig = await this.prisma.categoryFieldConfig.findFirst({
      where: { isDefault: true },
    });

    if (baseConfig) {
      await this.prisma.categoryFieldConfig.update({
        where: { id: baseConfig.id },
        data: { fields, updatedAt: new Date() },
      });
    } else {
      await this.prisma.categoryFieldConfig.create({
        data: {
          categoryId: null,
          slug: null,
          fields,
          isDefault: true,
          isActive: true,
          priority: 0,
        },
      });
    }

    await this.loadBaseFields();
  }

  async addExtraContainer(name: string, description?: string): Promise<void> {
    await this.prisma.extraFieldContainer.create({
      data: { name, description, isActive: true, priority: 10 },
    });
    await this.loadExtraContainers();
  }

  async removeExtraContainer(name: string): Promise<void> {
    await this.prisma.extraFieldContainer.updateMany({
      where: { name },
      data: { isActive: false },
    });
    await this.loadExtraContainers();
  }

  async deleteConfig(categoryId: string): Promise<void> {
    await this.prisma.categoryFieldConfig.updateMany({
      where: { categoryId },
      data: { isActive: false },
    });
  }

  // ──────────────────────────────────────────────
  // LISTING
  // ──────────────────────────────────────────────

  async listAll(): Promise<CategoryFieldConfigData[]> {
    const configs = await this.prisma.categoryFieldConfig.findMany({
      where: { isActive: true, isDefault: false },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      take: MAX_FIELDS,
    });

    return configs.map(config => ({
      categoryId: config.categoryId || '',
      slug: config.slug || '',
      fields: config.fields as Record<string, string[]>,
    }));
  }

  // ──────────────────────────────────────────────
  // HELPERS
  // ──────────────────────────────────────────────

  private normalizeSlug(slug: string): string {
    return slug
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}
