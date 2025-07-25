# 🌍 Configuración de Entornos

Esta guía explica cómo configurar las variables de entorno para diferentes ambientes en el proyecto.

## 📁 Archivos de Entorno

### `.env.example`
- **Propósito**: Plantilla con todas las variables necesarias
- **Uso**: Copia este archivo para crear tus configuraciones
- **Git**: ✅ Se incluye en el repositorio

### `.env.local`
- **Propósito**: Configuración local personal (sobrescribe otros archivos)
- **Uso**: Para desarrollo local con credenciales reales
- **Git**: ❌ No se incluye en el repositorio

### `.env.development`
- **Propósito**: Configuración para entorno de desarrollo
- **Uso**: Se carga automáticamente cuando `NODE_ENV=development`
- **Git**: ✅ Se puede incluir (sin credenciales sensibles)

### `.env.staging`
- **Propósito**: Configuración para entorno de staging/testing
- **Uso**: Para pruebas antes de producción
- **Git**: ✅ Se puede incluir (sin credenciales sensibles)

### `.env.production`
- **Propósito**: Configuración para entorno de producción
- **Uso**: Se carga automáticamente cuando `NODE_ENV=production`
- **Git**: ✅ Se puede incluir (sin credenciales sensibles)

## 🚀 Configuración Inicial

### 1. Copia el archivo de ejemplo
```bash
cp .env.example .env.local
```

### 2. Configura tus credenciales de Supabase
Edita `.env.local` y reemplaza:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_real
```

### 3. Obtén las credenciales de Supabase
1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** > **API**
4. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🔄 Orden de Prioridad

Next.js carga los archivos en este orden (el último sobrescribe):
1. `.env`
2. `.env.local`
3. `.env.development` / `.env.production` / `.env.staging`
4. `.env.development.local` / `.env.production.local` / `.env.staging.local`

## 🔒 Seguridad

### ✅ Buenas Prácticas
- Usa `.env.local` para credenciales reales
- Nunca commits archivos `.env.*.local`
- Usa variables `NEXT_PUBLIC_*` solo para datos públicos
- Mantén las service keys en variables sin `NEXT_PUBLIC_`

### ❌ Evita
- Commitear credenciales reales
- Usar `NEXT_PUBLIC_` para datos sensibles
- Hardcodear URLs en el código

## 🛠️ Variables Disponibles

### Supabase
```env
NEXT_PUBLIC_SUPABASE_URL=          # URL del proyecto Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Clave pública/anónima
SUPABASE_SERVICE_ROLE_KEY=         # Clave de servicio (solo servidor)
```

### Aplicación
```env
NEXT_PUBLIC_APP_ENV=               # Entorno actual
NEXT_PUBLIC_DEBUG_MODE=            # Modo debug (true/false)
```

### Opcionales
```env
NEXT_PUBLIC_ANALYTICS_ID=          # ID de analytics
SENTRY_DSN=                        # Sentry para errores
CYPRESS_BASE_URL=                  # URL base para testing
```

## 🚨 Troubleshooting

### Error: "Invalid URL"
- Verifica que `NEXT_PUBLIC_SUPABASE_URL` tenga formato válido
- Debe empezar con `https://`
- No debe tener `/` al final

### Variables no se cargan
- Reinicia el servidor de desarrollo
- Verifica que el nombre empiece con `NEXT_PUBLIC_` para uso en cliente
- Revisa que no haya espacios en el archivo `.env`

### Entorno incorrecto
- Verifica `NODE_ENV` con: `echo $NODE_ENV`
- Para desarrollo: `npm run dev`
- Para producción: `npm run build && npm start`