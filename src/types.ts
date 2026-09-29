export type UserRole = 'admin' | 'receptionist' | 'doctor' | 'pharmacist' | 'patient';

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  phone: string;
  email: string;
  created_at: string;
}

export interface Patient {
  id: string;
  patient_id: string; // e.g. HIMS/000001
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  emergency_contact: string;
  blood_group?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  genotype?: 'AA' | 'AS' | 'SS' | 'AC';
  photo?: string;
  created_at: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  phone: string;
  email: string;
  status: 'Active' | 'On Leave';
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string; // YYYY-MM-DD
  appointment_time: string; // e.g. 10:00 AM
  reason: string;
  status: 'Scheduled' | 'Waiting' | 'Completed' | 'Cancelled';
  created_at: string;
}

export interface Vitals {
  blood_pressure?: string; // e.g. 120/80 mmHg
  temperature?: string; // e.g. 36.8 °C
  pulse_rate?: string; // e.g. 72 bpm
  weight?: string; // e.g. 68 kg
  spo2?: string; // e.g. 98%
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id?: string;
  chief_complaint: string;
  symptoms: string;
  medical_history: string;
  diagnosis: string;
  treatment: string;
  doctor_notes: string;
  vitals?: Vitals;
  follow_up_date?: string;
  created_at: string;
}

export interface PrescriptionItem {
  id: string;
  drug_id: string;
  drug_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions: string;
}

export interface Prescription {
  id: string;
  prescription_id: string; // e.g. RX/000001
  patient_id: string;
  doctor_id: string;
  medical_record_id?: string;
  prescription_date: string;
  status: 'Pending' | 'Dispensed' | 'Cancelled';
  items: PrescriptionItem[];
}

export type InventoryStatus = 'AVAILABLE' | 'LOW STOCK' | 'OUT OF STOCK';

export interface Drug {
  id: string;
  drug_name: string;
  category: string;
  quantity: number;
  unit_price: number;
  expiry_date: string;
  supplier: string;
  low_stock_level: number;
  created_at: string;
}

export interface InventoryTransaction {
  id: string;
  drug_id: string;
  drug_name: string;
  transaction_type: 'STOCK_IN' | 'DISPENSING' | 'ADJUSTMENT';
  quantity: number;
  reference: string;
  performed_by: string;
  created_at: string;
}

export interface Dispensation {
  id: string;
  prescription_id: string;
  patient_id: string;
  pharmacist_id: string;
  dispensed_date: string;
  status: 'Dispensed';
}

export interface SystemActivity {
  id: string;
  user_name: string;
  role: UserRole;
  action: string;
  timestamp: string;
}
