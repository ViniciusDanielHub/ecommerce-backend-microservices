#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🚀 Iniciando E-commerce Microservices          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo ""

check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $1${NC}"
    else
        echo -e "${RED}✗ Erro ao $1${NC}"
        exit 1
    fi
}

echo -e "\n${YELLOW}[1/6] Criando rede Docker...${NC}"
docker network create microservices-net 2>/dev/null || echo -e "${YELLOW}Rede já existe${NC}"
check_status "criar/verificar rede Docker"

echo -e "\n${YELLOW}[2/6] Subindo serviços principais...${NC}"
docker compose up -d
check_status "subir serviços principais"

echo -e "\n${YELLOW}[3/6] Subindo User Service...${NC}"
docker compose -f docker-compose.user.yml up -d
check_status "subir User Service"

echo -e "\n${YELLOW}[4/6] Subindo Admin Service...${NC}"
docker compose -f docker-compose.admin.yml up -d
check_status "subir Admin Service"

echo -e "\n${YELLOW}[5/6] Subindo File Service...${NC}"
docker compose -f docker-compose.file.yml up -d
check_status "subir File Service"

echo -e "\n${YELLOW}Aguardando containers iniciarem (30s)...${NC}"
sleep 30

echo -e "\n${YELLOW}[6/6] Executando migrations do Prisma...${NC}"

echo "  → Auth Service"
docker exec -it auth-service npx prisma migrate deploy 2>/dev/null || docker exec -it auth-service npx prisma db push
check_status "migrations Auth Service"

echo "  → User Service"
docker exec -it user-service npx prisma migrate deploy 2>/dev/null || docker exec -it user-service npx prisma db push
check_status "migrations User Service"

echo "  → Admin Service"
docker exec -it admin-service npx prisma migrate deploy 2>/dev/null || docker exec -it admin-service npx prisma db push
check_status "migrations Admin Service"

echo "  → File Service"
docker exec -it file-service npx prisma migrate deploy 2>/dev/null || docker exec -it file-service npx prisma db push
check_status "migrations File Service"

echo "  → Product Service"
docker exec -it product-service npx prisma migrate deploy 2>/dev/null || docker exec -it product-service npx prisma db push
check_status "migrations Product Service"

echo "  → Category Service"
docker exec -it category-service npx prisma migrate deploy 2>/dev/null || docker exec -it category-service npx prisma db push
check_status "migrations Category Service"

echo -e "\n${YELLOW}Verificando status dos serviços...${NC}"
sleep 5

services=(
    "http://localhost:3000/api/health|API Gateway"
    "http://localhost:3001/health|Auth Service"
    "http://localhost:3002/health|User Service"
    "http://localhost:3003/health|Admin Service"
    "http://localhost:3004/health|Category Service"
    "http://localhost:3005/health|Product Service"
    "http://localhost:3006/health|File Service"
)

echo ""
for service in "${services[@]}"; do
    IFS='|' read -r url name <<< "$service"
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    if [ "$response" == "200" ]; then
        echo -e "${GREEN}✓ $name - UP${NC}"
    else
        echo -e "${RED}✗ $name - DOWN (código: $response)${NC}"
    fi
done

echo -e "\n${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   ✅ Microserviços iniciados com sucesso!        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"

echo -e "\n${GREEN}Serviços disponíveis:${NC}"
echo -e "  • API Gateway:      ${BLUE}http://localhost:3000${NC}"
echo -e "  • Auth Service:     ${BLUE}http://localhost:3001${NC}"
echo -e "  • User Service:     ${BLUE}http://localhost:3002${NC}"
echo -e "  • Admin Service:    ${BLUE}http://localhost:3003${NC}"
echo -e "  • Category Service: ${BLUE}http://localhost:3004${NC}"
echo -e "  • Product Service:  ${BLUE}http://localhost:3005${NC}"
echo -e "  • File Service:     ${BLUE}http://localhost:3006${NC}"

echo -e "\n${YELLOW}Comandos úteis:${NC}"
echo -e "  • Ver logs:         ${BLUE}docker compose logs -f${NC}"
echo -e "  • Parar tudo:       ${BLUE}./stop.sh${NC}"
echo -e "  • Ver containers:   ${BLUE}docker ps${NC}"
echo ""
