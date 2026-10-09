import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Activity,
  AlertCircle,
  Shield,
  ArrowRight,
  UserPlus,
  RefreshCw,
  Search
} from 'lucide-react';
import { getWards } from '../../services/api';

export default function WardsList() {
  const navigate = useNavigate();
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchWards = async () => {
    try {
      setLoading(true);
      const res = await getWards();
      if (res.success) setWards(res.data);
    } catch (err) {
      console.error('Failed to load wards:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWards();
  }, []);

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

  const filteredWards = wards.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.type.toLowerCase().includes(search.toLowerCase()) ||
      w.floor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B24] tracking-tight">
            Hospital Wards &amp; Inpatient Rooms
          </h1>
          <p className="text-xs sm:text-sm text-[#64746C] mt-1">
            Browse all hospital wards, monitor bed availability, and assign rooms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchWards}
            className="p-2.5 rounded-xl border border-[#E2EAE5] bg-white hover:bg-[#F7FAF8] text-[#64746C] cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#16845B]' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => navigate('/receptionist/admissions/new')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16845B] hover:bg-[#105C43] text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Assign Room</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="max-w-md relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64746C]">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ward name, wing, or type..."
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-[#E2EAE5] text-xs text-[#172B24] placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#16845B]"
        />
      </div>

      {/* Ward Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWards.map((ward) => {
          const Icon = getWardIcon(ward.type);

          return (
            <div
              key={ward.id}
              onClick={() => navigate(`/receptionist/wards/${ward.id}`)}
              className="group bg-white rounded-2xl p-6 border border-[#E2EAE5] shadow-xs hover:shadow-md hover:border-[#16845B]/50 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
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
                <p className="text-xs text-[#64746C] mt-0.5">{ward.floor}</p>
                <p className="text-xs text-[#64746C]/80 mt-2 line-clamp-2 leading-relaxed">
                  {ward.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E2EAE5]/80 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5]/60">
                    <span className="block text-[10px] uppercase font-bold text-[#64746C]">Total</span>
                    <span className="font-extrabold font-mono text-[#172B24] text-base">{ward.totalRooms}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#EAF7F0] border border-[#CDEBDC]">
                    <span className="block text-[10px] uppercase font-bold text-[#105C43]">Available</span>
                    <span className="font-extrabold font-mono text-[#16845B] text-base">{ward.availableRooms}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-100 border border-slate-200">
                    <span className="block text-[10px] uppercase font-bold text-slate-600">Occupied</span>
                    <span className="font-extrabold font-mono text-[#172B24] text-base">{ward.occupiedRooms}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#16845B] text-white text-xs font-bold hover:bg-[#105C43] transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Open Ward Room Grid</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
