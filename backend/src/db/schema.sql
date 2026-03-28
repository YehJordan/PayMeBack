CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
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
  user_id INTEGER NOT NULL,              
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-----------------------------------

CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  creator_id INTEGER NOT NULL,      -- who created the expense
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
  user_id INTEGER NOT NULL,
  amount NUMERIC(10,2) NOT NULL,       -- how much this user contributed
  FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(expense_id, user_id)
);

-------------------------------------

CREATE TYPE expense_category AS ENUM ('Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Healthcare', 'Other');