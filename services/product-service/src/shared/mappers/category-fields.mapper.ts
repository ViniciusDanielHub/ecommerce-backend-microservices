export class CategoryFieldsMapper {
  // Campos base que SEMPRE são retornados
  private static readonly BASE_FIELDS = [
    'id',
    'name',
    'description',
    'slug',
    'price',
    'comparePrice',
    'sku',
    'stock',
    'isActive',
    'categoryId',
    'status',
    'images',
    'createdAt',
    'updatedAt'
  ];

  // Mapeamento de categorias para campos específicos
  private static readonly CATEGORY_FIELD_MAP: Record<string, string[]> = {
    // Eletrônicos
    'eletronics': [
      ...CategoryFieldsMapper.BASE_FIELDS,
      'type',
      'barcode',
      'brandId',
      'weight',
      'weightUnit',
      'length',
      'width',
      'height',
      'dimensionUnit',
      'specifications',
      'isFeatured'
    ],

    // Roupas e Moda
    'clothes': [
      ...CategoryFieldsMapper.BASE_FIELDS,
      'type',
      'barcode',
      'brandId',
      'specifications', // Pode incluir tamanho, cor, material
      'customFields', // Para tamanho, cor, etc
      'isFeatured',
      'isNewArrival'
    ],

    'fashion': [
      ...CategoryFieldsMapper.BASE_FIELDS,
      'type',
      'brandId',
      'specifications',
      'customFields',
      'isFeatured',
      'isNewArrival'
    ],

    // Livros
    'books': [
      ...CategoryFieldsMapper.BASE_FIELDS,
      'type',
      'barcode',
      'brandId',
      'weight',
      'weightUnit',
      'specifications', // Para autor, editora, ISBN
      'customFields',
      'isFeatured',
      'isNewArrival'
    ],

    // Alimentos e Bebidas
    'foods': [
      ...CategoryFieldsMapper.BASE_FIELDS,
      'type',
      'barcode',
      'weight',
      'weightUnit',
      'specifications', // Ingredientes, valor nutricional
      'customFields',
      'ageRestriction',
      'isFeatured'
    ],

    'drinks': [
      ...CategoryFieldsMapper.BASE_FIELDS,
      'type',
      'barcode',
      'weight',
      'weightUnit',
      'specifications',
      'customFields',
      'ageRestriction',
      'isFeatured'
    ],

    // Móveis e Decoração
    'furniture': [
      ...CategoryFieldsMapper.BASE_FIELDS,
      'type',
      'brandId',
      'weight',
      'weightUnit',
      'length',
      'width',
      'height',
      'dimensionUnit',
      'requiresShipping',
      'shippingType',
      'specifications',
      'customFields',
      'isFeatured'
    ],

    // Esportes
    'sports': [
      ...CategoryFieldsMapper.BASE_FIELDS,
      'type',
      'brandId',
      'weight',
      'weightUnit',
      'specifications',
      'customFields',
      'isFeatured'
    ],

    // Beleza e Cuidados Pessoais
    'beauty': [
      ...CategoryFieldsMapper.BASE_FIELDS,
      'type',
      'barcode',
      'brandId',
      'weight',
      'weightUnit',
      'specifications', // Tipo de pele, ingredientes
      'customFields',
      'isFeatured'
    ],

    // Brinquedos
    'toys': [
      ...CategoryFieldsMapper.BASE_FIELDS,
      'type',
      'barcode',
      'brandId',
      'weight',
      'weightUnit',
      'ageRestriction',
      'specifications',
      'customFields',
      'isFeatured'
    ],

    // Produtos Digitais
    'digital': [
      ...CategoryFieldsMapper.BASE_FIELDS,
      'type',
      'isDigital',
      'downloadUrl',
      'downloadLimit',
      'requiresShipping',
      'customFields'
    ],

    // Assinaturas
    'signature': [
      ...CategoryFieldsMapper.BASE_FIELDS,
      'type',
      'isSubscription',
      'subscriptionPeriod',
      'requiresShipping',
      'customFields'
    ]
  };

  /**
   * Retorna os campos permitidos para uma categoria
   */
  static getFieldsForCategory(categorySlug: string): string[] {
    // Normalizar slug (remover acentos, lowercase)
    const normalizedSlug = categorySlug
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    // Buscar campos específicos ou retornar BASE_FIELDS
    return this.CATEGORY_FIELD_MAP[normalizedSlug] || this.BASE_FIELDS;
  }

  /**
   * Filtra um objeto produto mantendo apenas campos permitidos
   */
  static filterProduct(product: any, allowedFields: string[]): any {
    const filtered: any = {};

    allowedFields.forEach(field => {
      if (product.hasOwnProperty(field)) {
        filtered[field] = product[field];
      }
    });

    return filtered;
  }

  /**
   * Adiciona campo customizado ao mapeamento
   */
  static addCategoryMapping(categorySlug: string, fields: string[]): void {
    this.CATEGORY_FIELD_MAP[categorySlug] = [
      ...this.BASE_FIELDS,
      ...fields.filter(f => !this.BASE_FIELDS.includes(f))
    ];
  }
}