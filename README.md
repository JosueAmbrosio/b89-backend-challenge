# Backend B89 - Prueba Técnica

Backend desarrollado con Node.js, TypeScript y arquitectura de microservicios usando Moleculer.

El sistema incluye autenticación JWT, gestión de usuarios y CRUD de productos, todo conectado a PostgreSQL mediante Prisma.

---

## 🚀 Tecnologías

- Node.js + TypeScript
- Moleculer-Web (API Gateway)
- PostgreSQL + Prisma ORM
- JWT (Access + Refresh Tokens)
- bcrypt (hash de contraseñas)
- Zod (validación)
- Docker + Docker Compose

---

## 📌 Funcionalidades

### 🔐 Autenticación
- Registro de usuarios
- Login con JWT
- Refresh token
- Recuperación de contraseña por email
- Logout seguro

### 📦 Productos
- Crear producto
- Listar productos
- Actualizar producto
- Eliminación lógica (soft delete)

---

## 🏗 Arquitectura

El proyecto está dividido en 3 servicios:

- **API Gateway** → expone endpoints HTTP
- **Auth Service** → manejo de usuarios y tokens
- **Product Service** → gestión de productos

Flujo:
Cliente HTTP
    ↓
API Gateway (moleculer-web)
    ↓
Servicios (auth / product)
    ↓
Prisma ORM
    ↓
PostgreSQL

---

## 🐳 Ejecución del proyecto

### 1. Clonar repositorio
```bash
git clone https://github.com/JosueAmbrosio/b89-backend-challenge
cd backend-b89
```
### 2. Configurar variables de entorno
Crea un archivo `.env` basado en `.env.example` y completa los valores:
```
env
POSTGRES_DB=b89
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
DATABASE_URL=postgresql://postgres:password@db:5432/b89
JWT_SECRET=mi_access_super_secreto
JWT_REFRESH_SECRET=mi_refresh_super_secreto
SMTP_USER=correo
SMTP_PASS=xxxx xxxx xxxx
FRONTEND_URL=http://localhost:3000
```
### 3. Iniciar servicios con Docker Compose
```
docker-compose up --build
```
Esto levantará:
- PostgreSQL en el puerto 5432
- API Gateway en el puerto 3000
- Prisma migrará la base de datos automáticamente

### 4. Probar endpoints en swagger
Accede a `http://localhost:3000/docs` para ver la documentación Swagger y probar los endpoints.
Crear un usuario, iniciar sesión y gestionar productos.

---
## 🛠 Estructura del proyecto
```
backend-b89/
├── src/
│   ├── config/
│   ├── docs/
│   ├── errors/
│   ├── schemas/
│   ├── types/
│   ├── utils/
│
├── app.ts
└── route.ts
```

### 5. Comandos útiles
- `docker-compose logs -f` → ver logs en tiempo real
- `docker-compose down` → detener servicios

---

## 💻 Ejecución sin Docker (alternativa)

Si no deseas usar Docker, puedes ejecutar el proyecto localmente:

### 1. Instalar dependencias
```
npm install
```

### 2. Crea el archivo .env
```
POSTGRES_DB=b89
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
DATABASE_URL=postgresql://postgres:password@db:5432/b89
JWT_SECRET=mi_access_super_secreto
JWT_REFRESH_SECRET=mi_refresh_super_secreto
SMTP_USER=correo
SMTP_PASS=xxxx xxxx xxxx
FRONTEND_URL=http://localhost:3000
```

### 3. Ejecutar migraciones
```
npx prisma migrate dev
```

### 4. Generar cliente Prisma
```
npx prisma generate
```

### 5. Iniciar servidor
```
npx ts-node-dev src/app.ts
```

## 📝 Notas
- Asegúrate de tener Docker instalado para ejecutar el proyecto.
