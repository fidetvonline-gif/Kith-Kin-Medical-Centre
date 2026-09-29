import React, { useState } from 'react';
import { useHims } from '../context/HimsContext';
import { Prescription, Drug } from '../types';
import {
  Pill,
  AlertTriangle,
  Plus,
  Search,
  CheckCircle,
  Clock,
  Database,
  PlusCircle,
  TrendingDown,
  FileSpreadsheet,
  Coins,
  PackageCheck
} from 'lucide-react';
import { DispenseModal } from './DispenseModal';
import { AddDrugModal } from './AddDrugModal';
import { AddStockModal } from './AddStockModal';

export const PharmacistDashboard: React.FC = () => {
  const { prescriptions, drugs, inventoryTransactions, getDrugStatus } = useHims();

  const [activeSubTab, setActiveSubTab] = useState<'prescriptions' | 'inventory' | 'transactions'>('prescriptions');
  const [searchTerm, setSearchTerm] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState<'ALL' | 'AVAILABLE' | 'LOW STOCK' | 'OUT OF STOCK'>('ALL');
  const [rxStatusFilter, setRxStatusFilter] = useState<'ALL' | 'Pending' | 'Dispensed'>('ALL');

  // Modals
  const [selectedRxForDispense, setSelectedRxForDispense] = useState<Prescription | null>(null);
  const [isAddDrugOpen, setIsAddDrugOpen] = useState(false);
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [restockDrugId, setRestockDrugId] = useState<string | undefined>();

  const availableCount = drugs.filter((d) => getDrugStatus(d) === 'AVAILABLE').length;
  const lowStockCount = drugs.filter((d) => getDrugStatus(d) === 'LOW STOCK').length;
  const outStockCount = drugs.filter((d) => getDrugStatus(d) === 'OUT OF STOCK').length;
  const pendingRxCount = prescriptions.filter((p) => p.status === 'Pending').length;

  // Calculate total inventory monetary valuation in Naira
  const totalInventoryValue = drugs.reduce((acc, d) => acc + d.quantity * d.unit_price, 0);

  const filteredPrescriptions = prescriptions.filter((p) => {
    const matchesFilter = rxStatusFilter === 'ALL' || p.status === rxStatusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      p.prescription_id.toLowerCase().includes(term) ||
      p.patient_id.toLowerCase().includes(term) ||
      p.items.some((i) => i.drug_name.toLowerCase().includes(term));
    return matchesFilter && matchesSearch;
  });

  const filteredDrugs = drugs.filter((d) => {
    const status = getDrugStatus(d);
    const matchesFilter = stockStatusFilter === 'ALL' || status === stockStatusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      d.drug_name.toLowerCase().includes(term) ||
      d.category.toLowerCase().includes(term) ||
      d.supplier.toLowerCase().includes(term);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Pharmacy Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Pending Prescriptions</p>
            <p className="text-2xl font-extrabold text-amber-300 mt-1">{pendingRxCount}</p>
            <p className="text-[11px] text-amber-500/80 mt-0.5">Awaiting Dispensing</p>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Formulary Drugs</p>
            <p className="text-2xl font-extrabold text-white mt-1">{drugs.length}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Cataloged items</p>
          </div>
          <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-400">
            <Pill className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Available In Stock</p>
            <p className="text-2xl font-extrabold text-emerald-300 mt-1">{availableCount}</p>
            <p className="text-[11px] text-emerald-500/80 mt-0.5">Adequate supply</p>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <PackageCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Low Stock Warnings</p>
            <p className="text-2xl font-extrabold text-amber-300 mt-1">{lowStockCount}</p>
            <p className="text-[11px] text-amber-500/80 mt-0.5">Below threshold</p>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">Out of Stock</p>
            <p className="text-2xl font-extrabold text-rose-300 mt-1">{outStockCount}</p>
            <p className="text-[11px] text-rose-500/80 mt-0.5">Requires Reorder</p>
          </div>
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Subnav & Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('prescriptions')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'prescriptions'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-950/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Prescription Queue ({prescriptions.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('inventory')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'inventory'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-950/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Pharmacy Stock Store ({drugs.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('transactions')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'transactions'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-950/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Stock Ledger Audit</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {activeSubTab === 'inventory' && (
            <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
              {(['ALL', 'AVAILABLE', 'LOW STOCK', 'OUT OF STOCK'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStockStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    stockStatusFilter === st ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          )}

          {activeSubTab === 'prescriptions' && (
            <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
              {(['ALL', 'Pending', 'Dispensed'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setRxStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    rxStatusFilter === st ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          )}

          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search prescription or drug..."
              className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            onClick={() => setIsAddDrugOpen(true)}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-amber-950/40 border border-amber-400/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Drug</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Prescriptions Queue */}
      {activeSubTab === 'prescriptions' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" /> Prescriptions Dispensing Queue
            </h3>
            <span className="text-xs text-slate-400">{filteredPrescriptions.length} prescriptions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Prescription #</th>
                  <th className="p-3.5">Patient ID</th>
                  <th className="p-3.5">Date Issued</th>
                  <th className="p-3.5">Prescribed Medications</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 rounded-r-xl text-right">Dispensing Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {filteredPrescriptions.map((rx) => (
                  <tr key={rx.id} className="hover:bg-slate-950/40 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-amber-400">{rx.prescription_id}</td>
                    <td className="p-3.5 font-mono font-bold text-sky-400">{rx.patient_id}</td>
                    <td className="p-3.5 text-slate-300">{rx.prescription_date}</td>
                    <td className="p-3.5">
                      <div className="space-y-1">
                        {rx.items.map((item) => (
                          <div key={item.id} className="text-slate-200">
                            <span className="font-semibold">• {item.drug_name}</span> ({item.dosage}) —{' '}
                            <span className="text-amber-400 font-mono">Qty: {item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-semibold border ${
                          rx.status === 'Dispensed'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-300 border-amber-500/30 animate-pulse'
                        }`}
                      >
                        {rx.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      {rx.status === 'Pending' ? (
                        <button
                          onClick={() => setSelectedRxForDispense(rx)}
                          className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold text-xs shadow-md shadow-amber-950/50 inline-flex items-center gap-1.5 border border-amber-400/30 transition-all cursor-pointer"
                        >
                          <Pill className="w-3.5 h-3.5" /> Dispense Rx
                        </button>
                      ) : (
                        <span className="text-emerald-400 font-semibold inline-flex items-center gap-1.5 text-xs">
                          <CheckCircle className="w-4 h-4" /> Dispensed
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

      {/* Tab 2: Drug Inventory */}
      {activeSubTab === 'inventory' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" /> Hospital Pharmacy Drug Stock & Pricing
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Total Store Valuation:{' '}
                <strong className="text-emerald-400 font-mono">₦{totalInventoryValue.toLocaleString()}</strong>
              </p>
            </div>

            <button
              onClick={() => {
                setRestockDrugId(undefined);
                setIsAddStockOpen(true);
              }}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs shadow-sm inline-flex items-center gap-1.5 border border-emerald-400/30 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Restock Items
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Drug Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">In Stock Qty</th>
                  <th className="p-3.5">Unit Price (₦)</th>
                  <th className="p-3.5">Expiry Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 rounded-r-xl text-right">Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {filteredDrugs.map((drug) => {
                  const status = getDrugStatus(drug);
                  const statusStyles: Record<string, string> = {
                    AVAILABLE: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
                    'LOW STOCK': 'bg-amber-500/15 text-amber-300 border-amber-500/30 font-bold',
                    'OUT OF STOCK': 'bg-rose-500/15 text-rose-300 border-rose-500/30 font-bold'
                  };

                  return (
                    <tr key={drug.id} className="hover:bg-slate-950/40 transition-colors">
                      <td className="p-3.5 font-bold text-white">
                        {drug.drug_name}
                        <p className="text-[10px] text-slate-500 font-normal">{drug.supplier}</p>
                      </td>
                      <td className="p-3.5 text-slate-300">{drug.category}</td>
                      <td className="p-3.5 font-extrabold text-white text-sm font-mono">
                        {drug.quantity}{' '}
                        <span className="text-[10px] text-slate-500 font-normal">
                          (Min: {drug.low_stock_level})
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-200 font-mono font-semibold">
                        ₦{drug.unit_price.toLocaleString()}
                      </td>
                      <td className="p-3.5 text-slate-300 font-mono">{drug.expiry_date}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-semibold border ${statusStyles[status]}`}>
                          {status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            setRestockDrugId(drug.id);
                            setIsAddStockOpen(true);
                          }}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium border border-slate-700 inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-emerald-400" /> Restock
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

      {/* Tab 3: Inventory Transactions */}
      {activeSubTab === 'transactions' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-400" /> Stock Movement & Dispensing Audit Log
            </h3>
            <span className="text-xs text-slate-400">{inventoryTransactions.length} transactions recorded</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Timestamp</th>
                  <th className="p-3.5">Drug Name</th>
                  <th className="p-3.5">Movement Type</th>
                  <th className="p-3.5">Quantity</th>
                  <th className="p-3.5">Reference Note</th>
                  <th className="p-3.5 rounded-r-xl">Staff User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {inventoryTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-950/40 transition-colors">
                    <td className="p-3.5 font-mono text-slate-400">{tx.created_at}</td>
                    <td className="p-3.5 font-bold text-white">{tx.drug_name}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          tx.transaction_type === 'STOCK_IN'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {tx.transaction_type}
                      </span>
                    </td>
                    <td className="p-3.5 font-extrabold text-white font-mono">{tx.quantity}</td>
                    <td className="p-3.5 text-slate-300">{tx.reference}</td>
                    <td className="p-3.5 text-slate-300 font-medium">{tx.performed_by}</td>
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
      <AddDrugModal isOpen={isAddDrugOpen} onClose={() => setIsAddDrugOpen(false)} />
      <AddStockModal
        isOpen={isAddStockOpen}
        onClose={() => setIsAddStockOpen(false)}
        drugId={restockDrugId}
      />
    </div>
  );
};
