import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Patient,
  Doctor,
  Appointment,
  MedicalRecord,
  Prescription,
  Drug,
  InventoryTransaction,
  SystemActivity,
  UserRole
} from '../types';
import {
  initialUsers,
  initialPatients,
  initialDoctors,
  initialAppointments,
  initialMedicalRecords,
  initialPrescriptions,
  initialDrugs,
  initialInventoryTransactions,
  initialActivities
} from '../data/initialData';

interface HimsContextType {
  currentUser: User | null;
  currentRole: UserRole | null;
  activePatient: Patient | null;
  login: (username: string, role: UserRole) => boolean;
  patientLogin: (patientIdOrPhone: string) => boolean;
  logout: () => void;
  switchRoleQuick: (role: UserRole) => void;

  users: User[];
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  prescriptions: Prescription[];
  drugs: Drug[];
  inventoryTransactions: InventoryTransaction[];
  activities: SystemActivity[];

  // Actions
  registerPatient: (patientData: Omit<Patient, 'id' | 'patient_id' | 'created_at'>) => Patient;
  updatePatient: (id: string, updatedData: Partial<Patient>) => void;
  bookAppointment: (appointmentData: Omit<Appointment, 'id' | 'created_at' | 'status'>) => { success: boolean; message: string };
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  
  createConsultation: (
    consultationData: Omit<MedicalRecord, 'id' | 'created_at'>,
    prescriptionItems?: Array<{
      drug_id: string;
      drug_name: string;
      dosage: string;
      frequency: string;
      duration: string;
      quantity: number;
      instructions: string;
    }>
  ) => void;

  dispensePrescription: (prescriptionId: string) => { success: boolean; message: string };
  addNewDrug: (drugData: Omit<Drug, 'id' | 'created_at'>) => void;
  addDrugStock: (drugId: string, quantityToAdd: number, reference: string) => void;
  
  addUser: (userData: Omit<User, 'id' | 'created_at'>) => void;
  backupDatabase: () => string;
  restoreDatabase: (jsonData: string) => boolean;
  getDrugStatus: (drug: Drug) => 'AVAILABLE' | 'LOW STOCK' | 'OUT OF STOCK';
  
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const HimsContext = createContext<HimsContextType | undefined>(undefined);

export const HimsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hims_current_user');
    return saved ? JSON.parse(saved) : initialUsers[2]; // Default to Dr. John Udo (Doctor)
  });

  const [activePatient, setActivePatient] = useState<Patient | null>(() => {
    const saved = localStorage.getItem('hims_active_patient');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('hims_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('hims_patients');
    return saved ? JSON.parse(saved) : initialPatients;
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('hims_doctors');
    return saved ? JSON.parse(saved) : initialDoctors;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('hims_appointments');
    return saved ? JSON.parse(saved) : initialAppointments;
  });

  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(() => {
    const saved = localStorage.getItem('hims_medical_records');
    return saved ? JSON.parse(saved) : initialMedicalRecords;
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    const saved = localStorage.getItem('hims_prescriptions');
    return saved ? JSON.parse(saved) : initialPrescriptions;
  });

  const [drugs, setDrugs] = useState<Drug[]>(() => {
    const saved = localStorage.getItem('hims_drugs');
    return saved ? JSON.parse(saved) : initialDrugs;
  });

  const [inventoryTransactions, setInventoryTransactions] = useState<InventoryTransaction[]>(() => {
    const saved = localStorage.getItem('hims_inventory_transactions');
    return saved ? JSON.parse(saved) : initialInventoryTransactions;
  });

  const [activities, setActivities] = useState<SystemActivity[]>(() => {
    const saved = localStorage.getItem('hims_activities');
    return saved ? JSON.parse(saved) : initialActivities;
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('hims_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('hims_active_patient', JSON.stringify(activePatient));
  }, [activePatient]);

  useEffect(() => {
    localStorage.setItem('hims_users', JSON.stringify(users));
    localStorage.setItem('hims_patients', JSON.stringify(patients));
    localStorage.setItem('hims_doctors', JSON.stringify(doctors));
    localStorage.setItem('hims_appointments', JSON.stringify(appointments));
    localStorage.setItem('hims_medical_records', JSON.stringify(medicalRecords));
    localStorage.setItem('hims_prescriptions', JSON.stringify(prescriptions));
    localStorage.setItem('hims_drugs', JSON.stringify(drugs));
    localStorage.setItem('hims_inventory_transactions', JSON.stringify(inventoryTransactions));
    localStorage.setItem('hims_activities', JSON.stringify(activities));
  }, [users, patients, doctors, appointments, medicalRecords, prescriptions, drugs, inventoryTransactions, activities]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const logActivity = (action: string) => {
    if (!currentUser) return;
    const newAct: SystemActivity = {
      id: 'act-' + Date.now(),
      user_name: currentUser.name,
      role: currentUser.role,
      action,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const login = (username: string, role: UserRole) => {
    if (role === 'patient') {
      return patientLogin(username);
    }

    const found = users.find((u) => u.username.toLowerCase() === username.toLowerCase() && u.role === role);
    if (found) {
      setCurrentUser(found);
      setActivePatient(null);
      showToast(`Welcome back, ${found.name}! (${role.toUpperCase()})`, 'success');
      logActivity(`Logged in as ${role}`);
      return true;
    }
    // Fallback permit for demo
    const fallbackUser = users.find((u) => u.role === role) || users[0];
    setCurrentUser(fallbackUser);
    setActivePatient(null);
    showToast(`Logged in successfully as ${role}`, 'success');
    logActivity(`Logged in as ${role}`);
    return true;
  };

  const patientLogin = (patientIdOrPhone: string) => {
    const trimmed = patientIdOrPhone.trim().toLowerCase();
    const foundPatient = patients.find(
      (p) => p.patient_id.toLowerCase() === trimmed || p.phone.toLowerCase() === trimmed
    );

    if (foundPatient) {
      const patientUser: User = {
        id: foundPatient.id,
        name: `${foundPatient.first_name} ${foundPatient.last_name}`,
        username: foundPatient.patient_id,
        role: 'patient',
        phone: foundPatient.phone,
        email: foundPatient.email,
        created_at: foundPatient.created_at
      };

      setCurrentUser(patientUser);
      setActivePatient(foundPatient);
      showToast(`Welcome to your Patient Health Portal, ${foundPatient.first_name}!`, 'success');
      logActivity(`Patient ${foundPatient.patient_id} signed into Patient Portal`);
      return true;
    }

    // Default fallback to first patient if user entered anything in demo
    const fallback = patients[0];
    if (fallback) {
      const patientUser: User = {
        id: fallback.id,
        name: `${fallback.first_name} ${fallback.last_name}`,
        username: fallback.patient_id,
        role: 'patient',
        phone: fallback.phone,
        email: fallback.email,
        created_at: fallback.created_at
      };
      setCurrentUser(patientUser);
      setActivePatient(fallback);
      showToast(`Signed into Patient Portal for ${fallback.first_name} ${fallback.last_name}`, 'success');
      return true;
    }

    showToast('Patient record not found. Please verify your Patient ID or Phone Number.', 'error');
    return false;
  };

  const logout = () => {
    logActivity('Logged out of system');
    setCurrentUser(null);
    setActivePatient(null);
    showToast('Logged out successfully', 'info');
  };

  const switchRoleQuick = (role: UserRole) => {
    if (role === 'patient') {
      const pat = patients[0];
      if (pat) {
        patientLogin(pat.patient_id);
      }
      return;
    }

    const found = users.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
      setActivePatient(null);
      showToast(`Switched portal to ${role.toUpperCase()} (${found.name})`, 'success');
      logActivity(`Switched session to role ${role}`);
    }
  };

  const registerPatient = (patientData: Omit<Patient, 'id' | 'patient_id' | 'created_at'>) => {
    const nextNum = patients.length + 1;
    const patient_id = `HIMS/${String(nextNum).padStart(6, '0')}`;
    const newPatient: Patient = {
      ...patientData,
      id: 'p-' + Date.now(),
      patient_id,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setPatients((prev) => [newPatient, ...prev]);
    showToast(`Patient registered successfully with ID: ${patient_id}`, 'success');
    logActivity(`Registered new patient ${newPatient.first_name} ${newPatient.last_name} (${patient_id})`);
    return newPatient;
  };

  const updatePatient = (id: string, updatedData: Partial<Patient>) => {
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p)));
    showToast('Patient information updated successfully', 'success');
    logActivity(`Updated patient record ${id}`);
  };

  const bookAppointment = (appointmentData: Omit<Appointment, 'id' | 'created_at' | 'status'>) => {
    // Check time slot clash for same doctor on same date and time
    const clash = appointments.find(
      (a) =>
        a.doctor_id === appointmentData.doctor_id &&
        a.appointment_date === appointmentData.appointment_date &&
        a.appointment_time === appointmentData.appointment_time &&
        a.status !== 'Cancelled' &&
        a.status !== 'Completed'
    );

    if (clash) {
      showToast('Doctor is already booked for this date and time slot!', 'error');
      return { success: false, message: 'Doctor is already booked for this date and time slot!' };
    }

    const newApp: Appointment = {
      ...appointmentData,
      id: 'app-' + Date.now(),
      status: 'Scheduled',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAppointments((prev) => [newApp, ...prev]);
    showToast('Appointment booked successfully!', 'success');
    logActivity(`Booked appointment for patient ${newApp.patient_id} with doctor ${newApp.doctor_id}`);
    return { success: true, message: 'Appointment booked successfully!' };
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    showToast(`Appointment status updated to ${status}`, 'success');
    logActivity(`Updated appointment ${id} status to ${status}`);
  };

  const createConsultation = (
    consultationData: Omit<MedicalRecord, 'id' | 'created_at'>,
    prescriptionItems?: Array<{
      drug_id: string;
      drug_name: string;
      dosage: string;
      frequency: string;
      duration: string;
      quantity: number;
      instructions: string;
    }>
  ) => {
    const newRecord: MedicalRecord = {
      ...consultationData,
      id: 'med-' + Date.now(),
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    setMedicalRecords((prev) => [newRecord, ...prev]);

    // If appointment id exists, update its status to Completed
    if (consultationData.appointment_id) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === consultationData.appointment_id ? { ...a, status: 'Completed' } : a))
      );
    }

    // If prescription items were added, create prescription
    if (prescriptionItems && prescriptionItems.length > 0) {
      const rxNumber = prescriptions.length + 1;
      const prescription_id = `RX/${String(rxNumber).padStart(6, '0')}`;
      const newPrescription: Prescription = {
        id: 'rx-' + Date.now(),
        prescription_id,
        patient_id: consultationData.patient_id,
        doctor_id: consultationData.doctor_id,
        medical_record_id: newRecord.id,
        prescription_date: new Date().toISOString().substring(0, 10),
        status: 'Pending',
        items: prescriptionItems.map((item, idx) => ({
          ...item,
          id: 'rxi-' + Date.now() + '-' + idx
        }))
      };
      setPrescriptions((prev) => [newPrescription, ...prev]);
      showToast(`Consultation saved & Prescription ${prescription_id} created successfully!`, 'success');
      logActivity(
        `Recorded consultation & generated prescription ${prescription_id} for patient ${consultationData.patient_id}`
      );
    } else {
      showToast('Consultation recorded successfully!', 'success');
      logActivity(`Recorded consultation for patient ${consultationData.patient_id}`);
    }
  };

  const getDrugStatus = (drug: Drug): 'AVAILABLE' | 'LOW STOCK' | 'OUT OF STOCK' => {
    if (drug.quantity <= 0) return 'OUT OF STOCK';
    if (drug.quantity <= drug.low_stock_level) return 'LOW STOCK';
    return 'AVAILABLE';
  };

  const dispensePrescription = (prescriptionId: string) => {
    const rx = prescriptions.find((p) => p.id === prescriptionId || p.prescription_id === prescriptionId);
    if (!rx) {
      return { success: false, message: 'Prescription not found.' };
    }
    if (rx.status === 'Dispensed') {
      return { success: false, message: 'Prescription has already been dispensed.' };
    }

    // Check if sufficient stock for all items
    for (const item of rx.items) {
      const drug = drugs.find((d) => d.id === item.drug_id);
      if (!drug) {
        return { success: false, message: `Drug ${item.drug_name} not found in inventory.` };
      }
      if (drug.quantity < item.quantity) {
        return {
          success: false,
          message: `Insufficient stock for ${drug.drug_name}. Available: ${drug.quantity}, Required: ${item.quantity}.`
        };
      }
    }

    // Deduct stock and create transactions
    const updatedDrugs = [...drugs];
    const newTransactions: InventoryTransaction[] = [];

    for (const item of rx.items) {
      const drugIdx = updatedDrugs.findIndex((d) => d.id === item.drug_id);
      if (drugIdx !== -1) {
        updatedDrugs[drugIdx] = {
          ...updatedDrugs[drugIdx],
          quantity: updatedDrugs[drugIdx].quantity - item.quantity
        };

        newTransactions.push({
          id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
          drug_id: item.drug_id,
          drug_name: item.drug_name,
          transaction_type: 'DISPENSING',
          quantity: item.quantity,
          reference: `${rx.prescription_id} dispensed to ${rx.patient_id}`,
          performed_by: currentUser?.name || 'Pharmacist',
          created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
        });
      }
    }

    setDrugs(updatedDrugs);
    setInventoryTransactions((prev) => [...newTransactions, ...prev]);
    setPrescriptions((prev) => prev.map((p) => (p.id === rx.id ? { ...p, status: 'Dispensed' } : p)));

    showToast(`Prescription ${rx.prescription_id} dispensed successfully & stock updated!`, 'success');
    logActivity(`Dispensed prescription ${rx.prescription_id} for patient ${rx.patient_id}`);
    return { success: true, message: 'Prescription dispensed successfully.' };
  };

  const addNewDrug = (drugData: Omit<Drug, 'id' | 'created_at'>) => {
    const newDrug: Drug = {
      ...drugData,
      id: 'd-' + Date.now(),
      created_at: new Date().toISOString().substring(0, 10)
    };
    setDrugs((prev) => [newDrug, ...prev]);

    // Log initial stock in transaction
    const newTx: InventoryTransaction = {
      id: 'tx-' + Date.now(),
      drug_id: newDrug.id,
      drug_name: newDrug.drug_name,
      transaction_type: 'STOCK_IN',
      quantity: newDrug.quantity,
      reference: 'Initial Stock Addition',
      performed_by: currentUser?.name || 'Admin',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setInventoryTransactions((prev) => [newTx, ...prev]);

    showToast(`New drug "${newDrug.drug_name}" added to inventory successfully!`, 'success');
    logActivity(`Added new drug ${newDrug.drug_name} (${newDrug.quantity} units)`);
  };

  const addDrugStock = (drugId: string, quantityToAdd: number, reference: string) => {
    const drug = drugs.find((d) => d.id === drugId);
    if (!drug) return;

    setDrugs((prev) => prev.map((d) => (d.id === drugId ? { ...d, quantity: d.quantity + quantityToAdd } : d)));

    const newTx: InventoryTransaction = {
      id: 'tx-' + Date.now(),
      drug_id: drug.id,
      drug_name: drug.drug_name,
      transaction_type: 'STOCK_IN',
      quantity: quantityToAdd,
      reference: reference || 'Stock Restock',
      performed_by: currentUser?.name || 'Pharmacist',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setInventoryTransactions((prev) => [newTx, ...prev]);
    showToast(`Added ${quantityToAdd} units of ${drug.drug_name} successfully!`, 'success');
    logActivity(`Restocked ${quantityToAdd} units of ${drug.drug_name}`);
  };

  const addUser = (userData: Omit<User, 'id' | 'created_at'>) => {
    const newUser: User = {
      ...userData,
      id: 'u-' + Date.now(),
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setUsers((prev) => [...prev, newUser]);
    showToast(`User ${newUser.name} created successfully!`, 'success');
    logActivity(`Created new user account for ${newUser.name} (${newUser.role})`);
  };

  const backupDatabase = () => {
    const backupData = {
      version: '1.0',
      system: 'Kith & Kin HIMS',
      timestamp: new Date().toISOString(),
      users,
      patients,
      doctors,
      appointments,
      medicalRecords,
      prescriptions,
      drugs,
      inventoryTransactions,
      activities
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    showToast('Database backup generated successfully!', 'success');
    logActivity('Generated database backup JSON export');
    return jsonStr;
  };

  const restoreDatabase = (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.patients && data.drugs && data.prescriptions) {
        if (data.users) setUsers(data.users);
        if (data.patients) setPatients(data.patients);
        if (data.doctors) setDoctors(data.doctors);
        if (data.appointments) setAppointments(data.appointments);
        if (data.medicalRecords) setMedicalRecords(data.medicalRecords);
        if (data.prescriptions) setPrescriptions(data.prescriptions);
        if (data.drugs) setDrugs(data.drugs);
        if (data.inventoryTransactions) setInventoryTransactions(data.inventoryTransactions);
        if (data.activities) setActivities(data.activities);
        showToast('Database restored successfully from backup!', 'success');
        logActivity('Restored database from JSON backup file');
        return true;
      }
      showToast('Invalid backup file format.', 'error');
      return false;
    } catch {
      showToast('Error parsing JSON backup file.', 'error');
      return false;
    }
  };

  return (
    <HimsContext.Provider
      value={{
        currentUser,
        currentRole: currentUser?.role || null,
        activePatient,
        login,
        patientLogin,
        logout,
        switchRoleQuick,
        users,
        patients,
        doctors,
        appointments,
        medicalRecords,
        prescriptions,
        drugs,
        inventoryTransactions,
        activities,
        registerPatient,
        updatePatient,
        bookAppointment,
        updateAppointmentStatus,
        createConsultation,
        dispensePrescription,
        addNewDrug,
        addDrugStock,
        addUser,
        backupDatabase,
        restoreDatabase,
        getDrugStatus,
        toast,
        showToast
      }}
    >
      {children}
    </HimsContext.Provider>
  );
};

export const useHims = () => {
  const context = useContext(HimsContext);
  if (!context) {
    throw new Error('useHims must be used within a HimsProvider');
  }
  return context;
};
