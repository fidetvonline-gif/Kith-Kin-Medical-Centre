import React, { useState } from 'react';
import { useHims } from '../context/HimsContext';
import { Appointment } from '../types';
import {
  X,
  Stethoscope,
  Plus,
  Trash2,
  Pill,
  Activity,
  Heart,
  Thermometer,
  Weight,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment?: Appointment | null;
  preselectedPatientId?: string;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  appointment,
  preselectedPatientId
}) => {
  const { patients, currentUser, drugs, createConsultation, getDrugStatus } = useHims();

  const targetPatientId = appointment?.patient_id || preselectedPatientId || patients[0]?.patient_id || '';
  const patient = patients.find((p) => p.patient_id === targetPatientId);

  const [chiefComplaint, setChiefComplaint] = useState(appointment?.reason || '');
  const [symptoms, setSymptoms] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('No known chronic allergies or major past surgery.');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  // Vitals
  const [bp, setBp] = useState('120/80 mmHg');
  const [temp, setTemp] = useState('36.8 °C');
  const [pulse, setPulse] = useState('72 bpm');
  const [weight, setWeight] = useState('68 kg');
  const [spo2, setSpo2] = useState('98%');

  // Prescription items array
  const [prescriptionItems, setPrescriptionItems] = useState<
    Array<{
      drug_id: string;
      drug_name: string;
      dosage: string;
      frequency: string;
      duration: string;
      quantity: number;
      instructions: string;
    }>
  >([]);

  // New item form state
  const [selectedDrugId, setSelectedDrugId] = useState(drugs[0]?.id || '');
  const [dosage, setDosage] = useState('500mg');
  const [frequency, setFrequency] = useState('3 times daily (TDS)');
  const [duration, setDuration] = useState('5 days');
  const [quantity, setQuantity] = useState(15);
  const [instructions, setInstructions] = useState('Take orally after meals with water');

  if (!isOpen) return null;

  const currentSelectedDrug = drugs.find((d) => d.id === selectedDrugId);
  const drugStockStatus = currentSelectedDrug ? getDrugStatus(currentSelectedDrug) : 'OUT OF STOCK';

  const commonDiagnoses = [
    'Acute Malaria (Plasmodium falciparum)',
    'Enteric (Typhoid) Fever',
    'Upper Respiratory Tract Infection (URTI)',
    'Acute Gastroenteritis',
    'Primary Essential Hypertension',
    'Peptic Ulcer Disease (PUD)',
    'Urinary Tract Infection (UTI)'
  ];

  const handleAddPrescriptionItem = () => {
    if (!currentSelectedDrug) return;

    setPrescriptionItems((prev) => [
      ...prev,
      {
        drug_id: currentSelectedDrug.id,
        drug_name: currentSelectedDrug.drug_name,
        dosage,
        frequency,
        duration,
        quantity,
        instructions
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setPrescriptionItems((prev) => prev.filter((_, i) => i !== index));
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
        follow_up_date: followUpDate || undefined,
        vitals: {
          blood_pressure: bp,
          temperature: temp,
          pulse_rate: pulse,
          weight: weight,
          spo2: spo2
        }
      },
      prescriptionItems.length > 0 ? prescriptionItems : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-10">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">Clinical Consultation & Electronic Prescription</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Active Encounter
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Patient: <strong className="text-white">{patient?.first_name} {patient?.last_name}</strong> •{' '}
                <span className="font-mono text-sky-400">{targetPatientId}</span>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {/* Patient Quick Vitals Bar */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" /> Patient Triage Vitals
              </span>
              <span className="text-[11px] text-slate-500">Recorded at Consultation Desk</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">Blood Pressure</label>
                <input
                  type="text"
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">Body Temp</label>
                <input
                  type="text"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">Pulse Rate</label>
                <input
                  type="text"
                  value={pulse}
                  onChange={(e) => setPulse(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">Weight</label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">Oxygen SpO2</label>
                <input
                  type="text"
                  value={spo2}
                  onChange={(e) => setSpo2(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Clinical Findings & Diagnosis */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5" /> Subjective & Objective Clinical Findings
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Chief Complaint *</label>
                <input
                  type="text"
                  required
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  placeholder="e.g. High grade fever with severe headache for 3 days"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Presenting Symptoms *</label>
                <input
                  type="text"
                  required
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g. Chills, rigors, body weakness, bitter taste, nausea"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Clinical Diagnosis *</label>
              <input
                type="text"
                required
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Severe Malaria with mild dehydration"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-2"
              />

              {/* Quick diagnosis chips */}
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[10px] font-semibold text-slate-500 mr-1">Quick Select:</span>
                {commonDiagnoses.map((d, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setDiagnosis(d)}
                    className="px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-medium border border-slate-700/60 transition-colors"
                  >
                    + {d.split(' (')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Treatment Plan & Directives *</label>
                <textarea
                  required
                  rows={2}
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  placeholder="Prescribe antimalarial therapy, analgesics, bed rest, oral rehydration..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confidential Clinical Notes</label>
                <textarea
                  rows={2}
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  placeholder="Internal physician observations, lab recommendations..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Medical / Allergy History</label>
                <input
                  type="text"
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Follow-up Review Date</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Electronic Prescription Form */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5" /> Electronic Medication Prescription
              </h4>
              <span className="text-[11px] text-slate-400">Routes to Pharmacy Dispensing Unit automatically</span>
            </div>

            {/* Builder Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Select Formulary Drug
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedDrugId}
                      onChange={(e) => setSelectedDrugId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-amber-500"
                    >
                      {drugs.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.drug_name} — In Stock: {d.quantity} (₦{d.unit_price})
                        </option>
                      ))}
                    </select>
                    {currentSelectedDrug && (
                      <span
                        className={`px-2 py-1 rounded text-[10px] font-bold shrink-0 border ${
                          drugStockStatus === 'AVAILABLE'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : drugStockStatus === 'LOW STOCK'
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : 'bg-rose-950 text-rose-300 border-rose-800'
                        }`}
                      >
                        {drugStockStatus}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Total Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Dosage</label>
                  <input
                    type="text"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g. 500mg, 10ml, 1 tab"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Frequency</label>
                  <input
                    type="text"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    placeholder="e.g. 3 times daily (8-hourly)"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 3 days, 5 days, 1 month"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Patient Instructions</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g. Take after meals; avoid alcohol consumption"
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddPrescriptionItem}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shrink-0 shadow-sm transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add to Prescription
                  </button>
                </div>
              </div>
            </div>

            {/* Prescribed List */}
            {prescriptionItems.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-300">
                  Prescription Items Added ({prescriptionItems.length}):
                </p>
                {prescriptionItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                  >
                    <div>
                      <p className="font-bold text-white">
                        • {item.drug_name}{' '}
                        <span className="font-mono text-amber-400 font-normal">({item.dosage})</span>
                      </p>
                      <p className="text-slate-400 mt-0.5">
                        {item.frequency} for {item.duration} • <span className="text-white font-mono">Qty: {item.quantity}</span> •{' '}
                        <span className="text-slate-300 italic">{item.instructions}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1.5 text-rose-400 hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800 sticky bottom-0 bg-slate-900/95 py-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-950/50 border border-emerald-400/30 transition-all cursor-pointer"
            >
              Save Consultation & Issue Prescription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
