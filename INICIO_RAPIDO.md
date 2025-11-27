# 🚀 Inicio Rápido - Proyecto Final 2

## ⚡ Pasos Rápidos para Iniciar

### 1️⃣ Configurar MySQL (Solo Primera Vez)

```bash
# Iniciar MySQL
sudo service mysql start

# Crear base de datos
mysql -u root -p < server/database_setup.sql
```

**Editar credenciales:** `server/config/database.ts`
```typescript
password: '', // ⚠️ Colocar tu password de MySQL
```

### 2️⃣ Instalar Dependencias (Solo Primera Vez)

```bash
# Backend
cd server
npm install

# Frontend
cd ..
npm install
```

### 3️⃣ Iniciar Aplicación

**Terminal 1 - Backend:**
```bash
cd server
npx ts-node server.ts
```
✅ Debe mostrar: "Archive API server is running on port 5000"

**Terminal 2 - Frontend:**
```bash
npm run dev
```
✅ Debe abrir en: http://localhost:5173

### 4️⃣ Usar la Aplicación

1. **Registrarse:** http://localhost:5173/register
2. **Login:** http://localhost:5173/login
3. **Subir archivos:** Click en "Agregar Archivo"
4. **Ver archivos:** Aparecen como tarjetas
5. **Editar/Eliminar:** Click en "⋮" en cada tarjeta

## 🔍 Verificación Rápida

### Backend funcionando:
```bash
curl http://localhost:5000/api/health
```

### Ver datos en MySQL:
```sql
mysql -u root -p
USE proyecto_final_db;
SELECT * FROM ArchiveItem;
```

## ⚠️ Si algo no funciona

### Error: "Cannot connect to database"
```bash
sudo service mysql status
sudo service mysql start
mysql -u root -p < server/database_setup.sql
```

### Error: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
cd server
rm -rf node_modules package-lock.json
npm install
```

### Error en imports
```bash
# Limpiar cache de Vite
npm run dev -- --force
```

## 📁 Estructura de Archivos Clave

```
proyecto-final2/
├── server/
│   ├── config/database.ts          ← Configurar password aquí
│   ├── server.ts                   ← Iniciar con: npx ts-node server.ts
│   └── database_setup.sql          ← Ejecutar en MySQL
├── src/
│   ├── App.tsx                     ← Router y contextos
│   ├── main.tsx                    ← Entry point
│   ├── components/                 ← UI components
│   ├── screens/                    ← Páginas principales
│   ├── context/                    ← Auth, Theme, Language
│   ├── services/archiveApi.ts      ← API calls
│   └── hooks/useFileUpload.ts      ← Upload logic
└── package.json                     ← npm run dev
```

## ✅ Checklist Antes de Iniciar

- [ ] MySQL instalado y corriendo
- [ ] Password configurado en `server/config/database.ts`
- [ ] Base de datos creada (ejecutar `database_setup.sql`)
- [ ] Dependencias instaladas (backend y frontend)
- [ ] Puerto 5000 libre (backend)
- [ ] Puerto 5173 libre (frontend)

## 🎯 Características Principales

1. ✅ **Persistencia MySQL** - Los archivos se guardan en base de datos
2. ✅ **Sin localStorage** - Solo se usa para autenticación
3. ✅ **API REST** - Comunicación frontend-backend
4. ✅ **CRUD Completo** - Crear, Leer, Actualizar, Eliminar
5. ✅ **Multiidioma** - Español e Inglés
6. ✅ **Tema Claro/Oscuro**
7. ✅ **Rutas Protegidas** - Login requerido
8. ✅ **Validación de Archivos**

## 📚 Más Información

- **Documentación completa:** `MIGRACION_README.md`
- **Verificación:** `VERIFICACION_MIGRACION.md`
- **Script automático:** `./start.sh`

## 🆘 Soporte

Si encuentras problemas:
1. Revisa los logs del backend (Terminal 1)
2. Revisa la consola del navegador (F12)
3. Verifica que MySQL esté corriendo
4. Consulta `VERIFICACION_MIGRACION.md`

---

**¡Listo para usar!** 🎉
