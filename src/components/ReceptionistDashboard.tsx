import React, { useState } from 'react';
import { useHims } from '../context/HimsContext';
import { Patient, Appointment } from '../types';
import { UserPlus, Calendar, Search, Users, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';
import { AddPatientModal } from './AddPatientModal';
import { BookAppointmentModal } from './BookAppointmentModal';
import { PatientProfileModal } from './PatientProfileModal';

export const ReceptionistDashboard: React.FC = () => {
  const { patients, appointments, doctors, updateAppointmentStatus } = useHims();

  const [activeSubTab, setActiveSubTab] = useState<'patients' | 'appointments'>('patients');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isBookAppOpen, setIsBookAppOpen] = useState(false);
  const [selectedPatientForProfile, setSelectedPatientForProfile] = useState<Patient | null>(null);

  const filteredPatients = patients.filter(p =>
    p.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm)
  );

  const filteredAppointments = appointments.filter(a => {
    const p = patients.find(pat => pat.patient_id === a.patient_id);
    const doc = doctors.find(d => d.id === a.doctor_id);
    const term = searchTerm.toLowerCase();
    return (
      a.patient_id.toLowerCase().includes(term) ||
      (p && (p.first_name.toLowerCase().includes(term) || p.last_name.toLowerCase().includes(term))) ||
      (doc && doc.name.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-extrabold text-white">Reception Desk Portal</h2>
          <p className="text-xs text-slate-400 mt-1">Manage patient registrations, unique IDs, and appointment scheduling.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsAddPatientOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs shadow-lg transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> Register New Patient
          </button>
          <button
            onClick={() => setIsBookAppOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs shadow-lg transition-all flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" /> Book Appointment
          </button>
        </div>
      </div>

      {/* Subnav & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveSubTab('patients')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'patients'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Registered Patients ({patients.length})
          </button>
          <button
            onClick={() => setActiveSubTab('appointments')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'appointments'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Appointments Schedule ({appointments.length})
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
            placeholder="Search by ID, name, phone..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Patients Tab */}
      {activeSubTab === 'patients' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" /> Patient Directory
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-xl">Patient ID</th>
                  <th className="p-3">Full Name</th>
                  <th className="p-3">DOB / Gender</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Address</th>
                  <th className="p-3 rounded-r-xl text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredPatients.map(p => (
                  <tr key={p.id} className="hover:bg-slate-950/50">
                    <td className="p-3 font-mono font-bold text-blue-400">{p.patient_id}</td>
                    <td className="p-3 font-semibold text-white">{p.first_name} {p.last_name}</td>
                    <td className="p-3 text-slate-300">{p.date_of_birth} ({p.gender})</td>
                    <td className="p-3 text-slate-300">{p.phone}</td>
                    <td className="p-3 text-slate-300">{p.address}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedPatientForProfile(p)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium inline-flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Appointments Tab */}
      {activeSubTab === 'appointments' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" /> Doctor Appointments Schedule
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-xl">Patient ID & Name</th>
                  <th className="p-3">Assigned Doctor</th>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 rounded-r-xl text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredAppointments.map(app => {
                  const p = patients.find(pat => pat.patient_id === app.patient_id);
                  const doc = doctors.find(d => d.id === app.doctor_id);
                  const statusColors: Record<string, string> = {
                    Scheduled: 'bg-blue-900/50 text-blue-300 border-blue-700',
                    Waiting: 'bg-amber-900/50 text-amber-300 border-amber-700',
                    Completed: 'bg-emerald-900/50 text-emerald-300 border-emerald-700',
                    Cancelled: 'bg-rose-900/50 text-rose-300 border-rose-700'
                  };
                  return (
                    <tr key={app.id} className="hover:bg-slate-950/50">
                      <td className="p-3">
                        <span className="font-mono font-bold text-blue-400">{app.patient_id}</span>
                        <p className="font-semibold text-white mt-0.5">{p ? `${p.first_name} ${p.last_name}` : 'Unknown'}</p>
                      </td>
                      <td className="p-3 text-slate-200 font-medium">Dr. {doc?.name || 'General Doctor'}</td>
                      <td className="p-3 text-slate-300 font-bold">{app.appointment_date} <br/><span className="font-normal text-slate-400">{app.appointment_time}</span></td>
                      <td className="p-3 text-slate-300">{app.reason}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${statusColors[app.status]}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1">
                        {app.status === 'Scheduled' && (
                          <button
                            onClick={() => updateAppointmentStatus(app.id, 'Waiting')}
                            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium inline-flex items-center gap-1"
                          >
                            <Clock className="w-3 h-3" /> Mark Waiting
                          </button>
                        )}
                        {app.status !== 'Cancelled' && app.status !== 'Completed' && (
                          <button
                            onClick={() => updateAppointmentStatus(app.id, 'Cancelled')}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-lg font-medium inline-flex items-center gap-1"
                          >
                            <XCircle className="w-3 h-3" /> Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddPatientModal isOpen={isAddPatientOpen} onClose={() => setIsAddPatientOpen(false)} />
      <BookAppointmentModal isOpen={isBookAppOpen} onClose={() => setIsBookAppOpen(false)} />
      <PatientProfileModal
        patient={selectedPatientForProfile}
        isOpen={Boolean(selectedPatientForProfile)}
        onClose={() => setSelectedPatientForProfile(null)}
      />
    </div>
  );
};
