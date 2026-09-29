import React, { useState } from 'react';
import { useHims } from '../context/HimsContext';
import { Users, Calendar, Stethoscope, Pill, AlertTriangle, Shield, Download, Upload, UserPlus } from 'lucide-react';

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
    restoreDatabase
  } = useHims();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'users' | 'backup'>('overview');

  // Add User Form State
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'receptionist' | 'doctor' | 'pharmacist'>('doctor');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // Backup / Restore state
  const [backupJson, setBackupJson] = useState('');
  const [restoreInput, setRestoreInput] = useState('');

  const lowStockDrugs = drugs.filter(d => getDrugStatus(d) === 'LOW STOCK' || getDrugStatus(d) === 'OUT OF STOCK');
  const todayAppointments = appointments.filter(a => a.appointment_date === new Date().toISOString().substring(0, 10));

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
  };

  const handleRestore = (e: React.FormEvent) => {
    e.preventDefault();
    restoreDatabase(restoreInput);
  };

  return (
    <div className="space-y-6">
      {/* Subnav */}
      <div className="flex space-x-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'overview'
              ? 'bg-purple-600 text-white shadow'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          Admin Overview & Metrics
        </button>
        <button
          onClick={() => setActiveSubTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'users'
              ? 'bg-purple-600 text-white shadow'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          System Users & Roles ({users.length})
        </button>
        <button
          onClick={() => setActiveSubTab('backup')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'backup'
              ? 'bg-purple-600 text-white shadow'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          Database Backup & Restore
        </button>
      </div>

      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Patients</p>
                <p className="text-2xl font-extrabold text-white mt-1">{patients.length}</p>
              </div>
              <div className="p-3 bg-blue-900/30 border border-blue-700/50 rounded-xl text-blue-400">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Today's Appointments</p>
                <p className="text-2xl font-extrabold text-white mt-1">{todayAppointments.length}</p>
              </div>
              <div className="p-3 bg-emerald-900/30 border border-emerald-700/50 rounded-xl text-emerald-400">
                <Calendar className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Doctors</p>
                <p className="text-2xl font-extrabold text-white mt-1">{doctors.length}</p>
              </div>
              <div className="p-3 bg-teal-900/30 border border-teal-700/50 rounded-xl text-teal-400">
                <Stethoscope className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pharmacy Inventory</p>
                <p className="text-2xl font-extrabold text-white mt-1">{drugs.length} Drugs</p>
              </div>
              <div className="p-3 bg-amber-900/30 border border-amber-700/50 rounded-xl text-amber-400">
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
                {lowStockDrugs.map(drug => {
                  const status = getDrugStatus(drug);
                  return (
                    <div key={drug.id} className="p-3 rounded-xl bg-slate-900 border border-rose-900/40 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-white">{drug.drug_name}</p>
                        <p className="text-slate-400">Qty: {drug.quantity} (Threshold: {drug.low_stock_level})</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${status === 'OUT OF STOCK' ? 'bg-rose-900 text-rose-200' : 'bg-amber-900 text-amber-200'}`}>
                        {status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent System Activity */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">System Audit & Recent Activities</h3>
            <div className="space-y-2">
              {activities.slice(0, 8).map(act => (
                <div key={act.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
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
        </div>
      )}

      {activeSubTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add User Form */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 lg:col-span-1">
            <div className="flex items-center space-x-2 text-purple-400">
              <UserPlus className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Create System User</h3>
            </div>
            <form onSubmit={handleAddUserSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Dr. Emem Etuk"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Username *</label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  placeholder="e.g. emem"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Role *</label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="admin">Administrator</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="doctor">Doctor</option>
                  <option value="pharmacist">Pharmacist</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Phone *</label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  placeholder="080XXXXXXXX"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="user@kithandkin.org"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-sm shadow-lg transition-all"
              >
                Create User Account
              </button>
            </form>
          </div>

          {/* Users Table */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 lg:col-span-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active Staff & System Users ({users.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-3 rounded-l-xl">Name</th>
                    <th className="p-3">Username</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3 rounded-r-xl">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-950/50">
                      <td className="p-3 font-bold text-white">{u.name}</td>
                      <td className="p-3 font-mono text-purple-400">{u.username}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 border border-slate-700 text-slate-300">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300">{u.phone}</td>
                      <td className="p-3 text-slate-300">{u.email}</td>
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
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 text-emerald-400">
              <Download className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Export Database Backup</h3>
            </div>
            <p className="text-xs text-slate-400">Generate a complete JSON backup of all patients, appointments, medical records, prescriptions, and inventory data.</p>
            <button
              onClick={handleBackup}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm shadow-lg transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Generate JSON Backup
            </button>
            {backupJson && (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-medium text-slate-300">Backup JSON Export:</label>
                <textarea
                  readOnly
                  rows={8}
                  value={backupJson}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300"
                />
              </div>
            )}
          </div>

          {/* Restore */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 text-amber-400">
              <Upload className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Restore Database from Backup</h3>
            </div>
            <p className="text-xs text-slate-400">Paste a valid HIMS JSON backup export below to restore database records.</p>
            <form onSubmit={handleRestore} className="space-y-3">
              <textarea
                rows={8}
                required
                value={restoreInput}
                onChange={e => setRestoreInput(e.target.value)}
                placeholder="Paste backup JSON string here..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl text-sm shadow-lg transition-all flex items-center gap-2"
              >
                <Upload className="w-4 h-4" /> Restore Database
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
