-- Esquema de base de datos para aplicación de finanzas personales
-- Ejecutar este script en el SQL Editor de Supabase

-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  color VARCHAR(7) NOT NULL, -- Formato hexadecimal #RRGGBB
  icon VARCHAR(50) DEFAULT 'shopping', -- Nombre del icono
  type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense', 'both')) DEFAULT 'expense',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
-- Índices para categorías
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);

-- Índices para transacciones
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

-- Triggers para actualizar updated_at
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar categorías de ejemplo
INSERT INTO categories (name, color, icon, type) VALUES
('Food', '#17B26A', 'groceries', 'expense'),
('Entertainment', '#F04438', 'credit-card', 'expense'),
('Transportation', '#0BA5EC', 'transportation', 'expense'),
('Shopping', '#4E5BA6', 'shopping', 'expense'),
('Bills', '#9E77ED', 'house', 'expense'),
('Health', '#F79009', 'health', 'expense'),
('Education', '#6172F3', 'education', 'expense'),
('Travel', '#DD2590', 'travel', 'expense'),
('Other', '#667085', 'shopping', 'both'),
('Salary', '#17B26A', 'income', 'income'),
('Freelance', '#0BA5EC', 'freelance', 'income'),
('Bonus', '#F79009', 'bonus', 'income');

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
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir todas las operaciones (ajustar según necesidades de autenticación)
CREATE POLICY "Allow all operations on categories" ON categories
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on transactions" ON transactions
  FOR ALL USING (true);