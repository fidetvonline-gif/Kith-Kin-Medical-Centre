import React, { useState } from 'react';
import { useHims } from '../context/HimsContext';
import { HIMS_SUPABASE_SQL_SCHEMA } from '../lib/supabase';
import {
  Users,
  Calendar,
  Stethoscope,
  Pill,
  AlertTriangle,
  Shield,
  Download,
  Upload,
  UserPlus,
  Activity,
  FileCheck,
  CheckCircle2,
  Lock,
  Phone,
  Mail,
  UserCheck,
  Database,
  Copy,
  Check
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    patients,
    appointments,
    doctors,
    drugs,
    users,
    activities,
    getDrugStatus,
    addUser,
    backupDatabase,
    restoreDatabase,
    isCloudConnected,
    syncStatus
  } = useHims();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'users' | 'backup' | 'supabase'>('overview');
  const [copiedSql, setCopiedSql] = useState(false);

  // Add User Form State
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'receptionist' | 'doctor' | 'pharmacist'>('doctor');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // Backup / Restore state
  const [backupJson, setBackupJson] = useState('');
  const [restoreInput, setRestoreInput] = useState('');

  const lowStockDrugs = drugs.filter(
    (d) => getDrugStatus(d) === 'LOW STOCK' || getDrugStatus(d) === 'OUT OF STOCK'
  );
  const todayAppointments = appointments.filter(
    (a) => a.appointment_date === new Date().toISOString().substring(0, 10)
  );

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addUser({
      name: newName,
      username: newUsername,
      role: newRole,
      phone: newPhone,
      email: newEmail
    });
    setNewName('');
    setNewUsername('');
    setNewPhone('');
    setNewEmail('');
  };

  const handleBackup = () => {
    const json = backupDatabase();
    setBackupJson(json);

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kith_and_kin_hims_backup_${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestore = (e: React.FormEvent) => {
    e.preventDefault();
    restoreDatabase(restoreInput);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(HIMS_SUPABASE_SQL_SCHEMA.trim());
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Subnav */}
      <div className="flex flex-wrap gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'overview'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>System Overview & Health</span>
        </button>
        <button
          onClick={() => setActiveSubTab('users')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'users'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Staff Accounts ({users.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('backup')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'backup'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Database Backup & Restore</span>
        </button>
        <button
          onClick={() => setActiveSubTab('supabase')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'supabase'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>Supabase SQL Schema</span>
        </button>
      </div>

      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Patients</p>
                <p className="text-2xl font-extrabold text-white mt-1">{patients.length}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Centralized Records</p>
              </div>
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Today's OPD Queue</p>
                <p className="text-2xl font-extrabold text-white mt-1">{todayAppointments.length}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Booked Consultations</p>
              </div>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                <Calendar className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Medical Officers</p>
                <p className="text-2xl font-extrabold text-white mt-1">{doctors.length}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Active Staff Roster</p>
              </div>
              <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-400">
                <Stethoscope className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Formulary Drugs</p>
                <p className="text-2xl font-extrabold text-white mt-1">{drugs.length}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Inventory Catalog</p>
              </div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
                <Pill className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Low Stock Alerts */}
          {lowStockDrugs.length > 0 && (
            <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-900/50 shadow-xl space-y-3">
              <div className="flex items-center space-x-2 text-rose-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Critical Inventory Alerts ({lowStockDrugs.length})</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {lowStockDrugs.map((drug) => {
                  const status = getDrugStatus(drug);
                  return (
                    <div
                      key={drug.id}
                      className="p-3 rounded-xl bg-slate-900 border border-rose-900/40 flex justify-between items-center text-xs"
                    >
                      <div>
                        <p className="font-bold text-white">{drug.drug_name}</p>
                        <p className="text-slate-400">
                          Qty: <strong className="text-white font-mono">{drug.quantity}</strong> (Min: {drug.low_stock_level})
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          status === 'OUT OF STOCK'
                            ? 'bg-rose-950 text-rose-200 border-rose-800'
                            : 'bg-amber-950 text-amber-200 border-amber-800'
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent System Activity */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" /> Hospital Operational Audit Trail
            </h3>
            <div className="space-y-2">
              {activities.slice(0, 10).map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2"
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
        </div>
      )}

      {activeSubTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add User Form */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 lg:col-span-1">
            <div className="flex items-center space-x-2 text-purple-400">
              <UserPlus className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Register Staff Account</h3>
            </div>
            <form onSubmit={handleAddUserSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Staff Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Dr. Emem Etuk"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Username / ID *</label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g. emem.doctor"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Department Role *</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="doctor">Consulting Doctor</option>
                  <option value="receptionist">Reception Desk</option>
                  <option value="pharmacist">Pharmacy Unit</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="080XXXXXXXX"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="staff@kithandkin.org"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-semibold rounded-xl text-xs shadow-lg shadow-purple-950/50 transition-all cursor-pointer"
              >
                Create Staff Account
              </button>
            </form>
          </div>

          {/* Users Table */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 lg:col-span-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" /> Active Hospital Staff Roster ({users.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">Staff Name</th>
                    <th className="p-3.5">Username</th>
                    <th className="p-3.5">Assigned Role</th>
                    <th className="p-3.5">Contact Phone</th>
                    <th className="p-3.5 rounded-r-xl">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-950/40 transition-colors">
                      <td className="p-3.5 font-bold text-white">{u.name}</td>
                      <td className="p-3.5 font-mono text-purple-400">{u.username}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 border border-slate-700 text-slate-300">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-300 font-mono">{u.phone}</td>
                      <td className="p-3.5 text-slate-300 truncate max-w-xs">{u.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'backup' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Backup */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 text-emerald-400">
              <Download className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Export Database Backup</h3>
            </div>
            <p className="text-xs text-slate-400">
              Generate a snapshot JSON backup of all registered patients, doctor appointments, consultations, prescriptions, and pharmacy inventory transactions.
            </p>
            <button
              onClick={handleBackup}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-emerald-950/50 border border-emerald-400/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download JSON Backup File
            </button>
            {backupJson && (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-slate-300">Backup JSON Data Stream:</label>
                <textarea
                  readOnly
                  rows={8}
                  value={backupJson}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-slate-300"
                />
              </div>
            )}
          </div>

          {/* Restore */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 text-amber-400">
              <Upload className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Restore Database from Backup</h3>
            </div>
            <p className="text-xs text-slate-400">
              Paste a valid HIMS JSON backup export string below to restore all hospital database records.
            </p>
            <form onSubmit={handleRestore} className="space-y-3">
              <textarea
                rows={8}
                required
                value={restoreInput}
                onChange={(e) => setRestoreInput(e.target.value)}
                placeholder="Paste backup JSON string here..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-slate-300 focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-amber-950/50 border border-amber-400/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" /> Restore Database
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab: Supabase SQL Schema */}
      {activeSubTab === 'supabase' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" /> Supabase Database Schema & Cloud Setup
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Current Status:{' '}
                <strong className={isCloudConnected ? 'text-emerald-400' : 'text-amber-400'}>
                  {isCloudConnected ? 'Supabase Cloud Connected' : 'Local Storage Cache Active (Ready for Supabase Keys)'}
                </strong>
              </p>
            </div>

            <button
              onClick={handleCopySql}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shadow-sm"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy Supabase SQL Schema'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
            <p className="font-semibold text-white">To link your own Supabase Cloud project:</p>
            <ol className="list-decimal list-inside space-y-1 text-slate-400">
              <li>Create a new project at <code className="text-emerald-400">supabase.com</code>.</li>
              <li>Go to <strong>SQL Editor</strong> in Supabase, paste the SQL schema below, and click <strong>RUN</strong>.</li>
              <li>Set <code className="text-emerald-400 font-mono">VITE_SUPABASE_URL</code> and <code className="text-emerald-400 font-mono">VITE_SUPABASE_ANON_KEY</code> in your environment.</li>
            </ol>
          </div>

          <textarea
            readOnly
            rows={14}
            value={HIMS_SUPABASE_SQL_SCHEMA.trim()}
            className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-300/90 leading-relaxed focus:outline-none select-all"
          />
        </div>
      )}
    </div>
  );
};
