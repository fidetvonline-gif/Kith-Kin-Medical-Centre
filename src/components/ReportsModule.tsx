import React, { useState } from 'react';
import { useHims } from '../context/HimsContext';
import { BarChart3, Users, Calendar, Pill, Shield, Printer, Activity, TrendingUp, CheckCircle2 } from 'lucide-react';

export const ReportsModule: React.FC = () => {
  const { patients, appointments, drugs, inventoryTransactions, activities, getDrugStatus } = useHims();
  const [reportType, setReportType] = useState<'patients' | 'appointments' | 'pharmacy' | 'activities'>('patients');

  const lowStockDrugs = drugs.filter((d) => getDrugStatus(d) === 'LOW STOCK' || getDrugStatus(d) === 'OUT OF STOCK');
  const availableDrugs = drugs.filter((d) => getDrugStatus(d) === 'AVAILABLE');
  const totalStockUnits = drugs.reduce((acc, d) => acc + d.quantity, 0);
  const totalStockValuation = drugs.reduce((acc, d) => acc + d.quantity * d.unit_price, 0);

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Hospital Intelligence
            </span>
            <span className="text-xs text-slate-400">Clinical & Operational Reports</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Executive Management Reports</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational summaries, patient demographics, OPD queue throughput, pharmacy stock movements, and audit records.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handlePrintReport}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Subnav Pills */}
      <div className="flex space-x-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
        {(
          [
            { id: 'patients', label: 'Patient Registry Summary', icon: <Users className="w-3.5 h-3.5" /> },
            { id: 'appointments', label: 'OPD Appointments Statistics', icon: <Calendar className="w-3.5 h-3.5" /> },
            { id: 'pharmacy', label: 'Pharmacy Stock & Valuation', icon: <Pill className="w-3.5 h-3.5" /> },
            { id: 'activities', label: 'System Audit Trail', icon: <Shield className="w-3.5 h-3.5" /> }
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              reportType === tab.id
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Patient Reports */}
      {reportType === 'patients' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-sky-400" /> Patient Demographic Distribution
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Total Registered Patients</p>
              <p className="text-3xl font-extrabold text-white mt-1 font-mono">{patients.length}</p>
              <p className="text-[11px] text-slate-500 mt-1">100% Computerized EMR</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Male Patients</p>
              <p className="text-3xl font-extrabold text-sky-400 mt-1 font-mono">
                {patients.filter((p) => p.gender === 'Male').length}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                {patients.length > 0
                  ? Math.round((patients.filter((p) => p.gender === 'Male').length / patients.length) * 100)
                  : 0}
                % of total patient base
              </p>
            </div>
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Female Patients</p>
              <p className="text-3xl font-extrabold text-rose-400 mt-1 font-mono">
                {patients.filter((p) => p.gender === 'Female').length}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                {patients.length > 0
                  ? Math.round((patients.filter((p) => p.gender === 'Female').length / patients.length) * 100)
                  : 0}
                % of total patient base
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Appointment Reports */}
      {reportType === 'appointments' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" /> Outpatient Department (OPD) Performance
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Total Encounters</p>
              <p className="text-3xl font-extrabold text-white mt-1 font-mono">{appointments.length}</p>
              <p className="text-[11px] text-slate-500 mt-1">Booked Appointments</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Scheduled / In Queue</p>
              <p className="text-3xl font-extrabold text-amber-400 mt-1 font-mono">
                {appointments.filter((a) => a.status === 'Scheduled' || a.status === 'Waiting').length}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Pending Consultation</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Completed Consultations</p>
              <p className="text-3xl font-extrabold text-emerald-400 mt-1 font-mono">
                {appointments.filter((a) => a.status === 'Completed').length}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Physician Checked</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Cancelled Visits</p>
              <p className="text-3xl font-extrabold text-rose-400 mt-1 font-mono">
                {appointments.filter((a) => a.status === 'Cancelled').length}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Rescheduled or Cancelled</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Pharmacy Reports */}
      {reportType === 'pharmacy' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Pill className="w-4 h-4 text-amber-400" /> Pharmacy Inventory & Formulary Valuation
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Stock Store Valuation</p>
              <p className="text-2xl font-extrabold text-emerald-400 mt-1 font-mono">
                ₦{totalStockValuation.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">{totalStockUnits} Total units in store</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Formulary Drugs</p>
              <p className="text-3xl font-extrabold text-white mt-1 font-mono">{drugs.length}</p>
              <p className="text-[11px] text-slate-500 mt-1">Unique pharmaceutical lines</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Healthy Stock Level</p>
              <p className="text-3xl font-extrabold text-emerald-400 mt-1 font-mono">{availableDrugs.length}</p>
              <p className="text-[11px] text-slate-500 mt-1">Sufficient inventory</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Low & Out of Stock</p>
              <p className="text-3xl font-extrabold text-rose-400 mt-1 font-mono">{lowStockDrugs.length}</p>
              <p className="text-[11px] text-slate-500 mt-1">Action required</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: System Audit */}
      {reportType === 'activities' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400" /> Complete System Audit Trail
          </h3>
          <div className="space-y-2">
            {activities.map((act) => (
              <div
                key={act.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2"
              >
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-semibold uppercase text-[10px] border border-purple-800">
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
