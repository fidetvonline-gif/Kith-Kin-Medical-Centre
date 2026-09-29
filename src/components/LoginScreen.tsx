import React, { useState } from 'react';
import { useHims } from '../context/HimsContext';
import { UserRole } from '../types';
import { Building2, Shield, UserCheck, Stethoscope, Pill, Lock, User, ArrowRight } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login } = useHims();
  const [selectedRole, setSelectedRole] = useState<UserRole>('doctor');
  const [username, setUsername] = useState('doctor');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, selectedRole);
  };

  const roleCards: Array<{ role: UserRole; title: string; desc: string; icon: React.ReactNode; color: string }> = [
    {
      role: 'doctor',
      title: 'Doctor Portal',
      desc: 'View appointments, record consultations & issue prescriptions',
      icon: <Stethoscope className="w-6 h-6 text-emerald-400" />,
      color: 'border-emerald-500/50 bg-emerald-950/20 hover:bg-emerald-900/30'
    },
    {
      role: 'receptionist',
      title: 'Reception Desk',
      desc: 'Register patients, generate ID & book appointments',
      icon: <UserCheck className="w-6 h-6 text-blue-400" />,
      color: 'border-blue-500/50 bg-blue-950/20 hover:bg-blue-900/30'
    },
    {
      role: 'pharmacist',
      title: 'Pharmacy Unit',
      desc: 'Dispense prescriptions, manage inventory & stock updates',
      icon: <Pill className="w-6 h-6 text-amber-400" />,
      color: 'border-amber-500/50 bg-amber-950/20 hover:bg-amber-900/30'
    },
    {
      role: 'admin',
      title: 'Administrator',
      desc: 'Manage users, view system records, audit & database backup',
      icon: <Shield className="w-6 h-6 text-purple-400" />,
      color: 'border-purple-500/50 bg-purple-950/20 hover:bg-purple-900/30'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center mb-8">
        <div className="inline-flex p-3 bg-emerald-600 rounded-2xl shadow-xl mb-4">
          <Building2 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          KITH & KIN MEDICAL CENTRE
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Ibo Hall, Ikot Ekpene, Akwa Ibom State • Hospital Information Management System (HIMS)
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">Select Role to Sign In</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {roleCards.map(card => (
              <button
                key={card.role}
                type="button"
                onClick={() => handleRoleSelect(card.role)}
                className={`text-left p-4 rounded-xl border transition-all flex items-start space-x-3 ${
                  selectedRole === card.role
                    ? `${card.color} ring-2 ring-emerald-500 shadow-lg`
                    : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800/50'
                }`}
              >
                <div className="p-2 rounded-lg bg-slate-800 shrink-0">
                  {card.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">{card.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{card.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-800">
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">
                Username / Staff ID
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
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">
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
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Default demo password for all roles: <code className="text-emerald-400">password123</code></p>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg transition-all"
            >
              <span>Sign In as <span className="capitalize">{selectedRole}</span></span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
