# API Contract - Parcial Prog4

**Base URL:** `http://localhost:8000/api/v1`

---

## 🏷️ Categorías

### GET /categorias
Lista todas las categorías con paginación opcional.

**Query params:**
- `skip`: int = 0
- `limit`: int = 100

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "nombre": "Bebidas",
    "descripcion": "Bebidas frías y calientes",
    "created_at": "2026-04-20T10:00:00"
  }
]
```

---

### GET /categorias/{id}
Obtiene una categoría por ID.

**Response:** `200 OK`
```json
{
  "id": 1,
  "nombre": "Bebidas",
  "descripcion": "Bebidas frías y calientes",
  "created_at": "2026-04-20T10:00:00"
}
```

**Errores:**
- `404 Not Found` - Categoría no encontrada

---

### POST /categorias
Crea una nueva categoría.

**Request body:**
```json
{
  "nombre": "Bebidas",
  "descripcion": "Bebidas frías y calientes"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "nombre": "Bebidas",
  "descripcion": "Bebidas frías y calientes",
  "created_at": "2026-04-20T10:00:00"
}
```

**Errores:**
- `400 Bad Request` - Validación fallida (ej. nombre vacío)
- `409 Conflict` - Categoría ya existe

---

### PUT /categorias/{id}
Actualiza una categoría existente.

**Request body:**
```json
{
  "nombre": "Bebidas Premium",
  "descripcion": "Bebidas importadas"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "nombre": "Bebidas Premium",
  "descripcion": "Bebidas importadas",
  "created_at": "2026-04-20T10:00:00"
}
```

**Errores:**
- `404 Not Found` - Categoría no encontrada
- `400 Bad Request` - Validación fallida

---

### DELETE /categorias/{id}
Elimina una categoría.

**Response:** `204 No Content`

**Errores:**
- `404 Not Found` - Categoría no encontrada
- `409 Conflict` - Categoría tiene productos asociados

---

## 🧪 Ingredientes

### GET /ingredientes
Lista todos los ingredientes con paginación opcional.

**Query params:**
- `skip`: int = 0
- `limit`: int = 100

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "nombre": "Leche",
    "unidad_medida": "ml",
    "stock_actual": 5000,
    "stock_minimo": 1000,
    "created_at": "2026-04-20T10:00:00"
  }
]
```

---

### GET /ingredientes/{id}
Obtiene un ingrediente por ID.

**Response:** `200 OK`
```json
{
  "id": 1,
  "nombre": "Leche",
  "unidad_medida": "ml",
  "stock_actual": 5000,
  "stock_minimo": 1000,
  "created_at": "2026-04-20T10:00:00"
}
```

**Errores:**
- `404 Not Found` - Ingrediente no encontrado

---

### POST /ingredientes
Crea un nuevo ingrediente.

**Request body:**
```json
{
  "nombre": "Leche",
  "unidad_medida": "ml",
  "stock_actual": 5000,
  "stock_minimo": 1000
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "nombre": "Leche",
  "unidad_medida": "ml",
  "stock_actual": 5000,
  "stock_minimo": 1000,
  "created_at": "2026-04-20T10:00:00"
}
```

**Errores:**
- `400 Bad Request` - Validación fallida
- `409 Conflict` - Ingrediente ya existe

---

### PUT /ingredientes/{id}
Actualiza un ingrediente existente.

**Request body:**
```json
{
  "nombre": "Leche Entera",
  "unidad_medida": "ml",
  "stock_actual": 6000,
  "stock_minimo": 1500
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "nombre": "Leche Entera",
  "unidad_medida": "ml",
  "stock_actual": 6000,
  "stock_minimo": 1500,
  "created_at": "2026-04-20T10:00:00"
}
```

**Errores:**
- `404 Not Found` - Ingrediente no encontrado
- `400 Bad Request` - Validación fallida

---

### DELETE /ingredientes/{id}
Elimina un ingrediente.

**Response:** `204 No Content`

**Errores:**
- `404 Not Found` - Ingrediente no encontrado
- `409 Conflict` - Ingrediente usado en productos

---

## 🍕 Productos

### GET /productos
Lista todos los productos con sus relaciones.

**Query params:**
- `skip`: int = 0
- `limit`: int = 100
- `categoria_id`: int (opcional) - filtrar por categoría

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "nombre": "Cappuccino",
    "descripcion": "Café con leche espumosa",
    "precio": 450.00,
    "disponible": true,
    "categorias": [
      {
        "id": 1,
        "nombre": "Bebidas"
      },
      {
        "id": 2,
        "nombre": "Calientes"
      }
    ],
    "ingredientes": [
      {
        "ingrediente_id": 1,
        "nombre": "Leche",
        "cantidad": 200,
        "unidad_medida": "ml"
      },
      {
        "ingrediente_id": 2,
        "nombre": "Café",
        "cantidad": 30,
        "unidad_medida": "g"
      }
    ],
    "created_at": "2026-04-20T10:00:00"
  }
]
```

---

### GET /productos/{id}
Obtiene un producto por ID con todas sus relaciones.

**Response:** `200 OK`
```json
{
  "id": 1,
  "nombre": "Cappuccino",
  "descripcion": "Café con leche espumosa",
  "precio": 450.00,
  "disponible": true,
  "categorias": [
    {
      "id": 1,
      "nombre": "Bebidas"
    },
    {
      "id": 2,
      "nombre": "Calientes"
    }
  ],
  "ingredientes": [
    {
      "ingrediente_id": 1,
      "nombre": "Leche",
      "cantidad": 200,
      "unidad_medida": "ml"
    }
  ],
  "created_at": "2026-04-20T10:00:00"
}
```

**Errores:**
- `404 Not Found` - Producto no encontrado

---

### POST /productos
Crea un nuevo producto con sus categorías e ingredientes.

**Request body:**
```json
{
  "nombre": "Cappuccino",
  "descripcion": "Café con leche espumosa",
  "precio": 450.00,
  "disponible": true,
  "categoria_ids": [1, 2],
  "ingredientes": [
    {
      "ingrediente_id": 1,
      "cantidad": 200
    },
    {
      "ingrediente_id": 2,
      "cantidad": 30
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "nombre": "Cappuccino",
  "descripcion": "Café con leche espumosa",
  "precio": 450.00,
  "disponible": true,
  "categoria_ids": [1, 2],
  "created_at": "2026-04-20T10:00:00"
}
```

**Errores:**
- `400 Bad Request` - Validación fallida (precio negativo, nombre vacío, sin categorías)
- `404 Not Found` - Categoría o ingrediente no existe
- `409 Conflict` - Producto ya existe

---

### PUT /productos/{id}
Actualiza un producto existente (reemplaza categorías e ingredientes).

**Request body:**
```json
{
  "nombre": "Cappuccino Grande",
  "descripcion": "Café con leche espumosa - tamaño grande",
  "precio": 550.00,
  "disponible": true,
  "categoria_ids": [1, 2, 3],
  "ingredientes": [
    {
      "ingrediente_id": 1,
      "cantidad": 300
    },
    {
      "ingrediente_id": 2,
      "cantidad": 40
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "nombre": "Cappuccino Grande",
  "descripcion": "Café con leche espumosa - tamaño grande",
  "precio": 550.00,
  "disponible": true,
  "categoria_ids": [1, 2, 3],
  "created_at": "2026-04-20T10:00:00"
}
```

**Errores:**
- `404 Not Found` - Producto, categoría o ingrediente no encontrado
- `400 Bad Request` - Validación fallida

---

### DELETE /productos/{id}
Elimina un producto (elimina automáticamente las relaciones con categorías e ingredientes).

**Response:** `204 No Content`

**Errores:**
- `404 Not Found` - Producto no encontrado

---

## 📋 Validaciones Comunes

### Categoría
- `nombre`: requerido, string, min 3, max 100 caracteres
- `descripcion`: opcional, string, max 500 caracteres

### Ingrediente
- `nombre`: requerido, string, min 3, max 100 caracteres
- `unidad_medida`: requerido, string (ej: "ml", "g", "unidades")
- `stock_actual`: requerido, float >= 0
- `stock_minimo`: requerido, float >= 0

### Producto
- `nombre`: requerido, string, min 3, max 150 caracteres
- `descripcion`: opcional, string, max 1000 caracteres
- `precio`: requerido, decimal > 0
- `disponible`: boolean, default true
- `categoria_ids`: requerido, array de int, al menos 1 categoría, todas deben existir
- `ingredientes`: array, al menos 1 ingrediente

### ProductoIngrediente
- `cantidad`: requerido, float > 0

---

## 🔍 Códigos de Estado HTTP

| Código | Uso |
|--------|-----|
| `200 OK` | GET, PUT exitosos |
| `201 Created` | POST exitoso |
| `204 No Content` | DELETE exitoso |
| `400 Bad Request` | Validación fallida |
| `404 Not Found` | Recurso no encontrado |
| `409 Conflict` | Conflicto (duplicado, dependencias) |
| `422 Unprocessable Entity` | Error de validación Pydantic |
| `500 Internal Server Error` | Error del servidor |

---

## 🧪 Datos de Prueba Mock (para desarrollo frontend)

Podés usar estos datos mientras el backend no esté listo:

**Categorías:**
```json
[
  { "id": 1, "nombre": "Bebidas", "descripcion": "Bebidas frías y calientes" },
  { "id": 2, "nombre": "Comidas", "descripcion": "Platos principales" },
  { "id": 3, "nombre": "Postres", "descripcion": "Dulces y helados" }
]
```

**Ingredientes:**
```json
[
  { "id": 1, "nombre": "Leche", "unidad_medida": "ml", "stock_actual": 5000, "stock_minimo": 1000 },
  { "id": 2, "nombre": "Café", "unidad_medida": "g", "stock_actual": 2000, "stock_minimo": 500 },
  { "id": 3, "nombre": "Azúcar", "unidad_medida": "g", "stock_actual": 3000, "stock_minimo": 1000 }
]
```

---

## 📝 Notas para Frontend

1. **Invalidación de caché (TanStack Query):**
   - Después de POST: invalidar la query del listado
   - Después de PUT: invalidar listado + detalle
   - Después de DELETE: invalidar listado

2. **Manejo de errores:**
   - Todos los errores vienen con formato: `{ "detail": "mensaje de error" }`

3. **CORS:**
   - El backend tiene CORS habilitado para `http://localhost:5173` (Vite)

4. **Relaciones:**
   - Los productos SIEMPRE incluyen categorías e ingredientes en el GET
   - Al crear/editar producto, enviar:
     - `categoria_ids`: array de IDs (ej: `[1, 2, 3]`)
     - `ingredientes`: array de `{ ingrediente_id, cantidad }`
