import { ProductStatus } from '../enums';

export interface IProduct {
  id: string;
  name: string;
  description?: string;
  slug: string;
  sku?: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  weight?: number;
  dimensions?: {
    height?: number;
    width?: number;
    depth?: number;
  };
  status: ProductStatus;
  stock: number;
  minStock?: number;
  maxStock?: number;
  isDigital?: boolean;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  categoryId: string;
  storeId: string;
  images?: IProductImage[];
  variants?: IProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductImage {
  id: string;
  productId: string;
  url: string;
  alt?: string;
  order: number;
  isMain: boolean;
  publicId?: string;
}

export interface IProductVariant {
  id: string;
  productId: string;
  name: string;
  value: string;
  price?: number;
  stock: number;
  sku?: string;
  isActive: boolean;
}
