#!/bin/bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5435/product_service"
echo "🚀 Iniciando Prisma Studio na porta 5555..."
npx prisma studio
