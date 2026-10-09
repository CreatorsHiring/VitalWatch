import React, { useState, useEffect } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Heart,
  Activity,
  Thermometer,
  Pill,
  Search,
  RefreshCw,
  Eye,
  AlertOctagon,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { getNurseStats, getNursePatients, getWards } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function NurseDashboard() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [stats, setStats] = useState({
    assignedPatients: 0,
    normalMonitoring: 0,
    activeAlerts: 0,
    pendingReviews: 0,
  });

  const [patients, setPatients] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [_error, setError] = useState(null);

  // Filters
  const searchFromUrl = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const [selectedWard, setSelectedWard] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    if (searchFromUrl !== searchTerm) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchFromUrl]);

  const fetchData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const [statsRes, patientsRes, wardsRes] = await Promise.all([
        getNurseStats(),
        getNursePatients(),
        getWards().catch(() => ({ wards: [] })),
      ]);

      if (statsRes?.stats) setStats(statsRes.stats);
      if (patientsRes?.patients) setPatients(patientsRes.patients);
      if (wardsRes?.wards) setWards(wardsRes.wards);
    } catch (err) {
      setError(err.message || 'Failed to load telemetry and patient records.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 20000);
    return () => clearInterval(interval);
  }, []);

  // Filtered patients list
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.roomNumber && patient.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient.wardName && patient.wardName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesWard = selectedWard === 'all' || patient.wardId === selectedWard;

    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'normal' && patient.monitoringStatus === 'Monitoring') ||
      (selectedStatus === 'review' && patient.monitoringStatus === 'Review Required') ||
      (selectedStatus === 'critical' && patient.monitoringStatus === 'Critical Rule Alert') ||
      (selectedStatus === 'stale' &&
        (patient.monitoringStatus === 'Stale Data' || patient.monitoringStatus === 'Data Missing'));

    return matchesSearch && matchesWard && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Monitoring':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#EAF7F0] text-[#16845B] border border-[#CDEBDC]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16845B]" />
            Monitoring
          </span>
        );
      case 'Review Required':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Review Required
          </span>
        );
      case 'Critical Rule Alert':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200 animate-pulse">
            <AlertOctagon className="w-3 h-3 text-rose-600" />
            Critical Rule Alert
          </span>
        );
      case 'Stale Data':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <Clock className="w-3 h-3 text-slate-500" />
            Stale Data
          </span>
        );
      case 'Data Missing':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            Data Missing
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* WELCOME BANNER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EAE5] shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF7F0] border border-[#CDEBDC] text-[#16845B] text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Clinical Early-Warning &amp; Safety Station</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B24] tracking-tight">
            Good morning, {user?.name || 'Sarah Vance, RN'}
          </h1>
          <p className="text-sm text-[#64746C] leading-relaxed">
            Continuously tracking vital deterioration risk, anomaly indicators, and medication
            safety rules across all active ward beds.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <button
            type="button"
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F7FAF8] hover:bg-[#EAF7F0] border border-[#E2EAE5] text-xs font-bold text-[#172B24] transition-all hover:border-[#16845B]/30 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#16845B] ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Updating...' : 'Sync Telemetry'}</span>
          </button>

          <NavLink
            to="/nurse/check-medicine"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#16845B] hover:bg-[#105C43] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Check Medicine</span>
          </NavLink>
        </div>

        {/* Decorative background accent */}
        <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-[#EAF7F0]/40 to-transparent pointer-events-none" />
      </div>

      {/* 4 SUMMARY STATISTIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Assigned Patients */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2EAE5] shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64746C]">
              Assigned Patients
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#EAF7F0] flex items-center justify-center text-[#16845B]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#172B24]">
              {loading ? '—' : stats.assignedPatients}
            </span>
            <span className="text-xs text-[#64746C]">admitted beds</span>
          </div>
          <p className="mt-2 text-xs text-[#64746C]">Currently monitored in assigned care units</p>
        </div>

        {/* Card 2: Normal Monitoring */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2EAE5] shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64746C]">
              Normal Monitoring
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#EAF7F0] flex items-center justify-center text-[#16845B]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#172B24]">
              {loading ? '—' : stats.normalMonitoring}
            </span>
            <span className="text-xs text-[#16845B] font-semibold">stable vitals</span>
          </div>
          <p className="mt-2 text-xs text-[#64746C]">Valid readings within expected baseline ranges</p>
        </div>

        {/* Card 3: Active Alerts */}
        <div className="bg-white rounded-2xl p-5 border border-rose-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
              Active Alerts
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-700">
              {loading ? '—' : stats.activeAlerts}
            </span>
            <span className="text-xs text-rose-600 font-semibold">unresolved</span>
          </div>
          <p className="mt-2 text-xs text-[#64746C]">Elevated deterioration triggers requiring review</p>
        </div>

        {/* Card 4: Pending Reviews */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Pending Reviews
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-700">
              {loading ? '—' : stats.pendingReviews}
            </span>
            <span className="text-xs text-amber-600 font-semibold">awaiting ack</span>
          </div>
          <p className="mt-2 text-xs text-[#64746C]">Clinical findings or notes awaiting sign-off</p>
        </div>
      </div>

      {/* PATIENT MONITORING SECTION HEADER & CONTROLS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#172B24] tracking-tight">
              Assigned Patient Monitoring Cards
            </h2>
            <p className="text-xs text-[#64746C]">
              Continuous telemetry stream with integrated ML anomaly detection and early warning
              scoring.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#64746C]">
              Showing {filteredPatients.length} of {patients.length} patients
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2EAE5] shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64746C]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by name, ID, or room..."
              className="w-full pl-10 pr-4 py-2 bg-[#F7FAF8] border border-[#E2EAE5] rounded-xl text-xs text-[#172B24] placeholder-[#64746C] focus:bg-white focus:outline-hidden focus:border-[#16845B]"
            />
          </div>

          {/* Ward filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#64746C] shrink-0">Ward:</span>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="bg-[#F7FAF8] border border-[#E2EAE5] rounded-xl px-3 py-2 text-xs text-[#172B24] font-medium focus:outline-hidden focus:border-[#16845B]"
            >
              <option value="all">All Wards &amp; Units</option>
              {wards.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All Status' },
              { id: 'normal', label: 'Normal' },
              { id: 'review', label: 'Review Required' },
              { id: 'critical', label: 'Critical' },
              { id: 'stale', label: 'Stale / Missing' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedStatus(st.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                  selectedStatus === st.id
                    ? 'bg-[#16845B] text-white'
                    : 'bg-[#F7FAF8] text-[#64746C] hover:bg-[#EAF7F0] hover:text-[#16845B]'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PATIENT MONITORING CARDS GRID */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E2EAE5]">
          <RefreshCw className="w-8 h-8 text-[#16845B] animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-[#172B24]">Loading telemetry feeds...</p>
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E2EAE5]">
          <Activity className="w-10 h-10 text-[#64746C] mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-[#172B24]">No patients match the filters</h3>
          <p className="text-xs text-[#64746C] mt-1">
            Try adjusting your search criteria or ward selection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => {
            const reading = patient.latestReading;
            const isCritical = patient.monitoringStatus === 'Critical Rule Alert';
            const isReview = patient.monitoringStatus === 'Review Required';

            return (
              <div
                key={patient.id}
                className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md ${
                  isCritical
                    ? 'border-rose-300 ring-2 ring-rose-500/20'
                    : isReview
                    ? 'border-amber-300'
                    : 'border-[#E2EAE5]'
                }`}
              >
                {/* CARD HEADER */}
                <div className="p-5 border-b border-[#E2EAE5]/70 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[#172B24] tracking-tight">
                        {patient.fullName}
                      </h3>
                      <span className="text-[11px] text-[#64746C] font-medium">
                        ({patient.gender}, {patient.age}y)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#64746C]">
                      <span className="font-bold text-[#16845B] bg-[#EAF7F0] px-2 py-0.5 rounded-md border border-[#CDEBDC]">
                        {patient.id}
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-[#172B24]">{patient.wardName}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-block px-2.5 py-1 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-xs font-bold text-[#172B24]">
                      {patient.roomNumber || 'Bed Unassigned'}
                    </span>
                    <span className="block mt-1 text-[10px] text-[#64746C]">
                      Admitted {patient.admissionDuration || 'recently'}
                    </span>
                  </div>
                </div>

                {/* CARD BODY: VITALS MEASUREMENTS GRID */}
                <div className="p-5 space-y-4">
                  {reading ? (
                    <div className="grid grid-cols-2 gap-3.5">
                      {/* Heart Rate */}
                      <div className="p-3 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5]">
                        <div className="flex items-center justify-between text-[#64746C] mb-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider">
                            Heart Rate
                          </span>
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              reading.heartRate > 100 || reading.heartRate < 55
                                ? 'text-rose-500 animate-pulse'
                                : 'text-emerald-600'
                            }`}
                          />
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span
                            className={`text-xl font-extrabold ${
                              reading.heartRate > 100 ? 'text-rose-600' : 'text-[#172B24]'
                            }`}
                          >
                            {reading.heartRate}
                          </span>
                          <span className="text-[10px] font-semibold text-[#64746C]">BPM</span>
                        </div>
                      </div>

                      {/* SpO2 */}
                      <div className="p-3 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5]">
                        <div className="flex items-center justify-between text-[#64746C] mb-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider">SpO₂</span>
                          <Activity
                            className={`w-3.5 h-3.5 ${
                              reading.spo2 < 94 ? 'text-rose-500' : 'text-[#16845B]'
                            }`}
                          />
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span
                            className={`text-xl font-extrabold ${
                              reading.spo2 < 93 ? 'text-rose-600' : 'text-[#172B24]'
                            }`}
                          >
                            {reading.spo2}%
                          </span>
                          <span className="text-[10px] font-semibold text-[#64746C]">O₂ Sat</span>
                        </div>
                      </div>

                      {/* Blood Pressure */}
                      <div className="p-3 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5]">
                        <div className="flex items-center justify-between text-[#64746C] mb-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider">
                            Blood Pressure
                          </span>
                          <Activity className="w-3.5 h-3.5 text-[#64746C]" />
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-extrabold text-[#172B24]">
                            {reading.systolicBp}/{reading.diastolicBp}
                          </span>
                          <span className="text-[10px] font-semibold text-[#64746C]">mmHg</span>
                        </div>
                      </div>

                      {/* Temperature */}
                      <div className="p-3 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5]">
                        <div className="flex items-center justify-between text-[#64746C] mb-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider">
                            Temperature
                          </span>
                          <Thermometer
                            className={`w-3.5 h-3.5 ${
                              reading.temperature >= 38.0 ? 'text-rose-500' : 'text-[#16845B]'
                            }`}
                          />
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span
                            className={`text-xl font-extrabold ${
                              reading.temperature >= 38.0 ? 'text-rose-600' : 'text-[#172B24]'
                            }`}
                          >
                            {reading.temperature}
                          </span>
                          <span className="text-[10px] font-semibold text-[#64746C]">°C</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center bg-[#F7FAF8] rounded-xl border border-dashed border-[#E2EAE5]">
                      <span className="text-xs text-[#64746C]">
                        No active telemetry stream received.
                      </span>
                    </div>
                  )}

                  {/* ML Isolation Forest Anomaly / Rule Escalation Box */}
                  {reading?.isAnomaly && (
                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="text-xs font-bold text-amber-900">
                          ML Anomaly Score: {reading.isolationForestScore}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                        Deviation Detected
                      </span>
                    </div>
                  )}
                </div>

                {/* CARD FOOTER */}
                <div className="p-5 border-t border-[#E2EAE5]/70 bg-[#F7FAF8]/60 rounded-b-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>{getStatusBadge(patient.monitoringStatus)}</div>
                    <div className="text-[11px] text-[#64746C] flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-[#64746C]" />
                      <span>
                        {reading
                          ? `Last: ${new Date(reading.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}`
                          : 'No data'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <NavLink
                      to={`/nurse/patients/${patient.id}`}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#EAF7F0] border border-[#E2EAE5] hover:border-[#16845B]/40 text-xs font-bold text-[#172B24] transition-all text-center"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#16845B]" />
                      <span>View Log</span>
                    </NavLink>

                    <NavLink
                      to={`/nurse/patients/${patient.id}/check-medicine`}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#16845B] hover:bg-[#105C43] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all text-center"
                    >
                      <Pill className="w-3.5 h-3.5" />
                      <span>Check Medicine</span>
                    </NavLink>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
