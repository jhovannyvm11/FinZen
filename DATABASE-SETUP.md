# Database Setup Guide

## Issue: "Error creating transaction: {}"

This error occurs because the Supabase database table doesn't exist yet. The schema needs to be executed in your Supabase project.

## Solution: Execute the Database Schema

### Step 1: Access Supabase SQL Editor
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar

### Step 2: Execute the Schema
1. Copy the entire content from `supabase-schema.sql`
2. Paste it into the SQL Editor
3. Click **Run** to execute the script

### Step 3: Verify Table Creation
After running the script, you should see:
- ✅ `transactions` table created
- ✅ Indexes created for performance
- ✅ Triggers for automatic `updated_at` field
- ✅ Sample data inserted
- ✅ Row Level Security enabled

### Step 4: Test the Application
1. Restart your development server: `npm run dev`
2. Try creating a new transaction
3. The error should be resolved

## Alternative: Quick Schema Copy

Here's the schema content for quick copy-paste:

```sql
-- Esquema de base de datos para aplicación de finanzas personales
-- Ejecutar este script en el SQL Editor de Supabase

-- Crear tabla de transacciones
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  method VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos de ejemplo
INSERT INTO transactions (type, description, amount, category, method, date) VALUES
('income', 'Orlando Rodrigues', 750.00, 'Salary', 'Bank account', '2024-04-01'),
('expense', 'Netflix', -9.90, 'Entertainment', 'Credit card', '2024-03-29'),
('expense', 'Spotify', -19.90, 'Entertainment', 'Credit card', '2024-03-29'),
('income', 'Carl Andrew', 400.00, 'Freelance', 'Bank account', '2024-03-27'),
('transfer', 'Maria Silva', -150.00, 'Transfer', 'Bank account', '2024-03-25'),
('expense', 'Grocery Store', -85.50, 'Food', 'Debit card', '2024-03-24'),
('income', 'Bonus Payment', 500.00, 'Bonus', 'Bank account', '2024-03-20'),
('expense', 'Gas Station', -45.00, 'Transportation', 'Credit card', '2024-03-18');

-- Habilitar Row Level Security (RLS)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Política para permitir todas las operaciones (ajustar según necesidades de autenticación)
CREATE POLICY "Allow all operations on transactions" ON transactions
  FOR ALL USING (true);
```

## Troubleshooting

### If you still get errors after running the schema:

1. **Check Supabase URL**: Ensure your `.env.local` has valid Supabase credentials
2. **Verify Table**: Go to Supabase Dashboard > Table Editor to confirm the `transactions` table exists
3. **Check Policies**: Ensure RLS policies allow your operations
4. **Restart Server**: Run `npm run dev` to reload environment variables

### Common Error Messages:
- `"Error creating transaction: {}"` → Database table doesn't exist
- `"relation 'transactions' does not exist"` → Schema not executed
- `"Invalid URL"` → Check Supabase environment variables

## Next Steps

After setting up the database:
1. Replace temporary Supabase credentials with your real project credentials
2. Customize the RLS policies for your authentication needs
3. Add more sample data if needed
4. Test all CRUD operations (Create, Read, Update, Delete)