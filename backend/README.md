# Backend — Food Store

API REST para gestión de productos, categorías e ingredientes. Construida con FastAPI, SQLModel y PostgreSQL.

## Tecnologías

- **FastAPI** — framework web para Python
- **SQLModel** — ORM con tipado (combina Pydantic + SQLAlchemy)
- **PostgreSQL** — base de datos relacional
- **Uvicorn** — servidor ASGI para desarrollo

## Cómo correr el proyecto

```bash
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

La API queda disponible en http://localhost:8000  
Documentación interactiva en http://localhost:8000/docs

Antes de correr, crear el archivo `.env` en la carpeta `backend/` con la conexión a PostgreSQL:

```env
DATABASE_URL=postgresql://postgres:tu_password@localhost:5432/parcial_prog4
```

Las tablas se crean automáticamente al iniciar la app.

## Estructura

```
app/
├── main.py          # app FastAPI, registro de routers
├── database.py      # conexión a PostgreSQL
├── uow.py           # Unit of Work (controla la sesión y el commit)
├── models/          # tablas con SQLModel (Producto, Categoria, Ingrediente)
├── schemas/         # schemas Pydantic para entrada y salida (Create, Read, Update)
├── repositories/    # acceso a la base de datos
├── services/        # lógica de negocio
└── routers/         # endpoints HTTP
```

## Arquitectura

El proyecto sigue el patrón **Router → Service → Repository → UnitOfWork**:

- **Router**: recibe el request, valida parámetros con `Annotated` + `Query` / `Path`, y delega al service
- **Service**: orquesta la lógica de negocio, valida reglas (duplicados, existencia de relaciones), lanza `HTTPException` si algo falla
- **Repository**: ejecuta las queries contra la base de datos
- **UnitOfWork**: controla la sesión de SQLModel — hace `commit` si todo salió bien o `rollback` si algo falló

## Endpoints

### Categorías
- `GET /api/categorias` — listar con paginación (`skip`, `limit`)
- `GET /api/categorias/{id}` — obtener por ID
- `POST /api/categorias` — crear
- `PUT /api/categorias/{id}` — editar
- `DELETE /api/categorias/{id}` — eliminar

### Ingredientes
- `GET /api/ingredientes` — listar
- `GET /api/ingredientes/{id}` — obtener por ID
- `POST /api/ingredientes` — crear
- `PUT /api/ingredientes/{id}` — editar
- `DELETE /api/ingredientes/{id}` — eliminar

### Productos
- `GET /api/productos` — listar (filtro opcional por `categoria_id`)
- `GET /api/productos/{id}` — obtener por ID con categorías e ingredientes
- `POST /api/productos` — crear con categorías e ingredientes
- `PUT /api/productos/{id}` — editar
- `DELETE /api/productos/{id}` — eliminar

## Modelo de datos

- **Producto ↔ Categoría**: relación N:N via tabla `producto_categoria`
- **Producto ↔ Ingrediente**: relación N:N via tabla `producto_ingrediente` (incluye campo `cantidad`)

Las relaciones están declaradas con `Relationship` y `back_populates` en los modelos SQLModel.
