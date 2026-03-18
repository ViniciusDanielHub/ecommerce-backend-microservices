-- CreateTable
CREATE TABLE "category_field_configs" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "fields" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_field_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_field_configs_categoryId_key" ON "category_field_configs"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "category_field_configs_slug_key" ON "category_field_configs"("slug");
