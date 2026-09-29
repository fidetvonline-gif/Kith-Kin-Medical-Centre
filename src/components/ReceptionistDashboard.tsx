import React, { useState } from 'react';
import { useHims } from '../context/HimsContext';
import { Patient, Appointment } from '../types';
import {
  UserPlus,
  Calendar,
  Search,
  Users,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  Phone,
  MapPin,
  CalendarPlus,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { AddPatientModal } from './AddPatientModal';
import { BookAppointmentModal } from './BookAppointmentModal';
import { PatientProfileModal } from './PatientProfileModal';

export const ReceptionistDashboard: React.FC = () => {
  const { patients, appointments, doctors, updateAppointmentStatus } = useHims();

  const [activeSubTab, setActiveSubTab] = useState<'patients' | 'appointments'>('patients');
  const [searchTerm, setSearchTerm] = useState('');
  const [appointmentFilter, setAppointmentFilter] = useState<'ALL' | 'Scheduled' | 'Waiting' | 'Completed' | 'Cancelled'>('ALL');

  // Modals
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isBookAppOpen, setIsBookAppOpen] = useState(false);
  const [bookForPatientId, setBookForPatientId] = useState<string | undefined>();
  const [selectedPatientForProfile, setSelectedPatientForProfile] = useState<Patient | null>(null);

  const todayStr = new Date().toISOString().substring(0, 10);
  const todaysAppointments = appointments.filter((a) => a.appointment_date === todayStr);

  const filteredPatients = patients.filter(
    (p) =>
      p.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      p.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAppointments = appointments.filter((a) => {
    const p = patients.find((pat) => pat.patient_id === a.patient_id);
    const doc = doctors.find((d) => d.id === a.doctor_id);
    const term = searchTerm.toLowerCase();
    const matchesFilter = appointmentFilter === 'ALL' || a.status === appointmentFilter;
    const matchesSearch =
      a.patient_id.toLowerCase().includes(term) ||
      (p && `${p.first_name} ${p.last_name}`.toLowerCase().includes(term)) ||
      (doc && doc.name.toLowerCase().includes(term)) ||
      a.reason.toLowerCase().includes(term);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Front Desk KPI Banner & Quick Actions */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500/15 text-sky-300 border border-sky-500/30">
              Front Desk Operations
            </span>
            <span className="text-xs text-slate-400">Reception Workstation</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Patient Admissions & Appointments Desk</h2>
          <p className="text-xs text-slate-400">
            Register incoming patients with automated ID generation, manage doctor schedules, and track clinic queues.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAddPatientOpen(true)}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-semibold rounded-xl text-xs shadow-lg shadow-sky-950/50 border border-sky-400/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register New Patient</span>
          </button>
          <button
            onClick={() => {
              setBookForPatientId(undefined);
              setIsBookAppOpen(true);
            }}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-lg shadow-emerald-950/50 border border-emerald-400/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Registered Patients</p>
            <p className="text-2xl font-bold text-white mt-0.5">{patients.length}</p>
          </div>
          <div className="p-2.5 bg-sky-500/10 rounded-lg text-sky-400 border border-sky-500/20">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Today's Clinic Appointments</p>
            <p className="text-2xl font-bold text-emerald-400 mt-0.5">{todaysAppointments.length}</p>
          </div>
          <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Waiting for Doctor</p>
            <p className="text-2xl font-bold text-amber-400 mt-0.5">
              {appointments.filter((a) => a.status === 'Waiting').length}
            </p>
          </div>
          <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/20">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex space-x-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('patients')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'patients'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-950/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Patient Registry ({patients.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('appointments')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'appointments'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-950/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Appointments Manager ({appointments.length})</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {activeSubTab === 'appointments' && (
            <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
              {(['ALL', 'Scheduled', 'Waiting', 'Completed', 'Cancelled'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setAppointmentFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    appointmentFilter === st
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          )}

          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, name, phone..."
              className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Tab 1: Patients Registry */}
      {activeSubTab === 'patients' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-400" /> Electronic Patient Directory
            </h3>
            <span className="text-xs text-slate-400">{filteredPatients.length} records found</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Patient ID</th>
                  <th className="p-3.5">Full Name</th>
                  <th className="p-3.5">DOB & Gender</th>
                  <th className="p-3.5">Phone</th>
                  <th className="p-3.5">Address</th>
                  <th className="p-3.5 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {filteredPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-950/40 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-sky-400">{p.patient_id}</td>
                    <td className="p-3.5 font-semibold text-white">
                      {p.first_name} {p.last_name}
                    </td>
                    <td className="p-3.5 text-slate-300">
                      {p.date_of_birth} <span className="text-slate-500">({p.gender})</span>
                    </td>
                    <td className="p-3.5 text-slate-300 font-mono">{p.phone}</td>
                    <td className="p-3.5 text-slate-300 truncate max-w-xs">{p.address}</td>
                    <td className="p-3.5 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setBookForPatientId(p.patient_id);
                          setIsBookAppOpen(true);
                        }}
                        className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 rounded-lg text-xs font-medium border border-emerald-500/30 inline-flex items-center gap-1 transition-colors"
                      >
                        <CalendarPlus className="w-3.5 h-3.5" /> Book
                      </button>
                      <button
                        onClick={() => setSelectedPatientForProfile(p)}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium border border-slate-700 inline-flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-400" /> Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Appointments Schedule */}
      {activeSubTab === 'appointments' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" /> Hospital Appointments & Doctor Bookings
            </h3>
            <span className="text-xs text-slate-400">{filteredAppointments.length} appointments</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Patient</th>
                  <th className="p-3.5">Assigned Doctor</th>
                  <th className="p-3.5">Date & Time</th>
                  <th className="p-3.5">Reason for Visit</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 rounded-r-xl text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {filteredAppointments.map((app) => {
                  const p = patients.find((pat) => pat.patient_id === app.patient_id);
                  const doc = doctors.find((d) => d.id === app.doctor_id);
                  const statusStyles: Record<string, string> = {
                    Scheduled: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
                    Waiting: 'bg-amber-500/15 text-amber-300 border-amber-500/30 font-bold',
                    Completed: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
                    Cancelled: 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                  };

                  return (
                    <tr key={app.id} className="hover:bg-slate-950/40 transition-colors">
                      <td className="p-3.5">
                        <span className="font-mono font-bold text-sky-400 text-xs">{app.patient_id}</span>
                        <p className="font-semibold text-white mt-0.5">{p ? `${p.first_name} ${p.last_name}` : 'Unknown'}</p>
                      </td>
                      <td className="p-3.5 text-slate-200 font-medium">
                        Dr. {doc?.name || 'General Doctor'}
                        <p className="text-[10px] text-slate-500">{doc?.specialization}</p>
                      </td>
                      <td className="p-3.5 text-slate-300 font-semibold">
                        {app.appointment_date}
                        <p className="font-mono text-emerald-400 text-[11px]">{app.appointment_time}</p>
                      </td>
                      <td className="p-3.5 text-slate-300 max-w-xs truncate">{app.reason}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-semibold border ${statusStyles[app.status]}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                        {app.status === 'Scheduled' && (
                          <button
                            onClick={() => updateAppointmentStatus(app.id, 'Waiting')}
                            className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                          >
                            <Clock className="w-3.5 h-3.5" /> Mark Waiting
                          </button>
                        )}
                        {app.status === 'Waiting' && (
                          <button
                            onClick={() => updateAppointmentStatus(app.id, 'Completed')}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                          </button>
                        )}
                        {app.status !== 'Cancelled' && app.status !== 'Completed' && (
                          <button
                            onClick={() => updateAppointmentStatus(app.id, 'Cancelled')}
                            className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-lg text-xs font-medium border border-slate-700 inline-flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Cancel
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
      <BookAppointmentModal
        isOpen={isBookAppOpen}
        onClose={() => setIsBookAppOpen(false)}
        preselectedPatientId={bookForPatientId}
      />
      <PatientProfileModal
        patient={selectedPatientForProfile}
        isOpen={Boolean(selectedPatientForProfile)}
        onClose={() => setSelectedPatientForProfile(null)}
      />
    </div>
  );
};
