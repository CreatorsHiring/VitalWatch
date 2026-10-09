import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import {
  Heart,
  Activity,
  Thermometer,
  Pill,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  ChevronLeft,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import {
  getPatientProfileDetail,
  getPatientLogs,
  acknowledgeAlert,
} from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function PatientProfileDetail() {
  const { patientId } = useParams();
  const { user } = useAuth();

  const [patient, setPatient] = useState(null);
  const [logs, setLogs] = useState([]);
  const [activeRange, setActiveRange] = useState('6h'); // '1h' | '6h' | '24h' | 'all'
  const [loading, setLoading] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [error, setError] = useState(null);

  // Alert acknowledgement state
  const [selectedAlertForAck, setSelectedAlertForAck] = useState(null);
  const [reviewNote, setReviewNote] = useState('');
  const [ackSubmitting, setAckSubmitting] = useState(false);
  const [ackSuccess, setAckSuccess] = useState('');

  const fetchPatientData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPatientProfileDetail(patientId);
      if (res?.patient) {
        setPatient(res.patient);
      } else {
        throw new Error('Patient record not found.');
      }
    } catch (err) {
      setError(err.message || 'Failed to load patient record.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async (range) => {
    setLoadingLogs(true);
    try {
      const res = await getPatientLogs(patientId, range);
      if (res?.logs) {
        setLogs(res.logs);
      }
    } catch {
      // ignore
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
      fetchLogs(activeRange);
    }
  }, [patientId]);

  const handleRangeChange = (range) => {
    setActiveRange(range);
    fetchLogs(range);
  };

  const handleAcknowledgeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAlertForAck) return;

    setAckSubmitting(true);
    try {
      await acknowledgeAlert(selectedAlertForAck.id, {
        nurseName: user?.name || 'Sarah Vance, RN',
        reviewNote: reviewNote || 'Clinical evaluation performed. Continued telemetry monitoring.',
      });

      setAckSuccess('Alert acknowledged and logged into clinical timeline.');
      setSelectedAlertForAck(null);
      setReviewNote('');
      fetchPatientData(); // Refresh patient alerts

      setTimeout(() => setAckSuccess(''), 4000);
    } catch (err) {
      alert(`Acknowledgement error: ${err.message}`);
    } finally {
      setAckSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center bg-white rounded-3xl border border-[#E2EAE5]">
        <RefreshCw className="w-8 h-8 text-[#16845B] animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-[#172B24]">Loading patient telemetry and care profile...</p>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-[#E2EAE5] space-y-4">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-[#172B24]">{error || 'Patient not found'}</h2>
        <NavLink
          to="/nurse/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#16845B] text-white text-xs font-bold rounded-xl"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Return to Nurse Dashboard</span>
        </NavLink>
      </div>
    );
  }

  const latestReading = patient.latestReading;
  const activeAlerts = patient.activeAlerts || [];
  const alertHistory = patient.alertHistory || [];

  return (
    <div className="space-y-8">
      {/* BREADCRUMBS & TOP BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <NavLink
            to="/nurse/dashboard"
            className="p-2 rounded-xl bg-white border border-[#E2EAE5] hover:bg-[#F7FAF8] text-[#64746C] hover:text-[#172B24] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </NavLink>
          <div>
            <div className="flex items-center gap-2 text-xs text-[#64746C]">
              <span>Nurse Dashboard</span>
              <span>/</span>
              <span>Patient Profile</span>
              <span>/</span>
              <span className="font-bold text-[#16845B]">{patient.id}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#172B24] tracking-tight flex items-center gap-3">
              <span>{patient.fullName}</span>
              <span className="text-sm font-bold text-[#16845B] bg-[#EAF7F0] px-3 py-0.5 rounded-full border border-[#CDEBDC]">
                {patient.currentWardName} • {patient.currentRoomNumber}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NavLink
            to={`/nurse/patients/${patient.id}/check-medicine`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#16845B] hover:bg-[#105C43] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Pill className="w-4 h-4" />
            <span>Check Medicine Safety</span>
          </NavLink>
        </div>
      </div>

      {/* SUCCESS BANNER */}
      {ackSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{ackSuccess}</span>
        </div>
      )}

      {/* SECTION A: PATIENT INFORMATION & MEDICAL HISTORY */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EAE5] shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#E2EAE5] pb-4">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-[#16845B]" />
            <h2 className="text-base font-bold text-[#172B24]">
              Section A: Patient Information &amp; Medical History
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#64746C]">
            Source:{' '}
            <span className="font-bold text-[#16845B]">
              {patient.medicalHistory?.source === 'ABHA Health Locker Demo'
                ? 'ABHA Health Locker (Verified)'
                : 'Hospital Admissions Intake'}
            </span>
          </span>
        </div>

        {/* Demographics & Admission details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64746C] block mb-1">
              Age &amp; Gender
            </span>
            <span className="text-sm font-bold text-[#172B24]">
              {patient.age} yrs • {patient.gender}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64746C] block mb-1">
              Blood Group
            </span>
            <span className="text-sm font-bold text-[#16845B]">
              {patient.bloodGroup || 'O+ Positive'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64746C] block mb-1">
              Attending Physician
            </span>
            <span className="text-sm font-bold text-[#172B24]">
              {patient.attendingDoctor || 'Dr. Gordon, MD'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64746C] block mb-1">
              Admission Timestamp
            </span>
            <span className="text-sm font-bold text-[#172B24]">
              {patient.admissionDate ? new Date(patient.admissionDate).toLocaleDateString() : 'Active'}
            </span>
          </div>
        </div>

        {/* Medical History Tags (Allergies, Conditions, Current Meds) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-2">
          {/* Confirmed Allergies */}
          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/70 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Confirmed Allergies
              </span>
              <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                {(patient.medicalHistory?.allergies || []).length} Recorded
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(patient.medicalHistory?.allergies || []).length > 0 ? (
                patient.medicalHistory.allergies.map((allergy, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white text-rose-700 border border-rose-300 shadow-2xs"
                  >
                    {allergy}
                  </span>
                ))
              ) : (
                <span className="text-xs text-[#64746C] italic">No allergies documented</span>
              )}
            </div>
          </div>

          {/* Chronic Conditions */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-amber-600" />
                Chronic Conditions
              </span>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                {(patient.medicalHistory?.conditions || []).length} Conditions
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(patient.medicalHistory?.conditions || []).length > 0 ? (
                patient.medicalHistory.conditions.map((cond, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white text-amber-800 border border-amber-300 shadow-2xs"
                  >
                    {cond}
                  </span>
                ))
              ) : (
                <span className="text-xs text-[#64746C] italic">No chronic conditions listed</span>
              )}
            </div>
          </div>

          {/* Current Active Medications */}
          <div className="p-4 rounded-2xl bg-[#EAF7F0]/60 border border-[#CDEBDC] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#16845B] uppercase tracking-wider flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-[#16845B]" />
                Current Medications
              </span>
              <span className="text-[10px] font-bold bg-[#EAF7F0] text-[#16845B] px-2 py-0.5 rounded border border-[#CDEBDC]">
                {(patient.medicalHistory?.medications || []).length} Active
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(patient.medicalHistory?.medications || []).length > 0 ? (
                patient.medicalHistory.medications.map((med, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white text-[#172B24] border border-[#CDEBDC] shadow-2xs"
                  >
                    {med}
                  </span>
                ))
              ) : (
                <span className="text-xs text-[#64746C] italic">No active prescriptions</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION B: CURRENT REAL-TIME VITALS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EAE5] shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#E2EAE5] pb-4">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-[#16845B]" />
            <h2 className="text-base font-bold text-[#172B24]">
              Section B: Current Real-Time Vitals
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#64746C]">
            <span className="flex items-center gap-1 font-semibold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Signal: {latestReading?.signalQuality || 'Good (98%)'}
            </span>
            <span>•</span>
            <span>
              Recorded:{' '}
              {latestReading
                ? new Date(latestReading.timestamp).toLocaleTimeString()
                : 'N/A'}
            </span>
          </div>
        </div>

        {latestReading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Heart Rate */}
            <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5]">
              <div className="flex items-center justify-between text-[#64746C] mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Heart Rate</span>
                <Heart
                  className={`w-4 h-4 ${
                    latestReading.heartRate > 100 ? 'text-rose-500 animate-pulse' : 'text-emerald-600'
                  }`}
                />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`text-3xl font-extrabold ${
                    latestReading.heartRate > 100 ? 'text-rose-600' : 'text-[#172B24]'
                  }`}
                >
                  {latestReading.heartRate}
                </span>
                <span className="text-xs font-bold text-[#64746C]">BPM</span>
              </div>
              <div className="mt-2 text-[11px] text-[#64746C]">
                Target range: 60 – 100 BPM
              </div>
            </div>

            {/* SpO2 */}
            <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5]">
              <div className="flex items-center justify-between text-[#64746C] mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">SpO₂ Pulse Ox</span>
                <Activity
                  className={`w-4 h-4 ${
                    latestReading.spo2 < 94 ? 'text-rose-500' : 'text-[#16845B]'
                  }`}
                />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`text-3xl font-extrabold ${
                    latestReading.spo2 < 93 ? 'text-rose-600' : 'text-[#172B24]'
                  }`}
                >
                  {latestReading.spo2}%
                </span>
                <span className="text-xs font-bold text-[#64746C]">Saturation</span>
              </div>
              <div className="mt-2 text-[11px] text-[#64746C]">
                Normal threshold: &ge; 95%
              </div>
            </div>

            {/* Blood Pressure */}
            <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5]">
              <div className="flex items-center justify-between text-[#64746C] mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Blood Pressure</span>
                <Activity className="w-4 h-4 text-[#64746C]" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-[#172B24]">
                  {latestReading.systolicBp}/{latestReading.diastolicBp}
                </span>
                <span className="text-xs font-bold text-[#64746C]">mmHg</span>
              </div>
              <div className="mt-2 text-[11px] text-[#64746C]">
                Target: &lt; 130/85 mmHg
              </div>
            </div>

            {/* Temperature */}
            <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5]">
              <div className="flex items-center justify-between text-[#64746C] mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Body Temp</span>
                <Thermometer
                  className={`w-4 h-4 ${
                    latestReading.temperature >= 38.0 ? 'text-rose-500' : 'text-[#16845B]'
                  }`}
                />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`text-3xl font-extrabold ${
                    latestReading.temperature >= 38.0 ? 'text-rose-600' : 'text-[#172B24]'
                  }`}
                >
                  {latestReading.temperature}
                </span>
                <span className="text-xs font-bold text-[#64746C]">°C</span>
              </div>
              <div className="mt-2 text-[11px] text-[#64746C]">
                Normal: 36.5°C – 37.5°C
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-[#64746C] bg-[#F7FAF8] rounded-2xl">
            No active telemetry recorded for this patient.
          </div>
        )}

        {/* ML Isolation Forest Anomaly Analysis Bar */}
        {latestReading?.isAnomaly && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="text-xs font-bold text-amber-900 block">
                  Machine Learning Deterioration Early Warning Triggered
                </span>
                <span className="text-[11px] text-amber-800">
                  Isolation Forest detected cross-parameter deviation (Anomaly Score:{' '}
                  {latestReading.isolationForestScore}). Recommendation: Assess patient and verify
                  vitals.
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-xl bg-amber-200/80 text-amber-900 text-xs font-bold shrink-0">
              Isolation Forest: Anomaly Flagged
            </span>
          </div>
        )}
      </div>

      {/* SECTION C: TIMESTAMPED HISTORY LOG & INTERACTIVE TREND CHARTS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EAE5] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2EAE5] pb-4">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-[#16845B]" />
            <h2 className="text-base font-bold text-[#172B24]">
              Section C: Timestamped Telemetry History &amp; Trend Charts
            </h2>
          </div>

          {/* Time range filter pills */}
          <div className="flex items-center gap-1.5">
            {[
              { id: '1h', label: '1 Hour' },
              { id: '6h', label: '6 Hours' },
              { id: '24h', label: '24 Hours' },
              { id: 'all', label: 'All Logs' },
            ].map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => handleRangeChange(pill.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeRange === pill.id
                    ? 'bg-[#16845B] text-white shadow-2xs'
                    : 'bg-[#F7FAF8] text-[#64746C] hover:bg-[#EAF7F0] hover:text-[#16845B]'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Sparkline / Multi-Metric Trend Chart */}
        {logs.length > 1 ? (
          <div className="p-5 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5] space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#172B24]">Vital Parameters Trend Curve</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#16845B]" />
                  Heart Rate (BPM)
                </span>
                <span className="flex items-center gap-1 text-sky-700 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  SpO₂ (%)
                </span>
                <span className="flex items-center gap-1 text-amber-700 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Systolic BP (mmHg)
                </span>
              </div>
            </div>

            {/* Render dynamic SVG polyline */}
            <div className="w-full h-44 sm:h-52 relative">
              <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                {/* Horizontal reference gridlines */}
                <line x1="0" y1="40" x2="800" y2="40" stroke="#E2EAE5" strokeDasharray="4 4" />
                <line x1="0" y1="100" x2="800" y2="100" stroke="#E2EAE5" strokeDasharray="4 4" />
                <line x1="0" y1="160" x2="800" y2="160" stroke="#E2EAE5" strokeDasharray="4 4" />

                {/* Heart Rate Polyline */}
                <polyline
                  fill="none"
                  stroke="#16845B"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={logs
                    .map((l, i) => {
                      const x = (i / (logs.length - 1)) * 800;
                      // map HR (50 - 130) to Y (180 - 20)
                      const y = 180 - ((l.heartRate - 50) / 80) * 160;
                      return `${x},${Math.max(20, Math.min(180, y))}`;
                    })
                    .join(' ')}
                />

                {/* SpO2 Polyline */}
                <polyline
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={logs
                    .map((l, i) => {
                      const x = (i / (logs.length - 1)) * 800;
                      // map SpO2 (85 - 100) to Y (180 - 20)
                      const y = 180 - ((l.spo2 - 85) / 15) * 160;
                      return `${x},${Math.max(20, Math.min(180, y))}`;
                    })
                    .join(' ')}
                />

                {/* Systolic BP Polyline */}
                <polyline
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                  strokeLinecap="round"
                  points={logs
                    .map((l, i) => {
                      const x = (i / (logs.length - 1)) * 800;
                      // map SBP (90 - 170) to Y (180 - 20)
                      const y = 180 - ((l.systolicBp - 90) / 80) * 160;
                      return `${x},${Math.max(20, Math.min(180, y))}`;
                    })
                    .join(' ')}
                />
              </svg>
            </div>
            <div className="flex justify-between text-[10px] text-[#64746C] pt-1">
              <span>Oldest ({new Date(logs[0].timestamp).toLocaleTimeString()})</span>
              <span>Latest ({new Date(logs[logs.length - 1].timestamp).toLocaleTimeString()})</span>
            </div>
          </div>
        ) : null}

        {/* Timestamped Telemetry Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#E2EAE5]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7FAF8] border-b border-[#E2EAE5] text-[10px] font-bold uppercase tracking-wider text-[#64746C]">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Heart Rate</th>
                <th className="px-4 py-3">SpO₂</th>
                <th className="px-4 py-3">BP (Sys/Dia)</th>
                <th className="px-4 py-3">Temp</th>
                <th className="px-4 py-3">ML Anomaly</th>
                <th className="px-4 py-3">Monitoring Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EAE5]/60 bg-white">
              {loadingLogs ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[#64746C]">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#16845B]" />
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-[#64746C]">
                    No telemetry logs recorded in this timeframe.
                  </td>
                </tr>
              ) : (
                logs
                  .slice()
                  .reverse()
                  .map((log) => (
                    <tr
                      key={log.id}
                      className={`hover:bg-[#F7FAF8] transition-colors ${
                        log.isAnomaly ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-[#172B24] whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-3 font-bold text-[#172B24]">
                        <span
                          className={
                            log.heartRate > 100 || log.heartRate < 55
                              ? 'text-rose-600 font-extrabold'
                              : ''
                          }
                        >
                          {log.heartRate} BPM
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#172B24]">
                        <span className={log.spo2 < 94 ? 'text-rose-600 font-extrabold' : ''}>
                          {log.spo2}%
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-[#172B24]">
                        {log.systolicBp}/{log.diastolicBp} mmHg
                      </td>
                      <td className="px-4 py-3 font-medium text-[#172B24]">
                        <span className={log.temperature >= 38.0 ? 'text-rose-600 font-bold' : ''}>
                          {log.temperature}°C
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {log.isAnomaly ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            Score {log.isolationForestScore}
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#64746C]">Normal (0.22)</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            log.monitoringStatus === 'Critical Rule Alert'
                              ? 'bg-rose-100 text-rose-800'
                              : log.monitoringStatus === 'Review Required'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-[#EAF7F0] text-[#16845B]'
                          }`}
                        >
                          {log.monitoringStatus}
                        </span>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION D: ALERT HISTORY & ACKNOWLEDGEMENT WORKFLOW */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EAE5] shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#E2EAE5] pb-4">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-[#172B24]">
              Section D: Clinical Alerts &amp; Nurse Review Workflow
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#64746C]">
            {activeAlerts.length} Active / {alertHistory.length} Total Alerts
          </span>
        </div>

        {/* List of alerts */}
        <div className="space-y-4">
          {alertHistory.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#64746C] bg-[#F7FAF8] rounded-2xl">
              No active or historical deterioration alerts generated for this patient.
            </div>
          ) : (
            alertHistory.map((alert) => {
              const isUnack = !alert.isAcknowledged;
              const isCritical = alert.priority.includes('Critical');

              return (
                <div
                  key={alert.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isUnack
                      ? isCritical
                        ? 'bg-rose-50/40 border-rose-300 ring-2 ring-rose-500/20'
                        : 'bg-amber-50/40 border-amber-300'
                      : 'bg-white border-[#E2EAE5]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          isCritical
                            ? 'bg-rose-100 text-rose-800'
                            : isUnack
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-[#EAF7F0] text-[#16845B]'
                        }`}
                      >
                        {alert.priority}
                      </span>
                      <h4 className="text-sm font-bold text-[#172B24]">{alert.type}</h4>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#64746C]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(alert.detectedAt).toLocaleString()}
                      </span>
                      <span className="font-mono font-bold text-[#172B24] bg-[#F7FAF8] px-2 py-0.5 rounded border border-[#E2EAE5]">
                        {alert.id}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#172B24] leading-relaxed mb-3">
                    <span className="font-bold">Clinical Reason:</span> {alert.reason}
                  </p>

                  {/* Supporting measurements */}
                  {alert.supportingMeasurements && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-white/80 p-3 rounded-xl border border-[#E2EAE5] mb-3">
                      {Object.entries(alert.supportingMeasurements).map(([key, val]) => (
                        <div key={key}>
                          <span className="text-[#64746C] capitalize block">
                            {key.replace(/([A-Z])/g, ' $1')}:
                          </span>
                          <span className="font-bold text-[#172B24]">{val}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Acknowledgement Status / Action */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#E2EAE5]/60">
                    {alert.isAcknowledged ? (
                      <div className="text-xs text-[#64746C] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          Acknowledged by <strong className="text-[#172B24]">{alert.acknowledgedBy}</strong> on{' '}
                          {new Date(alert.acknowledgedAt).toLocaleTimeString()}
                        </span>
                        {alert.reviewNote && (
                          <span className="italic block sm:inline text-[11px] text-[#172B24]">
                            — &ldquo;{alert.reviewNote}&rdquo;
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          Unresolved Alert — Requires Nurse Acknowledgement &amp; Clinical Note
                        </span>

                        <button
                          type="button"
                          onClick={() => setSelectedAlertForAck(alert)}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-2xs cursor-pointer"
                        >
                          Acknowledge Alert
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* SECTION E: CHECK MEDICINE CTA BANNER */}
      <div className="bg-gradient-to-r from-[#16845B] to-[#105C43] rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold">
            <Pill className="w-3.5 h-3.5" />
            <span>Section E: Medication Safety Scanner</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Administering or Prescribing Medicine for {patient.fullName}?
          </h3>
          <p className="text-xs text-white/90 leading-relaxed">
            Run an instant safety check to verify cross-reactivity with confirmed allergies (
            {patient.medicalHistory?.allergies?.join(', ') || 'None'}), chronic conditions (
            {patient.medicalHistory?.conditions?.join(', ') || 'None'}), and current drug
            interactions.
          </p>
        </div>

        <NavLink
          to={`/nurse/patients/${patient.id}/check-medicine`}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-[#EAF7F0] text-[#105C43] text-xs font-extrabold shadow-md transition-all shrink-0 active:scale-[0.98]"
        >
          <Pill className="w-4 h-4 text-[#16845B]" />
          <span>Launch Medication Check</span>
        </NavLink>
      </div>

      {/* ACKNOWLEDGE ALERT MODAL */}
      {selectedAlertForAck && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#E2EAE5] shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#E2EAE5] pb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-[#172B24]">
                  Acknowledge Clinical Alert ({selectedAlertForAck.id})
                </h3>
              </div>
              <button
                onClick={() => setSelectedAlertForAck(null)}
                className="text-[#64746C] hover:text-[#172B24] text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5] text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#64746C]">Trigger:</span>
                <span className="font-bold text-[#172B24]">{selectedAlertForAck.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64746C]">Severity:</span>
                <span className="font-bold text-rose-600">{selectedAlertForAck.priority}</span>
              </div>
              <p className="text-[11px] text-[#64746C] pt-1">{selectedAlertForAck.reason}</p>
            </div>

            <form onSubmit={handleAcknowledgeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#172B24] mb-1.5">
                  Clinical Action &amp; Review Notes (Required for Audit Trail)
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="e.g., Bedside assessment completed. Oxygen titrated via nasal cannula at 2L/min. Attending physician informed."
                  className="w-full p-3 bg-[#F7FAF8] border border-[#E2EAE5] rounded-xl text-xs text-[#172B24] focus:bg-white focus:outline-hidden focus:border-[#16845B]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAlertForAck(null)}
                  className="px-4 py-2 bg-[#F7FAF8] text-[#172B24] text-xs font-bold rounded-xl hover:bg-[#E2EAE5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={ackSubmitting}
                  className="px-5 py-2.5 bg-[#16845B] hover:bg-[#105C43] text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-50 flex items-center gap-2"
                >
                  {ackSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Logging...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Sign &amp; Acknowledge Alert</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
