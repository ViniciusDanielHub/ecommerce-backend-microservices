#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     🎨 Prisma Studio Launcher         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Escolha o serviço:${NC}"
echo "  1) Product Service (porta 5435)"
echo "  2) Category Service (porta 5434)"
echo "  3) Auth Service (porta 5433)"
echo "  4) User Service (porta 5436)"
echo "  5) Admin Service (porta 5437)"
echo "  6) File Service (porta 5438)"
echo ""
read -p "Digite o número (1-6): " choice

case $choice in
  1)
    echo -e "\n${GREEN}🚀 Iniciando Prisma Studio - Product Service${NC}"
    cd services/product-service
    DATABASE_URL="postgresql://postgres:postgres@localhost:5435/product_service" npx prisma studio
    ;;
  2)
    echo -e "\n${GREEN}🚀 Iniciando Prisma Studio - Category Service${NC}"
    cd services/category-service
    DATABASE_URL="postgresql://postgres:postgres@localhost:5434/category_service" npx prisma studio
    ;;
  3)
    echo -e "\n${GREEN}🚀 Iniciando Prisma Studio - Auth Service${NC}"
    cd services/auth-service
    DATABASE_URL="postgresql://postgres:postgres@localhost:5433/auth_service" npx prisma studio
    ;;
  4)
    echo -e "\n${GREEN}🚀 Iniciando Prisma Studio - User Service${NC}"
    cd services/user-service
    DATABASE_URL="postgresql://postgres:postgres@localhost:5436/user_service" npx prisma studio
    ;;
  5)
    echo -e "\n${GREEN}🚀 Iniciando Prisma Studio - Admin Service${NC}"
    cd services/admin-service
    DATABASE_URL="postgresql://postgres:postgres@localhost:5437/admin_service" npx prisma studio
    ;;
  6)
    echo -e "\n${GREEN}🚀 Iniciando Prisma Studio - File Service${NC}"
    cd services/file-service
    DATABASE_URL="postgresql://postgres:postgres@localhost:5438/file_service" npx prisma studio
    ;;
  *)
    echo -e "${YELLOW}Opção inválida!${NC}"
    exit 1
    ;;
esac
