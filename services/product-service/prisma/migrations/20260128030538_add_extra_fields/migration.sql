-- CreateTable
CREATE TABLE "extra_field_containers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "extra_field_containers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "extra_field_containers_name_key" ON "extra_field_containers"("name");

-- CreateIndex
CREATE INDEX "extra_field_containers_isActive_idx" ON "extra_field_containers"("isActive");

-- CreateIndex
CREATE INDEX "extra_field_containers_priority_idx" ON "extra_field_containers"("priority");
