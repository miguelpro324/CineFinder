# Proyecto Final 2 - Migración Completa

## 📋 Resumen de la Migración

Este proyecto migra el frontend de `proyecto-final` a `proyecto-final2` con persistencia MySQL en lugar de localStorage.

## ✅ Cambios Realizados

### 1. Frontend - Componentes Migrados
- ✅ `ArchiveCard.tsx` → `/src/components/specific/`
- ✅ `AddFileCard.tsx` → `/src/components/specific/`
- ✅ `FileUploadModal.tsx` → `/src/components/specific/`
- ✅ `LoginForm.tsx` → `/src/components/specific/`
- ✅ `RegisterForm.tsx` → `/src/components/specific/`
- ✅ `FileViewer.tsx` → `/src/components/specific/`
- ✅ `FileContentViewer.tsx` → `/src/components/specific/`
- ✅ `SettingsControls.tsx` → `/src/components/specific/`
- ✅ `ProtectedRoute.tsx` → `/src/components/common/`
- ✅ `BootstrapAlert.tsx` → `/src/components/common/`

### 2. Frontend - Contextos y Hooks
- ✅ `AuthContext.tsx` → `/src/context/`
- ✅ `LanguageContext.tsx` → `/src/context/`
- ✅ `useFileUpload.ts` - Actualizado para usar API REST
- ✅ `MainScreen.tsx` - Actualizado para usar API REST

### 3. Backend - Base de Datos MySQL

#### Tablas Creadas:
```sql
ArchiveItem (
  id, topic, subCategory, featuredFile, 
  fileType, fileContent, ownerId, createdAt
)

ArchiveFile (
  id, archiveItemId [FK], fileUrl, createdAt
)
```

#### Rutas API Implementadas:
- ✅ `POST /api/archive-items` - Crear ArchiveItem (con fileUrl opcional)
- ✅ `GET /api/archive-items` - Obtener todos los ArchiveItems
- ✅ `GET /api/archive-items/:id` - Obtener un ArchiveItem por ID
- ✅ `GET /api/archive-items/:id/file` - Obtener fileUrl de un ArchiveItem (lazy loading)
- ✅ `PUT /api/archive-items/:id` - Actualizar ArchiveItem
- ✅ `DELETE /api/archive-items/:id` - Eliminar ArchiveItem

### 4. Servicio de API Frontend
- ✅ `/src/services/archiveApi.ts` - Cliente HTTP para comunicación con backend

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v16+)
- MySQL (v8.0+)
- npm o yarn

### Paso 1: Configurar Base de Datos

1. **Iniciar MySQL:**
```bash
mysql -u root -p
```

2. **Ejecutar script de setup:**
```bash
cd proyecto-final2/server
mysql -u root -p < database_setup.sql
```

O manualmente:
```sql
CREATE DATABASE proyecto_final_db;
USE proyecto_final_db;
-- (ejecutar queries del archivo database_setup.sql)
```

3. **Configurar credenciales en `/server/config/database.ts`:**
```typescript
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'TU_PASSWORD_AQUI', // ⚠️ Cambiar esto
  database: 'proyecto_final_db',
  // ...
};
```

### Paso 2: Instalar Dependencias

**Backend:**
```bash
cd proyecto-final2/server
npm install
```

**Frontend:**
```bash
cd proyecto-final2
npm install
```

### Paso 3: Iniciar Servicios

**Terminal 1 - Backend:**
```bash
cd proyecto-final2/server
npx ts-node server.ts
# O si tienes un script en package.json:
npm run dev
```

El servidor debe iniciar en: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd proyecto-final2
npm run dev
```

El frontend debe iniciar en: `http://localhost:5173` (Vite) o `http://localhost:3000`

## 🧪 Pruebas de Funcionalidad

### 1. Verificar Conexión Backend
```bash
curl http://localhost:5000/api/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "message": "Archive API is running",
  "timestamp": "..."
}
```

### 2. Pruebas CRUD Completas

#### Crear ArchiveItem (POST)
```bash
curl -X POST http://localhost:5000/api/archive-items \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Matemáticas Avanzadas",
    "subCategory": "Cálculo Diferencial",
    "featuredFile": "ecuaciones.pdf",
    "fileType": "application/pdf",
    "fileContent": "Contenido del archivo...",
    "ownerId": "user123",
    "fileUrl": "data:application/pdf;base64,..."
  }'
```

#### Leer todos los ArchiveItems (GET)
```bash
curl http://localhost:5000/api/archive-items
```

#### Leer ArchiveItem por ID (GET)
```bash
curl http://localhost:5000/api/archive-items/1
```

#### Obtener fileUrl de un ArchiveItem (GET)
```bash
curl http://localhost:5000/api/archive-items/1/file
```

#### Actualizar ArchiveItem (PUT)
```bash
curl -X PUT http://localhost:5000/api/archive-items/1 \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Matemáticas Básicas",
    "subCategory": "Álgebra"
  }'
```

#### Eliminar ArchiveItem (DELETE)
```bash
curl -X DELETE http://localhost:5000/api/archive-items/1
```

### 3. Pruebas desde la Interfaz Web

1. **Registrar usuario:**
   - Ir a `/register`
   - Crear una cuenta

2. **Iniciar sesión:**
   - Ir a `/login`
   - Ingresar credenciales

3. **Subir archivo:**
   - Click en "Agregar Archivo"
   - Completar formulario
   - Seleccionar archivo
   - Click en "Subir"

4. **Verificar persistencia:**
   - Cerrar navegador
   - Reabrir aplicación
   - Los archivos deben seguir ahí (en MySQL, no en localStorage)

5. **Editar archivo:**
   - Click en "⋮" en una tarjeta
   - Seleccionar "Editar"

6. **Eliminar archivo:**
   - Click en "⋮" en una tarjeta
   - Seleccionar "Eliminar"

## 🔍 Verificación de la Migración

### Verificar que NO se use localStorage para ArchiveItems

Abrir DevTools → Application → Local Storage:
- ✅ NO debe haber clave `archive-items`
- ✅ Solo deben estar: `theme`, `language`, `current-user`, etc.

### Verificar Base de Datos

```sql
USE proyecto_final_db;

-- Ver todos los ArchiveItems
SELECT * FROM ArchiveItem;

-- Ver todos los ArchiveFiles
SELECT * FROM ArchiveFile;

-- Ver ArchiveItems con sus archivos (JOIN)
SELECT 
  ai.id, ai.topic, ai.subCategory, ai.featuredFile, 
  af.fileUrl, ai.createdAt
FROM ArchiveItem ai
LEFT JOIN ArchiveFile af ON ai.id = af.archiveItemId
ORDER BY ai.createdAt DESC;
```

## 📝 Estructura del Proyecto

```
proyecto-final2/
├── server/
│   ├── config/
│   │   └── database.ts          # ✅ Configuración MySQL
│   ├── controllers/
│   │   └── archiveController.ts # ✅ Lógica CRUD
│   ├── routes/
│   │   └── archiveRoutes.ts     # ✅ Endpoints API
│   ├── database_setup.sql       # ✅ Script SQL
│   └── server.ts                # ✅ Servidor principal
│
├── src/
│   ├── components/
│   │   ├── specific/            # ✅ Componentes migrados
│   │   ├── layout/
│   │   └── common/
│   ├── context/                 # ✅ Contextos migrados
│   ├── hooks/                   # ✅ Hooks actualizados
│   ├── services/
│   │   └── archiveApi.ts        # ✅ Cliente API REST
│   ├── screens/
│   │   └── MainScreen.tsx       # ✅ Actualizado con API
│   └── types/
│       └── archive.types.ts     # ✅ Tipos compartidos
```

## ⚠️ Consideraciones Importantes

1. **Tamaño de archivos:** El límite está en 50MB (configurado en server.ts)
2. **Base64 Storage:** Los archivos se guardan como base64 en la BD (para archivos grandes considerar almacenamiento en disco)
3. **CORS:** Configurado para localhost:3000 y localhost:5173
4. **Transacciones:** Las operaciones de creación usan transacciones SQL para garantizar integridad
5. **Cascading Deletes:** Al eliminar un ArchiveItem, se eliminan automáticamente sus ArchiveFiles

## 🐛 Solución de Problemas

### Error: "Cannot connect to MySQL"
- Verificar que MySQL esté corriendo: `sudo service mysql status`
- Verificar credenciales en `server/config/database.ts`

### Error: "CORS policy blocked"
- Verificar que el backend esté en puerto 5000
- Verificar corsOptions en `server/server.ts`

### Error: "Cannot find module"
- Ejecutar `npm install` en ambos directorios (server y raíz)

### Los archivos no persisten
- Verificar que el backend esté corriendo
- Abrir Network tab en DevTools y verificar llamadas a `/api/archive-items`
- Verificar que la base de datos exista: `mysql -u root -p -e "SHOW DATABASES;"`

## 📊 Diagrama de Flujo

```
Frontend (React)
    ↓ HTTP POST /api/archive-items
Backend (Express + TypeScript)
    ↓ INSERT INTO ArchiveItem
    ↓ INSERT INTO ArchiveFile (si hay fileUrl)
MySQL Database
    ↓ COMMIT Transaction
Backend
    ↓ Response { success, id }
Frontend
    ↓ Actualiza UI
```

## ✨ Características Implementadas

- ✅ Persistencia en MySQL (no localStorage)
- ✅ Lazy loading de fileUrl
- ✅ Transacciones SQL
- ✅ API RESTful completa
- ✅ Manejo de errores
- ✅ Validación de archivos
- ✅ Relaciones de base de datos (Foreign Keys)
- ✅ Índices para mejor performance
- ✅ CORS configurado
- ✅ Tipos TypeScript compartidos

## 📚 Documentación Adicional

- **API Endpoints:** Ver `/server/routes/archiveRoutes.ts`
- **Database Schema:** Ver `/server/database_setup.sql`
- **Frontend API Client:** Ver `/src/services/archiveApi.ts`

---

**Fecha de Migración:** 11 de Noviembre, 2025
**Estado:** ✅ Completo y funcional
