FROM node:18-bullseye-slim

RUN apt-get update && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar apenas os arquivos de dependências primeiro
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm install

# Gerar Prisma Client dentro do container (garante target Linux)
RUN npx prisma generate

# Copiar o resto do código
COPY . .

# Build da aplicação
RUN npm run build

EXPOSE 3005

CMD ["npm", "run", "start:prod"]
