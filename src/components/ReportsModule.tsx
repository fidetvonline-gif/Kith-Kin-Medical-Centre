import React, { useState } from 'react';
import { useHims } from '../context/HimsContext';
import { BarChart3, Users, Calendar, Pill, Shield } from 'lucide-react';

export const ReportsModule: React.FC = () => {
  const { patients, appointments, drugs, inventoryTransactions, activities, getDrugStatus } = useHims();
  const [reportType, setReportType] = useState<'patients' | 'appointments' | 'pharmacy' | 'activities'>('patients');

  const lowStockDrugs = drugs.filter(d => getDrugStatus(d) === 'LOW STOCK' || getDrugStatus(d) === 'OUT OF STOCK');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-extrabold text-white">HIMS Summary Reports</h2>
          <p className="text-xs text-slate-400 mt-1">Hospital operational reports, inventory status summaries, and system audit logs.</p>
        </div>
        <div className="flex space-x-2">
          {(['patients', 'appointments', 'pharmacy', 'activities'] as const).map(type => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                reportType === type
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {reportType === 'patients' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" /> Patient Registration Summary Report
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-xs text-slate-400 uppercase">Total Registered Patients</p>
              <p className="text-2xl font-extrabold text-white mt-1">{patients.length}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-xs text-slate-400 uppercase">Male Patients</p>
              <p className="text-2xl font-extrabold text-blue-400 mt-1">{patients.filter(p => p.gender === 'Male').length}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-xs text-slate-400 uppercase">Female Patients</p>
              <p className="text-2xl font-extrabold text-rose-400 mt-1">{patients.filter(p => p.gender === 'Female').length}</p>
            </div>
          </div>
        </div>
      )}

      {reportType === 'appointments' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" /> Appointment Statistics Report
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-xs text-slate-400 uppercase">Total Appointments</p>
              <p className="text-2xl font-extrabold text-white mt-1">{appointments.length}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-xs text-slate-400 uppercase">Scheduled / Waiting</p>
              <p className="text-2xl font-extrabold text-amber-400 mt-1">{appointments.filter(a => a.status === 'Scheduled' || a.status === 'Waiting').length}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-xs text-slate-400 uppercase">Completed</p>
              <p className="text-2xl font-extrabold text-emerald-400 mt-1">{appointments.filter(a => a.status === 'Completed').length}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-xs text-slate-400 uppercase">Cancelled</p>
              <p className="text-2xl font-extrabold text-rose-400 mt-1">{appointments.filter(a => a.status === 'Cancelled').length}</p>
            </div>
          </div>
        </div>
      )}

      {reportType === 'pharmacy' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Pill className="w-4 h-4 text-amber-400" /> Pharmacy Inventory & Stock Report
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-xs text-slate-400 uppercase">Total Drug Items</p>
              <p className="text-2xl font-extrabold text-white mt-1">{drugs.length}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-xs text-slate-400 uppercase">Available In Stock</p>
              <p className="text-2xl font-extrabold text-emerald-400 mt-1">{drugs.filter(d => getDrugStatus(d) === 'AVAILABLE').length}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-xs text-slate-400 uppercase">Low / Out of Stock Alerts</p>
              <p className="text-2xl font-extrabold text-rose-400 mt-1">{lowStockDrugs.length}</p>
            </div>
          </div>
        </div>
      )}

      {reportType === 'activities' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400" /> System Audit Trail
          </h3>
          <div className="space-y-2">
            {activities.map(act => (
              <div key={act.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-0.5 rounded bg-purple-900/50 text-purple-300 font-semibold uppercase text-[10px] border border-purple-700">
                    {act.role}
                  </span>
                  <span className="text-slate-200 font-medium">{act.action}</span>
                  <span className="text-slate-400">by {act.user_name}</span>
                </div>
                <span className="text-slate-500 font-mono text-[11px]">{act.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
