# Frontend — Food Store

Interfaz web del sistema de gestión de productos, categorías e ingredientes. Desarrollada con React, TypeScript y TanStack Query para el manejo del estado del servidor.

## Tecnologías

- **React 18** con **TypeScript** — componentes funcionales tipados
- **Vite** — bundler y servidor de desarrollo
- **TanStack Query** — manejo de estado del servidor (fetching, caché, mutaciones)
- **React Router DOM** — navegación SPA con rutas dinámicas
- **Tailwind CSS 4** — estilos con clases de utilidad

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

La app queda disponible en http://localhost:5173

## Estructura

```
src/
├── api/
│   └── client.ts          # instancia de axios con la base URL del backend
├── hooks/
│   ├── useCategorias.ts   # useQuery + useMutation para categorías
│   ├── useIngredientes.ts # useQuery + useMutation para ingredientes
│   └── useProductos.ts    # useQuery + useMutation para productos
├── pages/
│   ├── CategoriasPage.tsx
│   ├── IngredientesPage.tsx
│   ├── ProductosPage.tsx
│   └── ProductoDetallePage.tsx
├── components/
│   ├── layout/Header.tsx
│   ├── categorias/        # CategoriaModal, CategoriaForm
│   ├── ingredientes/      # IngredienteModal, IngredienteForm
│   └── productos/         # ProductoModal, ProductoForm
├── types/                 # interfaces TypeScript por módulo
└── App.tsx                # configuración de rutas
```

## Cómo funciona

Cada módulo (Categorías, Ingredientes, Productos) tiene:
- Una **página** con tabla, botones de editar/eliminar y botón de crear
- Un **modal** que abre el formulario de alta o edición
- Un **hook** que encapsula toda la comunicación con la API

El hook usa `useQuery` para traer los datos y `useMutation` para crear, editar o eliminar. Después de cada mutación se llama `invalidateQueries` para que la tabla se refresque automáticamente sin recargar la página.

La navegación usa `NavLink` para resaltar la sección activa en el header, y `useParams` en el detalle de producto para leer el ID de la URL (`/productos/:id`).
