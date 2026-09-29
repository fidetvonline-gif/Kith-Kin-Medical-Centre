import React, { useState, useEffect } from 'react';
import { useHims } from '../context/HimsContext';
import { UserRole } from '../types';
import {
  Building2,
  UserCircle,
  LogOut,
  Shield,
  Stethoscope,
  Pill,
  UserCheck,
  Activity,
  Heart
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, logout, switchRoleQuick, isCloudConnected } = useHims();
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!currentUser) return null;

  const roleConfigs: Record<UserRole, { label: string; icon: React.ReactNode; badgeColor: string }> = {
    admin: {
      label: 'Administrator',
      icon: <Shield className="w-3.5 h-3.5" />,
      badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30'
    },
    receptionist: {
      label: 'Reception Desk',
      icon: <UserCheck className="w-3.5 h-3.5" />,
      badgeColor: 'bg-sky-500/15 text-sky-300 border-sky-500/30'
    },
    doctor: {
      label: 'Consulting Doctor',
      icon: <Stethoscope className="w-3.5 h-3.5" />,
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    },
    pharmacist: {
      label: 'Pharmacy Unit',
      icon: <Pill className="w-3.5 h-3.5" />,
      badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
    },
    patient: {
      label: 'Patient Portal',
      icon: <Heart className="w-3.5 h-3.5 text-rose-400" />,
      badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30'
    }
  };

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Hospital Branding */}
          <div className="flex items-center space-x-3.5">
            <div className="relative p-2.5 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-xl text-white shadow-md shadow-emerald-900/40 border border-emerald-400/30">
              <Building2 className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-900 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-sm sm:text-base font-bold text-white tracking-wide font-sans">
                  KITH & KIN MEDICAL CENTRE
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                  <Activity className="w-3 h-3 text-emerald-400" /> HIMS v2.4
                </span>
                {isCloudConnected ? (
                  <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Supabase Cloud Active
                  </span>
                ) : (
                  <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Supabase Ready
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span>Ibo Hall, Ikot Ekpene</span>
                <span className="text-slate-600">•</span>
                <span className="font-mono text-emerald-400/90 font-medium">{timeStr}</span>
              </p>
            </div>
          </div>

          {/* Quick Role Switcher for Seamless Testing & Evaluation */}
          <div className="hidden lg:flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 shadow-inner">
            <span className="text-[11px] font-medium text-slate-400 px-2.5 select-none">Switch Portal:</span>
            {(['doctor', 'receptionist', 'pharmacist', 'admin', 'patient'] as UserRole[]).map((role) => {
              const config = roleConfigs[role];
              const isActive = currentUser.role === role;
              return (
                <button
                  key={role}
                  onClick={() => switchRoleQuick(role)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className={isActive ? 'text-emerald-400' : 'text-slate-500'}>{config.icon}</span>
                  <span className="capitalize">{role === 'patient' ? 'Patient Portal' : role}</span>
                </button>
              );
            })}
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center space-x-3">
            <PWAInstallButton />

            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-200 leading-tight">{currentUser.name}</p>
              <div
                className={`mt-0.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${roleConfigs[currentUser.role]?.badgeColor || 'bg-slate-800 text-slate-300'}`}
              >
                {roleConfigs[currentUser.role]?.icon}
                <span>{roleConfigs[currentUser.role]?.label || currentUser.role}</span>
              </div>
            </div>

            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-300 shadow-inner">
              <UserCircle className="w-5 h-5 text-emerald-400" />
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-xl border border-transparent hover:border-slate-700 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
