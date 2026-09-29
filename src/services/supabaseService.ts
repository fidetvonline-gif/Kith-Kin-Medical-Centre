import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  User,
  Patient,
  Doctor,
  Appointment,
  MedicalRecord,
  Prescription,
  Drug,
  InventoryTransaction,
  SystemActivity
} from '../types';

export const supabaseService = {
  isConfigured: isSupabaseConfigured,

  // --- USERS ---
  async fetchUsers(): Promise<User[] | null> {
    if (!supabase) return null;
    const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: true });
    if (error) {
      console.warn('Supabase fetchUsers error:', error.message);
      return null;
    }
    return data as User[];
  },

  async insertUser(user: User): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from('users').upsert(user);
    if (error) {
      console.warn('Supabase insertUser error:', error.message);
      return false;
    }
    return true;
  },

  // --- PATIENTS ---
  async fetchPatients(): Promise<Patient[] | null> {
    if (!supabase) return null;
    const { data, error } = await supabase.from('patients').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase fetchPatients error:', error.message);
      return null;
    }
    return data as Patient[];
  },

  async insertPatient(patient: Patient): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from('patients').upsert(patient);
    if (error) {
      console.warn('Supabase insertPatient error:', error.message);
      return false;
    }
    return true;
  },

  async updatePatient(id: string, updates: Partial<Patient>): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from('patients').update(updates).eq('id', id);
    if (error) {
      console.warn('Supabase updatePatient error:', error.message);
      return false;
    }
    return true;
  },

  // --- DOCTORS ---
  async fetchDoctors(): Promise<Doctor[] | null> {
    if (!supabase) return null;
    const { data, error } = await supabase.from('doctors').select('*').order('created_at', { ascending: true });
    if (error) {
      console.warn('Supabase fetchDoctors error:', error.message);
      return null;
    }
    return data as Doctor[];
  },

  // --- APPOINTMENTS ---
  async fetchAppointments(): Promise<Appointment[] | null> {
    if (!supabase) return null;
    const { data, error } = await supabase.from('appointments').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase fetchAppointments error:', error.message);
      return null;
    }
    return data as Appointment[];
  },

  async insertAppointment(appointment: Appointment): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from('appointments').upsert(appointment);
    if (error) {
      console.warn('Supabase insertAppointment error:', error.message);
      return false;
    }
    return true;
  },

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
    if (error) {
      console.warn('Supabase updateAppointmentStatus error:', error.message);
      return false;
    }
    return true;
  },

  // --- MEDICAL RECORDS ---
  async fetchMedicalRecords(): Promise<MedicalRecord[] | null> {
    if (!supabase) return null;
    const { data, error } = await supabase.from('medical_records').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase fetchMedicalRecords error:', error.message);
      return null;
    }
    return data as MedicalRecord[];
  },

  async insertMedicalRecord(record: MedicalRecord): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from('medical_records').upsert(record);
    if (error) {
      console.warn('Supabase insertMedicalRecord error:', error.message);
      return false;
    }
    return true;
  },

  // --- PRESCRIPTIONS ---
  async fetchPrescriptions(): Promise<Prescription[] | null> {
    if (!supabase) return null;
    const { data, error } = await supabase.from('prescriptions').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase fetchPrescriptions error:', error.message);
      return null;
    }
    return data as Prescription[];
  },

  async insertPrescription(prescription: Prescription): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from('prescriptions').upsert(prescription);
    if (error) {
      console.warn('Supabase insertPrescription error:', error.message);
      return false;
    }
    return true;
  },

  async updatePrescriptionStatus(id: string, status: Prescription['status']): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from('prescriptions').update({ status }).eq('id', id);
    if (error) {
      console.warn('Supabase updatePrescriptionStatus error:', error.message);
      return false;
    }
    return true;
  },

  // --- DRUGS & INVENTORY ---
  async fetchDrugs(): Promise<Drug[] | null> {
    if (!supabase) return null;
    const { data, error } = await supabase.from('drugs').select('*').order('created_at', { ascending: true });
    if (error) {
      console.warn('Supabase fetchDrugs error:', error.message);
      return null;
    }
    return data as Drug[];
  },

  async insertDrug(drug: Drug): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from('drugs').upsert(drug);
    if (error) {
      console.warn('Supabase insertDrug error:', error.message);
      return false;
    }
    return true;
  },

  async updateDrugQuantity(id: string, newQuantity: number): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from('drugs').update({ quantity: newQuantity }).eq('id', id);
    if (error) {
      console.warn('Supabase updateDrugQuantity error:', error.message);
      return false;
    }
    return true;
  },

  // --- INVENTORY TRANSACTIONS ---
  async fetchInventoryTransactions(): Promise<InventoryTransaction[] | null> {
    if (!supabase) return null;
    const { data, error } = await supabase.from('inventory_transactions').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase fetchInventoryTransactions error:', error.message);
      return null;
    }
    return data as InventoryTransaction[];
  },

  async insertInventoryTransaction(tx: InventoryTransaction): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from('inventory_transactions').upsert(tx);
    if (error) {
      console.warn('Supabase insertInventoryTransaction error:', error.message);
      return false;
    }
    return true;
  },

  // --- SYSTEM ACTIVITIES ---
  async fetchActivities(): Promise<SystemActivity[] | null> {
    if (!supabase) return null;
    const { data, error } = await supabase.from('system_activities').select('*').order('timestamp', { ascending: false });
    if (error) {
      console.warn('Supabase fetchActivities error:', error.message);
      return null;
    }
    return data as SystemActivity[];
  },

  async insertActivity(activity: SystemActivity): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from('system_activities').upsert(activity);
    if (error) {
      console.warn('Supabase insertActivity error:', error.message);
      return false;
    }
    return true;
  }
};
