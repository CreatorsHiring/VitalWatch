import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Search,
  RefreshCw,
  Eye,
  Pill,
  Sparkles,
} from 'lucide-react';
import { getNursePatients, getPatientLogs } from '../../services/api';

export default function PatientLogs() {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('all');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnomalyOnly, setFilterAnomalyOnly] = useState(false);

  useEffect(() => {
    getNursePatients()
      .then((res) => {
        if (res?.patients) {
          setPatients(res.patients);
        }
      })
      .catch(() => {});
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      if (selectedPatientId === 'all') {
        // Fetch logs for all patients and combine
        const patientsRes = await getNursePatients();
        const pts = patientsRes?.patients || [];
        const logsPromises = pts.map((p) =>
          getPatientLogs(p.id, '24h')
            .then((res) => (res?.logs || []).map((l) => ({ ...l, patientName: p.fullName })))
            .catch(() => [])
        );

        const results = await Promise.all(logsPromises);
        const combined = results.flat().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setLogs(combined);
      } else {
        const res = await getPatientLogs(selectedPatientId, '24h');
        const selectedPt = patients.find((p) => p.id === selectedPatientId);
        if (res?.logs) {
          setLogs(
            res.logs
              .map((l) => ({ ...l, patientName: selectedPt?.fullName || 'Patient' }))
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          );
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedPatientId]);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      (log.patientName && log.patientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      log.patientId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAnomaly = !filterAnomalyOnly || log.isAnomaly;

    return matchesSearch && matchesAnomaly;
  });

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#64746C] mb-1">
            <NavLink to="/nurse/dashboard" className="hover:text-[#16845B]">
              Nurse Dashboard
            </NavLink>
            <span>/</span>
            <span className="font-bold text-[#16845B]">Patient Telemetry Logs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B24] tracking-tight">
            Patient Telemetry Logs &amp; Audit
          </h1>
          <p className="text-xs sm:text-sm text-[#64746C] mt-1">
            Historical vital stream records with continuous Isolation Forest anomaly classifications.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchLogs}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E2EAE5] hover:bg-[#F7FAF8] text-xs font-bold text-[#172B24] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#16845B]" />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2EAE5] shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Patient select dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#64746C] shrink-0">Filter Patient:</span>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="bg-[#F7FAF8] border border-[#E2EAE5] rounded-xl px-3 py-2 text-xs text-[#172B24] font-medium focus:outline-hidden focus:border-[#16845B]"
          >
            <option value="all">All Monitored Inpatients</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.fullName} ({p.id})
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64746C]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by patient name or ID..."
            className="w-full pl-10 pr-4 py-2 bg-[#F7FAF8] border border-[#E2EAE5] rounded-xl text-xs text-[#172B24] focus:bg-white focus:outline-hidden focus:border-[#16845B]"
          />
        </div>

        {/* Anomaly checkbox toggle */}
        <button
          type="button"
          onClick={() => setFilterAnomalyOnly(!filterAnomalyOnly)}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            filterAnomalyOnly
              ? 'bg-amber-600 text-white'
              : 'bg-[#F7FAF8] text-[#64746C] hover:bg-amber-50 hover:text-amber-800 border border-[#E2EAE5]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Anomaly Only</span>
        </button>
      </div>

      {/* TELEMETRY TABLE */}
      <div className="bg-white rounded-3xl border border-[#E2EAE5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7FAF8] border-b border-[#E2EAE5] text-[10px] font-bold uppercase tracking-wider text-[#64746C]">
              <tr>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5">Patient</th>
                <th className="px-5 py-3.5">Heart Rate</th>
                <th className="px-5 py-3.5">SpO₂ Sat</th>
                <th className="px-5 py-3.5">Blood Pressure</th>
                <th className="px-5 py-3.5">Temperature</th>
                <th className="px-5 py-3.5">ML Score</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EAE5]/60 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-[#64746C]">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#16845B] mb-2" />
                    <span>Aggregating telemetry logs...</span>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-10 text-center text-[#64746C]">
                    No telemetry records match your filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.slice(0, 50).map((log) => (
                  <tr
                    key={log.id}
                    className={`hover:bg-[#F7FAF8] transition-colors ${
                      log.isAnomaly ? 'bg-amber-50/30' : ''
                    }`}
                  >
                    <td className="px-5 py-3.5 font-medium text-[#172B24] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-[#172B24]">{log.patientName}</div>
                      <div className="text-[10px] text-[#16845B] font-mono">{log.patientId}</div>
                    </td>
                    <td className="px-5 py-3.5 font-bold">
                      <span
                        className={
                          log.heartRate > 100 || log.heartRate < 55 ? 'text-rose-600' : 'text-[#172B24]'
                        }
                      >
                        {log.heartRate} BPM
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold">
                      <span className={log.spo2 < 94 ? 'text-rose-600' : 'text-[#172B24]'}>
                        {log.spo2}%
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-[#172B24]">
                      {log.systolicBp}/{log.diastolicBp} mmHg
                    </td>
                    <td className="px-5 py-3.5 font-medium text-[#172B24]">
                      <span className={log.temperature >= 38.0 ? 'text-rose-600 font-bold' : ''}>
                        {log.temperature}°C
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {log.isAnomaly ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          {log.isolationForestScore}
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#64746C]">Normal (0.22)</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
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
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <NavLink
                          to={`/nurse/patients/${log.patientId}`}
                          className="p-1.5 rounded-lg text-[#64746C] hover:text-[#16845B] hover:bg-[#EAF7F0]"
                          title="View Patient Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </NavLink>
                        <NavLink
                          to={`/nurse/patients/${log.patientId}/check-medicine`}
                          className="p-1.5 rounded-lg text-[#64746C] hover:text-[#16845B] hover:bg-[#EAF7F0]"
                          title="Check Medicine"
                        >
                          <Pill className="w-4 h-4" />
                        </NavLink>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
