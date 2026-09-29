import React from 'react';
import { useHims } from '../context/HimsContext';
import { Prescription } from '../types';
import { X, Pill, CheckCircle, AlertTriangle } from 'lucide-react';

interface DispenseModalProps {
  prescription: Prescription | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DispenseModal: React.FC<DispenseModalProps> = ({ prescription, isOpen, onClose }) => {
  const { patients, doctors, drugs, dispensePrescription } = useHims();

  if (!isOpen || !prescription) return null;

  const patient = patients.find(p => p.patient_id === prescription.patient_id);
  const doctor = doctors.find(d => d.id === prescription.doctor_id);

  // Check if all items have sufficient stock
  const stockCheck = prescription.items.map(item => {
    const drug = drugs.find(d => d.id === item.drug_id);
    const available = drug ? drug.quantity : 0;
    const sufficient = available >= item.quantity;
    return { ...item, available, sufficient };
  });

  const allSufficient = stockCheck.every(i => i.sufficient);

  const handleDispense = () => {
    const result = dispensePrescription(prescription.id);
    if (result.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-600 rounded-lg text-white">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Dispense Prescription</h3>
              <p className="text-xs text-amber-400 font-mono">{prescription.prescription_id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400">Patient:</span>
              <p className="font-bold text-white text-sm">{patient?.first_name} {patient?.last_name} ({prescription.patient_id})</p>
            </div>
            <div>
              <span className="text-slate-400">Prescribing Doctor:</span>
              <p className="font-bold text-white text-sm">Dr. {doctor?.name || 'General Doctor'}</p>
            </div>
            <div>
              <span className="text-slate-400">Date:</span>
              <p className="font-semibold text-slate-200">{prescription.prescription_date}</p>
            </div>
            <div>
              <span className="text-slate-400">Status:</span>
              <p className="font-semibold text-amber-400">{prescription.status}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Prescription Items & Stock Check</h4>
            {stockCheck.map((item, idx) => (
              <div key={idx} className={`p-3 rounded-xl border flex items-center justify-between text-xs ${item.sufficient ? 'bg-slate-950 border-slate-800' : 'bg-rose-950/20 border-rose-900/50'}`}>
                <div>
                  <p className="font-bold text-white">{item.drug_name} ({item.dosage})</p>
                  <p className="text-slate-400 mt-0.5">{item.frequency} for {item.duration} • Required Qty: <span className="font-semibold text-white">{item.quantity}</span></p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center gap-1 font-semibold ${item.sufficient ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {item.sufficient ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    Stock: {item.available}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {!allSufficient && (
            <div className="p-3 bg-rose-950/40 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Cannot dispense: One or more drugs have insufficient stock in inventory. Please restock first.</span>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl text-sm transition-colors"
            >
              Cancel
            </button>
            {prescription.status !== 'Dispensed' && (
              <button
                type="button"
                disabled={!allSufficient}
                onClick={handleDispense}
                className={`px-6 py-2 font-medium rounded-xl text-sm shadow-lg transition-all ${
                  allSufficient
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                Confirm Dispensing & Deduct Stock
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
