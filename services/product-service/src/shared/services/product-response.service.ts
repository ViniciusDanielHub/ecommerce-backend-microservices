import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { CategoryFieldsRepository } from '../../infrastructure/repositories/category-fields.repository';
import {
  RawProduct,
  FilteredProduct,
  CategoryData,
  CategoryDataMap,
  ExtraFields,
} from '../types/product.types';

@Injectable()
export class ProductResponseService {
  constructor(
    private readonly categoryFieldsRepository: CategoryFieldsRepository,
  ) { }

  /**
   * Filtra produto baseado na categoria (100% DINÂMICO e TIPADO)
   */
  async filterByCategory(
    product: RawProduct,
    categoryData: CategoryData,
  ): Promise<FilteredProduct> {
    // 1. Buscar campos permitidos para esta categoria pelo categoryId
    let allowedFields = await this.categoryFieldsRepository.getFieldsByCategoryId(
      categoryData.id,
    );

    // 2. Se só tem campos base, tentar enriquecer pelo slug da categoria
    const baseFieldsCount = this.categoryFieldsRepository.getBaseFieldsCount();
    const hasOnlyBaseFields = allowedFields.length <= baseFieldsCount;

    if (hasOnlyBaseFields && categoryData.slug) {
      allowedFields = await this.categoryFieldsRepository.getFieldsBySlug(
        categoryData.slug,
      );
    }

    // 3. Filtrar campos base do produto
    const filtered = this.filterProduct(product, allowedFields);

    // 4. Processar campos extras DINÂMICOS (carregados do banco)
    await this.processExtraFields(product, filtered, allowedFields);

    // 5. Serializar Decimal → number nos campos de preço
    this.serializeDecimalFields(filtered);

    // 6. Adicionar informações da categoria
    const result: FilteredProduct = {
      ...filtered,
      category: {
        id: categoryData.id,
        name: categoryData.name,
        slug: categoryData.slug,
      },
    } as FilteredProduct;

    return result;
  }

  /**
   * Filtra lista de produtos
   */
  async filterListByCategory(
    products: RawProduct[],
    categoryDataMap: CategoryDataMap,
  ): Promise<FilteredProduct[]> {
    return Promise.all(
      products.map(async product => {
        const categoryData = categoryDataMap.get(product.categoryId);

        if (!categoryData) {
          const defaultCategory: CategoryData = {
            id: product.categoryId,
            name: 'Unknown',
            slug: 'unknown',
          };
          return this.filterByCategory(product, defaultCategory);
        }

        return this.filterByCategory(product, categoryData);
      }),
    );
  }

  // ──────────────────────────────────────────────
  // PRIVATE HELPERS
  // ──────────────────────────────────────────────

  /**
   * Filtra apenas os campos permitidos do produto raw
   */
  private filterProduct(
    product: RawProduct,
    allowedFields: string[],
  ): Partial<FilteredProduct> {
    const filtered: Record<string, unknown> = {};

    allowedFields.forEach(field => {
      if (Object.prototype.hasOwnProperty.call(product, field)) {
        filtered[field] = product[field];
      }
    });

    return filtered as Partial<FilteredProduct>;
  }

  /**
   * Processa campos extras DINÂMICOS.
   * Os containers são carregados do banco, não hardcoded.
   */
  private async processExtraFields(
    product: RawProduct,
    filtered: Partial<FilteredProduct>,
    allowedFields: string[],
  ): Promise<void> {
    const extraFieldContainers =
      await this.categoryFieldsRepository.getExtraContainers();

    if (extraFieldContainers.length === 0) return;

    extraFieldContainers.forEach(containerName => {
      const extraData = product[containerName];

      if (!extraData) return;

      if (this.isPlainObject(extraData)) {
        const filteredExtra: ExtraFields = {};

        Object.keys(extraData).forEach(key => {
          if (allowedFields.includes(key)) {
            filteredExtra[key] = (extraData as Record<string, unknown>)[key];
          }
        });

        if (Object.keys(filteredExtra).length > 0) {
          (filtered as Record<string, unknown>)[containerName] = filteredExtra;
        }
      }
    });
  }

  /**
   * Converte todos os campos Decimal do Prisma para number JS.
   * Necessário pois o Prisma retorna Decimal para colunas DECIMAL/NUMERIC,
   * o que é incompatível com a interface FilteredProduct (number).
   */
  private serializeDecimalFields(filtered: Partial<FilteredProduct>): void {
    const decimalFields: Array<keyof FilteredProduct> = [
      'price',
      'comparePrice',
      'costPrice',
      'taxRate',
      'weight',
      'length',
      'width',
      'height',
    ];

    decimalFields.forEach(field => {
      const value = (filtered as Record<string, unknown>)[field as string];
      if (value instanceof Decimal) {
        (filtered as Record<string, unknown>)[field as string] = value.toNumber();
      }
    });
  }

  /**
   * Verifica se o valor é um objeto plain (não array, não null, não Date, não Decimal)
   */
  private isPlainObject(value: unknown): value is Record<string, unknown> {
    return (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      !(value instanceof Date) &&
      !(value instanceof Decimal)
    );
  }
}