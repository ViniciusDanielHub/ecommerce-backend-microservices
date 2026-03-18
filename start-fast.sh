#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🚀 Iniciando E-commerce (Modo Rápido)          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo ""

# Limpar tudo primeiro
echo -e "${YELLOW}Limpando containers anteriores...${NC}"
docker compose down 2>/dev/null
docker compose -f docker-compose.user.yml down 2>/dev/null
docker compose -f docker-compose.admin.yml down 2>/dev/null
docker compose -f docker-compose.file.yml down 2>/dev/null

# Criar rede
echo -e "\n${YELLOW}[1/6] Criando rede Docker...${NC}"
docker network create microservices-net 2>/dev/null || echo "Rede já existe"

# Subir FORÇANDO uso de imagens locais
echo -e "\n${YELLOW}[2/6] Subindo serviços principais...${NC}"
docker compose up -d --no-build --pull never

echo -e "\n${YELLOW}[3/6] Subindo User Service...${NC}"
docker compose -f docker-compose.user.yml up -d --no-build --pull never

echo -e "\n${YELLOW}[4/6] Subindo Admin Service...${NC}"
docker compose -f docker-compose.admin.yml up -d --no-build --pull never

echo -e "\n${YELLOW}[5/6] Subindo File Service...${NC}"
docker compose -f docker-compose.file.yml up -d --no-build --pull never

echo -e "\n${YELLOW}Aguardando containers iniciarem (20s)...${NC}"
sleep 20

echo -e "\n${YELLOW}[6/6] Executando migrations do Prisma...${NC}"

services=("auth-service" "user-service" "admin-service" "file-service" "product-service" "category-service")

for service in "${services[@]}"; do
    echo "  → $service"
    docker exec -it $service npx prisma migrate deploy 2>/dev/null || \
    docker exec -it $service npx prisma db push 2>/dev/null
done

echo -e "\n${GREEN}✅ Todos os serviços iniciados!${NC}"

# Verificar status
docker compose ps
