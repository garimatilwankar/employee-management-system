-- Employee Management System - inferred schema
-- PostgreSQL (Neon) compatible

-- USERS (auth)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Admin',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- DEPARTMENTS
CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  department_name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- SKILLS
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  skill_name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- EMPLOYEE PROFILES
-- NOTE: backend queries reference columns: user_id, department_id, phone, address, designation, salary
CREATE TABLE IF NOT EXISTS employee_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
  phone TEXT,
  address TEXT,
  designation TEXT,
  salary NUMERIC(12,2),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- LEAVE APPLICATIONS
CREATE TABLE IF NOT EXISTS leave_applications (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employee_profiles(id) ON DELETE CASCADE,
  leave_type TEXT NOT NULL,
  from_date TIMESTAMP NOT NULL,
  to_date TIMESTAMP NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ASSETS (already partially inferred; aligns with backend SQL)
CREATE TABLE IF NOT EXISTS assets (
  id SERIAL PRIMARY KEY,
  asset_name TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  serial_number TEXT UNIQUE NOT NULL,
  assigned_to INTEGER REFERENCES employee_profiles(id) ON DELETE SET NULL,
  assigned_date TIMESTAMP,
  return_date TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'Available'
);

-- AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Optional: data integrity helpers (safe even if unused)
CREATE INDEX IF NOT EXISTS idx_employee_profiles_department_id ON employee_profiles(department_id);
CREATE INDEX IF NOT EXISTS idx_leave_applications_employee_id ON leave_applications(employee_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

