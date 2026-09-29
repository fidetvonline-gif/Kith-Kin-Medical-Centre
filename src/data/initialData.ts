import { User, Patient, Doctor, Appointment, MedicalRecord, Prescription, Drug, InventoryTransaction, SystemActivity } from '../types';

export const initialUsers: User[] = [
  {
    id: 'u-1',
    name: 'Admin Principal',
    username: 'admin',
    role: 'admin',
    phone: '08031112233',
    email: 'admin@kithandkin.org',
    created_at: '2026-01-10 08:00:00'
  },
  {
    id: 'u-2',
    name: 'Grace Okon',
    username: 'reception',
    role: 'receptionist',
    phone: '08052223344',
    email: 'grace.okon@kithandkin.org',
    created_at: '2026-01-15 09:30:00'
  },
  {
    id: 'u-3',
    name: 'Dr. John Udo',
    username: 'doctor',
    role: 'doctor',
    phone: '08023334455',
    email: 'dr.john@kithandkin.org',
    created_at: '2026-01-10 08:30:00'
  },
  {
    id: 'u-4',
    name: 'Aniefiok Akpan',
    username: 'pharmacist',
    role: 'pharmacist',
    phone: '08074445566',
    email: 'aniefiok.pharm@kithandkin.org',
    created_at: '2026-01-12 10:00:00'
  }
];

export const initialDoctors: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. John Udo',
    specialization: 'General Practitioner',
    phone: '08023334455',
    email: 'dr.john@kithandkin.org',
    status: 'Active',
    created_at: '2026-01-10'
  },
  {
    id: 'doc-2',
    name: 'Dr. (Mrs.) Idorenyin Ekong',
    specialization: 'Paediatrician',
    phone: '08034445566',
    email: 'dr.idorenyin@kithandkin.org',
    status: 'Active',
    created_at: '2026-01-10'
  },
  {
    id: 'doc-3',
    name: 'Dr. Ekerette Essien',
    specialization: 'Medical Officer',
    phone: '08095556677',
    email: 'dr.ekerette@kithandkin.org',
    status: 'Active',
    created_at: '2026-01-12'
  }
];

export const initialPatients: Patient[] = [
  {
    id: 'p-1',
    patient_id: 'HIMS/000001',
    first_name: 'Thompson',
    last_name: 'Udeme',
    date_of_birth: '2000-04-12',
    gender: 'Male',
    phone: '08012345678',
    email: 'thompson.udeme@gmail.com',
    address: 'No. 14 Uyo Road, Ikot Ekpene',
    emergency_contact: 'Elder Udeme (Father) - 08087654321',
    created_at: '2026-09-28 09:15:00'
  },
  {
    id: 'p-2',
    patient_id: 'HIMS/000002',
    first_name: 'John',
    last_name: 'Peter',
    date_of_birth: '1995-08-22',
    gender: 'Male',
    phone: '08023456789',
    email: 'john.peter@yahoo.com',
    address: 'Ibo Hall Quarters, Ikot Ekpene',
    emergency_contact: 'Mary Peter (Wife) - 08098765432',
    created_at: '2026-09-28 10:30:00'
  },
  {
    id: 'p-3',
    patient_id: 'HIMS/000003',
    first_name: 'Mary',
    last_name: 'James',
    date_of_birth: '1988-11-05',
    gender: 'Female',
    phone: '08034567890',
    email: 'mary.james@outlook.com',
    address: 'Stadium Road, Ikot Ekpene',
    emergency_contact: 'James Okon (Brother) - 08011223344',
    created_at: '2026-09-29 08:00:00'
  }
];

export const initialDrugs: Drug[] = [
  {
    id: 'd-1',
    drug_name: 'Paracetamol',
    category: 'Analgesic / Antipyretic',
    quantity: 150,
    unit_price: 150,
    expiry_date: '2028-06-30',
    supplier: 'May & Baker Pharma Ltd',
    low_stock_level: 20,
    created_at: '2026-01-10'
  },
  {
    id: 'd-2',
    drug_name: 'Amoxicillin',
    category: 'Antibiotic',
    quantity: 8,
    unit_price: 500,
    expiry_date: '2027-12-15',
    supplier: 'Emzor Pharmaceuticals',
    low_stock_level: 15,
    created_at: '2026-01-10'
  },
  {
    id: 'd-3',
    drug_name: 'Artemether-Lumefantrine (Coartem)',
    category: 'Antimalarial',
    quantity: 0,
    unit_price: 2200,
    expiry_date: '2027-09-10',
    supplier: 'Swiss Pharma Nigeria',
    low_stock_level: 10,
    created_at: '2026-01-12'
  },
  {
    id: 'd-4',
    drug_name: 'Ibuprofen',
    category: 'NSAID / Pain Relief',
    quantity: 85,
    unit_price: 200,
    expiry_date: '2028-03-20',
    supplier: 'Fidson Healthcare',
    low_stock_level: 25,
    created_at: '2026-01-12'
  },
  {
    id: 'd-5',
    drug_name: 'Vitamin C (Ascorbic Acid)',
    category: 'Vitamin / Supplement',
    quantity: 200,
    unit_price: 50,
    expiry_date: '2029-01-10',
    supplier: 'Juhel Nigeria Ltd',
    low_stock_level: 30,
    created_at: '2026-01-15'
  },
  {
    id: 'd-6',
    drug_name: 'Ciprofloxacin',
    category: 'Antibiotic',
    quantity: 12,
    unit_price: 800,
    expiry_date: '2027-08-11',
    supplier: 'Emzor Pharmaceuticals',
    low_stock_level: 15,
    created_at: '2026-01-15'
  },
  {
    id: 'd-7',
    drug_name: 'Omeprazole',
    category: 'Antacid / PPI',
    quantity: 45,
    unit_price: 600,
    expiry_date: '2028-05-18',
    supplier: 'May & Baker Pharma Ltd',
    low_stock_level: 10,
    created_at: '2026-01-18'
  }
];

export const initialAppointments: Appointment[] = [
  {
    id: 'app-1',
    patient_id: 'HIMS/000001',
    doctor_id: 'doc-1',
    appointment_date: '2026-09-29',
    appointment_time: '10:00 AM',
    reason: 'Severe headache and intermittent fever',
    status: 'Waiting',
    created_at: '2026-09-29 08:30:00'
  },
  {
    id: 'app-2',
    patient_id: 'HIMS/000002',
    doctor_id: 'doc-1',
    appointment_date: '2026-09-29',
    appointment_time: '10:30 AM',
    reason: 'General body pain and fatigue',
    status: 'Scheduled',
    created_at: '2026-09-29 08:45:00'
  },
  {
    id: 'app-3',
    patient_id: 'HIMS/000003',
    doctor_id: 'doc-2',
    appointment_date: '2026-09-29',
    appointment_time: '11:00 AM',
    reason: 'Routine postnatal checkup',
    status: 'Scheduled',
    created_at: '2026-09-29 09:00:00'
  }
];

export const initialMedicalRecords: MedicalRecord[] = [
  {
    id: 'med-1',
    patient_id: 'HIMS/000001',
    doctor_id: 'doc-1',
    appointment_id: 'app-old-1',
    chief_complaint: 'Stomach upset and nausea',
    symptoms: 'Abdominal cramps, vomiting once',
    medical_history: 'No known chronic illness',
    diagnosis: 'Acute Gastroenteritis',
    treatment: 'Rehydration therapy and antispasmodics',
    doctor_notes: 'Patient advised to take plenty of fluids and soft diet.',
    follow_up_date: '2026-10-05',
    created_at: '2026-09-20 11:30:00'
  }
];

export const initialPrescriptions: Prescription[] = [
  {
    id: 'rx-1',
    prescription_id: 'RX/000001',
    patient_id: 'HIMS/000001',
    doctor_id: 'doc-1',
    medical_record_id: 'med-1',
    prescription_date: '2026-09-20',
    status: 'Dispensed',
    items: [
      {
        id: 'rxi-1',
        drug_id: 'd-1',
        drug_name: 'Paracetamol',
        dosage: '500mg',
        frequency: '3 times daily',
        duration: '5 days',
        quantity: 15,
        instructions: 'Take after meals'
      },
      {
        id: 'rxi-2',
        drug_id: 'd-5',
        drug_name: 'Vitamin C (Ascorbic Acid)',
        dosage: '100mg',
        frequency: '1 daily',
        duration: '10 days',
        quantity: 10,
        instructions: 'Take in the morning'
      }
    ]
  }
];

export const initialInventoryTransactions: InventoryTransaction[] = [
  {
    id: 'tx-1',
    drug_id: 'd-1',
    drug_name: 'Paracetamol',
    transaction_type: 'STOCK_IN',
    quantity: 165,
    reference: 'Initial Batch Restock',
    performed_by: 'Admin Principal',
    created_at: '2026-01-10 09:00:00'
  },
  {
    id: 'tx-2',
    drug_id: 'd-1',
    drug_name: 'Paracetamol',
    transaction_type: 'DISPENSING',
    quantity: 15,
    reference: 'RX/000001 Dispensed to Thompson Udeme',
    performed_by: 'Aniefiok Akpan',
    created_at: '2026-09-20 12:00:00'
  }
];

export const initialActivities: SystemActivity[] = [
  {
    id: 'act-1',
    user_name: 'Grace Okon',
    role: 'receptionist',
    action: 'Registered new patient Thompson Udeme (HIMS/000001)',
    timestamp: '2026-09-28 09:15:00'
  },
  {
    id: 'act-2',
    user_name: 'Grace Okon',
    role: 'receptionist',
    action: 'Booked appointment for HIMS/000001 with Dr. John Udo',
    timestamp: '2026-09-29 08:30:00'
  },
  {
    id: 'act-3',
    user_name: 'Aniefiok Akpan',
    role: 'pharmacist',
    action: 'Dispensed prescription RX/000001 and updated stock',
    timestamp: '2026-09-20 12:00:00'
  }
];
