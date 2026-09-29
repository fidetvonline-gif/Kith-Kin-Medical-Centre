import React, { useState } from 'react';
import { useHims } from '../context/HimsContext';
import {
  User,
  Calendar,
  FileText,
  Pill,
  Clock,
  Heart,
  Phone,
  MapPin,
  CalendarPlus,
  CheckCircle,
  Activity,
  AlertCircle,
  Stethoscope
} from 'lucide-react';
import { BookAppointmentModal } from './BookAppointmentModal';

export const PatientPortalDashboard: React.FC = () => {
  const { activePatient, appointments, medicalRecords, prescriptions, doctors } = useHims();
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'consultations' | 'prescriptions'>('overview');

  if (!activePatient) return null;

  const myAppointments = appointments.filter((a) => a.patient_id === activePatient.patient_id);
  const myRecords = medicalRecords.filter((m) => m.patient_id === activePatient.patient_id);
  const myPrescriptions = prescriptions.filter((p) => p.patient_id === activePatient.patient_id);

  const upcomingAppointments = myAppointments.filter(
    (a) => a.status === 'Scheduled' || a.status === 'Waiting'
  );

  return (
    <div className="space-y-6">
      {/* Patient Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xl font-bold border border-emerald-400/40 shadow-lg shadow-emerald-950/60">
            {activePatient.first_name[0]}
            {activePatient.last_name[0]}
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h2 className="text-xl font-extrabold text-white">
                Welcome, {activePatient.first_name} {activePatient.last_name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                {activePatient.patient_id}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
              <span>DOB: {activePatient.date_of_birth}</span>
              <span>•</span>
              <span>Gender: {activePatient.gender}</span>
              <span>•</span>
              <span>Phone: {activePatient.phone}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsBookModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-lg shadow-emerald-950/50 border border-emerald-400/30 transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>Book New Doctor Appointment</span>
        </button>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Upcoming Visits</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{upcomingAppointments.length}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Scheduled appointments</p>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Past Consultations</p>
            <p className="text-2xl font-bold text-sky-400 mt-1">{myRecords.length}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Doctor encounters</p>
          </div>
          <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-400">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">My Prescriptions</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{myPrescriptions.length}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Dispensed medications</p>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <Pill className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex space-x-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'overview'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Patient Health Card</span>
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'appointments'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>My Appointments ({myAppointments.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('consultations')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'consultations'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Doctor Consultation Notes ({myRecords.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'prescriptions'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Pill className="w-3.5 h-3.5" />
          <span>Prescriptions & Medications ({myPrescriptions.length})</span>
        </button>
      </div>

      {/* Tab 1: Overview / Health Card */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 lg:col-span-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" /> Patient Registration Profile
            </h3>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div>
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Patient ID</span>
                <p className="font-mono text-emerald-400 font-bold text-sm mt-0.5">{activePatient.patient_id}</p>
              </div>
              <div>
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Residential Address</span>
                <p className="text-slate-200 mt-0.5">{activePatient.address}</p>
              </div>
              <div>
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Email Address</span>
                <p className="text-slate-200 mt-0.5">{activePatient.email || 'N/A'}</p>
              </div>
              <div>
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Emergency Next-of-Kin</span>
                <p className="text-slate-200 mt-0.5 font-medium">{activePatient.emergency_contact}</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" /> Next Upcoming Clinic Visits
              </h3>
              <button
                onClick={() => setIsBookModalOpen(true)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                + Book Visit
              </button>
            </div>

            {upcomingAppointments.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800">
                <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">You have no upcoming appointments scheduled.</p>
                <button
                  onClick={() => setIsBookModalOpen(true)}
                  className="mt-3 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CalendarPlus className="w-3.5 h-3.5" /> Schedule Doctor Appointment
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((app) => {
                  const doc = doctors.find((d) => d.id === app.doctor_id);
                  return (
                    <div
                      key={app.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white font-mono text-sm">
                            {app.appointment_date} at {app.appointment_time}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-950 text-sky-300 border border-sky-800">
                            {app.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">
                          Attending Physician: <strong className="text-white">Dr. {doc?.name || 'Doctor'}</strong> ({doc?.specialization})
                        </p>
                        <p className="text-[11px] text-slate-400 italic">Reason: "{app.reason}"</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Appointments */}
      {activeTab === 'appointments' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" /> Complete Appointment Schedule
            </h3>
            <button
              onClick={() => setIsBookModalOpen(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CalendarPlus className="w-3.5 h-3.5" /> Book Appointment
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Date & Time</th>
                  <th className="p-3.5">Doctor</th>
                  <th className="p-3.5">Specialization</th>
                  <th className="p-3.5">Reason for Visit</th>
                  <th className="p-3.5 rounded-r-xl">Visit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {myAppointments.map((app) => {
                  const doc = doctors.find((d) => d.id === app.doctor_id);
                  const statusStyles: Record<string, string> = {
                    Scheduled: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
                    Waiting: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
                    Completed: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
                    Cancelled: 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                  };

                  return (
                    <tr key={app.id} className="hover:bg-slate-950/40">
                      <td className="p-3.5 font-bold text-white font-mono">
                        {app.appointment_date} <br />
                        <span className="text-slate-400 text-[11px] font-normal">{app.appointment_time}</span>
                      </td>
                      <td className="p-3.5 font-medium text-slate-200">Dr. {doc?.name || 'Physician'}</td>
                      <td className="p-3.5 text-slate-400">{doc?.specialization}</td>
                      <td className="p-3.5 text-slate-300">{app.reason}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-semibold border ${statusStyles[app.status]}`}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Consultations */}
      {activeTab === 'consultations' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-emerald-400" /> Electronic Medical Record Consultations
          </h3>

          {myRecords.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800">
              <FileText className="w-6 h-6 text-slate-600 mx-auto mb-1.5" />
              <p className="text-xs text-slate-400">No medical consultations recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myRecords.map((rec) => {
                const doc = doctors.find((d) => d.id === rec.doctor_id);
                return (
                  <div key={rec.id} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-slate-800 gap-2">
                      <div>
                        <span className="text-sm font-bold text-emerald-400">Diagnosis: {rec.diagnosis}</span>
                      </div>
                      <span className="text-xs text-slate-400">
                        Attending Doctor: <strong className="text-white">Dr. {doc?.name || 'Doctor'}</strong> • {rec.created_at}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 font-semibold uppercase text-[10px]">Chief Complaint</span>
                        <p className="text-slate-200 mt-0.5">{rec.chief_complaint}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold uppercase text-[10px]">Symptoms Reported</span>
                        <p className="text-slate-200 mt-0.5">{rec.symptoms}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-500 font-semibold uppercase text-[10px]">Physician Treatment Plan</span>
                        <p className="text-slate-200 mt-0.5 leading-relaxed">{rec.treatment}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Prescriptions */}
      {activeTab === 'prescriptions' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Pill className="w-4 h-4 text-amber-400" /> Prescribed Medications & Pharmacy History
          </h3>

          {myPrescriptions.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800">
              <Pill className="w-6 h-6 text-slate-600 mx-auto mb-1.5" />
              <p className="text-xs text-slate-400">No prescriptions found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myPrescriptions.map((rx) => (
                <div key={rx.id} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                    <span className="font-bold text-amber-400 font-mono text-sm">{rx.prescription_id}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400">{rx.prescription_date}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          rx.status === 'Dispensed'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border-amber-800'
                        }`}
                      >
                        {rx.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {rx.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1"
                      >
                        <div>
                          <p className="font-bold text-white">
                            {item.drug_name}{' '}
                            <span className="font-mono text-amber-400 font-normal">({item.dosage})</span>
                          </p>
                          <p className="text-slate-400 mt-0.5">{item.instructions}</p>
                        </div>
                        <div className="text-right font-mono text-slate-300">
                          <span>
                            {item.frequency} • {item.duration} (Qty: {item.quantity})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Booking Modal */}
      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        preselectedPatientId={activePatient.patient_id}
      />
    </div>
  );
};
