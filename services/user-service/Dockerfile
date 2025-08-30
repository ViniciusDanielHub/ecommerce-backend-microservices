FROM node:18-alpine

# Instalar dependências do sistema
RUN apk add --no-cache \
    openssl \
    libc6-compat

WORKDIR /app

# Instalar dependências globais
RUN npm install -g @nestjs/cli

# Copiar package.json e instalar dependências
COPY package.json ./
RUN npm install

# Copiar configurações do TypeScript e Nest
COPY tsconfig.json ./
COPY nest-cli.json ./

# Copiar Prisma e gerar cliente
COPY prisma/ ./prisma/
RUN npx prisma generate

# Copiar código fonte
COPY src/ ./src/

EXPOSE 3002

CMD ["npm", "run", "start:dev"]
