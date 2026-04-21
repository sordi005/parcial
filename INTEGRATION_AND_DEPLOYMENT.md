# 🚀 Guía de Integración y Deployment

## Tabla de Contenidos
1. [Verificación de Requisitos](#requisitos)
2. [Setup Local](#setup-local)
3. [Testing End-to-End](#testing-e2e)
4. [Troubleshooting](#troubleshooting)
5. [Deployment](#deployment)

---

## 📋 Requisitos

### Sistema
- **Python 3.8+** (Backend)
- **Node.js 18+** (Frontend)
- **PostgreSQL 12+** (Database)
- **Git** (Control de versiones)

### Verificar Instalación

```bash
# Python
python --version

# Node.js
node --version && npm --version

# PostgreSQL
psql --version

# Git
git --version
```

---

## 🔧 Setup Local

### Opción A: Manual (Recomendado para desarrollo)

#### 1. Backend

```bash
cd backend

# Crear virtual environment
python -m venv .venv

# Activar (Linux/Mac)
source .venv/bin/activate

# Activar (Windows)
.venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Verificar variables de entorno
cat .env
# DATABASE_URL=postgresql://postgres:1234postgres@localhost:5434/parcial_prog4

# Ejecutar servidor
uvicorn app.main:app --reload
```

Backend estará en: `http://localhost:8000`  
Documentación: `http://localhost:8000/docs`

#### 2. Frontend

```bash
cd frontend

# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm run dev
```

Frontend estará en: `http://localhost:5173`

#### 3. Base de Datos

**Opción A: PostgreSQL Local**
```bash
# Crear base de datos
createdb -U postgres -h localhost -p 5434 parcial_prog4

# Verificar conexión
psql -U postgres -h localhost -p 5434 -d parcial_prog4 -c "SELECT version();"
```

**Opción B: Docker**
```bash
docker run --name postgres-parcial \
  -e POSTGRES_PASSWORD=1234postgres \
  -e POSTGRES_DB=parcial_prog4 \
  -p 5434:5432 \
  -d postgres:15
```

### Opción B: Automatizado (usando script)

```bash
# Desde la raíz del proyecto
chmod +x setup.sh
./setup.sh
```

---

## 🧪 Testing End-to-End

### Test Manual Rápido

```bash
# 1. Verifica que Backend responde
curl http://localhost:8000/

# Debería retornar:
# {
#   "message": "Parcial Prog4 API",
#   "version": "1.0.0",
#   "docs": "/docs"
# }

# 2. Crear categoría
curl -X POST http://localhost:8000/api/categorias \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Bebidas","descripcion":"Bebidas frías"}'

# 3. Verificar en Frontend
# Abre http://localhost:5173/categorias
```

### Test Automatizado

```bash
chmod +x test-integration.sh
./test-integration.sh
```

Esto ejecutará:
- ✅ GET /categorias
- ✅ POST /categorias (crear)
- ✅ PUT /categorias/:id (actualizar)
- ✅ DELETE /categorias/:id (eliminar)
- ✅ (lo mismo para ingredientes y productos)

---

## 🐛 Troubleshooting

### Error: "Connection refused" en Backend

**Causa**: Backend no está corriendo o no usa puerto 8000

**Solución**:
```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Error: "CORS error" en Frontend

**Causa**: Backend no tiene CORS habilitado para `http://localhost:5173`

**Verificar en `backend/app/main.py`**:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Error: "Database connection failed"

**Causa**: PostgreSQL no está corriendo o credenciales incorrectas

**Verificar**:
```bash
# Verificar que PostgreSQL está corriendo
psql -U postgres -h localhost -p 5434 -c "SELECT 1"

# Si usa Docker
docker ps | grep postgres

# Crear BD si no existe
createdb -U postgres -h localhost -p 5434 parcial_prog4
```

**Revisar `backend/.env`**:
```env
DATABASE_URL=postgresql://usuario:password@host:puerto/database
# Ejemplo:
DATABASE_URL=postgresql://postgres:1234postgres@localhost:5434/parcial_prog4
```

### Error: "Module not found" en Frontend

**Solución**:
```bash
cd frontend
pnpm install
# Si sigue fallando:
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Frontend no ve cambios en la API

**Causa**: TanStack Query cachea los datos

**Solución**:
```bash
# Borrar caché en DevTools (F12 → Application → Storage)
# O recargar la página (Ctrl+Shift+R)
```

---

## 🌐 Deployment

### Preparación Pre-Deployment

#### 1. Variables de Entorno

**Backend (`backend/.env`)**:
```env
DATABASE_URL=postgresql://usuario:pass@host:5432/parcial_prod
ENVIRONMENT=production
DEBUG=False
```

**Frontend (editar `frontend/src/api/client.ts`)**:
```typescript
export const apiClient = axios.create({
  baseURL: 'https://api.tudominio.com/api/v1',  // URL de producción
});
```

#### 2. Build de Producción

```bash
# Backend (no necesita build especial, uvicorn maneja todo)

# Frontend
cd frontend
pnpm run build
# Genera: frontend/dist/

# Copiar a servidor web (nginx, Apache, etc.)
# El contenido de dist/ se sirve como archivos estáticos
```

#### 3. Base de Datos

```bash
# Crear BD en servidor de producción
createdb -U postgres parcial_prog4

# Aplicar migraciones (si existen)
# python backend/scripts/migrate.py
```

### Deployment con Docker

#### Docker Compose (Recomendado)

**Verificar `docker-compose.yml`**:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: 1234postgres
      POSTGRES_DB: parcial_prog4
    ports:
      - "5434:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://postgres:1234postgres@postgres:5432/parcial_prog4
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

**Ejecutar**:
```bash
docker-compose up -d

# Verificar
docker-compose ps

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

### Deployment Manual

#### 1. Servidor (Linux/Ubuntu)

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependencias
sudo apt install -y python3 python3-pip python3-venv postgresql nodejs npm

# Clonar repositorio
git clone https://github.com/usuario/parcial-prog4.git
cd parcial-prog4

# Setup Backend
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Setup Frontend
cd ../frontend
npm install
npm run build

# Configurar Nginx
# Ver sección Nginx abajo
```

#### 2. Nginx Configuration

```nginx
server {
    listen 80;
    server_name tudominio.com;

    # Frontend
    location / {
        root /var/www/parcial-prog4/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 3. PM2 para Backend (Node Process Manager)

```bash
# Instalar PM2
npm install -g pm2

# Crear script para backend
cat > start-backend.sh << 'EOF'
#!/bin/bash
cd backend
source .venv/bin/activate
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
EOF

chmod +x start-backend.sh

# Iniciar con PM2
pm2 start start-backend.sh --name "parcial-backend"

# Monitorear
pm2 monit

# Guardar configuración
pm2 save
pm2 startup
```

---

## 📊 Checklist de Deployment

### Pre-Deployment
- [ ] Todas las pruebas E2E pasan (`./test-integration.sh`)
- [ ] Variables de entorno configuradas
- [ ] Base de datos creada y disponible
- [ ] Frontend compilado (`pnpm run build`)
- [ ] SSL/TLS configurado (para HTTPS)
- [ ] Backups de base de datos configurados
- [ ] Logs configurados
- [ ] Monitoreo activo

### Deployment
- [ ] Backend corriendo
- [ ] Frontend servido correctamente
- [ ] API accesible desde Frontend
- [ ] CORS funcionando
- [ ] HTTPS activo
- [ ] Certificados válidos

### Post-Deployment
- [ ] Verificar todas las funciones
- [ ] Monitorear performance
- [ ] Revisar logs de errores
- [ ] Contactar a usuarios sobre cambios
- [ ] Plan de rollback preparado

---

## 📈 Performance & Monitoring

### Backend Metrics
```bash
# Instalar Prometheus client
pip install prometheus-client

# Ver métricas en
http://localhost:8000/metrics
```

### Frontend Performance
```bash
# Analizar bundle
pnpm run build --analyze

# Ver performance en DevTools (F12 → Performance)
```

### Database
```bash
# Backup automático
pg_dump -U postgres parcial_prog4 > backup_$(date +%Y%m%d).sql

# Restaurar
psql -U postgres parcial_prog4 < backup.sql
```

---

## 🔐 Seguridad

### Checklist de Seguridad

- [ ] HTTPS habilitado en producción
- [ ] Contraseñas de BD no en código (usar variables de entorno)
- [ ] CORS restrictivo (solo dominios permitidos)
- [ ] Validación de entrada en backend y frontend
- [ ] Rate limiting en API
- [ ] Logs de acceso habilitados
- [ ] Actualizaciones de dependencias regulares

### Actualizar Dependencias

```bash
# Frontend
cd frontend
pnpm outdated
pnpm upgrade

# Backend
pip list --outdated
pip install --upgrade -r requirements.txt
```

---

## 📞 Soporte

### Logs

**Backend**:
```bash
# Ver logs en tiempo real
tail -f backend/logs/app.log
```

**Frontend**:
```bash
# Consola del navegador (F12)
```

### Contacto
Para reportar errores o solicitar ayuda, crear un issue en GitHub.

---

Fecha: 21 de Abril de 2026
