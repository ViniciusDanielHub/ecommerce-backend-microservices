#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🛑 Parando E-commerce Microservices            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}Parando todos os serviços...${NC}"

docker compose -f docker-compose.file.yml down
docker compose -f docker-compose.admin.yml down
docker compose -f docker-compose.user.yml down
docker compose down

echo -e "\n${GREEN}✓ Todos os serviços foram parados!${NC}"
echo ""
