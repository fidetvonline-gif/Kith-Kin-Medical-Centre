import React, { useState } from 'react';
import { useHims } from '../context/HimsContext';
import { Appointment } from '../types';
import { X, Stethoscope, Plus, Trash2, Pill } from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment?: Appointment | null;
  preselectedPatientId?: string;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose, appointment, preselectedPatientId }) => {
  const { patients, currentUser, drugs, createConsultation } = useHims();

  const targetPatientId = appointment?.patient_id || preselectedPatientId || patients[0]?.patient_id || '';
  const patient = patients.find(p => p.patient_id === targetPatientId);

  const [chiefComplaint, setChiefComplaint] = useState(appointment?.reason || '');
  const [symptoms, setSymptoms] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('No known chronic illness');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  // Prescription items array
  const [prescriptionItems, setPrescriptionItems] = useState<Array<{
    drug_id: string;
    drug_name: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
    instructions: string;
  }>>([]);

  // New item form state
  const [selectedDrugId, setSelectedDrugId] = useState(drugs[0]?.id || '');
  const [dosage, setDosage] = useState('500mg');
  const [frequency, setFrequency] = useState('3 times daily');
  const [duration, setDuration] = useState('5 days');
  const [quantity, setQuantity] = useState(15);
  const [instructions, setInstructions] = useState('Take after meals');

  if (!isOpen) return null;

  const handleAddPrescriptionItem = () => {
    const drug = drugs.find(d => d.id === selectedDrugId);
    if (!drug) return;

    setPrescriptionItems(prev => [
      ...prev,
      {
        drug_id: drug.id,
        drug_name: drug.drug_name,
        dosage,
        frequency,
        duration,
        quantity,
        instructions
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setPrescriptionItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    createConsultation(
      {
        patient_id: targetPatientId,
        doctor_id: currentUser.id,
        appointment_id: appointment?.id,
        chief_complaint: chiefComplaint,
        symptoms,
        medical_history: medicalHistory,
        diagnosis,
        treatment,
        doctor_notes: doctorNotes,
        follow_up_date: followUpDate || undefined
      },
      prescriptionItems.length > 0 ? prescriptionItems : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-600 rounded-lg text-white">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Doctor Consultation & Prescription</h3>
              <p className="text-xs text-slate-400">Patient: {patient?.first_name} {patient?.last_name} ({targetPatientId})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Clinical Findings */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Clinical Examination & Diagnosis</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Chief Complaint *</label>
                <input
                  type="text"
                  required
                  value={chiefComplaint}
                  onChange={e => setChiefComplaint(e.target.value)}
                  placeholder="e.g. Severe headache and fever"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Symptoms *</label>
                <input
                  type="text"
                  required
                  value={symptoms}
                  onChange={e => setSymptoms(e.target.value)}
                  placeholder="e.g. High temperature, chills, fatigue"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Medical History</label>
                <input
                  type="text"
                  value={medicalHistory}
                  onChange={e => setMedicalHistory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Diagnosis *</label>
                <input
                  type="text"
                  required
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                  placeholder="e.g. Malaria, Typhoid, Upper Respiratory Tract Infection"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Treatment Plan *</label>
              <textarea
                required
                rows={2}
                value={treatment}
                onChange={e => setTreatment(e.target.value)}
                placeholder="Detailed treatment plan..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Doctor's Clinical Notes</label>
                <input
                  type="text"
                  value={doctorNotes}
                  onChange={e => setDoctorNotes(e.target.value)}
                  placeholder="Additional notes..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Follow-up Date</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={e => setFollowUpDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Prescription Builder */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Pill className="w-4 h-4" /> Create Prescription (Optional)
            </h4>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Select Drug from Inventory</label>
                  <select
                    value={selectedDrugId}
                    onChange={e => setSelectedDrugId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-amber-500"
                  >
                    {drugs.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.drug_name} — Qty Available: {d.quantity} (₦{d.unit_price})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Dosage</label>
                  <input
                    type="text"
                    value={dosage}
                    onChange={e => setDosage(e.target.value)}
                    placeholder="e.g. 500mg"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Frequency</label>
                  <input
                    type="text"
                    value={frequency}
                    onChange={e => setFrequency(e.target.value)}
                    placeholder="e.g. 3 times daily"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    placeholder="e.g. 5 days"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Instructions</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={instructions}
                    onChange={e => setInstructions(e.target.value)}
                    placeholder="e.g. Take after meals"
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddPrescriptionItem}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-xl text-sm flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Add Item
                  </button>
                </div>
              </div>
            </div>

            {/* Added Prescription Items List */}
            {prescriptionItems.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400">Prescribed Drugs ({prescriptionItems.length}):</p>
                {prescriptionItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <div>
                      <p className="font-bold text-white">• {item.drug_name} ({item.dosage})</p>
                      <p className="text-slate-400 mt-0.5">{item.frequency} for {item.duration} • Qty: {item.quantity} • {item.instructions}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1.5 text-rose-400 hover:bg-rose-950/50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl text-sm shadow-lg transition-all"
            >
              Save Consultation & Prescription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
