import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Search,
  UserPlus,
  RefreshCw
} from 'lucide-react';
import { getAdmissions, getWards } from '../../services/api';

export default function AdmissionsList() {
  const navigate = useNavigate();

  const [admissions, setAdmissions] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const [admRes, wardsRes] = await Promise.all([
        getAdmissions({ wardId: selectedWard }),
        getWards(),
      ]);

      if (admRes.success) setAdmissions(admRes.data);
      if (wardsRes.success) setWards(wardsRes.data);
    } catch (err) {
      console.error('Error fetching admissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWard]);

  const filteredAdmissions = admissions.filter(
    (a) =>
      a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      a.attendingDoctor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B24] tracking-tight">
            Hospital Admissions Log
          </h1>
          <p className="text-xs sm:text-sm text-[#64746C] mt-1">
            Chronological audit record of patient admissions, doctor assignments, and assigned rooms.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/receptionist/admissions/new')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16845B] hover:bg-[#105C43] text-white text-xs font-bold shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ New Admission</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2EAE5] shadow-2xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64746C]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Admission ID, patient name, room, or doctor..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#F7FAF8] rounded-xl border border-[#E2EAE5] text-xs text-[#172B24] placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#16845B]"
          />
        </div>

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
      </div>

      {/* Admissions Table */}
      <div className="bg-white rounded-3xl border border-[#E2EAE5] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#64746C]">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#16845B]" />
            Loading admission records...
          </div>
        ) : filteredAdmissions.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#64746C]">
            <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-[#172B24]">No admission logs found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F7FAF8] border-b border-[#E2EAE5] text-[#64746C] text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Admission ID</th>
                  <th className="py-3 px-4 font-semibold">Patient Name &amp; ID</th>
                  <th className="py-3 px-4 font-semibold">Ward &amp; Room</th>
                  <th className="py-3 px-4 font-semibold">Attending Doctor</th>
                  <th className="py-3 px-4 font-semibold">Assigned Caregiver</th>
                  <th className="py-3 px-4 font-semibold">Admitted Timestamp</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EAE5]">
                {filteredAdmissions.map((adm) => (
                  <tr key={adm.id} className="hover:bg-[#F7FAF8] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#16845B]">{adm.id}</td>
                    <td className="py-3.5 px-4">
                      <strong className="text-[#172B24] block">{adm.patientName}</strong>
                      <span className="font-mono text-[10px] text-[#64746C]">{adm.patientId}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#172B24]">{adm.wardName}</span>
                      <span className="text-[11px] text-[#16845B] block font-semibold">{adm.roomNumber}</span>
                    </td>
                    <td className="py-3.5 px-4 text-[#172B24]">{adm.attendingDoctor}</td>
                    <td className="py-3.5 px-4 text-[#64746C]">{adm.assignedNurse || 'Floor Nurse Team'}</td>
                    <td className="py-3.5 px-4 text-[#64746C]">
                      {new Date(adm.admittedAt).toLocaleDateString()} • {new Date(adm.admittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF7F0] text-[#105C43] border border-[#CDEBDC]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
