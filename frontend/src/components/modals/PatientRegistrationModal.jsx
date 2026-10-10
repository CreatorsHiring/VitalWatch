import React, { useState } from 'react';
import { Modal } from './Modal';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';
import { UserPlus, ShieldAlert } from 'lucide-react';

export function PatientRegistrationModal({ isOpen, onClose }) {
  const { registerPatient, wards } = useApp();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Female');
  const [admissionReason, setAdmissionReason] = useState('');
  const [selectedWard, setSelectedWard] = useState('ICU Ward A');
  const [selectedRoom, setSelectedRoom] = useState('Bed 103');
  const [allergiesStatus, setAllergiesStatus] = useState('VERIFIED');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Patient synthetic display name is required.');
      return;
    }
    if (!age || isNaN(age) || age <= 0) {
      setError('Please provide a valid age.');
      return;
    }

    registerPatient({
      name: name.trim(),
      age: Number(age),
      gender,
      admissionReason: admissionReason.trim() || 'Synthetic Clinical Surveillance',
      ward: selectedWard,
      room: selectedRoom,
      allergiesHistoryStatus: allergiesStatus,
    });

    // Reset and close
    setName('');
    setAge('');
    setAdmissionReason('');
    setError('');
    onClose();
  };

  const wardObj = wards.find((w) => w.name === selectedWard) || wards[0];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Admit Synthetic Patient" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-teal-50 border border-teal-200 rounded-md text-xs text-teal-800 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <span>
            Synthetic intake form. All generated identifiers and records are strictly for demonstration bed tracking.
          </span>
        </div>

        {error && <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-xs font-semibold">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Synthetic Display Name"
            placeholder="e.g. Clara Oswald"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Age"
              type="number"
              placeholder="e.g. 62"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
            <Select
              label="Gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              options={[
                { value: 'Female', label: 'Female' },
                { value: 'Male', label: 'Male' },
                { value: 'Other', label: 'Other' },
              ]}
            />
          </div>
        </div>

        <Input
          label="Admission Diagnosis / Reason"
          placeholder="e.g. Post-operative Sepsis Surveillance"
          value={admissionReason}
          onChange={(e) => setAdmissionReason(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Assigned Ward"
            value={selectedWard}
            onChange={(e) => {
              setSelectedWard(e.target.value);
              const w = wards.find((w) => w.name === e.target.value);
              if (w && w.rooms.length > 0) setSelectedRoom(w.rooms[0]);
            }}
            options={wards.map((w) => ({ value: w.name, label: w.name }))}
          />

          <Select
            label="Bed / Room Assignment"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            options={wardObj ? wardObj.rooms.map((r) => ({ value: r, label: r })) : []}
          />
        </div>

        <Select
          label="Allergy History Status"
          value={allergiesStatus}
          onChange={(e) => setAllergiesStatus(e.target.value)}
          options={[
            { value: 'VERIFIED', label: 'Verified - History Confirmed' },
            { value: 'UNKNOWN', label: 'UNKNOWN / Incomplete - Requires Intake Verification' },
          ]}
          hint="Explicitly distinguishes unknown history from negative history."
        />

        <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={UserPlus}>
            Complete Synthetic Admission
          </Button>
        </div>
      </form>
    </Modal>
  );
}
