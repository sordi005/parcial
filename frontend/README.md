# Food Store Frontend 🍔

Una aplicación web moderna construida con **React 19**, **TypeScript**, y **Vite** para gestionar un catálogo de productos, ingredientes y categorías. Conectada con un backend FastAPI.

## 🚀 Quick Start

### Requisitos previos

- **Node.js 18+**
- **pnpm** (recomendado) o npm/yarn
- **Backend corriendo** en `http://localhost:8000`

### Instalación y desarrollo

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm run dev
```

El frontend estará disponible en **`http://localhost:5173`**

### Build para producción

```bash
pnpm run build
```

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── api/
│   │   └── client.ts              # Axios client configurado
│   ├── types/
│   │   ├── categoria.ts           # Interfaces TypeScript
│   │   ├── ingrediente.ts
│   │   ├── producto.ts
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useCategorias.ts       # TanStack Query hooks
│   │   ├── useIngredientes.ts
│   │   └── useProductos.ts
│   ├── components/
│   │   ├── layout/
│   │   ├── categorias/
│   │   ├── ingredientes/
│   │   └── productos/
│   ├── pages/
│   │   ├── CategoriasPage.tsx
│   │   ├── IngredientesPage.tsx
│   │   ├── ProductosPage.tsx
│   │   └── ProductoDetallePage.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🎯 Características Principales

✅ **CRUD Completo** — Gestión de Categorías, Ingredientes y Productos  
✅ **State Management** — TanStack Query v5 con caché automática  
✅ **Validación** — Formularios con validación en cliente  
✅ **Responsive** — Diseño mobile-first con Tailwind CSS v4  
✅ **Type-Safe** — TypeScript strict mode  
✅ **Enrutamiento** — React Router v7 con rutas dinámicas  
✅ **Manejo de Errores** — Error states y feedback visual  

## 🔌 Configuración del Backend

Por defecto, el frontend se conecta a `http://localhost:8000/api`

Para cambiar la URL base, edita `src/api/client.ts`:

```typescript
export const apiClient = axios.create({
  baseURL: "http://tu-servidor:puerto/api",
});
```

### Endpoints esperados

Consulta [FRONTEND.md](./FRONTEND.md#-integración-con-backend) para la lista completa de endpoints.

## 📚 Documentación Completa

Para información detallada sobre:
- **Testing manual** de todas las funcionalidades
- **Troubleshooting** común
- **Próximos pasos** de desarrollo
- **Notas importantes** sobre validación y caché

Consulta [**FRONTEND.md**](./FRONTEND.md)

## 🛠 Stack Tecnológico

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| React | 19.2 | Framework UI |
| TypeScript | 6.0 | Type safety |
| Vite | 8.0 | Build tool y dev server |
| React Router | 7.14 | Enrutamiento |
| TanStack Query | 5.99 | State management & sync |
| Axios | 1.15 | Cliente HTTP |
| Tailwind CSS | 4.2 | Styling |
| ESLint | 9.39 | Linting |

## 📋 Scripts disponibles

```bash
pnpm run dev       # Inicia dev server (HMR activo)
pnpm run build     # Build para producción
pnpm run lint      # Ejecuta ESLint
pnpm run preview   # Preview del build en local
```

## 🔒 CORS

El backend debe tener habilitado CORS para `http://localhost:5173`:

```python
# FastAPI backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 💡 Consejos de desarrollo

1. **Abrir React DevTools** — Instala la extensión de React Developer Tools en tu navegador
2. **Inspect Network** — F12 → Network para ver llamadas a la API
3. **HMR en acción** — Edita archivos y ve cambios instantáneos sin recargar
4. **TypeScript en strict mode** — Configura tu editor para mostrar errores de tipos en tiempo real

## 🐛 Troubleshooting

### "ECONNREFUSED localhost:8000"
Asegúrate de que el backend está corriendo antes de iniciar el frontend.

### Error CORS en consola
Verifica que el backend tiene CORS configurado correctamente para `http://localhost:5173`

### Formulario no responde
- Revisa la consola del navegador (F12)
- Verifica que el backend retorna la respuesta esperada
- Intenta un hard refresh (Ctrl+Shift+R)

## 📝 License

Proyecto académico — Programación 4

## 👨‍💻 Contacto

Para reportar errores o sugerencias, abre un issue en el repositorio.
