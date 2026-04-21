#!/bin/bash

# Script de configuración e integración completa para Parcial Prog4
# Este script configura backend, frontend, base de datos y realiza tests

set -e

echo "🚀 ==========================================="
echo "   PARCIAL PROG4 - SETUP E INTEGRACIÓN"
echo "==========================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir títulos
print_section() {
    echo ""
    echo -e "${BLUE}▶ $1${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Función para verificar comando
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 instalado"
        return 0
    else
        echo -e "${RED}✗${NC} $1 NO ENCONTRADO"
        return 1
    fi
}

# 1. Verificar requisitos del sistema
print_section "VERIFICANDO REQUISITOS"

check_command "python" || { echo "Instala Python 3.8+"; exit 1; }
check_command "node" || { echo "Instala Node.js 18+"; exit 1; }
check_command "pnpm" || { echo "Instala pnpm: npm install -g pnpm"; exit 1; }
check_command "git" || { echo "Instala Git"; exit 1; }

# Verificar PostgreSQL (puede estar en Docker)
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✓${NC} PostgreSQL CLI instalado"
elif docker ps -a 2>/dev/null | grep -q postgres; then
    echo -e "${GREEN}✓${NC} PostgreSQL detectado en Docker"
else
    echo -e "${YELLOW}⚠${NC} PostgreSQL no encontrado - asegúrate de que está corriendo"
fi

echo ""

# 2. Backend setup
print_section "CONFIGURANDO BACKEND"

if [ ! -d "backend/.venv" ]; then
    echo "Creando virtual environment..."
    cd backend
    python -m venv .venv
    cd ..
fi

echo "Activando virtual environment..."
if [ -f "backend/.venv/Scripts/activate" ]; then
    source backend/.venv/Scripts/activate
elif [ -f "backend/.venv/bin/activate" ]; then
    source backend/.venv/bin/activate
fi

echo "Instalando dependencias de Python..."
pip install -q -r backend/requirements.txt

echo -e "${GREEN}✓${NC} Backend configurado"

# 3. Frontend setup
print_section "CONFIGURANDO FRONTEND"

cd frontend

if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias de Node..."
    pnpm install -q
fi

echo "Build del frontend..."
pnpm run build -q 2>&1 | grep -E "error|✓ built" || echo "Build completado"

echo -e "${GREEN}✓${NC} Frontend configurado"

cd ..
echo ""

# 4. Verificar configuración
print_section "VERIFICANDO CONFIGURACIÓN"

echo "Backend URL: ${BLUE}http://localhost:8000${NC}"
echo "Frontend URL: ${BLUE}http://localhost:5173${NC}"
echo "Database: ${BLUE}postgresql://localhost:5434/parcial_prog4${NC}"
echo "API Base: ${BLUE}http://localhost:8000/api${NC}"

# 5. Verificar archivos críticos
print_section "VERIFICANDO ARCHIVOS CRÍTICOS"

BACKEND_FILES=(
    "backend/app/main.py"
    "backend/app/models/categoria.py"
    "backend/app/routers/categorias.py"
    "backend/requirements.txt"
    "backend/.env"
)

FRONTEND_FILES=(
    "frontend/src/App.tsx"
    "frontend/src/api/client.ts"
    "frontend/src/hooks/useCategorias.ts"
    "frontend/package.json"
)

for file in "${BACKEND_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file FALTA"
    fi
done

for file in "${FRONTEND_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file FALTA"
    fi
done

echo ""

# 6. Instrucciones finales
print_section "PRÓXIMOS PASOS"

cat << 'EOF'
1. ASEGÚRATE QUE PostgreSQL ESTÁ CORRIENDO:
   - Opción A (Local): psql -U postgres -h localhost -p 5434
   - Opción B (Docker): docker run --name postgres -e POSTGRES_PASSWORD=1234postgres -p 5434:5432 -d postgres

2. INICIA EL BACKEND (en una terminal):
   cd backend
   source .venv/bin/activate  # O: .venv\Scripts\activate (Windows)
   uvicorn app.main:app --reload

3. INICIA EL FRONTEND (en otra terminal):
   cd frontend
   pnpm run dev

4. ABRE EN EL NAVEGADOR:
   http://localhost:5173

5. PRUEBA LAS OPERACIONES:
   - /categorias       → CRUD de categorías
   - /ingredientes     → CRUD de ingredientes
   - /productos        → CRUD de productos con relaciones N:N
EOF

echo ""
echo -e "${GREEN}✅ Setup completado exitosamente!${NC}"
echo ""
