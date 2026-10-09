import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
  Sparkles,
  Eye,
} from 'lucide-react';
import { getAllAlerts, acknowledgeAlert } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ClinicalAlerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'unacknowledged' | 'acknowledged'
  const [searchTerm, setSearchTerm] = useState('');

  // Acknowledge Modal
  const [selectedAlertForAck, setSelectedAlertForAck] = useState(null);
  const [reviewNote, setReviewNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState('');

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await getAllAlerts(
        filterStatus === 'all' ? undefined : filterStatus
      );
      if (res?.alerts) {
        setAlerts(res.alerts);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [filterStatus]);

  const handleAcknowledge = async (e) => {
    e.preventDefault();
    if (!selectedAlertForAck) return;

    setSubmitting(true);
    try {
      await acknowledgeAlert(selectedAlertForAck.id, {
        nurseName: user?.name || 'Sarah Vance, RN',
        reviewNote: reviewNote || 'Clinical triage performed. Bedside telemetry verified.',
      });

      setSuccessBanner(`Alert ${selectedAlertForAck.id} acknowledged and logged.`);
      setSelectedAlertForAck(null);
      setReviewNote('');
      fetchAlerts();
      setTimeout(() => setSuccessBanner(''), 4000);
    } catch (err) {
      alert(`Acknowledgement error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.wardName && a.wardName.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
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
            <span className="font-bold text-[#16845B]">Clinical Alerts &amp; Triage</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B24] tracking-tight">
            Clinical Deterioration Alerts
          </h1>
          <p className="text-xs sm:text-sm text-[#64746C] mt-1">
            Prioritized real-time alerts generated from Isolation Forest telemetry anomalies and
            NEWS2 vital threshold rules.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAlerts}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E2EAE5] hover:bg-[#F7FAF8] text-xs font-bold text-[#172B24] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#16845B]" />
          <span>Refresh Alerts</span>
        </button>
      </div>

      {successBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2EAE5] shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64746C]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search alerts by patient name, ID, or Alert ID..."
            className="w-full pl-10 pr-4 py-2 bg-[#F7FAF8] border border-[#E2EAE5] rounded-xl text-xs text-[#172B24] focus:bg-white focus:outline-hidden focus:border-[#16845B]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Alerts' },
            { id: 'unacknowledged', label: 'Action Required (Unresolved)' },
            { id: 'acknowledged', label: 'Acknowledged' },
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setFilterStatus(st.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                filterStatus === st.id
                  ? 'bg-[#16845B] text-white'
                  : 'bg-[#F7FAF8] text-[#64746C] hover:bg-[#EAF7F0] hover:text-[#16845B]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* ALERTS LIST */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E2EAE5]">
          <RefreshCw className="w-8 h-8 text-[#16845B] animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-[#172B24]">Loading clinical alert queue...</p>
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E2EAE5]">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#172B24]">No matching alerts found</h3>
          <p className="text-xs text-[#64746C] mt-1">
            All telemetry streams are operating within normal baseline parameters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => {
            const isUnack = !alert.isAcknowledged;
            const isCritical = alert.priority.includes('Critical');

            return (
              <div
                key={alert.id}
                className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all shadow-xs ${
                  isUnack
                    ? isCritical
                      ? 'border-rose-300 ring-2 ring-rose-500/20 bg-rose-50/20'
                      : 'border-amber-300 bg-amber-50/20'
                    : 'border-[#E2EAE5]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
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

                      <h3 className="text-base font-bold text-[#172B24]">{alert.type}</h3>

                      <span className="text-xs font-mono font-bold text-[#64746C] bg-[#F7FAF8] px-2 py-0.5 rounded border border-[#E2EAE5]">
                        {alert.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#64746C]">
                      <span className="font-bold text-[#172B24]">{alert.patientName}</span>
                      <span>•</span>
                      <span className="font-semibold text-[#16845B]">{alert.patientId}</span>
                      <span>•</span>
                      <span>
                        {alert.wardName} ({alert.roomNumber})
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 text-xs text-[#64746C]">
                    <span className="flex items-center gap-1 justify-end">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(alert.detectedAt).toLocaleString()}
                    </span>
                    {alert.anomalyScore > 0 && (
                      <span className="mt-1 inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        ML Score: {alert.anomalyScore}
                      </span>
                    )}
                  </div>
                </div>

                {/* Reason & Measurements */}
                <div className="mt-4 pt-3 border-t border-[#E2EAE5]/80 space-y-3">
                  <p className="text-xs text-[#172B24] leading-relaxed">
                    <strong className="text-[#172B24]">Trigger Cause:</strong> {alert.reason}
                  </p>

                  {alert.supportingMeasurements && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-[#F7FAF8] p-3 rounded-xl border border-[#E2EAE5]">
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
                </div>

                {/* Footer Actions */}
                <div className="mt-4 pt-3 border-t border-[#E2EAE5]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold text-amber-800">
                        Awaiting clinical sign-off &amp; bedside verification
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <NavLink
                      to={`/nurse/patients/${alert.patientId}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F7FAF8] hover:bg-[#EAF7F0] text-xs font-bold text-[#172B24] rounded-xl border border-[#E2EAE5]"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#16845B]" />
                      <span>Patient Profile</span>
                    </NavLink>

                    {isUnack && (
                      <button
                        type="button"
                        onClick={() => setSelectedAlertForAck(alert)}
                        className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-2xs cursor-pointer"
                      >
                        Acknowledge Alert
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL */}
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
                className="text-[#64746C] hover:text-[#172B24] text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5] text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#64746C]">Patient:</span>
                <span className="font-bold text-[#172B24]">
                  {selectedAlertForAck.patientName} ({selectedAlertForAck.patientId})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64746C]">Trigger:</span>
                <span className="font-bold text-[#172B24]">{selectedAlertForAck.type}</span>
              </div>
              <p className="text-[11px] text-[#64746C] pt-1">{selectedAlertForAck.reason}</p>
            </div>

            <form onSubmit={handleAcknowledge} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#172B24] mb-1.5">
                  Clinical Action &amp; Review Notes:
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="e.g., Bedside assessment completed. Oxygen titrated via nasal cannula. Attending physician informed."
                  className="w-full p-3 bg-[#F7FAF8] border border-[#E2EAE5] rounded-xl text-xs text-[#172B24] focus:bg-white focus:outline-hidden focus:border-[#16845B]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAlertForAck(null)}
                  className="px-4 py-2 bg-[#F7FAF8] text-[#172B24] text-xs font-bold rounded-xl hover:bg-[#E2EAE5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-[#16845B] hover:bg-[#105C43] text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Logging...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Sign &amp; Acknowledge</span>
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
