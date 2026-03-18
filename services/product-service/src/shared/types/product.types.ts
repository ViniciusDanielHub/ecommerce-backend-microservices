import { Decimal } from '@prisma/client/runtime/library';
import { JsonValue } from '@prisma/client/runtime/library';

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
}

/**
 * Imagem do produto
 */
export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isMain: boolean;
  order: number;
  title?: string;
  width?: number;
  height?: number;
  size?: number;
  type?: string;
  productId?: string;
  createdAt?: Date;
}

/**
 * Campos extras dinâmicos (podem ser qualquer coisa)
 */
export interface ExtraFields {
  [key: string]: unknown;
}

/**
 * Produto completo do banco (antes da filtragem).
 * Usa Decimal para os campos numéricos que o Prisma retorna como Decimal,
 * evitando erros de type mismatch.
 */
export interface RawProduct {
  id: string;
  name: string;
  description?: string | null;
  slug: string;
  price: Decimal | number;
  comparePrice?: Decimal | number | null;
  sku?: string | null;
  stock: number;
  isActive: boolean;
  categoryId: string;
  status?: string | null;
  images?: ProductImage[];
  createdAt: Date;
  updatedAt: Date;

  // Campos Json do Prisma — JsonValue é o tipo real que o Prisma retorna
  customFields?: JsonValue | null;
  specifications?: JsonValue | null;
  attributes?: JsonValue | null;

  // Outros campos dinâmicos possíveis
  [key: string]: unknown;
}

/**
 * Produto filtrado (após aplicar regras da categoria).
 * price é serializado como number no response final.
 */
export interface FilteredProduct {
  id: string;
  name: string;
  description?: string | null;
  slug: string;
  price: number;
  comparePrice?: number | null;
  sku?: string | null;
  stock: number;
  isActive: boolean;
  categoryId: string;
  status?: string | null;
  images?: ProductImage[];
  createdAt: Date;
  updatedAt: Date;

  // Categoria aninhada
  category: {
    id: string;
    name: string;
    slug: string;
  };

  // Campos extras filtrados
  customFields?: ExtraFields | null;
  specifications?: ExtraFields | null;
  attributes?: ExtraFields | null;

  // Outros campos permitidos
  [key: string]: unknown;
}

/**
 * Mapa de categorias (categoryId -> CategoryData)
 */
export type CategoryDataMap = Map<string, CategoryData>;