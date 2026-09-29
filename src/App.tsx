import React, { useState } from 'react';
import { HimsProvider, useHims } from './context/HimsContext';
import { Navbar } from './components/Navbar';
import { LoginScreen } from './components/LoginScreen';
import { Toast } from './components/Toast';
import { AdminDashboard } from './components/AdminDashboard';
import { ReceptionistDashboard } from './components/ReceptionistDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { PharmacistDashboard } from './components/PharmacistDashboard';
import { PatientPortalDashboard } from './components/PatientPortalDashboard';
import { ReportsModule } from './components/ReportsModule';
import {
  LayoutDashboard,
  BarChart3,
  Building2,
  Users,
  Calendar,
  Pill,
  ShieldCheck,
  Heart
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentUser, patients, appointments, drugs, prescriptions } = useHims();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports'>('dashboard');

  if (!currentUser) {
    return <LoginScreen />;
  }

  const isPatientRole = currentUser.role === 'patient';

  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'receptionist':
        return <ReceptionistDashboard />;
      case 'doctor':
        return <DoctorDashboard />;
      case 'pharmacist':
        return <PharmacistDashboard />;
      case 'patient':
        return <PatientPortalDashboard />;
      default:
        return <DoctorDashboard />;
    }
  };

  const todayStr = new Date().toISOString().substring(0, 10);
  const todayApps = appointments.filter((a) => a.appointment_date === todayStr);
  const pendingPrescriptions = prescriptions.filter((p) => p.status === 'Pending');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
      <Navbar activeTab={activeTab} setActiveTab={(tab: string) => setActiveTab(tab as any)} />

      {/* Hospital Subbar & Operational Quick Stats */}
      <div className="bg-slate-900/70 border-b border-slate-800/80 backdrop-blur-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Hospital Location & Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center space-x-2 text-slate-300">
              <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold text-slate-200">
                {isPatientRole ? 'Patient Health Records Portal' : 'Clinical Operations'}
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">Ibo Hall, Ikot Ekpene</span>
            </div>

            {/* Micro stats (visible for staff) */}
            {!isPatientRole && (
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 text-[11px] border border-slate-700/60">
                  <Users className="w-3 h-3 text-sky-400" />
                  <span className="text-slate-400">Patients:</span>
                  <strong className="text-white font-semibold">{patients.length}</strong>
                </span>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 text-[11px] border border-slate-700/60">
                  <Calendar className="w-3 h-3 text-emerald-400" />
                  <span className="text-slate-400">Today's OPD:</span>
                  <strong className="text-white font-semibold">{todayApps.length}</strong>
                </span>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 text-[11px] border border-slate-700/60">
                  <Pill className="w-3 h-3 text-amber-400" />
                  <span className="text-slate-400">Pending Rx:</span>
                  <strong className="text-white font-semibold">{pendingPrescriptions.length}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50 border border-emerald-500/50'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="capitalize">{currentUser.role} {isPatientRole ? 'Portal' : 'Workstation'}</span>
            </button>

            {!isPatientRole && (
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 ${
                  activeTab === 'reports'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50 border border-emerald-500/50'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Hospital Reports</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Clinical Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' ? renderDashboard() : <ReportsModule />}
      </main>

      {/* Enterprise Healthcare Footer */}
      <footer className="bg-slate-900/90 border-t border-slate-800 py-3.5 mt-auto text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-300">Kith & Kin Medical Centre</span>
            <span className="text-slate-600">•</span>
            <span>Hospital Information Management System</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] text-slate-500">
            <span>Ibo Hall, Ikot Ekpene, Akwa Ibom State</span>
            <span>•</span>
            <span className="text-emerald-500 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live System
            </span>
          </div>
        </div>
      </footer>

      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <HimsProvider>
      <MainAppContent />
    </HimsProvider>
  );
}
