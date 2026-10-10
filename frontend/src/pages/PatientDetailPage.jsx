import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { TimeSeriesChart } from '../components/charts/TimeSeriesChart';
import { AlertDetailsModal } from '../components/modals/AlertDetailsModal';
import {
  User,
  Activity,
  AlertTriangle,
  Pill,
  ShieldAlert,
  ArrowLeft,
  Clock,
  Building,
  Radio,
  FileText,
  CheckCircle2
} from 'lucide-react';

export function PatientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, alerts, updateEncounter, wards } = useApp();

  const [selectedAlertModal, setSelectedAlertModal] = useState(null);
  const [isChangingRoom, setIsChangingRoom] = useState(false);
  const [newWard, setNewWard] = useState('ICU Ward A');
  const [newRoom, setNewRoom] = useState('Bed 101');

  const patient = patients.find((p) => p.id === id);

  if (!patient) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Synthetic Patient Not Found</h2>
        <p className="text-xs text-slate-500">The requested patient ID standard does not exist in the active seed data.</p>
        <Button variant="primary" icon={ArrowLeft} onClick={() => navigate('/patients')}>
          Return to Patient Directory
        </Button>
      </div>
    );
  }

  const patientAlerts = alerts.filter((a) => a.patientId === patient.id);
  const obs = patient.observations || [];

  const handleRoomChangeSubmit = (e) => {
    e.preventDefault();
    updateEncounter(patient.id, newWard, newRoom);
    setIsChangingRoom(false);
  };

  const wardObj = wards.find((w) => w.name === newWard) || wards[0];

  return (
    <div className="space-y-6">
      {/* Top Header & Navigation Back */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" icon={ArrowLeft} onClick={() => navigate('/patients')}>
            Back
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">{patient.name}</h1>
              <Badge severity={patient.status}>{patient.status.replace(/_/g, ' ')}</Badge>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              ID: {patient.id} • MRN: {patient.mrn} • {patient.age}y {patient.gender} • Admitted: {new Date(patient.admissionDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={Building} onClick={() => setIsChangingRoom(!isChangingRoom)}>
            Reassign Bed
          </Button>
          <Button variant="primary" size="sm" icon={Pill} onClick={() => navigate('/medication-safety')}>
            Check Medication Safety
          </Button>
        </div>
      </div>

      {/* Bed Reassignment Form Drawer */}
      {isChangingRoom && (
        <Card title="Transfer / Reassign Encounter Bed" subtitle="Update current ward and bedside allocation.">
          <form onSubmit={handleRoomChangeSubmit} className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Target Ward</label>
              <select
                className="clinical-input"
                value={newWard}
                onChange={(e) => {
                  setNewWard(e.target.value);
                  const w = wards.find((w) => w.name === e.target.value);
                  if (w && w.rooms.length > 0) setNewRoom(w.rooms[0]);
                }}
              >
                {wards.map((w) => (
                  <option key={w.name} value={w.name}>{w.name}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Target Bed</label>
              <select
                className="clinical-input"
                value={newRoom}
                onChange={(e) => setNewRoom(e.target.value)}
              >
                {wardObj ? wardObj.rooms.map((r) => <option key={r} value={r}>{r}</option>) : []}
              </select>
            </div>
            <div className="flex gap-2">
              <Button type="submit" variant="primary" size="sm">Save Assignment</Button>
              <Button variant="ghost" size="sm" onClick={() => setIsChangingRoom(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Encounter Summary & Bedside Device Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card bodyClassName="p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Location</p>
          <p className="text-base font-bold text-slate-900 mt-1">{patient.ward}</p>
          <p className="text-xs text-slate-600 font-mono mt-0.5">{patient.room}</p>
        </Card>

        <Card bodyClassName="p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Admission Diagnosis</p>
          <p className="text-xs font-semibold text-slate-900 mt-1 line-clamp-2">{patient.admissionReason}</p>
        </Card>

        <Card bodyClassName="p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Care Team Lead</p>
          <p className="text-xs font-semibold text-slate-900 mt-1">{patient.careTeam}</p>
        </Card>

        <Card bodyClassName="p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bedside Sensor Feed</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span className="text-xs font-mono font-bold text-slate-900">{patient.deviceId}</span>
          </div>
        </Card>
      </div>

      {/* Time-Series Vital Sign Charts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-700" />
            Time-Series Vital Signs (24-Hour Telemetry)
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Observations: <strong>{obs.length}</strong> | Missing Gaps Preserved
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TimeSeriesChart
            data={obs}
            dataKey="hr"
            title="Heart Rate (HR)"
            unit="bpm"
            color="#0f766e"
            thresholdMax={110}
            thresholdMin={50}
          />
          <TimeSeriesChart
            data={obs}
            dataKey="spo2"
            title="Oxygen Saturation (SpO2)"
            unit="%"
            color="#2563eb"
            thresholdMin={90}
          />
          <TimeSeriesChart
            data={obs}
            dataKey="sysBP"
            title="Systolic Blood Pressure"
            unit="mmHg"
            color="#dc2626"
            thresholdMax={140}
          />
          <TimeSeriesChart
            data={obs}
            dataKey="temp"
            title="Core Temperature"
            unit="°C"
            color="#d97706"
            thresholdMax={38.0}
          />
        </div>
      </div>

      {/* Structured Medical History & Alert History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medical History */}
        <Card
          title="Structured Medical History"
          subtitle="Documented allergies, active conditions, and outpatient/inpatient medication statements."
        >
          <div className="space-y-4">
            {/* Allergy Status Warning Banner */}
            <div className={`p-3 rounded-md text-xs border ${
              patient.history?.allergiesHistoryStatus === 'UNKNOWN'
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <div className="flex items-center justify-between font-bold">
                <span>Allergy History Verification State:</span>
                <Badge severity={patient.history?.allergiesHistoryStatus === 'UNKNOWN' ? 'WARNING' : 'STABLE'} size="sm">
                  {patient.history?.allergiesHistoryStatus || 'VERIFIED'}
                </Badge>
              </div>
              {patient.history?.allergiesHistoryStatus === 'UNKNOWN' && (
                <p className="mt-1 text-[11px] text-amber-800 leading-tight">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600 inline mr-1" />
                  <strong>UNVERIFIED HISTORY:</strong> Patient allergy history is recorded as UNKNOWN. Absence of documented allergies must NOT be interpreted as "No allergies".
                </p>
              )}
            </div>

            {/* Documented Allergies */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Documented Allergies</h4>
              {patient.history?.allergies?.length === 0 ? (
                <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded border border-slate-200">
                  No documented allergies recorded in verified intake.
                </p>
              ) : (
                patient.history?.allergies?.map((all, idx) => (
                  <div key={idx} className="p-2.5 bg-red-50/60 border border-red-200 rounded text-xs flex justify-between items-center">
                    <div>
                      <span className="font-bold text-red-900">{all.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono block">Code: {all.ingredient}</span>
                    </div>
                    <Badge severity="CRITICAL" size="sm">{all.severity} Severity</Badge>
                  </div>
                ))
              )}
            </div>

            {/* Active Conditions */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Active Diagnoses & Conditions</h4>
              {patient.history?.conditions?.length === 0 ? (
                <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded">No recorded conditions.</p>
              ) : (
                patient.history?.conditions?.map((c, idx) => (
                  <div key={idx} className="p-2 bg-slate-50 border border-slate-200 rounded text-xs flex justify-between items-center">
                    <span className="font-semibold text-slate-800">{c.name}</span>
                    <span className="font-mono text-[11px] text-slate-500">{c.code}</span>
                  </div>
                ))
              )}
            </div>

            {/* Medication Statements */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Active Medication Statements</h4>
              {patient.history?.medications?.length === 0 ? (
                <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded">No active medications prescribed.</p>
              ) : (
                patient.history?.medications?.map((m, idx) => (
                  <div key={idx} className="p-2 bg-slate-50 border border-slate-200 rounded text-xs flex justify-between items-center">
                    <span className="font-semibold text-slate-800">{m.name}</span>
                    <span className="font-mono text-[11px] text-teal-700 font-semibold">{m.code}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>

        {/* Alert History for Patient */}
        <Card
          title="Clinical Finding & Alert History"
          subtitle="Event log of detected findings, rule triggers, and clinical notes."
        >
          <div className="space-y-3">
            {patientAlerts.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-4 text-center bg-slate-50 rounded border border-slate-200">
                No alert findings recorded for this encounter.
              </p>
            ) : (
              patientAlerts.map((alt) => (
                <div
                  key={alt.id}
                  onClick={() => setSelectedAlertModal(alt)}
                  className="p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-400 transition-colors cursor-pointer space-y-1"
                >
                  <div className="flex justify-between items-center">
                    <Badge severity={alt.severity} size="sm">{alt.severity}</Badge>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(alt.detectedAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-slate-900">{alt.title}</div>
                  <div className="text-[11px] text-slate-600 font-mono">{alt.explanation}</div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <AlertDetailsModal
        alert={selectedAlertModal}
        isOpen={Boolean(selectedAlertModal)}
        onClose={() => setSelectedAlertModal(null)}
      />
    </div>
  );
}
