export interface CreateProductDto {
  name: string;
  description?: string;
  slug: string;
  price: number;
  comparePrice?: number;
  sku?: string;
  stock?: number;
  categoryId: string;
  images?: CreateProductImageDto[];
}

export interface CreateProductImageDto {
  url: string;
  alt?: string;
  isMain?: boolean;
  order?: number;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}
