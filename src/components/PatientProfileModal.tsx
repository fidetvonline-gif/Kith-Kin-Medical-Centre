import React, { useState } from 'react';
import { useHims } from '../context/HimsContext';
import { Patient } from '../types';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  FileText,
  Pill,
  Clock,
  Printer,
  ShieldCheck,
  Activity
} from 'lucide-react';

interface PatientProfileModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenConsultation?: (patientId: string) => void;
}

export const PatientProfileModal: React.FC<PatientProfileModalProps> = ({
  patient,
  isOpen,
  onClose,
  onOpenConsultation
}) => {
  const { appointments, medicalRecords, prescriptions, doctors } = useHims();
  const [profileTab, setProfileTab] = useState<'consultations' | 'appointments' | 'prescriptions'>('consultations');

  if (!isOpen || !patient) return null;

  const patientAppointments = appointments.filter((a) => a.patient_id === patient.patient_id);
  const patientRecords = medicalRecords.filter((m) => m.patient_id === patient.patient_id);
  const patientPrescriptions = prescriptions.filter((p) => p.patient_id === patient.patient_id);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden my-6">
        {/* Patient EMR Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-10">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 border border-sky-400/30 flex items-center justify-center text-white font-bold text-base shadow-md">
              {patient.first_name[0]}
              {patient.last_name[0]}
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h3 className="text-lg font-bold text-white">
                  {patient.first_name} {patient.last_name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-md bg-sky-950/80 border border-sky-800/60 text-sky-300 text-xs font-mono font-bold">
                  {patient.patient_id}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Registration Date: {patient.created_at} • Gender: {patient.gender} • DOB: {patient.date_of_birth}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print EMR</span>
            </button>

            {onOpenConsultation && (
              <button
                onClick={() => {
                  onClose();
                  onOpenConsultation(patient.patient_id);
                }}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md border border-emerald-400/30 transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" /> Start Consultation
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Patient Bio Summary Card */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div className="flex items-start space-x-2.5">
              <Calendar className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">DOB / Age / Gender</p>
                <p className="text-xs font-bold text-slate-200 mt-0.5">
                  {patient.date_of_birth} ({patient.gender})
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <Phone className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Primary Phone</p>
                <p className="text-xs font-bold text-slate-200 mt-0.5 font-mono">{patient.phone}</p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <MapPin className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Address</p>
                <p className="text-xs font-semibold text-slate-200 mt-0.5 truncate">{patient.address}</p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <Heart className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Emergency Contact</p>
                <p className="text-xs font-semibold text-slate-200 mt-0.5 truncate">{patient.emergency_contact}</p>
              </div>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex space-x-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setProfileTab('consultations')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                profileTab === 'consultations'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Medical Consultations ({patientRecords.length})
            </button>
            <button
              onClick={() => setProfileTab('appointments')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                profileTab === 'appointments'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Appointments History ({patientAppointments.length})
            </button>
            <button
              onClick={() => setProfileTab('prescriptions')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                profileTab === 'prescriptions'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Prescriptions & Pharmacy History ({patientPrescriptions.length})
            </button>
          </div>

          {/* Tab 1: Consultations History */}
          {profileTab === 'consultations' && (
            <div className="space-y-3">
              {patientRecords.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800">
                  <FileText className="w-6 h-6 text-slate-600 mx-auto mb-1.5" />
                  <p className="text-xs text-slate-400">No medical consultations recorded yet for this patient.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {patientRecords.map((rec) => {
                    const doc = doctors.find((d) => d.id === rec.doctor_id);
                    return (
                      <div key={rec.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-slate-800/80 gap-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-emerald-400">
                              Diagnosis: {rec.diagnosis}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            Attending: <strong className="text-slate-200">Dr. {doc?.name || 'Physician'}</strong> • {rec.created_at}
                          </span>
                        </div>

                        {/* Vitals snapshot if available */}
                        {rec.vitals && (
                          <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                            {rec.vitals.blood_pressure && (
                              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                                BP: <strong className="text-emerald-400">{rec.vitals.blood_pressure}</strong>
                              </span>
                            )}
                            {rec.vitals.temperature && (
                              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                                Temp: <strong className="text-emerald-400">{rec.vitals.temperature}</strong>
                              </span>
                            )}
                            {rec.vitals.pulse_rate && (
                              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                                Pulse: <strong className="text-emerald-400">{rec.vitals.pulse_rate}</strong>
                              </span>
                            )}
                            {rec.vitals.weight && (
                              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                                Wt: <strong className="text-emerald-400">{rec.vitals.weight}</strong>
                              </span>
                            )}
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-slate-500 font-semibold uppercase text-[10px]">Chief Complaint</span>
                            <p className="text-slate-200 mt-0.5 font-medium">{rec.chief_complaint}</p>
                          </div>
                          <div>
                            <span className="text-slate-500 font-semibold uppercase text-[10px]">Presenting Symptoms</span>
                            <p className="text-slate-200 mt-0.5">{rec.symptoms}</p>
                          </div>
                          <div className="sm:col-span-2">
                            <span className="text-slate-500 font-semibold uppercase text-[10px]">Treatment Plan & Physician Notes</span>
                            <p className="text-slate-200 mt-0.5 leading-relaxed">
                              {rec.treatment} {rec.doctor_notes && `— ${rec.doctor_notes}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Appointments */}
          {profileTab === 'appointments' && (
            <div className="space-y-3">
              {patientAppointments.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800">
                  <Clock className="w-6 h-6 text-slate-600 mx-auto mb-1.5" />
                  <p className="text-xs text-slate-400">No appointments recorded for this patient.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {patientAppointments.map((app) => {
                    const doc = doctors.find((d) => d.id === app.doctor_id);
                    const statusStyles: Record<string, string> = {
                      Scheduled: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
                      Waiting: 'bg-amber-500/15 text-amber-300 border-amber-500/30 font-bold',
                      Completed: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
                      Cancelled: 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                    };

                    return (
                      <div
                        key={app.id}
                        className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-white font-mono">
                            {app.appointment_date} at {app.appointment_time}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Dr. {doc?.name || 'Doctor'} • <span className="text-slate-300">{app.reason}</span>
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${statusStyles[app.status]}`}>
                          {app.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Prescriptions */}
          {profileTab === 'prescriptions' && (
            <div className="space-y-3">
              {patientPrescriptions.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800">
                  <Pill className="w-6 h-6 text-slate-600 mx-auto mb-1.5" />
                  <p className="text-xs text-slate-400">No prescriptions issued yet for this patient.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {patientPrescriptions.map((rx) => (
                    <div key={rx.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
                        <span className="font-bold text-amber-400 font-mono">{rx.prescription_id}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-400">{rx.prescription_date}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                              rx.status === 'Dispensed'
                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            }`}
                          >
                            {rx.status}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        {rx.items.map((item) => (
                          <div
                            key={item.id}
                            className="text-xs flex justify-between items-center py-1 border-b border-slate-900/60 last:border-0"
                          >
                            <span className="font-medium text-slate-200">
                              • {item.drug_name} <span className="text-amber-400 font-mono">({item.dosage})</span>
                            </span>
                            <span className="text-slate-400">
                              {item.frequency} for {item.duration} •{' '}
                              <strong className="text-white font-mono">Qty: {item.quantity}</strong>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Close EMR
          </button>
        </div>
      </div>
    </div>
  );
};
