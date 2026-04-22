# ✅ Guía de Verificación - Sistema Completo

Esta guía te ayudará a verificar que todo el sistema (Backend + Frontend + Database) está funcionando correctamente.

## 📋 Checklist Pre-Inicio

### Requisitos del Sistema
- [ ] Python 3.8+ instalado: `python --version`
- [ ] Node.js 18+ instalado: `node --version`
- [ ] PostgreSQL 12+ disponible: `psql --version`
- [ ] Git instalado: `git --version`
- [ ] 2+ GB RAM disponibles
- [ ] Conexión a internet (primera instalación)

### Requisitos de Directorio
- [ ] Estás en la carpeta raíz: `pwd` → debe mostrar `/parcial`
- [ ] Estructura completa:
  ```bash
  ls -d backend frontend docs .git
  ```

---

## 🔧 Paso 1: Configurar Base de Datos

### Opción A: PostgreSQL Local

```bash
# 1. Crear la base de datos
createdb -U postgres -h localhost -p 5434 parcial_prog4

# 2. Verificar conexión
psql -U postgres -h localhost -p 5434 -d parcial_prog4 -c "SELECT version();"

# ✓ Debería mostrar: PostgreSQL 12+
```

### Opción B: Docker (Más fácil)

```bash
# 1. Ejecutar PostgreSQL en Docker
docker run --name postgres-parcial \
  -e POSTGRES_PASSWORD=1234postgres \
  -e POSTGRES_DB=parcial_prog4 \
  -p 5434:5432 \
  -d postgres:15

# 2. Esperar 10 segundos para que inicie
sleep 10

# 3. Verificar
docker logs postgres-parcial

# ✓ Debería mostrar: "database system is ready to accept connections"
```

**Checklist**:
- [ ] Base de datos creada
- [ ] Conexión verificada

---

## 🔴 Paso 2: Configurar Backend

### 2.1 Crear Virtual Environment

```bash
cd backend

# Windows
python -m venv .venv
.venv\Scripts\activate

# Linux/Mac
python3 -m venv .venv
source .venv/bin/activate

# ✓ Prompt debería mostrar: (.venv)
```

### 2.2 Instalar Dependencias

```bash
pip install -r requirements.txt

# Esperar a que termine (~1-2 minutos)

# ✓ Debería terminar sin errores
```

### 2.3 Verificar Archivo .env

```bash
cat .env

# Debería contener:
# DATABASE_URL=postgresql://postgres:1234postgres@localhost:5434/parcial_prog4
```

**Si no existe o está vacío**:
```bash
cat > .env << 'EOF'
DATABASE_URL=postgresql://postgres:1234postgres@localhost:5434/parcial_prog4
EOF
```

### 2.4 Iniciar Backend

```bash
uvicorn app.main:app --reload

# ✓ Debería mostrar:
# INFO:     Uvicorn running on http://127.0.0.1:8000
# INFO:     Application startup complete
```

**Dejar esta terminal corriendo**. Abrir una nueva terminal para el siguiente paso.

**Checklist**:
- [ ] Virtual environment creado y activado
- [ ] Dependencias instaladas
- [ ] .env configurado correctamente
- [ ] Backend corriendo en puerto 8000
- [ ] Tablas de BD creadas automáticamente

---

## 🟦 Paso 3: Configurar Frontend

### 3.1 Instalar Dependencias

```bash
cd frontend

# Instalar pnpm si no lo tienes
npm install -g pnpm

# Instalar dependencias del frontend
pnpm install

# ✓ Debería terminar sin errores (~30-60 segundos)
```

### 3.2 Verificar Build

```bash
pnpm run build

# ✓ Debería mostrar:
# ✓ built in XXms
# dist/index.html (tamaño)
# dist/assets/index-xxx.css
# dist/assets/index-xxx.js
```

### 3.3 Iniciar Frontend

```bash
pnpm run dev

# ✓ Debería mostrar:
# ➜  Local:   http://localhost:5173/
```

**Dejar esta terminal corriendo**. Frontend está listo en otra terminal si lo necesitas.

**Checklist**:
- [ ] pnpm instalado globalmente
- [ ] Dependencias del frontend instaladas
- [ ] Build exitoso
- [ ] Frontend corriendo en puerto 5173

---

## 🧪 Paso 4: Verificación de Conectividad

### 4.1 Verificar Backend

En una nueva terminal:

```bash
# Test 1: Endpoint raíz
curl http://localhost:8000/

# ✓ Debería retornar:
# {"message":"Parcial Prog4 API","version":"1.0.0","docs":"/docs"}

# Test 2: Documentación
# Abre en navegador: http://localhost:8000/docs
# ✓ Deberías ver interfaz Swagger con todos los endpoints

# Test 3: Health check
curl http://localhost:8000/api/categorias

# ✓ Debería retornar:
# {"data":[],"total":0}  (o una lista si hay datos)
```

### 4.2 Verificar Frontend

En navegador:

```
http://localhost:5173
```

**Checklist**:
- [ ] Backend responde en http://localhost:8000
- [ ] Swagger docs disponibles en http://localhost:8000/docs
- [ ] Frontend carga en http://localhost:5173
- [ ] No hay errores en consola (F12)
- [ ] Header con navegación visible

---

## ✨ Paso 5: Test CRUD Completo (Manual)

### 5.1 Crear una Categoría

1. Abre http://localhost:5173/categorias
2. Haz click en "+ Nueva Categoría"
3. Completa el formulario:
   - Nombre: `Bebidas`
   - Descripción: `Bebidas frías y calientes`
4. Haz click en "Crear Categoría"

**✓ Checklist**:
- [ ] Modal aparece
- [ ] Formulario valida (nombre debe tener 3+ caracteres)
- [ ] Se crea exitosamente
- [ ] Aparece en la tabla
- [ ] Se puede editar
- [ ] Se puede eliminar

### 5.2 Crear un Ingrediente

1. Navega a http://localhost:5173/ingredientes
2. Haz click en "+ Nuevo Ingrediente"
3. Completa:
   - Nombre: `Leche`
   - Unidad: `ml`
   - Stock Actual: `5000`
   - Stock Mínimo: `1000`
4. Click "Crear Ingrediente"

**✓ Checklist**:
- [ ] Ingrediente creado
- [ ] Stock se muestra correctamente
- [ ] Se puede editar
- [ ] Se puede eliminar

### 5.3 Crear un Producto

1. Navega a http://localhost:5173/productos
2. Haz click en "+ Nuevo Producto"
3. Completa:
   - Nombre: `Cappuccino`
   - Descripción: `Café con leche`
   - Precio: `450`
   - Categoría: Selecciona "Bebidas" (debe existir)
   - Ingrediente: Selecciona "Leche" y cantidad `200`
4. Click "Crear Producto"

**✓ Checklist**:
- [ ] Producto creado
- [ ] Aparece en grid
- [ ] Se puede filtrar por categoría
- [ ] Click en "Ver detalle" muestra página completa
- [ ] Se puede editar
- [ ] Se puede eliminar

---

## 🔄 Paso 6: Test Automatizado (E2E)

```bash
cd /ruta/del/proyecto

chmod +x test-integration.sh
./test-integration.sh

# ✓ Debería mostrar:
# ✓ Testing: Listar categorías... ✓
# ✓ Testing: Crear categoría... ✓
# ... (más tests) ...
# ✅ Todas las pruebas pasaron!
```

**Checklist**:
- [ ] Todos los tests pasan (0 fallos)
- [ ] CRUD de categorías funciona
- [ ] CRUD de ingredientes funciona
- [ ] CRUD de productos funciona
- [ ] Relaciones N:N funcionan

---

## 🔍 Paso 7: Verificación de Bases de Datos

### 7.1 Verificar Tablas Creadas

```bash
# Conectar a la BD
psql -U postgres -h localhost -p 5434 -d parcial_prog4

# En la consola de PostgreSQL:
\dt

# ✓ Debería mostrar tablas:
# categoria
# ingrediente
# producto
# producto_categoria
# producto_ingrediente

# Ver esquema de una tabla
\d categoria

# Salir
\q
```

### 7.2 Insertar Datos de Prueba (Opcional)

```bash
python seed.py
```

**Checklist**:
- [ ] Tablas creadas correctamente
- [ ] Esquema coincide con especificación
- [ ] Relaciones N:N presentes
- [ ] Índices creados en campos críticos

---

## 🚨 Resolución de Problemas Comunes

### ❌ "Connection refused" al conectar a Backend

**Causa**: Backend no está corriendo
**Solución**:
```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload
```

### ❌ "CORS error" en Frontend

**Causa**: Backend no tiene CORS habilitado
**Verificar**: `backend/app/main.py` línea 16-22
```python
allow_origins=["http://localhost:5173"]
```

### ❌ "Database connection failed"

**Causa**: PostgreSQL no disponible
**Solución**:
```bash
# Si usas Docker:
docker start postgres-parcial

# Si usas instalación local:
# En Windows: iniciar servicio PostgreSQL
# En Linux: sudo service postgresql start
```

### ❌ "Module not found" en Frontend

**Solución**:
```bash
cd frontend
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### ❌ TypeScript errors en build

**Solución**:
```bash
cd frontend
pnpm run build  # Ver errores exactos
# Corregir según los errores reportados
```

---

## 📊 Matrix de Verificación Final

Marca cada casilla cuando esté verificado:

### Backend
- [ ] Python 3.8+ instalado
- [ ] Virtual environment creado
- [ ] Dependencias instaladas
- [ ] .env configurado
- [ ] `uvicorn` corriendo en puerto 8000
- [ ] GET `/` responde con JSON
- [ ] GET `/docs` muestra Swagger UI
- [ ] GET `/api/categorias` responde

### Database
- [ ] PostgreSQL disponible
- [ ] Base de datos `parcial_prog4` creada
- [ ] Conexión verificada desde CLI
- [ ] Tablas creadas automáticamente
- [ ] Índices en lugar correcto

### Frontend
- [ ] Node.js 18+ instalado
- [ ] pnpm instalado
- [ ] Dependencias instaladas
- [ ] Build exitoso (0 errores TS)
- [ ] Frontend corriendo en puerto 5173
- [ ] Página carga sin CORS errors
- [ ] Header con navegación visible

### CRUD Operations
- [ ] ✓ Categorías (Create, Read, Update, Delete)
- [ ] ✓ Ingredientes (Create, Read, Update, Delete)
- [ ] ✓ Productos (Create, Read, Update, Delete)
- [ ] ✓ Relaciones N:N funcionan
- [ ] ✓ Filtros funcionan
- [ ] ✓ Validaciones funcionan

### API Integration
- [ ] Frontend puede crear datos
- [ ] Frontend puede listar datos
- [ ] Frontend puede actualizar datos
- [ ] Frontend puede eliminar datos
- [ ] Caché de TanStack Query funciona
- [ ] Errores se muestran correctamente

---

## 🎯 Verificación Exitosa = Proyecto LISTO

Si todos los checks están ✅, tu sistema está completamente funcional.

**Próximos pasos**:
1. Explorar los datos en http://localhost:5173
2. Leer la documentación: [INTEGRATION_AND_DEPLOYMENT.md](INTEGRATION_AND_DEPLOYMENT.md)
3. Preparar para deployment si lo necesitas
4. Reportar bugs encontrados

---

## 📞 Si algo falla

1. Revisa la sección [Resolución de Problemas](#-resolución-de-problemas-comunes)
2. Lee los logs en la terminal donde corre el backend
3. Abre DevTools en el navegador (F12) para ver errores frontend
4. Verifica que los puertos 8000, 5173, 5434 están disponibles

---

**Fecha**: 21 de Abril de 2026  
**Sistema**: Completamente Funcional ✅
