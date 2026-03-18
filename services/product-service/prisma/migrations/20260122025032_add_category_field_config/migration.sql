-- AlterTable
ALTER TABLE "category_field_configs" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "categoryId" DROP NOT NULL,
ALTER COLUMN "slug" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "category_field_configs_categoryId_idx" ON "category_field_configs"("categoryId");

-- CreateIndex
CREATE INDEX "category_field_configs_slug_idx" ON "category_field_configs"("slug");

-- CreateIndex
CREATE INDEX "category_field_configs_isDefault_idx" ON "category_field_configs"("isDefault");
