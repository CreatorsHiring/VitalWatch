import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  ChevronRight,
  UserPlus,
  Search,
  X,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { getWardById, getWardRooms, getPatientById } from '../../services/api';

export default function WardRoomsView() {
  const { wardId } = useParams();
  const navigate = useNavigate();

  const [ward, setWard] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'available' | 'occupied'

  // Read-only modal state for occupied rooms
  const [selectedOccupiedRoom, setSelectedOccupiedRoom] = useState(null);
  const [patientDetail, setPatientDetail] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(false);

  const fetchWardData = async () => {
    try {
      setLoading(true);
      const [wardRes, roomsRes] = await Promise.all([
        getWardById(wardId),
        getWardRooms(wardId),
      ]);

      if (wardRes.success) setWard(wardRes.data);
      if (roomsRes.success) setRooms(roomsRes.data);
    } catch (err) {
      console.error('Error fetching ward room data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wardId]);

  // Handle clicking on an occupied room
  const handleOccupiedRoomClick = async (room) => {
    setSelectedOccupiedRoom(room);
    if (room.currentPatientId) {
      try {
        setLoadingPatient(true);
        const res = await getPatientById(room.currentPatientId);
        if (res.success) setPatientDetail(res.data);
      } catch (err) {
        console.error('Failed to load patient details:', err);
      } finally {
        setLoadingPatient(false);
      }
    }
  };

  // Filtered rooms list
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      room.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalCount = rooms.length;
  const availableCount = rooms.filter((r) => r.status === 'available').length;
  const occupiedCount = rooms.filter((r) => r.status === 'occupied').length;

  return (
    <div className="space-y-6">
      {/* 1. BREADCRUMBS & WARD HEADER */}
      <div className="space-y-3">
        {/* Breadcrumb trail */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-[#64746C]">
          <Link to="/receptionist/dashboard" className="hover:text-[#16845B]">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/receptionist/wards" className="hover:text-[#16845B]">
            Wards
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#172B24] font-bold">
            {ward?.name || 'General Ward'}
          </span>
        </nav>

        {/* Ward Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EAE5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EAF7F0] text-[#16845B] border border-[#CDEBDC]">
                {ward?.type || 'Inpatient Ward'}
              </span>
              <span className="text-xs text-[#64746C]">•</span>
              <span className="text-xs text-[#64746C] font-medium">{ward?.floor || 'Floor 1'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B24] tracking-tight">
              {ward?.name || 'Ward Rooms'}
            </h1>
            <p className="text-xs sm:text-sm text-[#64746C] max-w-xl">
              {ward?.description || 'View real-time room availability, inspect occupied bed records, and assign incoming patients.'}
            </p>
          </div>

          {/* Stat Counters & Assign CTA */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-[#F7FAF8] p-2.5 rounded-2xl border border-[#E2EAE5] text-xs">
              <div className="px-3 py-1 text-center border-r border-[#E2EAE5]">
                <span className="text-[10px] uppercase font-bold text-[#64746C] block">Total</span>
                <span className="text-base font-extrabold font-mono text-[#172B24]">{totalCount}</span>
              </div>
              <div className="px-3 py-1 text-center border-r border-[#E2EAE5]">
                <span className="text-[10px] uppercase font-bold text-[#105C43] block">Available</span>
                <span className="text-base font-extrabold font-mono text-[#16845B]">{availableCount}</span>
              </div>
              <div className="px-3 py-1 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-600 block">Occupied</span>
                <span className="text-base font-extrabold font-mono text-slate-700">{occupiedCount}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/receptionist/admissions/new?wardId=${wardId}`)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#16845B] hover:bg-[#105C43] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Assign Room</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. ROOM AVAILABILITY LEGEND & SEARCH/FILTER CONTROLS */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2EAE5] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Availability Legend */}
        <div className="flex items-center gap-6 text-xs">
          <span className="font-bold text-[#172B24] uppercase tracking-wider text-[11px]">
            Room Legend:
          </span>

          {/* Green Dot — Available */}
          <div className="flex items-center gap-2 font-semibold text-[#105C43]">
            <span
              className="w-3.5 h-3.5 rounded-full inline-block shrink-0 shadow-xs ring-2 ring-emerald-200"
              style={{ backgroundColor: '#16845B' }}
            ></span>
            <span>Available (Click to Assign)</span>
          </div>

          {/* Gray Dot — Occupied */}
          <div className="flex items-center gap-2 font-semibold text-slate-600">
            <span
              className="w-3.5 h-3.5 rounded-full inline-block shrink-0 shadow-xs ring-2 ring-slate-200"
              style={{ backgroundColor: '#9AA59F' }}
            ></span>
            <span>Occupied (Read-Only)</span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search by room number */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64746C]">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search room number..."
              className="pl-8.5 pr-3 py-1.5 bg-[#F7FAF8] rounded-xl border border-[#E2EAE5] text-xs text-[#172B24] placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#16845B] w-44"
            />
          </div>

          {/* Filter Pills */}
          <div className="p-1 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] flex items-center gap-1">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white text-[#16845B] shadow-2xs font-bold'
                  : 'text-[#64746C] hover:text-[#172B24]'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('available')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'available'
                  ? 'bg-[#EAF7F0] text-[#16845B] font-bold ring-1 ring-[#16845B]/30'
                  : 'text-[#64746C] hover:text-[#172B24]'
              }`}
            >
              Available ({availableCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('occupied')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'occupied'
                  ? 'bg-slate-200 text-slate-800 font-bold'
                  : 'text-[#64746C] hover:text-[#172B24]'
              }`}
            >
              Occupied ({occupiedCount})
            </button>
          </div>
        </div>
      </div>

      {/* 3. ROOM GRID */}
      {loading ? (
        <div className="py-20 text-center">
          <RefreshCw className="w-8 h-8 text-[#16845B] animate-spin mx-auto mb-2" />
          <p className="text-xs text-[#64746C]">Loading ward room telemetry...</p>
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E2EAE5]">
          <Building2 className="w-10 h-10 text-[#64746C]/50 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#172B24]">No rooms matched your criteria</h3>
          <p className="text-xs text-[#64746C] mt-1">Try changing the search term or status filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredRooms.map((room) => {
            const isAvailable = room.status === 'available';

            return (
              <div
                key={room.id}
                onClick={() => {
                  if (isAvailable) {
                    // Navigate to assignment workflow with ward and room preselected
                    navigate(`/receptionist/admissions/new?wardId=${room.wardId}&roomId=${room.id}&roomNumber=${encodeURIComponent(room.roomNumber)}`);
                  } else {
                    // Open read-only occupied room info panel
                    handleOccupiedRoomClick(room);
                  }
                }}
                className={`group relative rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between text-center ${
                  isAvailable
                    ? 'bg-white hover:bg-[#EAF7F0]/40 border-[#CDEBDC] hover:border-[#16845B] shadow-2xs hover:shadow-md'
                    : 'bg-[#F7FAF8] hover:bg-slate-100/80 border-[#E2EAE5] shadow-2xs'
                }`}
              >
                {/* Room Number */}
                <div>
                  <h4 className="text-base sm:text-lg font-extrabold font-mono text-[#172B24] tracking-tight">
                    {room.roomNumber}
                  </h4>

                  {/* Status Indicator Dot & Label */}
                  <div className="my-3 flex flex-col items-center justify-center gap-1.5">
                    <span
                      className={`w-3.5 h-3.5 rounded-full inline-block shadow-xs transition-transform group-hover:scale-110 ${
                        isAvailable
                          ? 'bg-[#16845B] ring-2 ring-emerald-200'
                          : 'bg-[#9AA59F] ring-2 ring-slate-300'
                      }`}
                      style={{
                        backgroundColor: isAvailable ? '#16845B' : '#9AA59F',
                      }}
                      aria-hidden="true"
                    />
                    <span
                      className={`text-xs font-bold tracking-wide ${
                        isAvailable ? 'text-[#16845B]' : 'text-[#64746C]'
                      }`}
                    >
                      {isAvailable ? 'Available' : 'Occupied'}
                    </span>
                  </div>
                </div>

                {/* Patient / Action Subtext */}
                <div className="pt-2 border-t border-[#E2EAE5]/60 min-h-[36px] flex items-center justify-center">
                  {isAvailable ? (
                    <span className="text-[11px] font-semibold text-[#16845B] group-hover:underline">
                      + Assign
                    </span>
                  ) : (
                    <div className="text-center truncate w-full">
                      <span className="text-[11px] font-bold text-[#172B24] block truncate">
                        {room.patient?.fullName || 'Admitted Patient'}
                      </span>
                      <span className="text-[10px] text-[#64746C] font-mono block">
                        {room.patient?.id || room.currentPatientId}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. OCCUPIED ROOM READ-ONLY INFORMATION MODAL */}
      {selectedOccupiedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#E2EAE5] shadow-2xl relative animate-in fade-in-50 zoom-in-95 duration-150">
            {/* Close Button */}
            <button
              onClick={() => {
                setSelectedOccupiedRoom(null);
                setPatientDetail(null);
              }}
              className="absolute right-5 top-5 p-2 rounded-full text-[#64746C] hover:bg-[#F7FAF8] hover:text-[#172B24]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-lg font-mono">
                {selectedOccupiedRoom.roomNumber.replace(/[^0-9]/g, '') || 'Bed'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-[#172B24]">
                    {selectedOccupiedRoom.roomNumber}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    <span className="w-2 h-2 rounded-full bg-[#9AA59F]"></span>
                    Occupied
                  </span>
                </div>
                <p className="text-xs text-[#64746C] mt-0.5">
                  {ward?.name} • {ward?.type}
                </p>
              </div>
            </div>

            {/* Read-Only Notice */}
            <div className="p-3.5 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-xs text-[#64746C] mb-5 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#172B24]">Active Inpatient Assignment: </strong>
                This room is currently occupied by an admitted patient. Reassignment or double-booking is prohibited by hospital safety protocols.
              </div>
            </div>

            {/* Patient Information */}
            {loadingPatient ? (
              <div className="py-6 text-center text-xs text-[#64746C]">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#16845B]" />
                Loading patient record...
              </div>
            ) : patientDetail ? (
              <div className="space-y-3.5 text-xs">
                <div className="p-4 rounded-2xl bg-[#EAF7F0]/40 border border-[#CDEBDC] space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#105C43]">
                        Admitted Patient
                      </span>
                      <h4 className="text-base font-bold text-[#172B24]">
                        {patientDetail.fullName}
                      </h4>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#16845B] bg-white px-2.5 py-1 rounded-lg border border-[#CDEBDC]">
                      {patientDetail.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#CDEBDC]/60 text-[#64746C]">
                    <div>
                      <span className="font-semibold text-[#172B24]">DOB / Gender: </span>
                      {patientDetail.dob} ({patientDetail.gender})
                    </div>
                    <div>
                      <span className="font-semibold text-[#172B24]">Phone: </span>
                      {patientDetail.phone || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Medical History Summary */}
                {patientDetail.medicalHistory && (
                  <div className="p-3.5 rounded-xl border border-[#E2EAE5] bg-white space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#64746C] block">
                      Documented Conditions &amp; Allergies
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {patientDetail.medicalHistory.conditions?.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                          {c}
                        </span>
                      ))}
                      {patientDetail.medicalHistory.allergies?.map((a, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-medium">
                          Allergy: {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-4 text-xs text-[#64746C]">
                Admitted Patient ID: <strong className="text-[#172B24]">{selectedOccupiedRoom.currentPatientId}</strong>
              </div>
            )}

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-[#E2EAE5] flex items-center justify-between">
              <span className="text-[11px] text-[#64746C]">
                VitalWatch Bed Management
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedOccupiedRoom(null);
                  setPatientDetail(null);
                }}
                className="px-5 py-2.5 bg-[#172B24] hover:bg-slate-800 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
