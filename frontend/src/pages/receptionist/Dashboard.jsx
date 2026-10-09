import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  LayoutGrid,
  CheckCircle2,
  Users,
  UserPlus,
  ArrowRight,
  Activity,
  AlertCircle,
  Shield,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getHospitalStats, getWards, getAdmissions } from '../../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [wards, setWards] = useState([]);
  const [recentAdmissions, setRecentAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, wardsRes, admRes] = await Promise.all([
        getHospitalStats(),
        getWards(),
        getAdmissions({ status: 'active' }),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (wardsRes.success) setWards(wardsRes.data);
      if (admRes.success) setRecentAdmissions(admRes.data.slice(0, 5));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Unable to load latest hospital statistics. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Helper to map ward icon
  const getWardIcon = (type) => {
    switch (type) {
      case 'ICU':
        return Activity;
      case 'Emergency':
        return AlertCircle;
      case 'Private Ward':
        return Shield;
      default:
        return Building2;
    }
  };

  return (
    <div className="space-y-8">
      {/* ========================================================================= */}
      {/* 1. WELCOME BANNER & ACTION HEADER */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EAE5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle decorative background mint glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#EAF7F0]/60 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF7F0] border border-[#CDEBDC] text-[#16845B] text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Admissions &amp; Bed Telemetry</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B24] tracking-tight">
            Good morning, {user?.name || 'Eleanor Jenkins'}
          </h1>

          <p className="text-sm sm:text-base text-[#64746C] leading-relaxed">
            Manage patient admissions, ward availability, and room assignments from one place.
          </p>
        </div>

        {/* Action Button: + Assign Room */}
        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-3 rounded-xl border border-[#E2EAE5] bg-white hover:bg-[#F7FAF8] text-[#64746C] hover:text-[#172B24] transition-colors cursor-pointer"
            title="Refresh hospital availability"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#16845B]' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => navigate('/receptionist/admissions/new')}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#16845B] hover:bg-[#105C43] text-white text-sm font-bold shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Assign Room</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchData}
            className="underline font-bold text-amber-900 hover:text-amber-950"
          >
            Retry
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SUMMARY STATISTIC CARDS (Dynamically calculated from backend) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Total Wards */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2EAE5] shadow-xs hover:border-[#16845B]/30 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64746C]">
              Total Wards
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#EAF7F0] text-[#16845B] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-mono text-[#172B24]">
              {loading ? '--' : stats?.totalWards ?? 5}
            </div>
            <p className="text-xs text-[#64746C] mt-1">Across all hospital floors</p>
          </div>
        </div>

        {/* Card 2: Total Rooms */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2EAE5] shadow-xs hover:border-[#16845B]/30 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64746C]">
              Total Rooms
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-[#172B24] flex items-center justify-center">
              <LayoutGrid className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-mono text-[#172B24]">
              {loading ? '--' : stats?.totalRooms ?? 50}
            </div>
            <p className="text-xs text-[#64746C] mt-1">Total inpatient capacity</p>
          </div>
        </div>

        {/* Card 3: Available Rooms */}
        <div className="bg-white p-6 rounded-2xl border border-[#CDEBDC] bg-gradient-to-b from-white to-[#EAF7F0]/20 shadow-xs hover:border-[#16845B] transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#105C43]">
              Available Rooms
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#EAF7F0] text-[#16845B] flex items-center justify-center ring-1 ring-[#16845B]/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-mono text-[#16845B]">
              {loading ? '--' : stats?.availableRooms ?? 37}
            </div>
            <p className="text-xs text-[#105C43] mt-1 font-medium">Ready for immediate patient intake</p>
          </div>
        </div>

        {/* Card 4: Occupied Rooms */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2EAE5] shadow-xs hover:border-[#16845B]/30 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64746C]">
              Occupied Rooms
            </span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-mono text-[#172B24]">
              {loading ? '--' : stats?.occupiedRooms ?? 13}
            </div>
            <p className="text-xs text-[#64746C] mt-1">
              {loading ? 'Calculating...' : `${stats?.occupancyPercentage ?? 26}% overall occupancy`}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. WARD OVERVIEW SECTION */}
      {/* ========================================================================= */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#172B24] tracking-tight">
              Ward Overview
            </h2>
            <p className="text-xs sm:text-sm text-[#64746C] mt-0.5">
              Select a ward to view its rooms and current availability.
            </p>
          </div>

          <button
            onClick={() => navigate('/receptionist/wards')}
            className="text-xs font-semibold text-[#16845B] hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>View All Wards</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Ward Cards Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {wards.map((ward) => {
            const Icon = getWardIcon(ward.type);
            const isHighOccupancy = ward.occupancyRate > 70;

            return (
              <div
                key={ward.id}
                onClick={() => navigate(`/receptionist/wards/${ward.id}`)}
                className="group bg-white rounded-2xl p-6 border border-[#E2EAE5] shadow-xs hover:shadow-md hover:border-[#16845B]/50 transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Ward Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#EAF7F0] text-[#16845B] flex items-center justify-center shrink-0 group-hover:bg-[#16845B] group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F7FAF8] border border-[#E2EAE5] text-[#172B24]">
                      {ward.type}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#172B24] group-hover:text-[#16845B] transition-colors">
                    {ward.name}
                  </h3>
                  <p className="text-xs text-[#64746C] mt-1">{ward.floor}</p>
                  <p className="text-xs text-[#64746C]/80 mt-2 line-clamp-2 leading-relaxed">
                    {ward.description}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-[#E2EAE5]/80 space-y-3">
                  {/* Metric Counters */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5]/60">
                      <span className="block text-[10px] uppercase font-bold text-[#64746C]">Total</span>
                      <span className="text-base font-extrabold font-mono text-[#172B24]">
                        {ward.totalRooms}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-[#EAF7F0]/60 border border-[#CDEBDC]">
                      <span className="block text-[10px] uppercase font-bold text-[#105C43]">Available</span>
                      <span className="text-base font-extrabold font-mono text-[#16845B]">
                        {ward.availableRooms}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-100 border border-slate-200">
                      <span className="block text-[10px] uppercase font-bold text-slate-600">Occupied</span>
                      <span className="text-base font-extrabold font-mono text-[#172B24]">
                        {ward.occupiedRooms}
                      </span>
                    </div>
                  </div>

                  {/* Availability Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#64746C] font-medium">Occupancy</span>
                      <span className="font-bold text-[#172B24] font-mono">{ward.occupancyRate}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#E2EAE5] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isHighOccupancy ? 'bg-amber-500' : 'bg-[#16845B]'
                        }`}
                        style={{ width: `${ward.occupancyRate}%` }}
                      />
                    </div>
                  </div>

                  {/* View Rooms Action Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/receptionist/wards/${ward.id}`);
                    }}
                    className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#F7FAF8] group-hover:bg-[#16845B] text-[#172B24] group-hover:text-white text-xs font-bold border border-[#E2EAE5] group-hover:border-[#16845B] transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>View Rooms</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. RECENT ADMISSIONS QUICK LOG */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EAE5] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#172B24]">Recent Active Admissions</h3>
            <p className="text-xs text-[#64746C]">Patients recently admitted and assigned to beds.</p>
          </div>
          <button
            onClick={() => navigate('/receptionist/admissions')}
            className="text-xs font-semibold text-[#16845B] hover:underline"
          >
            View Full Admissions Log &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E2EAE5] text-[#64746C] text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3 font-semibold">Admission ID</th>
                <th className="py-2.5 px-3 font-semibold">Patient Name</th>
                <th className="py-2.5 px-3 font-semibold">Ward &amp; Room</th>
                <th className="py-2.5 px-3 font-semibold">Attending Doctor</th>
                <th className="py-2.5 px-3 font-semibold">Admitted At</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EAE5]">
              {recentAdmissions.map((adm) => (
                <tr key={adm.id} className="hover:bg-[#F7FAF8] transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-[#172B24]">{adm.id}</td>
                  <td className="py-3 px-3 font-bold text-[#172B24]">{adm.patientName}</td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-[#16845B]">{adm.wardName}</span>
                    <span className="text-[11px] text-[#64746C] block">{adm.roomNumber}</span>
                  </td>
                  <td className="py-3 px-3 text-[#64746C]">{adm.attendingDoctor}</td>
                  <td className="py-3 px-3 text-[#64746C]">
                    {new Date(adm.admittedAt).toLocaleDateString()} • {new Date(adm.admittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF7F0] text-[#105C43] border border-[#CDEBDC]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Active Inpatient
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
