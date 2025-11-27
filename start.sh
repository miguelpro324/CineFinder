#!/bin/bash

# Script de inicio rápido para proyecto-final2
# Este script ayuda a configurar y ejecutar el proyecto después de la migración

echo "================================================"
echo "   🚀 Proyecto Final 2 - Setup & Start Script"
echo "================================================"
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar prerrequisitos
echo -e "${BLUE}1. Verificando prerrequisitos...${NC}"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js instalado: $(node --version)${NC}"

if ! command_exists npm; then
    echo -e "${RED}❌ npm no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm instalado: $(npm --version)${NC}"

if ! command_exists mysql; then
    echo -e "${YELLOW}⚠ MySQL no encontrado. Asegúrate de tenerlo instalado.${NC}"
else
    echo -e "${GREEN}✓ MySQL instalado${NC}"
fi

echo ""

# Verificar si la base de datos existe
echo -e "${BLUE}2. Verificando base de datos...${NC}"
echo -e "${YELLOW}Por favor, asegúrate de que MySQL esté corriendo.${NC}"
echo -e "${YELLOW}Para crear la base de datos, ejecuta:${NC}"
echo -e "   ${GREEN}mysql -u root -p < server/database_setup.sql${NC}"
echo ""

# Instalar dependencias del backend
echo -e "${BLUE}3. Instalando dependencias del backend...${NC}"
cd server
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✓ Dependencias del backend instaladas${NC}"
else
    echo -e "${GREEN}✓ Dependencias del backend ya están instaladas${NC}"
fi
cd ..
echo ""

# Instalar dependencias del frontend
echo -e "${BLUE}4. Instalando dependencias del frontend...${NC}"
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✓ Dependencias del frontend instaladas${NC}"
else
    echo -e "${GREEN}✓ Dependencias del frontend ya están instaladas${NC}"
fi
echo ""

# Verificar configuración de la base de datos
echo -e "${BLUE}5. Verificando configuración...${NC}"
echo -e "${YELLOW}Asegúrate de configurar las credenciales de MySQL en:${NC}"
echo -e "   ${GREEN}server/config/database.ts${NC}"
echo ""

# Iniciar servicios
echo -e "${BLUE}6. ¿Deseas iniciar los servicios ahora? (s/n)${NC}"
read -r response

if [[ "$response" =~ ^([sS][iI]|[sS])$ ]]; then
    echo ""
    echo -e "${GREEN}================================================${NC}"
    echo -e "${GREEN}   Iniciando servicios...${NC}"
    echo -e "${GREEN}================================================${NC}"
    echo ""
    echo -e "${BLUE}Backend: http://localhost:5000${NC}"
    echo -e "${BLUE}Frontend: http://localhost:5173${NC}"
    echo ""
    echo -e "${YELLOW}Abre dos terminales:${NC}"
    echo -e "  Terminal 1: ${GREEN}cd server && npx ts-node server.ts${NC}"
    echo -e "  Terminal 2: ${GREEN}npm run dev${NC}"
    echo ""
fi

echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}   Setup completado!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "📚 Para más información, consulta: ${BLUE}MIGRACION_README.md${NC}"
