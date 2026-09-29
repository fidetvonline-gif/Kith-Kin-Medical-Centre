import React, { useState } from 'react';
import { useHims } from '../context/HimsContext';
import { Appointment, Patient } from '../types';
import {
  Stethoscope,
  Calendar,
  Search,
  Users,
  FileText,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
  Plus,
  Filter
} from 'lucide-react';
import { ConsultationModal } from './ConsultationModal';
import { PatientProfileModal } from './PatientProfileModal';

export const DoctorDashboard: React.FC = () => {
  const { appointments, patients, doctors, medicalRecords, prescriptions, currentUser } = useHims();

  const [activeSubTab, setActiveSubTab] = useState<'appointments' | 'patients'>('appointments');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Waiting' | 'Scheduled' | 'Completed'>('ALL');

  // Modals
  const [selectedAppointmentForConsultation, setSelectedAppointmentForConsultation] = useState<Appointment | null>(null);
  const [preselectedPatientIdForConsultation, setPreselectedPatientIdForConsultation] = useState<string | undefined>();
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [selectedPatientForProfile, setSelectedPatientForProfile] = useState<Patient | null>(null);

  const todayStr = new Date().toISOString().substring(0, 10);
  const todaysAppointments = appointments.filter((a) => a.appointment_date === todayStr);

  const waitingCount = todaysAppointments.filter((a) => a.status === 'Waiting').length;
  const completedTodayCount = todaysAppointments.filter((a) => a.status === 'Completed').length;
  const totalDoctorRecords = medicalRecords.length;

  const filteredAppointments = todaysAppointments.filter((a) => {
    const p = patients.find((pat) => pat.patient_id === a.patient_id);
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      a.patient_id.toLowerCase().includes(term) ||
      (p && `${p.first_name} ${p.last_name}`.toLowerCase().includes(term)) ||
      a.reason.toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  const filteredPatients = patients.filter((p) =>
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm) ||
    p.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Clinician Overview Banner & KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Today's Clinic Queue</p>
            <p className="text-2xl font-extrabold text-white mt-1">{todaysAppointments.length}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Assigned OPD Patients</p>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Waiting in Lobby</p>
            <p className="text-2xl font-extrabold text-amber-300 mt-1">{waitingCount}</p>
            <p className="text-[11px] text-amber-500/80 mt-0.5">Ready for consultation</p>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Completed Consultations</p>
            <p className="text-2xl font-extrabold text-emerald-300 mt-1">{completedTodayCount}</p>
            <p className="text-[11px] text-emerald-500/80 mt-0.5">Discharged or prescribed</p>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">Total Health Records</p>
            <p className="text-2xl font-extrabold text-sky-300 mt-1">{totalDoctorRecords}</p>
            <p className="text-[11px] text-sky-500/80 mt-0.5">Electronic EMR files</p>
          </div>
          <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-400">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Action Toolbar & Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Subtabs */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-sm">
          <button
            onClick={() => setActiveSubTab('appointments')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'appointments'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Today's OPD Queue ({todaysAppointments.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('patients')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'patients'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Patient EMR Archive ({patients.length})</span>
          </button>
        </div>

        {/* Filter pills & search */}
        <div className="flex flex-wrap items-center gap-2.5">
          {activeSubTab === 'appointments' && (
            <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
              {(['ALL', 'Waiting', 'Scheduled', 'Completed'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    statusFilter === st
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st === 'ALL' ? 'All Queue' : st}
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
              placeholder="Search by name, ID or complaint..."
              className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Subtab 1: Today's Appointments Queue */}
      {activeSubTab === 'appointments' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Clinical Consultations Queue</h3>
                <p className="text-[11px] text-slate-400">Date: {todayStr} • Doctor In Attendance: {currentUser?.name}</p>
              </div>
            </div>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-slate-950/50 border border-slate-800/80">
              <Stethoscope className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-300">No appointments matching current filter</p>
              <p className="text-xs text-slate-500 mt-1">Check back as reception books new patients for today's clinic.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">Time Slot</th>
                    <th className="p-3.5">Patient Information</th>
                    <th className="p-3.5">Chief Complaint</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 rounded-r-xl text-right">Consultation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {filteredAppointments.map((app) => {
                    const p = patients.find((pat) => pat.patient_id === app.patient_id);
                    const statusStyles: Record<string, string> = {
                      Scheduled: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
                      Waiting: 'bg-amber-500/15 text-amber-300 border-amber-500/30 animate-pulse',
                      Completed: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
                      Cancelled: 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                    };

                    return (
                      <tr key={app.id} className="hover:bg-slate-950/40 transition-colors">
                        <td className="p-3.5 font-bold text-emerald-400 font-mono whitespace-nowrap">
                          {app.appointment_time}
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200">
                              {p ? p.first_name[0] : 'P'}
                            </div>
                            <div>
                              <p className="font-semibold text-white text-xs">
                                {p ? `${p.first_name} ${p.last_name}` : 'Unknown Patient'}
                              </p>
                              <span className="font-mono text-[10px] text-sky-400 bg-sky-950/60 px-1.5 py-0.2 rounded border border-sky-800/50">
                                {app.patient_id}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-300 max-w-xs">
                          <p className="truncate font-medium">{app.reason}</p>
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[10px] font-semibold border ${statusStyles[app.status]}`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedPatientForProfile(p || null)}
                            className="px-2.5 py-1.5 bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white rounded-lg text-xs font-medium border border-slate-700/80 inline-flex items-center gap-1.5 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            <span>EMR File</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedAppointmentForConsultation(app);
                              setPreselectedPatientIdForConsultation(undefined);
                              setIsConsultationOpen(true);
                            }}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-md shadow-emerald-950/50 border border-emerald-400/40 transition-all"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>{app.status === 'Completed' ? 'View/Add Note' : 'Open Consultation'}</span>
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

      {/* Subtab 2: Patient EMR Archive */}
      {activeSubTab === 'patients' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400 border border-sky-500/20">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Hospital Medical Records Archive</h3>
                <p className="text-[11px] text-slate-400">Search patient history, chronic diagnosis records, and previous prescriptions</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Patient ID</th>
                  <th className="p-3.5">Full Name</th>
                  <th className="p-3.5">DOB & Gender</th>
                  <th className="p-3.5">Contact Phone</th>
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
                    <td className="p-3.5 text-slate-300">{p.phone}</td>
                    <td className="p-3.5 text-slate-300 truncate max-w-xs">{p.address}</td>
                    <td className="p-3.5 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedPatientForProfile(p)}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium border border-slate-700 inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>Medical Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAppointmentForConsultation(null);
                          setPreselectedPatientIdForConsultation(p.patient_id);
                          setIsConsultationOpen(true);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Start Consultation</span>
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
