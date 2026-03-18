import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // ========================================
  // 1. CONFIGURAR CONTAINERS DE CAMPOS EXTRAS
  // ========================================
  console.log('📦 Setting up extra field containers...');

  await prisma.extraFieldContainer.upsert({
    where: { name: 'customFields' },
    update: {
      description: 'Campos customizados específicos do produto',
      isActive: true,
      priority: 10
    },
    create: {
      name: 'customFields',
      description: 'Campos customizados específicos do produto',
      isActive: true,
      priority: 10
    }
  });

  await prisma.extraFieldContainer.upsert({
    where: { name: 'specifications' },
    update: {
      description: 'Especificações técnicas detalhadas',
      isActive: true,
      priority: 20
    },
    create: {
      name: 'specifications',
      description: 'Especificações técnicas detalhadas',
      isActive: true,
      priority: 20
    }
  });

  await prisma.extraFieldContainer.upsert({
    where: { name: 'attributes' },
    update: {
      description: 'Atributos adicionais do produto',
      isActive: true,
      priority: 15
    },
    create: {
      name: 'attributes',
      description: 'Atributos adicionais do produto',
      isActive: true,
      priority: 15
    }
  });

  console.log('✅ Extra field containers configured\n');

  // ========================================
  // 2. CAMPOS BASE (TODOS OS PRODUTOS)
  // ========================================
  console.log('🔧 Setting up base fields...');

  const baseFields = await prisma.categoryFieldConfig.upsert({
    where: { id: 'base-fields-default' },
    update: {
      fields: [
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
      ],
      isDefault: true,
      isActive: true,
      priority: 0,
      updatedAt: new Date()
    },
    create: {
      id: 'base-fields-default',
      categoryId: null,
      slug: null,
      fields: [
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
      ],
      isDefault: true,
      isActive: true,
      priority: 0
    }
  });

  console.log('✅ Base fields:', (baseFields.fields as string[]).length, 'fields\n');

  // ========================================
  // 3. ELETRÔNICOS
  // ========================================
  console.log('📱 Setting up electronics category...');

  await prisma.categoryFieldConfig.upsert({
    where: { slug: 'eletronicos' },
    update: {
      fields: [
        'warranty',
        'warrantyPeriod',
        'brand',
        'model',
        'voltage',
        'power',
        'frequency',
        'dimensions',
        'weight',
        'color',
        'energyEfficiency',
        'certification',
        'processor',
        'ram',
        'storage',
        'screenSize',
        'resolution',
        'battery',
        'operatingSystem'
      ],
      isActive: true,
      isDefault: false,
      priority: 10
    },
    create: {
      slug: 'eletronicos',
      fields: [
        'warranty',
        'warrantyPeriod',
        'brand',
        'model',
        'voltage',
        'power',
        'frequency',
        'dimensions',
        'weight',
        'color',
        'energyEfficiency',
        'certification',
        'processor',
        'ram',
        'storage',
        'screenSize',
        'resolution',
        'battery',
        'operatingSystem'
      ],
      isDefault: false,
      isActive: true,
      priority: 10
    }
  });

  console.log('✅ Electronics category configured\n');

  // ========================================
  // 4. ROUPAS E MODA
  // ========================================
  console.log('👕 Setting up clothing category...');

  await prisma.categoryFieldConfig.upsert({
    where: { slug: 'roupas' },
    update: {
      fields: [
        'size',
        'sizeChart',
        'fit',
        'color',
        'pattern',
        'colorVariants',
        'material',
        'composition',
        'fabric',
        'gender',
        'ageGroup',
        'season',
        'style',
        'washInstructions',
        'careInstructions',
        'madeIn',
        'brand'
      ],
      isActive: true,
      isDefault: false,
      priority: 10
    },
    create: {
      slug: 'roupas',
      fields: [
        'size',
        'sizeChart',
        'fit',
        'color',
        'pattern',
        'colorVariants',
        'material',
        'composition',
        'fabric',
        'gender',
        'ageGroup',
        'season',
        'style',
        'washInstructions',
        'careInstructions',
        'madeIn',
        'brand'
      ],
      isDefault: false,
      isActive: true,
      priority: 10
    }
  });

  console.log('✅ Clothing category configured\n');

  // ========================================
  // 5. ALIMENTOS E BEBIDAS
  // ========================================
  console.log('🍕 Setting up food category...');

  await prisma.categoryFieldConfig.upsert({
    where: { slug: 'alimentos' },
    update: {
      fields: [
        'nutritionalInfo',
        'ingredients',
        'allergens',
        'calories',
        'servingSize',
        'expirationDate',
        'manufacturingDate',
        'shelfLife',
        'brand',
        'origin',
        'organic',
        'vegan',
        'glutenFree',
        'lactoseFree',
        'storageInstructions',
        'temperature',
        'certifications',
        'registrationNumber'
      ],
      isActive: true,
      isDefault: false,
      priority: 10
    },
    create: {
      slug: 'alimentos',
      fields: [
        'nutritionalInfo',
        'ingredients',
        'allergens',
        'calories',
        'servingSize',
        'expirationDate',
        'manufacturingDate',
        'shelfLife',
        'brand',
        'origin',
        'organic',
        'vegan',
        'glutenFree',
        'lactoseFree',
        'storageInstructions',
        'temperature',
        'certifications',
        'registrationNumber'
      ],
      isDefault: false,
      isActive: true,
      priority: 10
    }
  });

  console.log('✅ Food category configured\n');

  // ========================================
  // 6. LIVROS
  // ========================================
  console.log('📚 Setting up books category...');

  await prisma.categoryFieldConfig.upsert({
    where: { slug: 'livros' },
    update: {
      fields: [
        'author',
        'publisher',
        'isbn',
        'edition',
        'publicationYear',
        'format',
        'language',
        'pages',
        'dimensions',
        'weight',
        'genre',
        'subject',
        'ageRating',
        'ebook',
        'audiobook',
        'fileFormat',
        'fileSize'
      ],
      isActive: true,
      isDefault: false,
      priority: 10
    },
    create: {
      slug: 'livros',
      fields: [
        'author',
        'publisher',
        'isbn',
        'edition',
        'publicationYear',
        'format',
        'language',
        'pages',
        'dimensions',
        'weight',
        'genre',
        'subject',
        'ageRating',
        'ebook',
        'audiobook',
        'fileFormat',
        'fileSize'
      ],
      isDefault: false,
      isActive: true,
      priority: 10
    }
  });

  console.log('✅ Books category configured\n');

  console.log('🎉 Seeding completed!\n');
  console.log('📊 Summary:');
  console.log('   - Extra field containers: 3 (customFields, specifications, attributes)');
  console.log('   - Base fields: Always returned for all products');
  console.log('   - Categories configured: 4 (electronics, clothing, food, books)');
  console.log('   - Extra fields filtering: Dynamic based on category configuration\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });