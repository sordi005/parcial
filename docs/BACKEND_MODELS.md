# Backend - Modelado de Datos (SQLModel)

Este documento define la estructura de datos que se implementará en FastAPI + SQLModel para el backend.

---

## 📊 Diagrama de Relaciones

```
┌─────────────┐         ┌──────────────────────┐         ┌──────────────┐
│  Categoria  │◄────────┤ ProductoCategoria    ├────────►│   Producto   │
│             │  N:N    │ (tabla intermedia)   │  N:N    │              │
└─────────────┘         └──────────────────────┘         └──────────────┘
                                                                  │
                                                                  │ N:N
                                                                  │
                                                                  ▼
                        ┌──────────────────────┐         ┌──────────────┐
                        │ ProductoIngrediente  ├────────►│ Ingrediente  │
                        │ (tabla intermedia)   │         │              │
                        │ + cantidad           │         └──────────────┘
                        └──────────────────────┘
```

**Relaciones:**
- Producto ↔ Categoría: **N:N** (un producto puede estar en múltiples categorías)
- Producto ↔ Ingrediente: **N:N** (un producto usa múltiples ingredientes, cada uno con su cantidad)

---

## 🗃️ Tabla: `categoria`

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Identificador único |
| `nombre` | VARCHAR(100) | NOT NULL, UNIQUE, INDEX | Nombre de la categoría |
| `descripcion` | VARCHAR(500) | NULL | Descripción opcional |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha de creación |

### Ejemplo de modelo SQLModel:

```python
class Categoria(SQLModel, table=True):
    __tablename__ = "categoria"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(min_length=3, max_length=100, unique=True, index=True)
    descripcion: Optional[str] = Field(default=None, max_length=500)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relación N:N con Producto
    productos: List["Producto"] = Relationship(
        back_populates="categorias",
        link_model=ProductoCategoria
    )
```

### Validaciones:
- `nombre`: 3-100 caracteres, único, no vacío
- `descripcion`: opcional, máximo 500 caracteres

---

## 🗃️ Tabla: `ingrediente`

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Identificador único |
| `nombre` | VARCHAR(100) | NOT NULL, UNIQUE, INDEX | Nombre del ingrediente |
| `unidad_medida` | VARCHAR(20) | NOT NULL | Unidad (ml, g, unidades) |
| `stock_actual` | FLOAT | NOT NULL, >= 0 | Stock disponible |
| `stock_minimo` | FLOAT | NOT NULL, >= 0 | Stock mínimo permitido |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha de creación |

### Ejemplo de modelo SQLModel:

```python
class Ingrediente(SQLModel, table=True):
    __tablename__ = "ingrediente"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(min_length=3, max_length=100, unique=True, index=True)
    unidad_medida: str = Field(max_length=20)
    stock_actual: float = Field(ge=0)
    stock_minimo: float = Field(ge=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relación N:N con Producto
    productos: List["Producto"] = Relationship(
        back_populates="ingredientes",
        link_model=ProductoIngrediente
    )
```

### Validaciones:
- `nombre`: 3-100 caracteres, único
- `unidad_medida`: string, máx 20 caracteres
- `stock_actual`: float >= 0
- `stock_minimo`: float >= 0

---

## 🗃️ Tabla: `producto`

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Identificador único |
| `nombre` | VARCHAR(150) | NOT NULL, UNIQUE, INDEX | Nombre del producto |
| `descripcion` | VARCHAR(1000) | NULL | Descripción del producto |
| `precio` | DECIMAL(10,2) | NOT NULL, > 0 | Precio del producto |
| `disponible` | BOOLEAN | NOT NULL, DEFAULT TRUE | Si está disponible |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha de creación |

### Ejemplo de modelo SQLModel:

```python
from decimal import Decimal

class Producto(SQLModel, table=True):
    __tablename__ = "producto"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(min_length=3, max_length=150, unique=True, index=True)
    descripcion: Optional[str] = Field(default=None, max_length=1000)
    precio: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    disponible: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relación N:N con Categoría
    categorias: List[Categoria] = Relationship(
        back_populates="productos",
        link_model=ProductoCategoria
    )
    
    # Relación N:N con Ingrediente
    ingredientes: List[Ingrediente] = Relationship(
        back_populates="productos",
        link_model=ProductoIngrediente
    )
```

### Validaciones:
- `nombre`: 3-150 caracteres, único
- `descripcion`: opcional, máximo 1000 caracteres
- `precio`: Decimal > 0
- `disponible`: boolean, default True

---

## 🗃️ Tabla: `producto_categoria` (intermedia N:N)

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `producto_id` | INTEGER | FOREIGN KEY, PRIMARY KEY | Referencia a producto |
| `categoria_id` | INTEGER | FOREIGN KEY, PRIMARY KEY | Referencia a categoría |

### Ejemplo de modelo SQLModel:

```python
class ProductoCategoria(SQLModel, table=True):
    __tablename__ = "producto_categoria"
    
    producto_id: int = Field(foreign_key="producto.id", primary_key=True)
    categoria_id: int = Field(foreign_key="categoria.id", primary_key=True)
```

**Clave primaria compuesta:** (`producto_id`, `categoria_id`)

Esta tabla permite que:
- Un producto esté en múltiples categorías
- Una categoría contenga múltiples productos

---

## 🗃️ Tabla: `producto_ingrediente` (intermedia N:N + cantidad)

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `producto_id` | INTEGER | FOREIGN KEY, PRIMARY KEY | Referencia a producto |
| `ingrediente_id` | INTEGER | FOREIGN KEY, PRIMARY KEY | Referencia a ingrediente |
| `cantidad` | FLOAT | NOT NULL, > 0 | Cantidad del ingrediente |

### Ejemplo de modelo SQLModel:

```python
class ProductoIngrediente(SQLModel, table=True):
    __tablename__ = "producto_ingrediente"
    
    producto_id: int = Field(foreign_key="producto.id", primary_key=True)
    ingrediente_id: int = Field(foreign_key="ingrediente.id", primary_key=True)
    cantidad: float = Field(gt=0, description="Cantidad del ingrediente")
```

**Clave primaria compuesta:** (`producto_id`, `ingrediente_id`)

**Campo extra:** `cantidad` → almacena cuánto de cada ingrediente lleva el producto.

---

## 📝 Schemas (Request/Response)

Los schemas separan lo que entra (request) de lo que sale (response) para mayor seguridad.

### Categoría Schemas

```python
# Base (campos compartidos)
class CategoriaBase(SQLModel):
    nombre: str = Field(min_length=3, max_length=100)
    descripcion: Optional[str] = Field(default=None, max_length=500)

# Request (crear)
class CategoriaCreate(CategoriaBase):
    pass

# Request (actualizar)
class CategoriaUpdate(CategoriaBase):
    pass

# Response (leer)
class CategoriaRead(CategoriaBase):
    id: int
    created_at: datetime
```

### Ingrediente Schemas

```python
class IngredienteBase(SQLModel):
    nombre: str = Field(min_length=3, max_length=100)
    unidad_medida: str = Field(max_length=20)
    stock_actual: float = Field(ge=0)
    stock_minimo: float = Field(ge=0)

class IngredienteCreate(IngredienteBase):
    pass

class IngredienteUpdate(IngredienteBase):
    pass

class IngredienteRead(IngredienteBase):
    id: int
    created_at: datetime
```

### Producto Schemas

```python
# Schema para asignar ingredientes (input)
class ProductoIngredienteInput(SQLModel):
    ingrediente_id: int
    cantidad: float = Field(gt=0)

# Schema para leer ingredientes de un producto (output)
class ProductoIngredienteRead(SQLModel):
    ingrediente_id: int
    nombre: str
    cantidad: float
    unidad_medida: str

# Base
class ProductoBase(SQLModel):
    nombre: str = Field(min_length=3, max_length=150)
    descripcion: Optional[str] = Field(default=None, max_length=1000)
    precio: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    disponible: bool = Field(default=True)

# Request (crear)
class ProductoCreate(ProductoBase):
    categoria_ids: List[int] = Field(min_length=1)
    ingredientes: List[ProductoIngredienteInput] = Field(min_length=1)

# Request (actualizar)
class ProductoUpdate(ProductoBase):
    categoria_ids: List[int] = Field(min_length=1)
    ingredientes: List[ProductoIngredienteInput] = Field(min_length=1)

# Response (leer con relaciones completas)
class ProductoRead(ProductoBase):
    id: int
    created_at: datetime
    categorias: List[CategoriaRead]
    ingredientes: List[ProductoIngredienteRead]
```

---

## 🔐 Uso de `response_model` (Seguridad de Datos)

Los endpoints SIEMPRE deben usar `response_model` para controlar qué datos se exponen:

```python
# ✅ CORRECTO - No filtra datos sensibles
@router.get("/categorias/{id}", response_model=CategoriaRead)
def get_categoria(id: int):
    return categoria

# ❌ INCORRECTO - Puede exponer datos internos
@router.get("/categorias/{id}")
def get_categoria(id: int):
    return categoria
```

**Beneficios:**
- Filtra campos internos que no deben exponerse
- Valida que la respuesta cumple con el schema
- Documenta automáticamente en Swagger/OpenAPI

---

## 🛠️ Validaciones con `Annotated`, `Query` y `Path`

### En endpoints (routers):

```python
from typing import Annotated
from fastapi import Query, Path

# Paginación con validación
@router.get("/categorias")
def get_categorias(
    skip: Annotated[int, Query(ge=0)] = 0,  # >= 0
    limit: Annotated[int, Query(ge=1, le=100)] = 100  # entre 1 y 100
):
    pass

# Path param con validación
@router.get("/categorias/{id}")
def get_categoria(
    id: Annotated[int, Path(gt=0)]  # > 0
):
    pass

# Filtro opcional
@router.get("/productos")
def get_productos(
    categoria_id: Annotated[Optional[int], Query(gt=0)] = None
):
    pass
```

**Reglas de validación:**
- `gt=X` → mayor que X
- `ge=X` → mayor o igual a X
- `lt=X` → menor que X
- `le=X` → menor o igual a X

---

## ⚠️ Manejo de Excepciones

```python
from fastapi import HTTPException, status

# 404 - No encontrado
if not categoria:
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Categoría no encontrada"
    )

# 409 - Conflicto (duplicado)
if existing:
    raise HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail="Categoría ya existe"
    )

# 409 - Conflicto (dependencias)
if categoria.productos:
    raise HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail="No se puede eliminar - categoría tiene productos asociados"
    )

# 400 - Validación fallida (Pydantic lo maneja automáticamente)
```

---

## 📁 Estructura de Directorios Recomendada

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                  # FastAPI app + CORS
│   ├── database.py              # Conexión PostgreSQL
│   │
│   ├── models/                  # Modelos SQLModel (tablas)
│   │   ├── __init__.py
│   │   ├── categoria.py
│   │   ├── ingrediente.py
│   │   └── producto.py
│   │
│   ├── schemas/                 # Schemas (request/response)
│   │   ├── __init__.py
│   │   ├── categoria.py
│   │   ├── ingrediente.py
│   │   └── producto.py
│   │
│   ├── routers/                 # Endpoints
│   │   ├── __init__.py
│   │   ├── categorias.py
│   │   ├── ingredientes.py
│   │   └── productos.py
│   │
│   ├── services/                # Lógica de negocio (opcional)
│   │   ├── __init__.py
│   │   ├── categoria_service.py
│   │   ├── ingrediente_service.py
│   │   └── producto_service.py
│   │
│   └── uow/                     # Unit of Work (opcional)
│       ├── __init__.py
│       └── unit_of_work.py
│
├── .env                         # Variables de entorno
├── requirements.txt             # Dependencias
└── README.md
```

---

## 🔌 Conexión a PostgreSQL

### `.env`
```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/parcial_prog4
```

### `database.py`
```python
from sqlmodel import create_engine, Session, SQLModel
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
```

### `main.py`
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_db_and_tables

app = FastAPI(title="Parcial Prog4 API")

# CORS para frontend (Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
```

---

## 📦 requirements.txt

```txt
fastapi==0.109.0
sqlmodel==0.0.14
uvicorn[standard]==0.27.0
psycopg2-binary==2.9.9
python-dotenv==1.0.0
pydantic[email]==2.5.3
```

---

## 💡 Ejemplo Completo: Endpoint de Productos

```python
from typing import Annotated, Optional, List
from fastapi import APIRouter, Query, Path, HTTPException, status, Depends
from sqlmodel import Session, select
from app.database import get_session
from app.schemas.producto import ProductoCreate, ProductoRead, ProductoUpdate
from app.models.producto import Producto, ProductoCategoria, ProductoIngrediente

router = APIRouter(prefix="/api/v1/productos", tags=["productos"])

# GET listado con filtro y paginación
@router.get("", response_model=List[ProductoRead])
def get_productos(
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 100,
    categoria_id: Annotated[Optional[int], Query(gt=0)] = None,
    session: Session = Depends(get_session)
):
    query = select(Producto)
    
    if categoria_id:
        query = query.join(ProductoCategoria).where(
            ProductoCategoria.categoria_id == categoria_id
        )
    
    productos = session.exec(query.offset(skip).limit(limit)).all()
    return productos


# GET por ID
@router.get("/{id}", response_model=ProductoRead)
def get_producto(
    id: Annotated[int, Path(gt=0)],
    session: Session = Depends(get_session)
):
    producto = session.get(Producto, id)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    return producto


# POST crear
@router.post("", response_model=ProductoRead, status_code=status.HTTP_201_CREATED)
def create_producto(
    producto_data: ProductoCreate,
    session: Session = Depends(get_session)
):
    # 1. Validar que no exista
    existing = session.exec(
        select(Producto).where(Producto.nombre == producto_data.nombre)
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Producto ya existe"
        )
    
    # 2. Crear producto
    producto = Producto(
        nombre=producto_data.nombre,
        descripcion=producto_data.descripcion,
        precio=producto_data.precio,
        disponible=producto_data.disponible
    )
    session.add(producto)
    session.commit()
    session.refresh(producto)
    
    # 3. Asignar categorías
    for cat_id in producto_data.categoria_ids:
        relacion = ProductoCategoria(producto_id=producto.id, categoria_id=cat_id)
        session.add(relacion)
    
    # 4. Asignar ingredientes
    for ing in producto_data.ingredientes:
        relacion = ProductoIngrediente(
            producto_id=producto.id,
            ingrediente_id=ing.ingrediente_id,
            cantidad=ing.cantidad
        )
        session.add(relacion)
    
    session.commit()
    session.refresh(producto)
    return producto


# DELETE
@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_producto(
    id: Annotated[int, Path(gt=0)],
    session: Session = Depends(get_session)
):
    producto = session.get(Producto, id)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    
    session.delete(producto)  # Elimina en cascada las relaciones
    session.commit()
    return None
```

---

## ✅ Checklist de Implementación

- [ ] Modelos definidos con `SQLModel` y `table=True`
- [ ] Relaciones 1:N y N:N usando `Relationship` y `back_populates`
- [ ] Tablas intermedias (`ProductoCategoria`, `ProductoIngrediente`)
- [ ] Schemas separados (Create, Update, Read) para cada entidad
- [ ] Validaciones con `Field()` (min_length, max_length, gt, ge)
- [ ] Endpoints usan `Annotated`, `Query`, `Path`
- [ ] `response_model` en todos los endpoints
- [ ] Manejo de excepciones (`HTTPException` con códigos correctos)
- [ ] Conexión a PostgreSQL configurada
- [ ] CORS habilitado para frontend
