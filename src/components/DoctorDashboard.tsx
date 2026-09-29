import React, { useState } from 'react';
import { useHims } from '../context/HimsContext';
import { Appointment, Patient } from '../types';
import { Stethoscope, Calendar, Search, Users, FileText, Eye, CheckCircle2 } from 'lucide-react';
import { ConsultationModal } from './ConsultationModal';
import { PatientProfileModal } from './PatientProfileModal';

export const DoctorDashboard: React.FC = () => {
  const { appointments, patients, doctors, currentUser } = useHims();

  const [activeSubTab, setActiveSubTab] = useState<'appointments' | 'patients'>('appointments');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [selectedAppointmentForConsultation, setSelectedAppointmentForConsultation] = useState<Appointment | null>(null);
  const [preselectedPatientIdForConsultation, setPreselectedPatientIdForConsultation] = useState<string | undefined>();
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [selectedPatientForProfile, setSelectedPatientForProfile] = useState<Patient | null>(null);

  const todayStr = new Date().toISOString().substring(0, 10);
  const todaysAppointments = appointments.filter(a => a.appointment_date === todayStr);

  const filteredPatients = patients.filter(p =>
    p.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-extrabold text-white">Doctor Consultation Portal</h2>
          <p className="text-xs text-slate-400 mt-1">Access patient health history, record examinations, diagnoses, treatments, and prescriptions.</p>
        </div>
        <div className="flex items-center space-x-3 bg-emerald-950/40 border border-emerald-800/50 px-4 py-2.5 rounded-xl">
          <Stethoscope className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-xs font-bold text-white">{currentUser?.name || 'Doctor'}</p>
            <p className="text-[11px] text-emerald-400">Today's Queue: {todaysAppointments.length} patients</p>
          </div>
        </div>
      </div>

      {/* Subnav & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveSubTab('appointments')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'appointments'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Today's Appointments Queue ({todaysAppointments.length})
          </button>
          <button
            onClick={() => setActiveSubTab('patients')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'patients'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            All Patient Records ({patients.length})
          </button>
        </div>

        <div className="relative max-w-sm w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search patient records..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Appointments Queue */}
      {activeSubTab === 'appointments' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" /> Today's Assigned Patients ({todayStr})
          </h3>
          {todaysAppointments.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-6 bg-slate-950/50 rounded-xl border border-slate-800 text-center">No appointments scheduled for today.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-3 rounded-l-xl">Time</th>
                    <th className="p-3">Patient ID & Name</th>
                    <th className="p-3">Reason for Visit</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 rounded-r-xl text-right">Consultation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {todaysAppointments.map(app => {
                    const p = patients.find(pat => pat.patient_id === app.patient_id);
                    const statusColors: Record<string, string> = {
                      Scheduled: 'bg-blue-900/50 text-blue-300 border-blue-700',
                      Waiting: 'bg-amber-900/50 text-amber-300 border-amber-700',
                      Completed: 'bg-emerald-900/50 text-emerald-300 border-emerald-700',
                      Cancelled: 'bg-rose-900/50 text-rose-300 border-rose-700'
                    };
                    return (
                      <tr key={app.id} className="hover:bg-slate-950/50">
                        <td className="p-3 font-bold text-emerald-400">{app.appointment_time}</td>
                        <td className="p-3">
                          <span className="font-mono font-bold text-slate-300">{app.patient_id}</span>
                          <p className="font-semibold text-white mt-0.5">{p ? `${p.first_name} ${p.last_name}` : 'Unknown'}</p>
                        </td>
                        <td className="p-3 text-slate-300">{app.reason}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${statusColors[app.status]}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => setSelectedPatientForProfile(p || null)}
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" /> History
                          </button>
                          <button
                            onClick={() => {
                              setSelectedAppointmentForConsultation(app);
                              setPreselectedPatientIdForConsultation(undefined);
                              setIsConsultationOpen(true);
                            }}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold inline-flex items-center gap-1 shadow"
                          >
                            <FileText className="w-3.5 h-3.5" /> Open Consultation
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Patient Records Tab */}
      {activeSubTab === 'patients' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" /> Patient Medical Records Search
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-xl">Patient ID</th>
                  <th className="p-3">Full Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Address</th>
                  <th className="p-3 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredPatients.map(p => (
                  <tr key={p.id} className="hover:bg-slate-950/50">
                    <td className="p-3 font-mono font-bold text-emerald-400">{p.patient_id}</td>
                    <td className="p-3 font-semibold text-white">{p.first_name} {p.last_name}</td>
                    <td className="p-3 text-slate-300">{p.phone}</td>
                    <td className="p-3 text-slate-300">{p.address}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => setSelectedPatientForProfile(p)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Profile
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAppointmentForConsultation(null);
                          setPreselectedPatientIdForConsultation(p.patient_id);
                          setIsConsultationOpen(true);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold inline-flex items-center gap-1 shadow"
                      >
                        <FileText className="w-3.5 h-3.5" /> Start Consultation
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        appointment={selectedAppointmentForConsultation}
        preselectedPatientId={preselectedPatientIdForConsultation}
      />
      <PatientProfileModal
        patient={selectedPatientForProfile}
        isOpen={Boolean(selectedPatientForProfile)}
        onClose={() => setSelectedPatientForProfile(null)}
        onOpenConsultation={(patId) => {
          setSelectedAppointmentForConsultation(null);
          setPreselectedPatientIdForConsultation(patId);
          setIsConsultationOpen(true);
        }}
      />
    </div>
  );
};
