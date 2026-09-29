import React from 'react';
import { useHims } from '../context/HimsContext';
import { UserRole } from '../types';
import { Building2, UserCircle, LogOut, Shield, Stethoscope, Pill, UserCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, logout, switchRoleQuick } = useHims();

  if (!currentUser) return null;

  const roleIcons = {
    admin: <Shield className="w-4 h-4 text-purple-400" />,
    receptionist: <UserCheck className="w-4 h-4 text-blue-400" />,
    doctor: <Stethoscope className="w-4 h-4 text-emerald-400" />,
    pharmacist: <Pill className="w-4 h-4 text-amber-400" />
  };

  const roleColors = {
    admin: 'bg-purple-900/50 text-purple-200 border-purple-700',
    receptionist: 'bg-blue-900/50 text-blue-200 border-blue-700',
    doctor: 'bg-emerald-900/50 text-emerald-200 border-emerald-700',
    pharmacist: 'bg-amber-900/50 text-amber-200 border-amber-700'
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Hospital Branding */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-600 rounded-lg text-white shadow-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-wide">KITH & KIN MEDICAL CENTRE</h1>
              <p className="text-xs text-slate-400">Ibo Hall, Ikot Ekpene • HIMS Portal</p>
            </div>
          </div>

          {/* Quick Role Switcher for Demo / Evaluation */}
          <div className="hidden md:flex items-center space-x-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
            <span className="text-xs font-semibold text-slate-400 px-2">Quick Role:</span>
            {(['admin', 'receptionist', 'doctor', 'pharmacist'] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => switchRoleQuick(role)}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                  currentUser.role === role
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-200">{currentUser.name}</p>
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${roleColors[currentUser.role]}`}>
                  {roleIcons[currentUser.role]}
                  <span className="capitalize">{currentUser.role}</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                <UserCircle className="w-6 h-6" />
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
