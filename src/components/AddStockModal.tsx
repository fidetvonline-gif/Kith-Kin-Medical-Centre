import React, { useState } from 'react';
import { useHims } from '../context/HimsContext';
import { X, PlusCircle } from 'lucide-react';

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  drugId?: string;
}

export const AddStockModal: React.FC<AddStockModalProps> = ({ isOpen, onClose, drugId: initialDrugId }) => {
  const { drugs, addDrugStock } = useHims();

  const [selectedDrugId, setSelectedDrugId] = useState(initialDrugId || drugs[0]?.id || '');
  const [quantity, setQuantity] = useState(50);
  const [reference, setReference] = useState('Restock shipment');

  if (!isOpen) return null;

  const drug = drugs.find(d => d.id === selectedDrugId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDrugId) return;
    addDrugStock(selectedDrugId, quantity, reference);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-600 rounded-lg text-white">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Restock Drug Inventory</h3>
              <p className="text-xs text-slate-400">Add stock quantity to pharmacy store</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Select Drug *</label>
            <select
              value={selectedDrugId}
              onChange={e => setSelectedDrugId(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-emerald-500"
            >
              {drugs.map(d => (
                <option key={d.id} value={d.id}>
                  {d.drug_name} (Current Stock: {d.quantity})
                </option>
              ))}
            </select>
          </div>

          {drug && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex justify-between">
              <span className="text-slate-400">Current Stock Level:</span>
              <span className="font-bold text-white">{drug.quantity} units</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Quantity to Add *</label>
            <input
              type="number"
              min={1}
              required
              value={quantity}
              onChange={e => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Reference / Batch Note</label>
            <input
              type="text"
              value={reference}
              onChange={e => setReference(e.target.value)}
              placeholder="e.g. Supplier delivery invoice #4421"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl text-sm shadow-lg transition-all"
            >
              Restock Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
