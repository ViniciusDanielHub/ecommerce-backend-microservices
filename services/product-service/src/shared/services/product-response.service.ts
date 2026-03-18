import { Injectable } from '@nestjs/common';
import { CategoryFieldsRepository } from '../../infrastructure/repositories/category-fields.repository';
import {
  RawProduct,
  FilteredProduct,
  CategoryData,
  CategoryDataMap,
  ExtraFields
} from '../types/product.types';

@Injectable()
export class ProductResponseService {
  constructor(
    private readonly categoryFieldsRepository: CategoryFieldsRepository
  ) { }

  /**
   * Filtra produto baseado na categoria (100% DINÂMICO e TIPADO)
   */
  async filterByCategory(
    product: RawProduct,
    categoryData: CategoryData
  ): Promise<FilteredProduct> {
    // 1. Buscar campos permitidos para esta categoria
    let allowedFields = await this.categoryFieldsRepository.getFieldsByCategoryId(
      categoryData.id
    );

    // 2. Se não encontrou configuração específica, tentar por slug
    const baseFieldsCount = this.categoryFieldsRepository.getBaseFieldsCount();
    const hasOnlyBaseFields = allowedFields.length <= baseFieldsCount;

    if (hasOnlyBaseFields && categoryData.slug) {
      allowedFields = await this.categoryFieldsRepository.getFieldsBySlug(
        categoryData.slug
      );
    }

    // 3. Filtrar campos base do produto
    const filtered = this.filterProduct(product, allowedFields);

    // 4. Processar campos extras DINÂMICOS (carregados do banco)
    await this.processExtraFields(product, filtered, allowedFields);

    // 5. Adicionar informações da categoria
    const result = {
      ...filtered,
      category: {
        id: categoryData.id,
        name: categoryData.name,
        slug: categoryData.slug
      }
    } as FilteredProduct;

    return result;
  }

  /**
   * Filtra lista de produtos
   */
  async filterListByCategory(
    products: RawProduct[],
    categoryDataMap: CategoryDataMap
  ): Promise<FilteredProduct[]> {
    return Promise.all(
      products.map(async (product) => {
        const categoryData = categoryDataMap.get(product.categoryId);

        if (!categoryData) {
          // Fallback se categoria não for encontrada
          const defaultCategory: CategoryData = {
            id: product.categoryId,
            name: 'Unknown',
            slug: 'unknown'
          };
          return this.filterByCategory(product, defaultCategory);
        }

        return this.filterByCategory(product, categoryData);
      })
    );
  }

  /**
   * Filtra campos base do produto
   */
  private filterProduct(
    product: RawProduct,
    allowedFields: string[]
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
   * Processa campos extras DINÂMICOS
   * Containers são carregados do banco de dados
   */
  private async processExtraFields(
    product: RawProduct,
    filtered: Partial<FilteredProduct>,
    allowedFields: string[]
  ): Promise<void> {
    // Buscar containers ATIVOS do banco (não hardcoded!)
    const extraFieldContainers = await this.categoryFieldsRepository.getExtraContainers();

    if (extraFieldContainers.length === 0) {
      return;
    }

    // Processar cada container encontrado
    extraFieldContainers.forEach(containerName => {
      const extraData = product[containerName];

      if (!extraData) return;

      // Se for objeto, filtrar chaves
      if (this.isPlainObject(extraData)) {
        const filteredExtra: ExtraFields = {};

        Object.keys(extraData).forEach(key => {
          // Apenas incluir se o campo estiver na lista de permitidos
          if (allowedFields.includes(key)) {
            filteredExtra[key] = (extraData as Record<string, unknown>)[key];
          }
        });

        // Só adicionar se tiver algum campo
        if (Object.keys(filteredExtra).length > 0) {
          filtered[containerName] = filteredExtra;
        }
      }
    });
  }

  /**
   * Verifica se é um objeto plain (não array, não null, não Date, etc)
   */
  private isPlainObject(value: unknown): value is Record<string, unknown> {
    return (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    );
  }
}