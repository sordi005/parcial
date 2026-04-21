# Backend - Parcial Prog4

API REST construida con **FastAPI** + **SQLModel** + **PostgreSQL**.

## 🚀 Tecnologías

- **FastAPI**: Framework web para Python
- **SQLModel**: ORM para PostgreSQL con tipado (basado en Pydantic + SQLAlchemy)
- **PostgreSQL**: Base de datos relacional
- **Uvicorn**: Servidor ASGI para desarrollo

## 🏗️ Arquitectura

El proyecto sigue una **arquitectura por capas** con clara separación de responsabilidades:

### Capas

1. **Routers** (`app/routers/`): 
   - Manejan HTTP (request/response)
   - Validan parámetros con `Annotated`, `Query`, `Path`
   - Delegan toda la lógica a los servicios
   - Retornan respuestas usando `response_model`

2. **Services** (`app/services/`):
   - Contienen la lógica de negocio
   - Validan reglas de dominio (duplicados, relaciones, etc.)
   - Acceden a la base de datos vía SQLModel
   - Lanzan `HTTPException` en caso de errores

3. **Schemas** (`app/schemas/`):
   - Definen contratos de entrada/salida (DTOs)
   - Validación con Pydantic `Field()`
   - Tipos: `Create`, `Read`, `Update` por entidad

4. **Models** (`app/models/`):
   - Representan tablas de la base de datos
   - Usan `SQLModel` con `Relationship()` para relaciones N:N
   - Contienen tablas intermedias (junction tables)

## 📁 Estructura del Proyecto

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # Aplicación FastAPI principal
│   ├── database.py          # Configuración de conexión a PostgreSQL
│   ├── models/              # Modelos SQLModel (tablas)
│   │   ├── categoria.py
│   │   ├── ingrediente.py
│   │   └── producto.py
│   ├── schemas/             # Schemas Pydantic (request/response)
│   │   ├── categoria.py
│   │   ├── ingrediente.py
│   │   └── producto.py
│   ├── services/            # Lógica de negocio
│   │   ├── categoria_service.py
│   │   ├── ingrediente_service.py
│   │   └── producto_service.py
│   └── routers/             # Endpoints HTTP (solo request/response)
│       ├── categorias.py
│       ├── ingredientes.py
│       └── productos.py
├── .env                     # Variables de entorno (NO subir a git)
├── .env.example             # Plantilla de variables de entorno
├── requirements.txt         # Dependencias Python
└── README.md
```

## ⚙️ Instalación

### 1. Crear entorno virtual

```powershell
python -m venv .venv
.venv\Scripts\activate
```

### 2. Instalar dependencias

```powershell
pip install -r requirements.txt
```

### 3. Configurar base de datos

Copiar `.env.example` a `.env` y configurar la URL de PostgreSQL:

```powershell
cp .env.example .env
```

Editar `.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/parcial_prog4
```

### 4. Crear base de datos en PostgreSQL

```sql
CREATE DATABASE parcial_prog4;
```

## 🏃 Ejecutar

```powershell
uvicorn app.main:app --reload
```

La API estará disponible en:
- **API**: http://localhost:8000
- **Documentación Swagger**: http://localhost:8000/docs
- **Documentación ReDoc**: http://localhost:8000/redoc

## 📡 Endpoints

### Categorías

- `GET /api/v1/categorias` - Listar todas las categorías
- `GET /api/v1/categorias/{id}` - Obtener una categoría
- `POST /api/v1/categorias` - Crear categoría
- `PUT /api/v1/categorias/{id}` - Actualizar categoría
- `DELETE /api/v1/categorias/{id}` - Eliminar categoría

### Ingredientes

- `GET /api/v1/ingredientes` - Listar todos los ingredientes
- `GET /api/v1/ingredientes/{id}` - Obtener un ingrediente
- `POST /api/v1/ingredientes` - Crear ingrediente
- `PUT /api/v1/ingredientes/{id}` - Actualizar ingrediente
- `DELETE /api/v1/ingredientes/{id}` - Eliminar ingrediente

### Productos

- `GET /api/v1/productos` - Listar todos los productos
- `GET /api/v1/productos/{id}` - Obtener un producto
- `POST /api/v1/productos` - Crear producto
- `PUT /api/v1/productos/{id}` - Actualizar producto
- `DELETE /api/v1/productos/{id}` - Eliminar producto

## 🗄️ Modelo de Datos

### Relaciones

- **Producto ↔ Categoría**: N:N (un producto puede tener múltiples categorías)
- **Producto ↔ Ingrediente**: N:N (un producto usa múltiples ingredientes con cantidad)

### Tablas Intermedias

- `producto_categoria`: Relación entre productos y categorías
- `producto_ingrediente`: Relación entre productos e ingredientes (incluye campo `cantidad`)

## ✅ Validaciones

- **Annotated** con **Query** y **Path** para validar parámetros
- **Pydantic Fields** para validación de modelos
- Códigos de estado HTTP apropiados (201, 204, 404, 409)
- **response_model** en todos los endpoints para seguridad

## 🔧 Desarrollo

### Arquitectura de servicios

Cada entidad tiene su propio servicio que encapsula:
- Consultas a la base de datos
- Validaciones de negocio
- Manejo de relaciones N:N
- Excepciones HTTP con códigos apropiados

Los routers son **delgados** - solo reciben requests, llaman al servicio, y devuelven responses.

### Ver logs SQL

El motor de SQLModel está configurado con `echo=True` para ver todas las queries SQL en consola.

### Recrear base de datos

Las tablas se crean automáticamente al iniciar la aplicación gracias al evento `on_startup` en `main.py`.

### Testear endpoints

Usa la documentación interactiva en http://localhost:8000/docs o herramientas como:
- **Postman**
- **Insomnia**
- **Thunder Client** (extensión de VS Code)
