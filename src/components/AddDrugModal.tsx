import React, { useState } from 'react';
import { useHims } from '../context/HimsContext';
import { X, Pill, DollarSign, Calendar } from 'lucide-react';

interface AddDrugModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddDrugModal: React.FC<AddDrugModalProps> = ({ isOpen, onClose }) => {
  const { addNewDrug } = useHims();

  const [drugName, setDrugName] = useState('');
  const [category, setCategory] = useState('Analgesic');
  const [quantity, setQuantity] = useState(100);
  const [unitPrice, setUnitPrice] = useState(200);
  const [expiryDate, setExpiryDate] = useState('2028-12-31');
  const [supplier, setSupplier] = useState('Emzor Pharmaceuticals');
  const [lowStockLevel, setLowStockLevel] = useState(15);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNewDrug({
      drug_name: drugName,
      category,
      quantity,
      unit_price: unitPrice,
      expiry_date: expiryDate,
      supplier,
      low_stock_level: lowStockLevel
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-600 rounded-lg text-white">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Add New Drug to Inventory</h3>
              <p className="text-xs text-slate-400">Register new pharmaceutical item into hospital store</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Drug Name *</label>
            <input
              type="text"
              required
              value={drugName}
              onChange={e => setDrugName(e.target.value)}
              placeholder="e.g. Paracetamol 500mg"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category *</label>
              <input
                type="text"
                required
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="e.g. Antibiotic / Analgesic"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Initial Quantity *</label>
              <input
                type="number"
                min={0}
                required
                value={quantity}
                onChange={e => setQuantity(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Unit Price (₦) *
              </label>
              <input
                type="number"
                min={0}
                required
                value={unitPrice}
                onChange={e => setUnitPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Low Stock Alert Threshold *</label>
              <input
                type="number"
                min={1}
                required
                value={lowStockLevel}
                onChange={e => setLowStockLevel(parseInt(e.target.value) || 10)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Expiry Date *
              </label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={e => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Supplier / Manufacturer *</label>
              <input
                type="text"
                required
                value={supplier}
                onChange={e => setSupplier(e.target.value)}
                placeholder="e.g. May & Baker"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
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
              className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-xl text-sm shadow-lg transition-all"
            >
              Add Drug to Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
