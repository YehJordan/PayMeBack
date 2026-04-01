DROP TYPE IF EXISTS expense_category CASCADE;
CREATE TYPE expense_category AS ENUM ('Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Healthcare', 'Other');

CREATE TABLE users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email TEXT
);

-----------------------------------

CREATE TABLE groups (
  id SERIAL PRIMARY KEY,           
  name VARCHAR(100) NOT NULL,      
  description TEXT,                
  budget NUMERIC(10, 2) DEFAULT 0  
);

-----------------------------------

CREATE TABLE group_members (
  id SERIAL PRIMARY KEY,           
  group_id INTEGER NOT NULL,       
  user_id UUID NOT NULL,              
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-----------------------------------

CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  creator_id UUID NOT NULL,      -- who created the expense
  group_id INTEGER NOT NULL,         -- which group the expense belongs to
  amount NUMERIC(10,2) NOT NULL,  -- total expense
  category expense_category DEFAULT 'Other', -- category of the expense
  description TEXT,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

------------------------------------

CREATE TABLE expense_contributions (
  id SERIAL PRIMARY KEY,
  expense_id INTEGER NOT NULL,
  user_id UUID NOT NULL,
  amount NUMERIC(10,2) NOT NULL,       -- how much this user contributed
  FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(expense_id, user_id)
);

-------------------------------------

-- Trigger to automatically create a user profile when a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, name, email)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', new.email, 'Unknown'), new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-------------------------------------