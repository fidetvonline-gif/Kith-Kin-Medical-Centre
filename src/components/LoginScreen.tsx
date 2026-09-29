import React, { useState } from 'react';
import { useHims } from '../context/HimsContext';
import { UserRole } from '../types';
import {
  Building2,
  Shield,
  UserCheck,
  Stethoscope,
  Pill,
  Lock,
  User,
  ArrowRight,
  Activity,
  CheckCircle2,
  Clock,
  Heart,
  Phone,
  KeyRound
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

export const LoginScreen: React.FC = () => {
  const { login, patientLogin, patients } = useHims();
  const [authMode, setAuthMode] = useState<'staff' | 'patient'>('staff');

  // Staff State
  const [selectedRole, setSelectedRole] = useState<UserRole>('doctor');
  const [username, setUsername] = useState('doctor');

  // Patient Portal State
  const [patientIdInput, setPatientIdInput] = useState('HIMS/000001');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    switch (role) {
      case 'admin':
        setUsername('admin');
        break;
      case 'receptionist':
        setUsername('reception');
        break;
      case 'doctor':
        setUsername('doctor');
        break;
      case 'pharmacist':
        setUsername('pharmacist');
        break;
    }
  };

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, selectedRole);
  };

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    patientLogin(patientIdInput);
  };

  const roleCards: Array<{
    role: UserRole;
    title: string;
    desc: string;
    badge: string;
    icon: React.ReactNode;
    colorClasses: string;
    activeClasses: string;
  }> = [
    {
      role: 'doctor',
      title: 'Doctor Portal',
      desc: 'Appointments queue, patient consultations, diagnosis & electronic prescriptions',
      badge: 'Consultation & Rx',
      icon: <Stethoscope className="w-5 h-5 text-emerald-400" />,
      colorClasses: 'border-slate-800 bg-slate-900/60 hover:border-emerald-500/40 hover:bg-slate-900',
      activeClasses: 'border-emerald-500/80 bg-emerald-950/30 ring-1 ring-emerald-500/50 shadow-lg shadow-emerald-950/50'
    },
    {
      role: 'receptionist',
      title: 'Reception Desk',
      desc: 'Patient electronic registration, ID generation, directory search & appointment booking',
      badge: 'Front Desk & Records',
      icon: <UserCheck className="w-5 h-5 text-sky-400" />,
      colorClasses: 'border-slate-800 bg-slate-900/60 hover:border-sky-500/40 hover:bg-slate-900',
      activeClasses: 'border-sky-500/80 bg-sky-950/30 ring-1 ring-sky-500/50 shadow-lg shadow-sky-950/50'
    },
    {
      role: 'pharmacist',
      title: 'Pharmacy Unit',
      desc: 'Prescription dispensing queue, stock inventory, low-stock warnings & stock adjustment',
      badge: 'Dispensary & Stock',
      icon: <Pill className="w-5 h-5 text-amber-400" />,
      colorClasses: 'border-slate-800 bg-slate-900/60 hover:border-amber-500/40 hover:bg-slate-900',
      activeClasses: 'border-amber-500/80 bg-amber-950/30 ring-1 ring-amber-500/50 shadow-lg shadow-amber-950/50'
    },
    {
      role: 'admin',
      title: 'Administrator',
      desc: 'Staff user accounts, system activity logs, role permissions & database backup/restore',
      badge: 'System Admin & Audit',
      icon: <Shield className="w-5 h-5 text-purple-400" />,
      colorClasses: 'border-slate-800 bg-slate-900/60 hover:border-purple-500/40 hover:bg-slate-900',
      activeClasses: 'border-purple-500/80 bg-purple-950/30 ring-1 ring-purple-500/50 shadow-lg shadow-purple-950/50'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-3xl text-center mb-6 relative z-10">
        <div className="inline-flex p-3 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl shadow-xl shadow-emerald-950/60 border border-emerald-400/30 mb-4">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
          KITH & KIN MEDICAL CENTRE
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-400 flex items-center justify-center gap-2">
          <span>Ibo Hall, Ikot Ekpene, Akwa Ibom State</span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-medium">Hospital Information Management System (HIMS)</span>
        </p>

        {/* Portal Switch Tabs */}
        <div className="mt-5 inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
          <button
            type="button"
            onClick={() => setAuthMode('staff')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              authMode === 'staff'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Hospital Staff Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('patient')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              authMode === 'patient'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-950/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Patient Self-Service Portal</span>
          </button>
        </div>

        <div className="mt-3 flex justify-center">
          <PWAInstallButton variant="login" />
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-3xl relative z-10">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
          {authMode === 'staff' ? (
            <>
              <div className="flex items-center justify-between mb-5 border-b border-slate-800/80 pb-3">
                <div>
                  <h2 className="text-base font-bold text-white">Select Clinical Staff Role</h2>
                  <p className="text-xs text-slate-400">Choose your department to access your dedicated workstation</p>
                </div>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/50 flex items-center gap-1">
                  <Activity className="w-3 h-3" /> System Ready
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
                {roleCards.map((card) => {
                  const isSelected = selectedRole === card.role;
                  return (
                    <button
                      key={card.role}
                      type="button"
                      onClick={() => handleRoleSelect(card.role)}
                      className={`text-left p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                        isSelected ? card.activeClasses : card.colorClasses
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 rounded-lg bg-slate-800 border border-slate-700/60 shrink-0">
                          {card.icon}
                        </div>
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800">
                          {card.badge}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm flex items-center justify-between">
                          <span>{card.title}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{card.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <form onSubmit={handleStaffSubmit} className="space-y-4 pt-4 border-t border-slate-800/80">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Staff Username / ID
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="block w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        placeholder="Enter staff username"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        defaultValue="password123"
                        required
                        className="block w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 gap-3">
                  <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Demo Passcode: <code className="text-emerald-400 font-mono">password123</code></span>
                  </p>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center space-x-2 py-2.5 px-6 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-emerald-950/30 transition-all cursor-pointer"
                  >
                    <span>Launch <span className="capitalize">{selectedRole}</span> Workstation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* Patient Portal Login Form */
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-400" />
                    <span>Patient Health & Medical Records Portal</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Sign in with your Hospital Patient ID (e.g. <code className="text-sky-400 font-mono">HIMS/000001</code>) or Registered Phone Number
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-sky-400 bg-sky-950/60 px-2.5 py-1 rounded-full border border-sky-800/50">
                  Patient Self-Care
                </span>
              </div>

              {/* Quick Select Registered Demo Patients */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300">Quick Login with Registered Patients:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {patients.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPatientIdInput(p.patient_id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        patientIdInput === p.patient_id
                          ? 'bg-sky-950/50 border-sky-500/80 ring-1 ring-sky-500/50'
                          : 'bg-slate-950 border-slate-800 hover:bg-slate-800/60'
                      }`}
                    >
                      <p className="font-bold text-white text-xs">
                        {p.first_name} {p.last_name}
                      </p>
                      <p className="font-mono text-[11px] text-sky-400 mt-0.5">{p.patient_id}</p>
                      <p className="text-[10px] text-slate-500">{p.phone}</p>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handlePatientSubmit} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Patient ID or Registered Mobile Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={patientIdInput}
                      onChange={(e) => setPatientIdInput(e.target.value)}
                      required
                      className="block w-full pl-9 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all font-mono"
                      placeholder="e.g. HIMS/000001 or 08012345678"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 gap-3">
                  <p className="text-[11px] text-slate-500">
                    Need your Patient ID? Contact the reception desk at Kith & Kin Medical Centre.
                  </p>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center space-x-2 py-3 px-6 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-sky-950/40 border border-sky-400/30 transition-all cursor-pointer"
                  >
                    <span>Access My Health Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
