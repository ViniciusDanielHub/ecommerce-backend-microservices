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
}

/**
 * Campos extras dinâmicos (podem ser qualquer coisa)
 */
export interface ExtraFields {
  [key: string]: unknown;
}

/**
 * Produto completo do banco (antes da filtragem)
 */
export interface RawProduct {
  id: string;
  name: string;
  description?: string;
  slug: string;
  price: number;
  comparePrice?: number;
  sku?: string;
  stock: number;
  isActive: boolean;
  categoryId: string;
  status?: string;
  images?: ProductImage[];
  createdAt: Date;
  updatedAt: Date;

  // Campos extras dinâmicos
  customFields?: ExtraFields;
  specifications?: ExtraFields;
  attributes?: ExtraFields;

  // Outros campos dinâmicos possíveis
  [key: string]: unknown;
}

/**
 * Produto filtrado (após aplicar regras da categoria)
 */
export interface FilteredProduct {
  id: string;
  name: string;
  description?: string;
  slug: string;
  price: number;
  comparePrice?: number;
  sku?: string;
  stock: number;
  isActive: boolean;
  categoryId: string;
  status?: string;
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
  customFields?: ExtraFields;
  specifications?: ExtraFields;
  attributes?: ExtraFields;

  // Outros campos permitidos
  [key: string]: unknown;
}

/**
 * Mapa de categorias (categoryId -> CategoryData)
 */
export type CategoryDataMap = Map<string, CategoryData>;