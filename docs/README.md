## Proyecto Laravel + AdminLTE 3 (AgroPapas)

Esta guía explica cómo preparar el entorno, correr la aplicación y usar los endpoints CRUD creados para los catálogos base.

### Requisitos
- PHP 8.2+ (probado con 8.4.12) y extensiones `PDO`, `pdo_pgsql`, `pgsql`
- Composer 2.6+
- Node.js 18+ (recomendado 20/22) y npm
- PostgreSQL (la DB usada aquí es `AgroPapas` en 127.0.0.1:5433 con usuario `daswit`)


### 1) Instalación
1. Abrir una terminal en el directorio del proyecto:
   - Ruta del proyecto: `centralHub/adminlte`
2. Instalar dependencias backend:
   ```bash
   composer install
   ```
3. Instalar dependencias frontend (AdminLTE 3, Bootstrap 4, jQuery, FA):
   ```bash
   npm install
   ```


### 2) Configuración de entorno
1. Copiar el archivo de entorno y generar la APP_KEY:
   ```bash
   copy .env.example .env   # en Windows PowerShell: Copy-Item .env.example .env -Force
   php artisan key:generate
   ```
2. Editar `.env` con los datos de PostgreSQL (ejemplo):
   ```env
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5433
   DB_DATABASE=AgroPapas
   DB_USERNAME=daswit
   DB_PASSWORD=Slv6001313.

   # Recomendado en desarrollo para evitar dependencia de DB en la caché
   CACHE_STORE=file
   ```
3. En Windows, habilitar extensiones `pdo_pgsql` y `pgsql` en `php.ini` (si no lo están):
   ```ini
   extension=pdo_pgsql
   extension=pgsql
   ```
4. Limpiar cachés de Laravel para cargar el nuevo `.env`:
   ```bash
   php artisan optimize:clear
   ```


### 3) Base de datos
- Migraciones del core de Laravel (users, cache, jobs):
  ```bash
  php artisan migrate
  ```
- Si quieres cargar el esquema extendido de AgroPapas (múltiples esquemas y tablas) usa el script SQL que compartiste desde `psql`:
  ```bash
  psql -h 127.0.0.1 -p 5433 -U daswit -d AgroPapas -f ruta/al/script.sql
  ```


### 4) Compilar assets (Vite)
- Producción:
  ```bash
  npm run build
  ```
- Desarrollo (HMR opcional):
  ```bash
  npm run dev
  # y en otra terminal:
  php artisan serve --host=127.0.0.1 --port=8000
  ```


### 5) Levantar el servidor
```bash
php artisan serve --host=127.0.0.1 --port=8000
```
Abrir: `http://127.0.0.1:8000`


## Endpoints CRUD creados (catálogos base)
Todos usan vistas Blade con AdminLTE 3 (formularios web). También aceptan JSON si prefieres cURL/REST.

Prefijo común: `/cat`

### Departamentos
- GET `/cat/departamentos` (index, filtro: `?q=`)
- GET `/cat/departamentos/create` (form crear)
- POST `/cat/departamentos` (crear)
- GET `/cat/departamentos/{id}/edit` (form editar)
- PUT `/cat/departamentos/{id}` (actualizar)
- DELETE `/cat/departamentos/{id}` (eliminar)

Ejemplos cURL (JSON):
```bash
# Crear
curl -X POST http://127.0.0.1:8000/cat/departamentos \
  -H "Content-Type: application/json" \
  -d '{ "nombre": "Potosí" }'

# Actualizar
curl -X PUT http://127.0.0.1:8000/cat/departamentos/1 \
  -H "Content-Type: application/json" \
  -d '{ "nombre": "La Paz" }'

# Eliminar
curl -X DELETE http://127.0.0.1:8000/cat/departamentos/1
```

### Municipios
- GET `/cat/municipios` (index, filtros: `?q=`, `?departamento_id=`)
- GET `/cat/municipios/create`
- POST `/cat/municipios`
- GET `/cat/municipios/{id}/edit`
- PUT `/cat/municipios/{id}`
- DELETE `/cat/municipios/{id}`

JSON esperado:
```json
{
  "departamento_id": 1,
  "nombre": "Cochabamba"
}
```

### Variedades de papa
- GET `/cat/variedades` (index, filtro: `?q=` por código/nombre)
- GET `/cat/variedades/create`
- POST `/cat/variedades`
- GET `/cat/variedades/{id}/edit`
- PUT `/cat/variedades/{id}`
- DELETE `/cat/variedades/{id}`

JSON esperado (campos aceptados):
```json
{
  "codigo_variedad": "WAYCHA",
  "nombre_comercial": "Waych'a",
  "aptitud": "Mesa",
  "ciclo_dias_min": 110,
  "ciclo_dias_max": 140
}
```


- El layout base está en `resources/views/layouts/app.blade.php` con AdminLTE 3.
- Se incluye Font Awesome y los scripts de AdminLTE vía Vite (`resources/css/app.css`, `resources/js/app.js`).
- Las vistas CRUD extienden el layout y usan componentes simples para alertas y formularios.


## Solución de problemas
- Error de autenticación a PostgreSQL: valida usuario/host/puerto y que la contraseña sea correcta (incluye punto final en este caso).
- En Windows, si `esbuild` falta: `npm install esbuild --no-save` y luego `npm run build`.
- Si limpiar caché falla por acceso a DB, usa `CACHE_STORE=file` en `.env` y `php artisan optimize:clear`.


