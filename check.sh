#!/bin/bash

echo "🔍 Verificando Microserviços..."
echo ""

# Containers
echo "📦 Containers rodando:"
docker ps --format "table {{.Names}}\t{{.Status}}" | grep -E "(auth|user|admin|product|category|file|gateway)"

echo ""
echo "🌐 Testando Endpoints:"

services=(
    "3000/api|API Gateway"
    "3001|Auth Service"
    "3002|User Service"
    "3003|Admin Service"
    "3004|Category Service"
    "3005|Product Service"
    "3006|File Service"
)

echo ""
for service in "${services[@]}"; do
    IFS='|' read -r port name <<< "$service"
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$port/health 2>/dev/null)
    if [ "$response" == "200" ]; then
        echo "✅ $name (porta ${port%%/*})"
    else
        echo "❌ $name (porta ${port%%/*}) - Código: $response"
    fi
done

echo ""
echo "✅ Verificação concluída!"
