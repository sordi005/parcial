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

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate       # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

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
