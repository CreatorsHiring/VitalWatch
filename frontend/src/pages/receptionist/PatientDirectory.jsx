import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  UserPlus,
  X,
  RefreshCw
} from 'lucide-react';
import { getPatients, getWards } from '../../services/api';

export default function PatientDirectory() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedHistoryStatus, setSelectedHistoryStatus] = useState('');

  // Selected patient for detail modal
  const [activePatient, setActivePatient] = useState(null);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const [patientsRes, wardsRes] = await Promise.all([
        getPatients({
          search,
          wardId: selectedWard,
          admissionStatus: selectedStatus,
          historyStatus: selectedHistoryStatus,
        }),
        getWards(),
      ]);

      if (patientsRes.success) setPatients(patientsRes.data);
      if (wardsRes.success) setWards(wardsRes.data);
    } catch (err) {
      console.error('Error loading patients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWard, selectedStatus, selectedHistoryStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPatients();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B24] tracking-tight">
            Patient Directory &amp; Records
          </h1>
          <p className="text-xs sm:text-sm text-[#64746C] mt-1">
            Search patient records, view bed allocations, and inspect documented medical history.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/receptionist/admissions/new')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16845B] hover:bg-[#105C43] text-white text-xs font-bold shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Register / Admit Patient</span>
        </button>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2EAE5] shadow-2xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64746C]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Patient Name, ID (e.g. VW-PAT-1001), or Phone..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F7FAF8] rounded-xl border border-[#E2EAE5] text-xs text-[#172B24] placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#16845B]"
            />
          </div>

          {/* Ward Filter */}
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="px-3 py-2.5 bg-[#F7FAF8] rounded-xl border border-[#E2EAE5] text-xs text-[#172B24] focus:outline-hidden focus:ring-2 focus:ring-[#16845B]"
          >
            <option value="">All Wards</option>
            {wards.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>

          {/* Admission Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2.5 bg-[#F7FAF8] rounded-xl border border-[#E2EAE5] text-xs text-[#172B24] focus:outline-hidden focus:ring-2 focus:ring-[#16845B]"
          >
            <option value="">All Admission Statuses</option>
            <option value="Admitted">Admitted</option>
            <option value="Discharged">Discharged</option>
            <option value="Unassigned">Unassigned</option>
          </select>

          {/* Medical History Filter */}
          <select
            value={selectedHistoryStatus}
            onChange={(e) => setSelectedHistoryStatus(e.target.value)}
            className="px-3 py-2.5 bg-[#F7FAF8] rounded-xl border border-[#E2EAE5] text-xs text-[#172B24] focus:outline-hidden focus:ring-2 focus:ring-[#16845B]"
          >
            <option value="">All History Statuses</option>
            <option value="verified">Verified / ABHA</option>
            <option value="unverified">Unverified</option>
          </select>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#16845B] hover:bg-[#105C43] text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-3xl border border-[#E2EAE5] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#64746C]">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#16845B]" />
            Loading patient records...
          </div>
        ) : patients.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#64746C]">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-[#172B24]">No patient records found</h3>
            <p className="mt-1">Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F7FAF8] border-b border-[#E2EAE5] text-[#64746C] text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Patient ID</th>
                  <th className="py-3 px-4 font-semibold">Patient Name</th>
                  <th className="py-3 px-4 font-semibold">DOB &amp; Gender</th>
                  <th className="py-3 px-4 font-semibold">Admission Status</th>
                  <th className="py-3 px-4 font-semibold">Current Ward &amp; Room</th>
                  <th className="py-3 px-4 font-semibold">Registration Date</th>
                  <th className="py-3 px-4 font-semibold">Medical History</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EAE5]">
                {patients.map((p) => {
                  const isAdmitted = p.admissionStatus?.toLowerCase() === 'admitted';
                  const isVerified = p.medicalHistory?.status === 'verified';
                  const isAbha = p.medicalHistory?.source === 'abha_demo';

                  return (
                    <tr
                      key={p.id}
                      onClick={() => setActivePatient(p)}
                      className="hover:bg-[#F7FAF8] transition-colors cursor-pointer group"
                    >
                      {/* Patient ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#16845B]">
                        {p.id}
                      </td>

                      {/* Name */}
                      <td className="py-3.5 px-4 font-bold text-[#172B24] group-hover:text-[#16845B] transition-colors">
                        {p.fullName}
                      </td>

                      {/* DOB & Gender */}
                      <td className="py-3.5 px-4 text-[#64746C]">
                        {p.dob} • {p.gender}
                      </td>

                      {/* Admission Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isAdmitted
                              ? 'bg-[#EAF7F0] text-[#105C43] border border-[#CDEBDC]'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isAdmitted ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          />
                          {p.admissionStatus || 'Unassigned'}
                        </span>
                      </td>

                      {/* Ward & Room */}
                      <td className="py-3.5 px-4">
                        {p.currentWardName ? (
                          <div>
                            <span className="font-semibold text-[#172B24]">{p.currentWardName}</span>
                            <span className="text-[11px] text-[#64746C] block">{p.currentRoomNumber}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">Not currently assigned</span>
                        )}
                      </td>

                      {/* Registration Date */}
                      <td className="py-3.5 px-4 text-[#64746C]">
                        {new Date(p.createdAt || Date.now()).toLocaleDateString()}
                      </td>

                      {/* Medical History Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                            isAbha
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : isVerified
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-900 border border-amber-200'
                          }`}
                        >
                          {isAbha ? 'ABHA Verified' : isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActivePatient(p);
                          }}
                          className="px-3 py-1 bg-[#F7FAF8] hover:bg-[#16845B] text-[#172B24] hover:text-white border border-[#E2EAE5] rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PATIENT PROFILE DETAIL MODAL */}
      {activePatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-[#E2EAE5] shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setActivePatient(null)}
              className="absolute right-5 top-5 p-2 rounded-full text-[#64746C] hover:bg-[#F7FAF8]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#E2EAE5] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-[#172B24]">{activePatient.fullName}</h3>
                  <span className="font-mono text-xs font-bold text-[#16845B] bg-[#EAF7F0] px-2.5 py-0.5 rounded-lg border border-[#CDEBDC]">
                    {activePatient.id}
                  </span>
                </div>
                <p className="text-xs text-[#64746C] mt-0.5">
                  {activePatient.gender} • DOB: {activePatient.dob} • Phone: {activePatient.phone}
                </p>
              </div>

              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                  activePatient.admissionStatus === 'Admitted'
                    ? 'bg-[#EAF7F0] text-[#105C43] border border-[#CDEBDC]'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {activePatient.admissionStatus}
              </span>
            </div>

            {/* Current Admission & Bed info */}
            {activePatient.currentWardName ? (
              <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5] space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#16845B]">
                  Current Inpatient Assignment
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[#64746C] block">Ward:</span>
                    <strong className="text-sm font-bold text-[#172B24]">
                      {activePatient.currentWardName}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#64746C] block">Bed / Room Number:</span>
                    <strong className="text-sm font-bold text-[#16845B]">
                      {activePatient.currentRoomNumber}
                    </strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>Patient is not currently admitted to any hospital room.</span>
                <button
                  onClick={() => {
                    setActivePatient(null);
                    navigate(`/receptionist/admissions/new`);
                  }}
                  className="px-3 py-1 bg-[#16845B] text-white font-bold rounded-lg text-xs cursor-pointer"
                >
                  Assign Room
                </button>
              </div>
            )}

            {/* Documented Medical History */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#172B24]">
                  Documented Medical History &amp; Allergies
                </span>
                <span className="text-[10px] font-semibold text-[#64746C]">
                  Source: {activePatient.medicalHistory?.source || 'Manual Record'}
                </span>
              </div>

              {/* Conditions */}
              <div className="p-3.5 rounded-xl bg-white border border-[#E2EAE5] space-y-1">
                <strong className="text-[11px] text-[#64746C] block">Known Conditions:</strong>
                <div className="flex flex-wrap gap-1.5">
                  {activePatient.medicalHistory?.conditions?.length > 0 ? (
                    activePatient.medicalHistory.conditions.map((c, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 font-medium">
                        {c}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">None documented upon intake</span>
                  )}
                </div>
              </div>

              {/* Allergies */}
              <div className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200 space-y-1">
                <strong className="text-[11px] text-rose-800 block">Allergies &amp; Adverse Reactions:</strong>
                <div className="flex flex-wrap gap-1.5">
                  {activePatient.medicalHistory?.allergies?.length > 0 ? (
                    activePatient.medicalHistory.allergies.map((a, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold">
                        {a}
                      </span>
                    ))
                  ) : (
                    <span className="text-rose-700/70">No known drug allergies (NKDA)</span>
                  )}
                </div>
              </div>

              {/* Medications */}
              <div className="p-3.5 rounded-xl bg-white border border-[#E2EAE5] space-y-1">
                <strong className="text-[11px] text-[#64746C] block">Active Medications:</strong>
                <div className="flex flex-wrap gap-1.5">
                  {activePatient.medicalHistory?.medications?.length > 0 ? (
                    activePatient.medicalHistory.medications.map((m, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-md bg-[#EAF7F0] text-[#105C43] font-medium border border-[#CDEBDC]">
                        {m}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">No active medications recorded</span>
                  )}
                </div>
              </div>

              {/* Notes */}
              {activePatient.medicalHistory?.notes && (
                <div className="p-3 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-[#64746C]">
                  <strong className="text-[#172B24] block mb-0.5">Clinical Intake Notes:</strong>
                  {activePatient.medicalHistory.notes}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#E2EAE5] flex items-center justify-between">
              <span className="text-[11px] text-[#64746C]">
                Registered: {new Date(activePatient.createdAt || Date.now()).toLocaleDateString()}
              </span>
              <button
                type="button"
                onClick={() => setActivePatient(null)}
                className="px-5 py-2.5 bg-[#172B24] text-white font-bold rounded-xl text-xs hover:bg-slate-800 cursor-pointer"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
