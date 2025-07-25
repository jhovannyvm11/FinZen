# 💰 Aplicación de Finanzas Personales con Supabase

Esta aplicación permite gestionar ingresos, gastos y transferencias utilizando Next.js, HeroUI y Supabase como base de datos.

## 🚀 Configuración de Supabase

### 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Espera a que se complete la configuración del proyecto

### 2. Configurar la base de datos

1. En tu proyecto de Supabase, ve a **SQL Editor**
2. Copia y pega el contenido del archivo `supabase-schema.sql`
3. Ejecuta el script para crear las tablas y datos de ejemplo

### 3. Obtener las credenciales

1. Ve a **Settings** > **API**
2. Copia la **Project URL** y **anon public key**
3. Actualiza el archivo `.env.local` con tus credenciales:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_project_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

## 📦 Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🗄️ Estructura de la Base de Datos

### Tabla: `transactions`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único (auto-generado) |
| `type` | VARCHAR | Tipo de transacción: 'income', 'expense', 'transfer' |
| `description` | TEXT | Descripción de la transacción |
| `amount` | DECIMAL | Monto (positivo para ingresos, negativo para gastos) |
| `category` | VARCHAR | Categoría opcional |
| `method` | VARCHAR | Método de pago |
| `date` | DATE | Fecha de la transacción |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de última actualización |

## ✨ Funcionalidades

- ✅ **Dashboard con estadísticas en tiempo real**
  - Balance total
  - Total de ingresos
  - Total de gastos

- ✅ **Gestión de transacciones**
  - Agregar ingresos
  - Agregar gastos
  - Registrar transferencias
  - Ver historial de transacciones

- ✅ **Integración con Supabase**
  - Datos en tiempo real
  - Persistencia automática
  - Sincronización automática

## 🔧 Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: HeroUI, Tailwind CSS
- **Base de datos**: Supabase (PostgreSQL)
- **Estado**: React Hooks personalizados

## 📝 Uso de la Aplicación

1. **Ver Dashboard**: Las estadísticas se actualizan automáticamente
2. **Agregar Transacciones**: Usa los botones de acción para abrir el modal
3. **Ver Historial**: Las últimas transacciones se muestran en la tabla
4. **Categorización**: Organiza tus transacciones por categorías

## 🔒 Seguridad

La aplicación utiliza Row Level Security (RLS) de Supabase. Actualmente está configurada para permitir todas las operaciones, pero puedes ajustar las políticas según tus necesidades de autenticación.

## 🚨 Notas Importantes

- Asegúrate de mantener tus credenciales de Supabase seguras
- No commitees el archivo `.env.local` al repositorio
- Los datos de ejemplo se insertan automáticamente al ejecutar el schema

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature
3. Realiza tus cambios
4. Envía un pull request

---

¡Disfruta gestionando tus finanzas! 💸