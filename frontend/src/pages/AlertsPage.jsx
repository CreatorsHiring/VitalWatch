import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { AlertDetailsModal } from '../components/modals/AlertDetailsModal';
import { AlertTriangle, Filter, CheckCircle, ShieldAlert, Sparkles, ChevronRight } from 'lucide-react';

export function AlertsPage() {
  const { alerts, patients } = useApp();

  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [patientFilter, setPatientFilter] = useState('ALL');

  const [activeModalAlert, setActiveModalAlert] = useState(null);

  const filteredAlerts = alerts.filter((alt) => {
    const matchesCategory = categoryFilter === 'ALL' || alt.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || alt.status === statusFilter;
    const matchesPatient = patientFilter === 'ALL' || alt.patientId === patientFilter;
    return matchesCategory && matchesStatus && matchesPatient;
  });

  const columns = [
    {
      header: 'Severity / Category',
      key: 'severity',
      render: (alt) => (
        <div>
          <Badge severity={alt.severity}>{alt.severity}</Badge>
          <span className="block text-[10px] uppercase font-mono font-bold text-slate-500 mt-1">
            {alt.category}
          </span>
        </div>
      ),
    },
    {
      header: 'Finding Title & Explanation',
      key: 'title',
      render: (alt) => (
        <div className="max-w-md">
          <div className="font-bold text-xs text-slate-900">{alt.title}</div>
          <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">{alt.explanation}</p>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            Trigger Metric: <strong className="text-slate-700">{alt.evidence?.metric} ({alt.evidence?.value} {alt.evidence?.unit})</strong>
          </div>
        </div>
      ),
    },
    {
      header: 'Patient / Bed',
      key: 'patient',
      render: (alt) => (
        <div>
          <div className="font-semibold text-xs text-slate-900">{alt.patientName}</div>
          <div className="text-[11px] text-slate-500">{alt.bed}</div>
        </div>
      ),
    },
    {
      header: 'Timestamps',
      key: 'detectedAt',
      render: (alt) => (
        <div className="text-xs text-slate-600 font-mono">
          <div>Detected: {new Date(alt.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div className="text-[10px] text-slate-400">Updated: {new Date(alt.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (alt) => (
        <span className={`inline-block px-2 py-0.5 text-xs font-bold uppercase rounded border ${
          alt.status === 'NEW'
            ? 'bg-red-50 text-red-700 border-red-200'
            : alt.status === 'ACKNOWLEDGED'
            ? 'bg-amber-50 text-amber-800 border-amber-200'
            : alt.status === 'UNDER_REVIEW'
            ? 'bg-blue-50 text-blue-800 border-blue-200'
            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}>
          {alt.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (alt) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveModalAlert(alt)}
          icon={ChevronRight}
          iconPosition="right"
        >
          Review Evidence
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Clinical Alerts & Risk Triage Center</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time alert escalation queue, deterministic rule triggers, and unsupervised ML anomaly findings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge severity="CRITICAL">{alerts.filter((a) => a.status === 'NEW').length} New Unacknowledged</Badge>
        </div>
      </div>

      {/* Main Alert List */}
      <Card title="Alert Surveillance Queue" subtitle={`Showing ${filteredAlerts.length} findings.`}>
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="w-full sm:w-48">
              <Select
                label="Category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                options={[
                  { value: 'ALL', label: 'All Categories' },
                  { value: 'PHYSIOLOGICAL', label: 'Physiological Alerts' },
                  { value: 'TECHNICAL', label: 'Technical Monitoring' },
                  { value: 'ML_ANOMALY', label: 'ML Anomaly Score' },
                ]}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'ALL', label: 'All Statuses' },
                  { value: 'NEW', label: 'NEW' },
                  { value: 'ACKNOWLEDGED', label: 'ACKNOWLEDGED' },
                  { value: 'UNDER_REVIEW', label: 'UNDER REVIEW' },
                  { value: 'RESOLVED', label: 'RESOLVED' },
                ]}
              />
            </div>
            <div className="w-full sm:w-60">
              <Select
                label="Patient Filter"
                value={patientFilter}
                onChange={(e) => setPatientFilter(e.target.value)}
                options={[
                  { value: 'ALL', label: 'All Patients' },
                  ...patients.map((p) => ({ value: p.id, label: `${p.name} (${p.id})` })),
                ]}
              />
            </div>
          </div>

          {/* Table */}
          <Table columns={columns} data={filteredAlerts} keyField="id" />
        </div>
      </Card>

      <AlertDetailsModal
        alert={activeModalAlert}
        isOpen={Boolean(activeModalAlert)}
        onClose={() => setActiveModalAlert(null)}
      />
    </div>
  );
}
