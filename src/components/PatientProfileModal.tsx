import React from 'react';
import { useHims } from '../context/HimsContext';
import { Patient } from '../types';
import { X, User, Phone, Mail, MapPin, Calendar, Heart, FileText, Pill, Clock } from 'lucide-react';

interface PatientProfileModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenConsultation?: (patientId: string) => void;
}

export const PatientProfileModal: React.FC<PatientProfileModalProps> = ({ patient, isOpen, onClose, onOpenConsultation }) => {
  const { appointments, medicalRecords, prescriptions, doctors } = useHims();

  if (!isOpen || !patient) return null;

  const patientAppointments = appointments.filter(a => a.patient_id === patient.patient_id);
  const patientRecords = medicalRecords.filter(m => m.patient_id === patient.patient_id);
  const patientPrescriptions = prescriptions.filter(p => p.patient_id === patient.patient_id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
              {patient.first_name[0]}{patient.last_name[0]}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-white">{patient.first_name} {patient.last_name}</h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-900/50 border border-emerald-700 text-emerald-300 text-xs font-mono font-semibold">
                  {patient.patient_id}
                </span>
              </div>
              <p className="text-xs text-slate-400">Registered: {patient.created_at}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {onOpenConsultation && (
              <button
                onClick={() => {
                  onClose();
                  onOpenConsultation(patient.patient_id);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" /> Start Consultation
              </button>
            )}
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Personal Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-start space-x-3">
              <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Date of Birth / Gender</p>
                <p className="text-sm font-semibold text-slate-200">{patient.date_of_birth} ({patient.gender})</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Phone className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Phone Number</p>
                <p className="text-sm font-semibold text-slate-200">{patient.phone}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Mail className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Email Address</p>
                <p className="text-sm font-semibold text-slate-200">{patient.email || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Address</p>
                <p className="text-sm font-semibold text-slate-200">{patient.address}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 sm:col-span-2">
              <Heart className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Emergency Contact</p>
                <p className="text-sm font-semibold text-slate-200">{patient.emergency_contact}</p>
              </div>
            </div>
          </div>

          {/* Medical History Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" /> Medical History & Consultation Records ({patientRecords.length})
            </h4>
            {patientRecords.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-4 bg-slate-950/50 rounded-xl border border-slate-800">No medical consultations recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {patientRecords.map(rec => {
                  const doc = doctors.find(d => d.id === rec.doctor_id);
                  return (
                    <div key={rec.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                        <span className="font-semibold text-emerald-400">Diagnosis: {rec.diagnosis}</span>
                        <span>Dr. {doc?.name || 'General Doctor'} • {rec.created_at}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400 font-medium">Chief Complaint:</span>
                          <p className="text-slate-200 mt-0.5">{rec.chief_complaint}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Symptoms / History:</span>
                          <p className="text-slate-200 mt-0.5">{rec.symptoms} | {rec.medical_history}</p>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-slate-400 font-medium">Treatment & Doctor Notes:</span>
                          <p className="text-slate-200 mt-0.5">{rec.treatment} — {rec.doctor_notes}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Appointments History */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" /> Appointments History ({patientAppointments.length})
            </h4>
            {patientAppointments.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-4 bg-slate-950/50 rounded-xl border border-slate-800">No appointments scheduled.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {patientAppointments.map(app => {
                  const doc = doctors.find(d => d.id === app.doctor_id);
                  const statusColors: Record<string, string> = {
                    Scheduled: 'bg-blue-900/50 text-blue-300 border-blue-700',
                    Waiting: 'bg-amber-900/50 text-amber-300 border-amber-700',
                    Completed: 'bg-emerald-900/50 text-emerald-300 border-emerald-700',
                    Cancelled: 'bg-rose-900/50 text-rose-300 border-rose-700'
                  };
                  return (
                    <div key={app.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-white">{app.appointment_date} at {app.appointment_time}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Dr. {doc?.name || 'Doctor'} • {app.reason}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${statusColors[app.status]}`}>
                        {app.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Prescriptions & Pharmacy History */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Pill className="w-4 h-4 text-amber-400" /> Prescriptions & Pharmacy History ({patientPrescriptions.length})
            </h4>
            {patientPrescriptions.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-4 bg-slate-950/50 rounded-xl border border-slate-800">No prescriptions found.</p>
            ) : (
              <div className="space-y-3">
                {patientPrescriptions.map(rx => (
                  <div key={rx.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                      <span className="font-bold text-amber-400">{rx.prescription_id}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400">{rx.prescription_date}</span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${rx.status === 'Dispensed' ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700' : 'bg-amber-900/50 text-amber-300 border border-amber-700'}`}>
                          {rx.status}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {rx.items.map(item => (
                        <div key={item.id} className="text-xs flex justify-between items-center py-1 border-b border-slate-900 last:border-0">
                          <span className="font-medium text-slate-200">• {item.drug_name} ({item.dosage})</span>
                          <span className="text-slate-400">{item.frequency} for {item.duration} (Qty: {item.quantity})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl text-sm transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
