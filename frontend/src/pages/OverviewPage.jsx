import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { AlertDetailsModal } from '../components/modals/AlertDetailsModal';
import { PatientRegistrationModal } from '../components/modals/PatientRegistrationModal';
import {
  Users,
  AlertTriangle,
  Radio,
  Search,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  Activity,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';

export function OverviewPage() {
  const { patients, alerts, currentRole, simLogs } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWard, setSelectedWard] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const [selectedAlertForModal, setSelectedAlertForModal] = useState(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Compute dynamic summary metrics from current state
  const assignedPatientsCount = patients.length;
  const activeAlertPatientsCount = new Set(
    alerts.filter((a) => a.status !== 'RESOLVED').map((a) => a.patientId)
  ).size;
  const unacknowledgedAlertsCount = alerts.filter((a) => a.status === 'NEW').length;
  const staleDataCount = patients.filter(
    (p) => p.status === 'STALE_FEED' || p.vitals?.quality === 'STALE'
  ).length;

  // Filter patients for dashboard table
  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.room.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWard = selectedWard === 'ALL' || p.ward === selectedWard;
    const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
    return matchesSearch && matchesWard && matchesStatus;
  });

  // Patient Table Columns
  const patientColumns = [
    {
      header: 'Patient / ID',
      key: 'name',
      render: (p) => (
        <div>
          <button
            onClick={() => navigate(`/patients/${p.id}`)}
            className="font-bold text-slate-900 hover:text-teal-700 transition-colors text-left"
          >
            {p.name}
          </button>
          <div className="text-[11px] text-slate-500 font-mono">
            {p.id} • {p.mrn}
          </div>
        </div>
      ),
    },
    {
      header: 'Ward / Bed',
      key: 'ward',
      render: (p) => (
        <div>
          <div className="font-semibold text-slate-800 text-xs">{p.ward}</div>
          <div className="text-[11px] text-slate-500">{p.room}</div>
        </div>
      ),
    },
    {
      header: 'Latest Vitals Telemetry',
      key: 'vitals',
      render: (p) => {
        const v = p.vitals;
        if (!v || v.quality === 'STALE') {
          return <span className="text-xs text-amber-700 font-medium italic">Stream Stale / Missing</span>;
        }
        return (
          <div className="font-mono text-xs space-x-3 text-slate-800">
            <span>HR: <strong className={v.hr > 110 ? 'text-red-600 font-bold' : 'text-slate-900'}>{v.hr ?? '--'}</strong> <span className="text-[10px] text-slate-400">bpm</span></span>
            <span>SpO₂: <strong className={v.spo2 && v.spo2 < 92 ? 'text-red-600 font-bold' : 'text-slate-900'}>{v.spo2 ?? '--'}%</strong></span>
            <span>BP: <strong className="text-slate-900">{v.sysBP ?? '--'}/{v.diaBP ?? '--'}</strong></span>
          </div>
        );
      },
    },
    {
      header: 'Monitoring Status',
      key: 'status',
      render: (p) => <Badge severity={p.status}>{p.status.replace(/_/g, ' ')}</Badge>,
    },
    {
      header: 'Active Alerts',
      key: 'alerts',
      render: (p) => {
        const patientAlerts = alerts.filter((a) => a.patientId === p.id && a.status !== 'RESOLVED');
        if (patientAlerts.length === 0) {
          return <span className="text-xs text-slate-400">None</span>;
        }
        return (
          <Badge severity="CRITICAL" size="sm">
            {patientAlerts.length} Alert{patientAlerts.length > 1 ? 's' : ''}
          </Badge>
        );
      },
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (p) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/patients/${p.id}`)}
          icon={ChevronRight}
          iconPosition="right"
        >
          View Vitals
        </Button>
      ),
    },
  ];

  // Attention Needed Alerts (Unacknowledged or High/Critical)
  const attentionItems = alerts.filter((a) => a.status !== 'RESOLVED');

  return (
    <div className="space-y-6">
      {/* Top Banner / User Context */}
      <div className="bg-navy-950 text-white rounded-lg p-5 border border-navy-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-400">
            <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
            Role Workspace: {currentRole.name} ({currentRole.title})
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mt-1">
            Nurse & Caretaker Clinical Dashboard
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
            Real-time synthetic telemetry surveillance, risk triage, and patient status monitoring across ICU wards.
          </p>
        </div>

        {currentRole.id === 'RECEPTIONIST' || currentRole.id === 'CARETAKER' || currentRole.id === 'ADMIN' ? (
          <Button
            variant="primary"
            icon={UserPlus}
            onClick={() => setIsRegisterModalOpen(true)}
          >
            Admit Patient
          </Button>
        ) : null}
      </div>

      {/* Dynamic Summary Cards Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card bodyClassName="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Assigned Patients</p>
            <p className="text-2xl font-bold text-slate-900 font-mono mt-0.5">{assignedPatientsCount}</p>
            <p className="text-[11px] text-slate-500 mt-1">Across 3 ICU Wards</p>
          </div>
          <div className="p-2.5 bg-slate-100 rounded-md text-slate-700">
            <Users className="w-5 h-5" />
          </div>
        </Card>

        <Card bodyClassName="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Patients with Alerts</p>
            <p className="text-2xl font-bold text-amber-600 font-mono mt-0.5">{activeAlertPatientsCount}</p>
            <p className="text-[11px] text-amber-600 font-medium mt-1">Require Clinical Review</p>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </Card>

        <Card bodyClassName="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Unacknowledged Alerts</p>
            <p className="text-2xl font-bold text-red-600 font-mono mt-0.5">{unacknowledgedAlertsCount}</p>
            <p className="text-[11px] text-red-600 font-medium mt-1">Action Needed</p>
          </div>
          <div className="p-2.5 bg-red-50 text-red-600 rounded-md border border-red-200">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
        </Card>

        <Card bodyClassName="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Stale Feeds / Quality</p>
            <p className="text-2xl font-bold text-slate-800 font-mono mt-0.5">{staleDataCount}</p>
            <p className="text-[11px] text-slate-500 mt-1">Bedside Device Check</p>
          </div>
          <div className="p-2.5 bg-slate-100 rounded-md text-slate-700">
            <Activity className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Main Grid: Patient Table + Attention Needed & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Assigned Patients Table */}
        <div className="lg:col-span-2 space-y-4">
          <Card
            title="Assigned Patients Directory"
            subtitle="Live bedside telemetry and monitoring status overview."
          >
            <div className="space-y-4">
              {/* Table Controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Search by patient name, MRN, or bed..."
                    icon={Search}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full sm:w-44">
                  <Select
                    value={selectedWard}
                    onChange={(e) => setSelectedWard(e.target.value)}
                    options={[
                      { value: 'ALL', label: 'All Wards' },
                      { value: 'ICU Ward A', label: 'ICU Ward A' },
                      { value: 'ICU Ward B', label: 'ICU Ward B' },
                      { value: 'Stepdown Ward C', label: 'Stepdown Ward C' },
                    ]}
                  />
                </div>
              </div>

              {/* Patient Table */}
              <Table
                columns={patientColumns}
                data={filteredPatients}
                keyField="id"
                emptyMessage="No synthetic patients found matching search criteria."
              />
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Attention Needed & Recent Activity Log */}
        <div className="space-y-6">
          {/* Attention Needed Panel */}
          <Card
            title="Attention Needed"
            subtitle="Unacknowledged alerts & stale sensor feeds requiring review."
          >
            <div className="space-y-3">
              {attentionItems.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  All clinical alerts acknowledged or resolved.
                </div>
              ) : (
                attentionItems.map((alt) => (
                  <div
                    key={alt.id}
                    onClick={() => setSelectedAlertForModal(alt)}
                    className="p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-400 transition-colors cursor-pointer space-y-1.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <Badge severity={alt.severity} size="sm">
                        {alt.severity}
                      </Badge>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(alt.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="font-bold text-xs text-slate-900">{alt.title}</div>
                    <div className="text-[11px] text-slate-600 font-medium">
                      {alt.patientName} ({alt.bed})
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-2">{alt.explanation}</div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Activity Stream */}
          <Card
            title="Telemetry & System Activity Log"
            subtitle="Live observation stream & audit trail."
          >
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {simLogs.map((log) => (
                <div key={log.id} className="text-[11px] border-b border-slate-100 pb-1.5 pt-0.5">
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px]">
                    <Clock className="w-3 h-3 text-teal-600 shrink-0" />
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-slate-700 font-mono mt-0.5 leading-snug">{log.text}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <AlertDetailsModal
        alert={selectedAlertForModal}
        isOpen={Boolean(selectedAlertForModal)}
        onClose={() => setSelectedAlertForModal(null)}
      />

      <PatientRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
}
