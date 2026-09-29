import React from 'react';
import { useHims } from '../context/HimsContext';
import { Prescription } from '../types';
import {
  X,
  Pill,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Receipt,
  User,
  Stethoscope,
  Calendar
} from 'lucide-react';

interface DispenseModalProps {
  prescription: Prescription | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DispenseModal: React.FC<DispenseModalProps> = ({ prescription, isOpen, onClose }) => {
  const { patients, doctors, drugs, dispensePrescription, getDrugStatus } = useHims();

  if (!isOpen || !prescription) return null;

  const patient = patients.find((p) => p.patient_id === prescription.patient_id);
  const doctor = doctors.find((d) => d.id === prescription.doctor_id);

  // Check if all items have sufficient stock & calculate financial cost
  let totalCost = 0;
  const stockCheck = prescription.items.map((item) => {
    const drug = drugs.find((d) => d.id === item.drug_id);
    const available = drug ? drug.quantity : 0;
    const unitPrice = drug ? drug.unit_price : 0;
    const itemTotal = unitPrice * item.quantity;
    totalCost += itemTotal;
    const sufficient = available >= item.quantity;
    const remainingAfter = Math.max(0, available - item.quantity);

    let projectedStatus: 'AVAILABLE' | 'LOW STOCK' | 'OUT OF STOCK' = 'AVAILABLE';
    if (drug) {
      if (remainingAfter <= 0) projectedStatus = 'OUT OF STOCK';
      else if (remainingAfter <= drug.low_stock_level) projectedStatus = 'LOW STOCK';
    }

    return {
      ...item,
      available,
      sufficient,
      unitPrice,
      itemTotal,
      remainingAfter,
      projectedStatus
    };
  });

  const allSufficient = stockCheck.every((i) => i.sufficient);

  const handleDispense = () => {
    const result = dispensePrescription(prescription.id);
    if (result.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-10">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">Pharmacy Dispensing & Inventory Verification</h3>
                <span className="font-mono text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded text-xs border border-amber-800/60">
                  {prescription.prescription_id}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time stock deduction and electronic transaction logging
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Patient and Doctor Encounter Strip */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-start space-x-2.5">
              <User className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Patient File</span>
                <p className="font-bold text-white text-xs mt-0.5">
                  {patient?.first_name} {patient?.last_name}
                </p>
                <p className="font-mono text-sky-400 text-[11px]">{prescription.patient_id}</p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <Stethoscope className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Prescribed By</span>
                <p className="font-bold text-white text-xs mt-0.5">Dr. {doctor?.name || 'Medical Officer'}</p>
                <p className="text-slate-400 text-[11px]">{doctor?.specialization || 'Clinical Care'}</p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <Calendar className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Prescription Date</span>
                <p className="font-bold text-white text-xs mt-0.5">{prescription.prescription_date}</p>
                <span
                  className={`inline-block mt-0.5 px-2 py-0.2 rounded text-[10px] font-bold uppercase ${
                    prescription.status === 'Dispensed' ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  Status: {prescription.status}
                </span>
              </div>
            </div>
          </div>

          {/* Real-time stock audit list */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-amber-400" /> Prescribed Medications & Stock Deduction Plan
              </h4>
              <span className="text-xs text-slate-400">Total Items: {stockCheck.length}</span>
            </div>

            <div className="space-y-2">
              {stockCheck.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                    item.sufficient
                      ? 'bg-slate-950 border-slate-800'
                      : 'bg-rose-950/20 border-rose-900/60'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-bold text-white text-sm">{item.drug_name}</p>
                      <span className="font-mono text-[11px] text-amber-400 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800/40">
                        {item.dosage}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs">
                      {item.frequency} • {item.duration} • <span className="italic text-slate-300">"{item.instructions}"</span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Unit: ₦{item.unitPrice.toLocaleString()} × {item.quantity} ={' '}
                      <strong className="text-slate-300">₦{item.itemTotal.toLocaleString()}</strong>
                    </p>
                  </div>

                  {/* Stock Deduction Calculation Box */}
                  <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4 space-y-1">
                    <div className="flex items-center justify-end space-x-1.5 font-mono text-xs">
                      <span className="text-slate-400">{item.available}</span>
                      <span className="text-rose-400 font-bold">- {item.quantity}</span>
                      <ArrowRight className="w-3 h-3 text-slate-600 inline" />
                      <span
                        className={`font-bold ${
                          item.remainingAfter > 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {item.remainingAfter} left
                      </span>
                    </div>

                    <div>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${
                          item.sufficient
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                            : 'bg-rose-950/80 text-rose-300 border-rose-800/60'
                        }`}
                      >
                        {item.sufficient ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        {item.sufficient ? `Stock Sourced` : `Insufficient Stock`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insufficient Stock Alert */}
          {!allSufficient && (
            <div className="p-3.5 bg-rose-950/40 border border-rose-800/80 rounded-xl text-xs text-rose-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Cannot Complete Dispensing:</strong>
                <p className="mt-0.5 text-slate-300">
                  One or more medications do not have enough stock in the pharmacy store. Please restock the formulary or contact the prescribing physician.
                </p>
              </div>
            </div>
          )}

          {/* Total Cost Strip */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Total Prescription Formulary Cost:</span>
            <span className="text-base font-extrabold text-emerald-400 font-mono">
              ₦{totalCost.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-slate-800 bg-slate-900">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
          {prescription.status !== 'Dispensed' && (
            <button
              type="button"
              disabled={!allSufficient}
              onClick={handleDispense}
              className={`px-6 py-2.5 font-bold rounded-xl text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
                allSufficient
                  ? 'bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white shadow-amber-950/50 border border-amber-400/40'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Confirm Dispensing & Deduct Inventory</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
