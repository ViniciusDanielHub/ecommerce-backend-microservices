FROM node:18-alpine

# Instalar dependências do sistema (CORREÇÃO DO ERRO OPENSSL)
RUN apk add --no-cache \
    openssl \
    libc6-compat

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY . .
RUN npm run build

EXPOSE 3004

CMD ["npm", "run", "start:prod"]
