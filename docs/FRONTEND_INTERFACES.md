# Frontend - Interfaces TypeScript

Este documento define las interfaces TypeScript que se usarán en el frontend React para tipar todos los datos que vienen del backend.

---

## 📋 Interfaces Base

### Categoría

```typescript
// Interface para leer una categoría (response del backend)
export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  created_at: string; // ISO 8601 format
}

// Interface para crear una categoría (request body)
export interface CategoriaCreate {
  nombre: string;
  descripcion?: string;
}

// Interface para actualizar una categoría (request body)
export interface CategoriaUpdate {
  nombre: string;
  descripcion?: string;
}
```

**Uso en componentes:**
```typescript
const [categorias, setCategorias] = useState<Categoria[]>([]);

const handleSubmit = (data: CategoriaCreate) => {
  // Enviar al backend
};
```

---

### Ingrediente

```typescript
// Interface para leer un ingrediente (response)
export interface Ingrediente {
  id: number;
  nombre: string;
  unidad_medida: string; // "ml", "g", "unidades"
  stock_actual: number;
  stock_minimo: number;
  created_at: string;
}

// Interface para crear un ingrediente (request)
export interface IngredienteCreate {
  nombre: string;
  unidad_medida: string;
  stock_actual: number;
  stock_minimo: number;
}

// Interface para actualizar un ingrediente (request)
export interface IngredienteUpdate {
  nombre: string;
  unidad_medida: string;
  stock_actual: number;
  stock_minimo: number;
}
```

---

### Producto

```typescript
// Interface para un ingrediente dentro de un producto (response)
export interface ProductoIngrediente {
  ingrediente_id: number;
  nombre: string;
  cantidad: number;
  unidad_medida: string;
}

// Interface para leer un producto completo (response)
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number; // Decimal se recibe como number
  disponible: boolean;
  created_at: string;
  categorias: Categoria[]; // Array de categorías completas
  ingredientes: ProductoIngrediente[]; // Array de ingredientes con cantidad
}

// Interface para asignar ingredientes al crear/editar (request)
export interface ProductoIngredienteInput {
  ingrediente_id: number;
  cantidad: number;
}

// Interface para crear un producto (request)
export interface ProductoCreate {
  nombre: string;
  descripcion?: string;
  precio: number;
  disponible: boolean;
  categoria_ids: number[]; // Array de IDs de categorías
  ingredientes: ProductoIngredienteInput[]; // Array de ingredientes con cantidad
}

// Interface para actualizar un producto (request)
export interface ProductoUpdate {
  nombre: string;
  descripcion?: string;
  precio: number;
  disponible: boolean;
  categoria_ids: number[];
  ingredientes: ProductoIngredienteInput[];
}
```

---

## 🔌 API Client (Axios)

### `src/api/client.ts`

```typescript
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Formato de error del backend: { detail: "mensaje" }
    const message = error.response?.data?.detail || 'Error desconocido';
    return Promise.reject(new Error(message));
  }
);
```

---

## 🎯 TanStack Query - Hooks

### Categorías

#### `src/hooks/useCategorias.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { Categoria, CategoriaCreate, CategoriaUpdate } from '../types';

// GET listado
export const useCategorias = () => {
  return useQuery<Categoria[]>({
    queryKey: ['categorias'],
    queryFn: async () => {
      const { data } = await apiClient.get<Categoria[]>('/categorias');
      return data;
    },
  });
};

// GET por ID
export const useCategoria = (id: number) => {
  return useQuery<Categoria>({
    queryKey: ['categorias', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Categoria>(`/categorias/${id}`);
      return data;
    },
    enabled: !!id, // Solo ejecuta si hay ID
  });
};

// POST crear
export const useCreateCategoria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCategoria: CategoriaCreate) => {
      const { data } = await apiClient.post<Categoria>('/categorias', newCategoria);
      return data;
    },
    onSuccess: () => {
      // Invalida el cache para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });
};

// PUT actualizar
export const useUpdateCategoria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CategoriaUpdate }) => {
      const response = await apiClient.put<Categoria>(`/categorias/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalida lista + detalle
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      queryClient.invalidateQueries({ queryKey: ['categorias', variables.id] });
    },
  });
};

// DELETE eliminar
export const useDeleteCategoria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/categorias/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });
};
```

---

### Ingredientes

#### `src/hooks/useIngredientes.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { Ingrediente, IngredienteCreate, IngredienteUpdate } from '../types';

export const useIngredientes = () => {
  return useQuery<Ingrediente[]>({
    queryKey: ['ingredientes'],
    queryFn: async () => {
      const { data } = await apiClient.get<Ingrediente[]>('/ingredientes');
      return data;
    },
  });
};

export const useIngrediente = (id: number) => {
  return useQuery<Ingrediente>({
    queryKey: ['ingredientes', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Ingrediente>(`/ingredientes/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateIngrediente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newIngrediente: IngredienteCreate) => {
      const { data } = await apiClient.post<Ingrediente>('/ingredientes', newIngrediente);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] });
    },
  });
};

export const useUpdateIngrediente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: IngredienteUpdate }) => {
      const response = await apiClient.put<Ingrediente>(`/ingredientes/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] });
      queryClient.invalidateQueries({ queryKey: ['ingredientes', variables.id] });
    },
  });
};

export const useDeleteIngrediente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/ingredientes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] });
    },
  });
};
```

---

### Productos

#### `src/hooks/useProductos.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { Producto, ProductoCreate, ProductoUpdate } from '../types';

// GET con filtro opcional por categoría
export const useProductos = (categoriaId?: number) => {
  return useQuery<Producto[]>({
    queryKey: ['productos', categoriaId],
    queryFn: async () => {
      const params = categoriaId ? { categoria_id: categoriaId } : {};
      const { data } = await apiClient.get<Producto[]>('/productos', { params });
      return data;
    },
  });
};

export const useProducto = (id: number) => {
  return useQuery<Producto>({
    queryKey: ['productos', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Producto>(`/productos/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateProducto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProducto: ProductoCreate) => {
      const { data } = await apiClient.post<Producto>('/productos', newProducto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });
};

export const useUpdateProducto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ProductoUpdate }) => {
      const response = await apiClient.put<Producto>(`/productos/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      queryClient.invalidateQueries({ queryKey: ['productos', variables.id] });
    },
  });
};

export const useDeleteProducto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/productos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });
};
```

---

## 🎨 Ejemplo de Componente con TanStack Query

### `src/pages/Categorias.tsx`

```typescript
import { useState } from 'react';
import { useCategorias, useCreateCategoria, useDeleteCategoria } from '../hooks/useCategorias';
import type { CategoriaCreate } from '../types';

export const CategoriasPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // useQuery para el listado
  const { data: categorias, isLoading, error } = useCategorias();
  
  // useMutation para crear
  const createMutation = useCreateCategoria();
  
  // useMutation para eliminar
  const deleteMutation = useDeleteCategoria();

  const handleCreate = async (formData: CategoriaCreate) => {
    try {
      await createMutation.mutateAsync(formData);
      setIsModalOpen(false);
      // TanStack Query invalida automáticamente el cache
    } catch (error) {
      console.error('Error al crear categoría:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar esta categoría?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  // Estados de carga y error
  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categorías</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Nueva Categoría
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">ID</th>
            <th className="border p-2 text-left">Nombre</th>
            <th className="border p-2 text-left">Descripción</th>
            <th className="border p-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias?.map((categoria) => (
            <tr key={categoria.id} className="hover:bg-gray-50">
              <td className="border p-2">{categoria.id}</td>
              <td className="border p-2">{categoria.nombre}</td>
              <td className="border p-2">{categoria.descripcion || '-'}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(categoria.id)}
                  className="text-red-600 hover:underline"
                  disabled={deleteMutation.isPending}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para crear/editar */}
      {isModalOpen && (
        <CategoriaModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreate}
          isLoading={createMutation.isPending}
        />
      )}
    </div>
  );
};
```

---

## 🗂️ Estructura de Carpetas Frontend

```
frontend/
├── src/
│   ├── api/
│   │   └── client.ts              # Axios client configurado
│   │
│   ├── types/
│   │   ├── index.ts               # Exporta todas las interfaces
│   │   ├── categoria.ts           # Interfaces de Categoria
│   │   ├── ingrediente.ts         # Interfaces de Ingrediente
│   │   └── producto.ts            # Interfaces de Producto
│   │
│   ├── hooks/                     # TanStack Query hooks
│   │   ├── useCategorias.ts
│   │   ├── useIngredientes.ts
│   │   └── useProductos.ts
│   │
│   ├── components/                # Componentes reutilizables
│   │   ├── categorias/
│   │   │   ├── CategoriaModal.tsx
│   │   │   └── CategoriaForm.tsx
│   │   ├── ingredientes/
│   │   │   ├── IngredienteModal.tsx
│   │   │   └── IngredienteForm.tsx
│   │   └── productos/
│   │       ├── ProductoModal.tsx
│   │       ├── ProductoForm.tsx
│   │       └── ProductoCard.tsx
│   │
│   ├── pages/                     # Páginas principales
│   │   ├── Categorias.tsx
│   │   ├── Ingredientes.tsx
│   │   ├── Productos.tsx
│   │   └── ProductoDetalle.tsx    # Ruta dinámica /productos/:id
│   │
│   ├── App.tsx                    # React Router config
│   ├── main.tsx                   # QueryClientProvider
│   └── index.css                  # Tailwind CSS
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## ⚛️ React Router - Navegación

### `src/App.tsx`

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CategoriasPage } from './pages/Categorias';
import { IngredientesPage } from './pages/Ingredientes';
import { ProductosPage } from './pages/Productos';
import { ProductoDetallePage } from './pages/ProductoDetalle';

export const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          {/* Navbar con links */}
        </nav>
        
        <Routes>
          <Route path="/" element={<ProductosPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/ingredientes" element={<IngredientesPage />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/productos/:id" element={<ProductoDetallePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};
```

### Uso de `useParams` para rutas dinámicas

```typescript
import { useParams } from 'react-router-dom';
import { useProducto } from '../hooks/useProductos';

export const ProductoDetallePage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: producto, isLoading } = useProducto(Number(id));

  if (isLoading) return <div>Cargando...</div>;
  if (!producto) return <div>Producto no encontrado</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{producto.nombre}</h1>
      <p className="text-gray-600">{producto.descripcion}</p>
      
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Categorías:</h2>
        <div className="flex gap-2 mt-2">
          {producto.categorias.map((cat) => (
            <span key={cat.id} className="bg-blue-100 px-3 py-1 rounded">
              {cat.nombre}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold">Ingredientes:</h2>
        <ul className="mt-2">
          {producto.ingredientes.map((ing) => (
            <li key={ing.ingrediente_id}>
              {ing.nombre}: {ing.cantidad} {ing.unidad_medida}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
```

---

## 🎯 QueryClient Provider

### `src/main.tsx`

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { App } from './App';
import './index.css';

// Configuración del QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
```

---

## 📦 package.json (dependencias)

```json
{
  "name": "parcial-prog4-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "@tanstack/react-query": "^5.17.0",
    "axios": "^1.6.5"
  },
  "devDependencies": {
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.11",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.33",
    "autoprefixer": "^10.4.16",
    "@tanstack/react-query-devtools": "^5.17.0"
  }
}
```

---

## 🎨 Tailwind CSS 4 - Configuración

### `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## ✅ Checklist de Implementación Frontend

- [ ] Interfaces TypeScript para todas las entidades (Categoria, Ingrediente, Producto)
- [ ] Axios client configurado con baseURL e interceptor de errores
- [ ] TanStack Query hooks para CRUD de cada entidad
- [ ] QueryClientProvider configurado en `main.tsx`
- [ ] React Router con rutas dinámicas (`/productos/:id`)
- [ ] Componentes funcionales con Props tipadas
- [ ] useState para formularios y UI interactiva
- [ ] useQuery para listados y detalles
- [ ] useMutation para crear, editar, eliminar
- [ ] invalidateQueries después de mutaciones
- [ ] Estados de "Cargando..." y "Error" mostrados en UI
- [ ] Tailwind CSS para todos los estilos (sin CSS plano)
- [ ] Tablas con botones de acciones
- [ ] Modales para formularios de alta/edición
- [ ] Validación visual de errores del backend
