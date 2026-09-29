import React, { useState } from 'react';
import { useHims } from '../context/HimsContext';
import { Prescription, Drug } from '../types';
import { Pill, AlertTriangle, Plus, Search, CheckCircle, Clock, Database, PlusCircle } from 'lucide-react';
import { DispenseModal } from './DispenseModal';
import { AddDrugModal } from './AddDrugModal';
import { AddStockModal } from './AddStockModal';

export const PharmacistDashboard: React.FC = () => {
  const { prescriptions, drugs, inventoryTransactions, getDrugStatus } = useHims();

  const [activeSubTab, setActiveSubTab] = useState<'prescriptions' | 'inventory' | 'transactions'>('prescriptions');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [selectedRxForDispense, setSelectedRxForDispense] = useState<Prescription | null>(null);
  const [isAddDrugOpen, setIsAddDrugOpen] = useState(false);
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [restockDrugId, setRestockDrugId] = useState<string | undefined>();

  const availableCount = drugs.filter(d => getDrugStatus(d) === 'AVAILABLE').length;
  const lowStockCount = drugs.filter(d => getDrugStatus(d) === 'LOW STOCK').length;
  const outStockCount = drugs.filter(d => getDrugStatus(d) === 'OUT OF STOCK').length;
  const pendingRxCount = prescriptions.filter(p => p.status === 'Pending').length;

  const filteredPrescriptions = prescriptions.filter(p =>
    p.prescription_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.patient_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDrugs = drugs.filter(d =>
    d.drug_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Pending Rx</p>
            <p className="text-2xl font-extrabold text-amber-400 mt-1">{pendingRxCount}</p>
          </div>
          <div className="p-3 bg-amber-900/30 border border-amber-700/50 rounded-xl text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Drugs</p>
            <p className="text-2xl font-extrabold text-white mt-1">{drugs.length}</p>
          </div>
          <div className="p-3 bg-blue-900/30 border border-blue-700/50 rounded-xl text-blue-400">
            <Pill className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Available Stock</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">{availableCount}</p>
          </div>
          <div className="p-3 bg-emerald-900/30 border border-emerald-700/50 rounded-xl text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Low Stock</p>
            <p className="text-2xl font-extrabold text-amber-400 mt-1">{lowStockCount}</p>
          </div>
          <div className="p-3 bg-amber-900/30 border border-amber-700/50 rounded-xl text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Out of Stock</p>
            <p className="text-2xl font-extrabold text-rose-400 mt-1">{outStockCount}</p>
          </div>
          <div className="p-3 bg-rose-900/30 border border-rose-700/50 rounded-xl text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Subnav & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveSubTab('prescriptions')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'prescriptions'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Prescription Queue ({prescriptions.length})
          </button>
          <button
            onClick={() => setActiveSubTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'inventory'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Drug Inventory ({drugs.length})
          </button>
          <button
            onClick={() => setActiveSubTab('transactions')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'transactions'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Inventory Transactions
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative max-w-xs w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search prescription or drug..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            onClick={() => setIsAddDrugOpen(true)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl text-xs shadow-lg transition-all flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> Add New Drug
          </button>
        </div>
      </div>

      {/* Prescriptions Tab */}
      {activeSubTab === 'prescriptions' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" /> Prescription Queue & Dispensing
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-xl">Prescription ID</th>
                  <th className="p-3">Patient ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Drugs Prescribed</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 rounded-r-xl text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredPrescriptions.map(rx => (
                  <tr key={rx.id} className="hover:bg-slate-950/50">
                    <td className="p-3 font-mono font-bold text-amber-400">{rx.prescription_id}</td>
                    <td className="p-3 font-mono font-bold text-blue-400">{rx.patient_id}</td>
                    <td className="p-3 text-slate-300">{rx.prescription_date}</td>
                    <td className="p-3">
                      <div className="space-y-0.5">
                        {rx.items.map(item => (
                          <p key={item.id} className="text-slate-200">• {item.drug_name} ({item.dosage}) - Qty: {item.quantity}</p>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${rx.status === 'Dispensed' ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700' : 'bg-amber-900/50 text-amber-300 border border-amber-700'}`}>
                        {rx.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {rx.status === 'Pending' ? (
                        <button
                          onClick={() => setSelectedRxForDispense(rx)}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold shadow inline-flex items-center gap-1"
                        >
                          <Pill className="w-3.5 h-3.5" /> Dispense Rx
                        </button>
                      ) : (
                        <span className="text-emerald-400 font-semibold inline-flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Dispensed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Drug Inventory Tab */}
      {activeSubTab === 'inventory' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-400" /> Pharmacy Drug Inventory & Real-Time Stock Status
            </h3>
            <button
              onClick={() => {
                setRestockDrugId(undefined);
                setIsAddStockOpen(true);
              }}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs shadow inline-flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Restock Inventory
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-xl">Drug Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Unit Price (₦)</th>
                  <th className="p-3">Expiry Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 rounded-r-xl text-right">Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredDrugs.map(drug => {
                  const status = getDrugStatus(drug);
                  const statusStyles = {
                    'AVAILABLE': 'bg-emerald-900/50 text-emerald-300 border-emerald-700',
                    'LOW STOCK': 'bg-amber-900/50 text-amber-300 border-amber-700',
                    'OUT OF STOCK': 'bg-rose-900/50 text-rose-300 border-rose-700'
                  };
                  return (
                    <tr key={drug.id} className="hover:bg-slate-950/50">
                      <td className="p-3 font-bold text-white">{drug.drug_name}</td>
                      <td className="p-3 text-slate-300">{drug.category}</td>
                      <td className="p-3 font-extrabold text-white">{drug.quantity}</td>
                      <td className="p-3 text-slate-200">₦{drug.unit_price.toLocaleString()}</td>
                      <td className="p-3 text-slate-300">{drug.expiry_date}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusStyles[status]}`}>
                          {status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setRestockDrugId(drug.id);
                            setIsAddStockOpen(true);
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium inline-flex items-center gap-1"
                        >
                          <PlusCircle className="w-3 h-3" /> Restock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inventory Transactions Tab */}
      {activeSubTab === 'transactions' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-400" /> Inventory Transactions Audit Log
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-xl">Timestamp</th>
                  <th className="p-3">Drug Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Reference</th>
                  <th className="p-3 rounded-r-xl">Performed By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {inventoryTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-950/50">
                    <td className="p-3 font-mono text-slate-400">{tx.created_at}</td>
                    <td className="p-3 font-bold text-white">{tx.drug_name}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${tx.transaction_type === 'STOCK_IN' ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700' : 'bg-amber-900/50 text-amber-300 border border-amber-700'}`}>
                        {tx.transaction_type}
                      </span>
                    </td>
                    <td className="p-3 font-extrabold text-white">{tx.quantity}</td>
                    <td className="p-3 text-slate-300">{tx.reference}</td>
                    <td className="p-3 text-slate-300">{tx.performed_by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <DispenseModal
        prescription={selectedRxForDispense}
        isOpen={Boolean(selectedRxForDispense)}
        onClose={() => setSelectedRxForDispense(null)}
      />
      <AddDrugModal
        isOpen={isAddDrugOpen}
        onClose={() => setIsAddDrugOpen(false)}
      />
      <AddStockModal
        isOpen={isAddStockOpen}
        onClose={() => setIsAddStockOpen(false)}
        drugId={restockDrugId}
      />
    </div>
  );
};
