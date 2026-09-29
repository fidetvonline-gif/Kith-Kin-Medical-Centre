import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length > 20
  );
};

// Initialize the Supabase client
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * SQL Schema migration script for Supabase SQL Editor:
 * Run this in your Supabase Dashboard -> SQL Editor to initialize all HIMS tables.
 */
export const HIMS_SUPABASE_SQL_SCHEMA = `
-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PATIENTS TABLE
CREATE TABLE IF NOT EXISTS patients (
  id TEXT PRIMARY KEY,
  patient_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  emergency_contact TEXT NOT NULL,
  blood_group TEXT,
  genotype TEXT,
  photo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DOCTORS TABLE
CREATE TABLE IF NOT EXISTS doctors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
  doctor_id TEXT NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'Scheduled',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MEDICAL RECORDS TABLE
CREATE TABLE IF NOT EXISTS medical_records (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
  doctor_id TEXT NOT NULL,
  appointment_id TEXT,
  chief_complaint TEXT NOT NULL,
  symptoms TEXT NOT NULL,
  medical_history TEXT,
  diagnosis TEXT NOT NULL,
  treatment TEXT NOT NULL,
  doctor_notes TEXT,
  vitals JSONB,
  follow_up_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PRESCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS prescriptions (
  id TEXT PRIMARY KEY,
  prescription_id TEXT UNIQUE NOT NULL,
  patient_id TEXT NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
  doctor_id TEXT NOT NULL,
  medical_record_id TEXT,
  prescription_date DATE NOT NULL,
  status TEXT DEFAULT 'Pending',
  items JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. DRUGS (PHARMACY INVENTORY) TABLE
CREATE TABLE IF NOT EXISTS drugs (
  id TEXT PRIMARY KEY,
  drug_name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  unit_price NUMERIC NOT NULL DEFAULT 0,
  expiry_date DATE NOT NULL,
  supplier TEXT NOT NULL,
  low_stock_level INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. INVENTORY TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id TEXT PRIMARY KEY,
  drug_id TEXT NOT NULL REFERENCES drugs(id) ON DELETE CASCADE,
  drug_name TEXT NOT NULL,
  transaction_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  reference TEXT NOT NULL,
  performed_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SYSTEM AUDIT ACTIVITIES TABLE
CREATE TABLE IF NOT EXISTS system_activities (
  id TEXT PRIMARY KEY,
  user_name TEXT NOT NULL,
  role TEXT NOT NULL,
  action TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
`;
