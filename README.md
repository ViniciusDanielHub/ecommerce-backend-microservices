# 🛒 E-commerce Microservices

> Plataforma de e-commerce baseada em **arquitetura de microserviços** com **NestJS**, **PostgreSQL** e **Docker**.

## 📋 Índice


1. [Visão Geral](#-visão-geral)
2. [Arquitetura dos Serviços](#-arquitetura-dos-serviços)
3. [Pré-requisitos](#-pré-requisitos)
4. [Instalação e Configuração](#-instalação-e-configuração)
5. [Como Executar](#-como-executar)
6. [Documentação das APIs (Swagger)](#-documentação-das-apis-swagger)
7. [Autenticação](#-autenticação)
8. [Serviços e Endpoints](#-serviços-e-endpoints)
9. [Estrutura de Dados](#-estrutura-de-dados)
10. [Exemplos de Uso](#-exemplos-de-uso)
11. [Troubleshooting](#-troubleshooting)

## 🔍 Visão Geral


Este projeto é uma plataforma de **e-commerce** composta por **7 microserviços independentes**,
cada um com seu próprio banco de dados PostgreSQL e deploy isolado.

| Serviço            | Porta | Função                                              |
|--------------------|-------|----------------------------------------------------|
| **API Gateway**    | 3000  | Roteamento e proxy central para todos os serviços |
| **Auth Service**   | 3001  | Autenticação, login, registro e emissão de JWT     |
| **User Service**   | 3002  | Gestão de perfis de usuário                       |
| **Admin Service**  | 3003  | Funcionalidades administrativas                   |
| **Category Service**| 3004 | CRUD de categorias com hierarquia                 |
| **Product Service** | 3005 | CRUD de produtos e variações                      |
| **File Service**    | 3006 | Upload de arquivos (Local/Cloudinary/AWS)         |

Cada serviço é independente, facilitando escalabilidade, manutenção e desenvolvimento.

## 🏗 Arquitetura dos Serviços


Todos os serviços seguem **Clean Architecture**:

```
src/
├── config/           # Configurações da aplicação
├── domain/           # Lógica de negócio
│   ├── entities/     # Entidades de domínio
│   └── use-cases/    # Casos de uso
├── infrastructure/   # Infraestrutura
│   ├── database/     # Integração com banco (Prisma)
│   └── repositories/ # Repositórios
├── modules/          # Módulos por feature (controllers, DTOs)
├── shared/           # Código compartilhado (guards, decorators, utils)
└── main.ts           # Ponto de entrada da aplicação
```

## 📋 Pré-requisitos


- **Node.js 18+**
- **Docker** e **Docker Compose**
- **Git**

## 🚀 Instalação e Configuração


```bash
# Clonar o repositório
git clone <seu-repositorio>.git
cd ecommerce-microservices

# Criar rede docker
docker network create microservices-net
```

### Executar migrações do banco
Cada serviço tem suas próprias migrations com Prisma:
```bash
docker compose -f docker-compose.auth.yml exec auth-service npx prisma migrate dev --name init
docker compose -f docker-compose.user.yml exec user-service npx prisma migrate dev --name init
# ... repita para admin, category, product e file
```

## ▶ Como Executar


Subir todos os serviços de uma vez:
```bash
docker compose -f docker-compose.auth.yml -f docker-compose.user.yml -f docker-compose.admin.yml -f docker-compose.category.yml -f docker-compose.product.yml -f docker-compose.file.yml -f docker-compose.gateway.yml up -d
```

Subir individualmente:
```bash
docker compose -f docker-compose.auth.yml up -d
docker compose -f docker-compose.user.yml up -d
# etc...
```

Ver logs de um serviço:
```bash
docker compose -f docker-compose.auth.yml logs -f auth-service
```

Ver status:
```bash
docker ps
```

## 📚 Documentação das APIs (Swagger)


Cada serviço expõe documentação Swagger em:

- Auth: http://localhost:3001/api-docs
- User: http://localhost:3002/api-docs
- Admin: http://localhost:3003/api-docs
- Category: http://localhost:3004/api-docs
- Product: http://localhost:3005/api-docs
- File: http://localhost:3006/api-docs

Para usar:
1. Suba o serviço com Docker
2. Acesse o endpoint no navegador
3. Clique em **Authorize** e insira seu JWT

## 🔐 Autenticação


O sistema usa **JWT**:

1. Faça login ou registro → Receba `access_token` e `refresh_token`
2. Requests subsequentes → Header: `Authorization: Bearer <access_token>`
3. Quando expirar → Use `refresh_token`

**Roles**:
- `USER`: Usuário padrão
- `ADMIN`: Acesso total
- `SELLER`: Gerencia produtos

## 🛠 Serviços e Endpoints


Cada microserviço tem endpoints REST claros. Veja exemplos:

### 🔑 Auth Service
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/register` | Registrar usuário |
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | Renovar token |
| POST | `/auth/request-password-reset` | Solicitar reset de senha |
| POST | `/auth/reset-password` | Resetar senha |

### 👤 User Service
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/users/profile` | Buscar perfil |
| PUT | `/users/profile` | Atualizar perfil |
| GET | `/users/activity-logs` | Logs de atividade |

### 🛡️ Admin Service
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/admin/users` | Listar usuários |
| PUT | `/admin/users/:id/promote` | Promover usuário |
| GET | `/admin/config/upload` | Config de upload |
| POST| `/admin/config/upload` | Atualizar config |

### 🏷️ Category Service
- GET `/categories` (público, com filtros)
- GET `/categories/tree`
- POST `/categories` (Admin/Seller)
- PUT `/categories/:id`
- DELETE `/categories/:id`

### 📦 Product Service
- GET `/products` (filtros: categoria, preço, status, etc.)
- GET `/products/:id`
- POST `/products` (Admin/Seller)
- POST `/products/with-upload` (multipart)
- PUT `/products/:id`
- DELETE `/products/:id`

### 📁 File Service
- POST `/upload/single` (multipart)
- POST `/upload/multiple`
- DELETE `/upload/:fileId`
- GET `/health`

## 📊 Estrutura de Dados (Simplificada)


### User
```ts
{
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SELLER';
  createdAt: Date;
  updatedAt: Date;
}
```

### Category
```ts
{
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  children?: Category[];
}
```

### Product
```ts
{
  id: string;
  name: string;
  price: number;
  stock: number;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  categoryId: string;
  images: ProductImage[];
}
```

## 🔧 Exemplos de Uso


### Registro e Login
```bash
curl -X POST http://localhost:3000/auth/register   -H "Content-Type: application/json"   -d '{"name":"João","email":"joao@test.com","password":"Senha@123","confirmPassword":"Senha@123"}'

curl -X POST http://localhost:3000/auth/login   -H "Content-Type: application/json"   -d '{"email":"joao@test.com","password":"Senha@123"}'
```

### Upload de Arquivo
```bash
curl -X POST http://localhost:3000/upload/single   -H "Authorization: Bearer TOKEN"   -F "file=@/path/to/image.jpg"
```

## ❗ Troubleshooting


- **Container não sobe**: Rode `docker compose ps` e veja logs com `docker compose logs`
- **Erro no banco**: Verifique `.env` e se o container do Postgres está rodando
- **Token inválido**: Refaça login ou use refresh token
- **Permissão negada (403)**: Confirme role (`ADMIN`, `SELLER`, `USER`)
- **Upload falha**: Verifique limite (5MB) e formatos suportados (jpg, png, webp)
- **API Gateway não roteia**: Verifique todos serviços e proxy configs
