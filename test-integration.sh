#!/bin/bash

# Script para testear la integración completa Frontend-Backend
# Verifica que todas las operaciones CRUD funcionan correctamente

set -e

BASE_URL="http://localhost:8000/api"
TIMEOUT=5

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Contadores
PASSED=0
FAILED=0

# Función para hacer requests y capturar respuesta
test_api() {
    local METHOD=$1
    local ENDPOINT=$2
    local EXPECTED_CODE=$3
    local DATA=$4
    local DESCRIPTION=$5

    echo -n "  Testing: $DESCRIPTION... "

    if [ -z "$DATA" ]; then
        RESPONSE=$(curl -s -w "\n%{http_code}" -X "$METHOD" "$BASE_URL$ENDPOINT" \
            -H "Content-Type: application/json" \
            --max-time $TIMEOUT 2>/dev/null || echo "000")
    else
        RESPONSE=$(curl -s -w "\n%{http_code}" -X "$METHOD" "$BASE_URL$ENDPOINT" \
            -H "Content-Type: application/json" \
            -d "$DATA" \
            --max-time $TIMEOUT 2>/dev/null || echo "000")
    fi

    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | head -n-1)

    if [ "$HTTP_CODE" = "$EXPECTED_CODE" ]; then
        echo -e "${GREEN}✓${NC} (HTTP $HTTP_CODE)"
        PASSED=$((PASSED + 1))
        # Retornar el body para extraer IDs
        echo "$BODY"
    else
        echo -e "${RED}✗${NC} (HTTP $HTTP_CODE, esperado $EXPECTED_CODE)"
        echo "    Respuesta: $BODY"
        FAILED=$((FAILED + 1))
    fi
}

clear

echo "=========================================="
echo "   PRUEBAS DE INTEGRACIÓN E2E"
echo "=========================================="
echo ""

# Verificar que el backend está corriendo
echo "Verificando conectividad al backend..."
if ! curl -s --max-time 2 "$BASE_URL/../" > /dev/null 2>&1; then
    echo -e "${RED}✗ Backend no responde en $BASE_URL${NC}"
    echo "Inicia el backend con: cd backend && uvicorn app.main:app --reload"
    exit 1
fi
echo -e "${GREEN}✓ Backend respondiendo${NC}"
echo ""

# ========== PRUEBAS DE CATEGORÍAS ==========
echo -e "${BLUE}▶ PRUEBAS DE CATEGORÍAS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# GET categorías (debería retornar 200)
RESPONSE=$(test_api "GET" "/categorias" "200" "" "Listar categorías")
CATEG_LIST="$RESPONSE"

# POST nueva categoría
CATEG_DATA='{"nombre":"Bebidas","descripcion":"Bebidas frías y calientes"}'
RESPONSE=$(test_api "POST" "/categorias" "201" "$CATEG_DATA" "Crear categoría")
CATEG_ID=$(echo "$RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
echo "    ID de categoría creada: $CATEG_ID"

# GET categoría por ID
test_api "GET" "/categorias/$CATEG_ID" "200" "" "Obtener categoría por ID" > /dev/null

# PUT actualizar categoría
UPDATE_DATA='{"nombre":"Bebidas Premium","descripcion":"Bebidas importadas"}'
test_api "PUT" "/categorias/$CATEG_ID" "200" "$UPDATE_DATA" "Actualizar categoría" > /dev/null

echo ""

# ========== PRUEBAS DE INGREDIENTES ==========
echo -e "${BLUE}▶ PRUEBAS DE INGREDIENTES${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# GET ingredientes
test_api "GET" "/ingredientes" "200" "" "Listar ingredientes" > /dev/null

# POST nuevo ingrediente
ING_DATA='{"nombre":"Leche","unidad_medida":"ml","stock_actual":5000,"stock_minimo":1000}'
RESPONSE=$(test_api "POST" "/ingredientes" "201" "$ING_DATA" "Crear ingrediente")
ING_ID=$(echo "$RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
echo "    ID de ingrediente creado: $ING_ID"

# GET ingrediente por ID
test_api "GET" "/ingredientes/$ING_ID" "200" "" "Obtener ingrediente por ID" > /dev/null

# PUT actualizar ingrediente
UPDATE_ING='{"nombre":"Leche Entera","unidad_medida":"ml","stock_actual":6000,"stock_minimo":1500}'
test_api "PUT" "/ingredientes/$ING_ID" "200" "$UPDATE_ING" "Actualizar ingrediente" > /dev/null

echo ""

# ========== PRUEBAS DE PRODUCTOS ==========
echo -e "${BLUE}▶ PRUEBAS DE PRODUCTOS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# GET productos
test_api "GET" "/productos" "200" "" "Listar productos" > /dev/null

# POST nuevo producto (requiere categoría e ingrediente)
PROD_DATA="{\"nombre\":\"Cappuccino\",\"descripcion\":\"Café con leche\",\"precio\":450.00,\"disponible\":true,\"categoria_ids\":[$CATEG_ID],\"ingredientes\":[{\"ingrediente_id\":$ING_ID,\"cantidad\":200}]}"
RESPONSE=$(test_api "POST" "/productos" "201" "$PROD_DATA" "Crear producto")
PROD_ID=$(echo "$RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
echo "    ID de producto creado: $PROD_ID"

# GET producto por ID
test_api "GET" "/productos/$PROD_ID" "200" "" "Obtener producto por ID" > /dev/null

# GET productos filtrados por categoría
test_api "GET" "/productos?categoria_id=$CATEG_ID" "200" "" "Filtrar productos por categoría" > /dev/null

# PUT actualizar producto
UPDATE_PROD="{\"nombre\":\"Cappuccino Grande\",\"descripcion\":\"Café con leche - tamaño grande\",\"precio\":550.00,\"disponible\":true,\"categoria_ids\":[$CATEG_ID],\"ingredientes\":[{\"ingrediente_id\":$ING_ID,\"cantidad\":300}]}"
test_api "PUT" "/productos/$PROD_ID" "200" "$UPDATE_PROD" "Actualizar producto" > /dev/null

echo ""

# ========== PRUEBAS DE ELIMINACIÓN ==========
echo -e "${BLUE}▶ PRUEBAS DE ELIMINACIÓN (DELETE)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# DELETE producto
test_api "DELETE" "/productos/$PROD_ID" "204" "" "Eliminar producto" > /dev/null

# DELETE ingrediente
test_api "DELETE" "/ingredientes/$ING_ID" "204" "" "Eliminar ingrediente" > /dev/null

# DELETE categoría
test_api "DELETE" "/categorias/$CATEG_ID" "204" "" "Eliminar categoría" > /dev/null

echo ""

# ========== RESUMEN ==========
echo "=========================================="
echo -e "  ${GREEN}PRUEBAS EXITOSAS: $PASSED${NC}"
echo -e "  ${RED}PRUEBAS FALLIDAS: $FAILED${NC}"
echo "=========================================="
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ Todas las pruebas pasaron!${NC}"
    echo ""
    echo "El sistema está listo para usar:"
    echo "  - Backend: http://localhost:8000"
    echo "  - Frontend: http://localhost:5173"
    echo "  - Docs API: http://localhost:8000/docs"
    exit 0
else
    echo -e "${RED}❌ Algunas pruebas fallaron${NC}"
    echo ""
    echo "Verificar:"
    echo "  1. Backend está corriendo en http://localhost:8000"
    echo "  2. PostgreSQL está disponible"
    echo "  3. Variables de entorno en backend/.env son correctas"
    exit 1
fi
