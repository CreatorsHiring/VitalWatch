import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { PatientRegistrationModal } from '../components/modals/PatientRegistrationModal';
import { Search, UserPlus, ChevronRight, Activity, ShieldAlert } from 'lucide-react';

export function PatientsPage() {
  const { patients, wards, currentRole } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWard, setSelectedWard] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.room.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWard = selectedWard === 'ALL' || p.ward === selectedWard;
    const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
    return matchesSearch && matchesWard && matchesStatus;
  });

  const columns = [
    {
      header: 'Patient Name / Identifiers',
      key: 'name',
      render: (p) => (
        <div>
          <button
            onClick={() => navigate(`/patients/${p.id}`)}
            className="font-bold text-slate-900 hover:text-teal-700 transition-colors text-left"
          >
            {p.name}
          </button>
          <div className="text-xs text-slate-500 font-mono">
            {p.id} • {p.mrn} • {p.age}y {p.gender}
          </div>
        </div>
      ),
    },
    {
      header: 'Admission Reason',
      key: 'admissionReason',
      render: (p) => (
        <div className="max-w-xs text-xs text-slate-700 font-medium leading-snug">
          {p.admissionReason}
        </div>
      ),
    },
    {
      header: 'Location / Ward',
      key: 'location',
      render: (p) => (
        <div>
          <div className="font-semibold text-slate-800 text-xs">{p.ward}</div>
          <div className="text-xs text-slate-500">{p.room}</div>
        </div>
      ),
    },
    {
      header: 'Assigned Device',
      key: 'deviceId',
      render: (p) => <span className="font-mono text-xs text-slate-700">{p.deviceId}</span>,
    },
    {
      header: 'Monitoring Status',
      key: 'status',
      render: (p) => <Badge severity={p.status}>{p.status.replace(/_/g, ' ')}</Badge>,
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (p) => (
        <Button
          variant="outline"
          size="sm"
          icon={ChevronRight}
          iconPosition="right"
          onClick={() => navigate(`/patients/${p.id}`)}
        >
          Open Profile
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Synthetic Patient Directory</h1>
          <p className="text-xs text-slate-500 mt-1">Bedside surveillance census, care team assignments, and admission management.</p>
        </div>
        <Button variant="primary" icon={UserPlus} onClick={() => setIsModalOpen(true)}>
          Admit Synthetic Patient
        </Button>
      </div>

      {/* Directory Table Card */}
      <Card
        title="Active Patient Census"
        subtitle={`Showing ${filteredPatients.length} of ${patients.length} admitted patients.`}
      >
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search by patient name, MRN, bed, or admission diagnosis..."
                icon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                options={[
                  { value: 'ALL', label: 'All Wards' },
                  ...wards.map((w) => ({ value: w.name, label: w.name })),
                ]}
              />
            </div>
            <div className="w-full sm:w-44">
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                options={[
                  { value: 'ALL', label: 'All Statuses' },
                  { value: 'STABLE', label: 'Stable' },
                  { value: 'HIGH_RISK', label: 'High Risk' },
                  { value: 'CRITICAL', label: 'Critical Risk' },
                  { value: 'STALE_FEED', label: 'Stale Feed' },
                ]}
              />
            </div>
          </div>

          {/* Table */}
          <Table columns={columns} data={filteredPatients} keyField="id" />
        </div>
      </Card>

      {/* Modal */}
      <PatientRegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
