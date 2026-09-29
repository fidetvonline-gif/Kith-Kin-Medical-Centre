import React, { useState } from 'react';
import { HimsProvider, useHims } from './context/HimsContext';
import { Navbar } from './components/Navbar';
import { LoginScreen } from './components/LoginScreen';
import { Toast } from './components/Toast';
import { AdminDashboard } from './components/AdminDashboard';
import { ReceptionistDashboard } from './components/ReceptionistDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { PharmacistDashboard } from './components/PharmacistDashboard';
import { ReportsModule } from './components/ReportsModule';
import { LayoutDashboard, BarChart3, Building2 } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentUser } = useHims();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports'>('dashboard');

  if (!currentUser) {
    return <LoginScreen />;
  }

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
      default:
        return <DoctorDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={(tab: string) => setActiveTab(tab as any)} />

      {/* Navigation Subbar */}
      <div className="bg-slate-900/60 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-300">Case Study: Kith and Kin Medical Centre, Ibo Hall, Ikot Ekpene</span>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="capitalize">{currentUser.role} Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'reports'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Reports & Audit
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' ? renderDashboard() : <ReportsModule />}
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        Hospital Information Management System (HIMS) • Kith and Kin Medical Centre, Ikot Ekpene, Akwa Ibom State
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
