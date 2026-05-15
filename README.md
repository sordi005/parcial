# Parcial 1 — Programación IV

Aplicación fullstack desarrollada para el Primer Parcial de Programación IV (Tecnicatura Universitaria en Programación — UTN).

## Descripción

Sistema de gestión de productos de una carta/menú con soporte para categorías e ingredientes. Permite realizar el CRUD completo de productos, categorías e ingredientes, con relaciones N:N entre ellos y persistencia en PostgreSQL.

**Tecnologías:**
- **Backend:** FastAPI + SQLModel + PostgreSQL — arquitectura modular (routers / services / repositories / UoW)
- **Frontend:** React 18 + TypeScript + Vite + TanStack Query + React Router + Tailwind CSS 4

## Video de presentación

> 🔗 **[Agregar link al video aquí]**

## Cómo ejecutar

### 1. Base de datos (Docker)

Requiere tener [Docker](https://www.docker.com/) instalado.

```bash
docker compose up -d
```

Esto levanta un contenedor PostgreSQL con:
- **Host:** `localhost`
- **Puerto:** `5434`
- **Usuario:** `postgres`
- **Contraseña:** `1234postgres`
- **Base de datos:** `parcial_prog4`

Para detenerlo:

```bash
docker compose down
```

### 2. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate       # Windows
# source .venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
uvicorn app.main:app --reload
```

La API queda disponible en http://localhost:8000  
Documentación interactiva: http://localhost:8000/docs

#### (Opcional) Cargar datos de prueba

```bash
cd backend
python seed.py
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

La app queda disponible en http://localhost:5173

## Estructura del proyecto

```
parcial/
├── backend/
│   └── app/
│       ├── models/        # Modelos SQLModel
│       ├── schemas/       # Pydantic schemas (input/output)
│       ├── repositories/  # Acceso a base de datos
│       ├── services/      # Lógica de negocio
│       ├── routers/       # Endpoints FastAPI
│       └── uow.py         # Unit of Work
└── frontend/
    └── src/
        ├── api/           # Cliente axios
        ├── hooks/         # TanStack Query hooks
        ├── pages/         # Páginas por módulo
        ├── components/    # Componentes UI
        └── types/         # Interfaces TypeScript
```
