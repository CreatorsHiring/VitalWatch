import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  X,
  Info,
  Save,
  Check,
  Search
} from 'lucide-react';
import {
  getWards,
  getWardRooms,
  getPatients,
  createAdmission,
  lookupAbhaDemo,
} from '../../services/api';

export default function AssignRoom() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialWardId = searchParams.get('wardId') || '';
  const initialRoomId = searchParams.get('roomId') || '';
  const initialRoomNumber = searchParams.get('roomNumber') || '';

  // Wards & Available Rooms state
  const [wards, setWards] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  // Section A: Patient Information
  const [existingPatientId, setExistingPatientId] = useState('');
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Female');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  // Patient Search Modal for Returning Patients
  const [searchPatientModalOpen, setSearchPatientModalOpen] = useState(false);
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [searchedPatients, setSearchedPatients] = useState([]);
  const [searchingPatients, setSearchingPatients] = useState(false);

  // Section B: Admission Information
  const [admittedAt, setAdmittedAt] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });
  const [selectedWardId, setSelectedWardId] = useState(initialWardId);
  const [selectedRoomId, setSelectedRoomId] = useState(initialRoomId);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState(initialRoomNumber);
  const [attendingDoctor, setAttendingDoctor] = useState('Dr. Sarah Mehta, MD (Orthopedics / Surgery)');
  const [admissionReason, setAdmissionReason] = useState('');
  const [assignedNurse, setAssignedNurse] = useState('Nurse Vance, RN');

  // Section C: Medical History Collection
  const [historyMode, setHistoryMode] = useState('manual'); // 'manual' | 'abha' | 'unknown'
  const [conditionsText, setConditionsText] = useState('');
  const [allergiesText, setAllergiesText] = useState('');
  const [medicationsText, setMedicationsText] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [historyStatus, setHistoryStatus] = useState('verified'); // 'verified' | 'unverified'

  // ABHA Demo Modal & Retrieval State
  const [abhaModalOpen, setAbhaModalOpen] = useState(false);
  const [abhaSearchQuery, setAbhaSearchQuery] = useState('');
  const [abhaRecords, setAbhaRecords] = useState([]);
  const [searchingAbha, setSearchingAbha] = useState(false);

  // Form State
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successResult, setSuccessResult] = useState(null);

  // 1. Fetch initial wards on mount
  useEffect(() => {
    async function loadWards() {
      try {
        const res = await getWards();
        if (res.success) {
          setWards(res.data);
          if (!selectedWardId && res.data.length > 0) {
            setSelectedWardId(res.data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load wards:', err);
      }
    }
    loadWards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Fetch available rooms when ward changes
  useEffect(() => {
    async function loadRoomsForWard() {
      if (!selectedWardId) {
        setAvailableRooms([]);
        return;
      }
      try {
        setLoadingRooms(true);
        const res = await getWardRooms(selectedWardId);
        if (res.success) {
          const avail = res.data.filter((r) => r.status === 'available');
          setAvailableRooms(avail);

          // Clear or set room
          if (initialRoomId && res.data.some((r) => r.id === initialRoomId && r.status === 'available')) {
            setSelectedRoomId(initialRoomId);
            const found = res.data.find((r) => r.id === initialRoomId);
            setSelectedRoomNumber(found?.roomNumber || initialRoomNumber);
          } else if (avail.length > 0 && !avail.some((r) => r.id === selectedRoomId)) {
            setSelectedRoomId(avail[0].id);
            setSelectedRoomNumber(avail[0].roomNumber);
          } else if (avail.length === 0) {
            setSelectedRoomId('');
            setSelectedRoomNumber('');
          }
        }
      } catch (err) {
        console.error('Failed to load rooms for ward:', err);
      } finally {
        setLoadingRooms(false);
      }
    }

    loadRoomsForWard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWardId]);

  // Handle Ward selection change
  const handleWardChange = (e) => {
    const newWardId = e.target.value;
    setSelectedWardId(newWardId);
    setSelectedRoomId('');
    setSelectedRoomNumber('');
  };

  // Handle Room selection change
  const handleRoomChange = (e) => {
    const roomId = e.target.value;
    setSelectedRoomId(roomId);
    const room = availableRooms.find((r) => r.id === roomId);
    setSelectedRoomNumber(room ? room.roomNumber : '');
  };

  // Search existing patients
  const handleSearchPatients = async () => {
    try {
      setSearchingPatients(true);
      const res = await getPatients({ search: patientSearchQuery });
      if (res.success) {
        setSearchedPatients(res.data);
      }
    } catch (err) {
      console.error('Error searching patients:', err);
    } finally {
      setSearchingPatients(false);
    }
  };

  const handleSelectExistingPatient = (patient) => {
    setExistingPatientId(patient.id);
    setFullName(patient.fullName);
    setDob(patient.dob);
    setGender(patient.gender);
    setPhone(patient.phone);
    setEmergencyContact(patient.emergencyContact || '');

    if (patient.medicalHistory) {
      setConditionsText(patient.medicalHistory.conditions?.join(', ') || '');
      setAllergiesText(patient.medicalHistory.allergies?.join(', ') || '');
      setMedicationsText(patient.medicalHistory.medications?.join(', ') || '');
      setClinicalNotes(patient.medicalHistory.notes || '');
      setHistoryStatus(patient.medicalHistory.status || 'verified');
    }

    setSearchPatientModalOpen(false);
  };

  // Search ABHA records
  const handleSearchAbha = async () => {
    try {
      setSearchingAbha(true);
      const res = await lookupAbhaDemo(abhaSearchQuery);
      if (res.success) {
        setAbhaRecords(res.data);
      }
    } catch (err) {
      console.error('Error searching ABHA:', err);
    } finally {
      setSearchingAbha(false);
    }
  };

  const handleImportAbha = (record) => {
    setFullName(record.name);
    setDob(record.dob);
    setGender(record.gender);
    setConditionsText(record.conditions.join(', '));
    setAllergiesText(record.allergies.join(', '));
    setMedicationsText(record.medications.join(', '));
    setClinicalNotes(
      `Simulated ABHA Record (${record.abhaId}). Verified at ${record.verifiedHealthFacility}. Past events: ${record.pastHospitalizations.join(', ')}.`
    );
    setHistoryMode('abha');
    setHistoryStatus('verified');
    setAbhaModalOpen(false);
  };

  // Save draft locally
  const handleSaveDraft = () => {
    const draft = {
      fullName,
      dob,
      gender,
      phone,
      emergencyContact,
      selectedWardId,
      selectedRoomId,
      attendingDoctor,
      admissionReason,
      assignedNurse,
      conditionsText,
      allergiesText,
      medicationsText,
      clinicalNotes,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('vitalwatch_admission_draft', JSON.stringify(draft));
    alert('Admission draft saved successfully on this workstation.');
  };

  // Validation
  const validateForm = () => {
    const errs = {};
    if (!fullName.trim()) errs.fullName = 'Patient full name is required.';
    if (!dob) errs.dob = 'Date of birth is required.';
    if (!phone.trim()) {
      errs.phone = 'Phone number is required for patient communication.';
    }
    if (!selectedWardId) errs.ward = 'Please select a hospital ward.';
    if (!selectedRoomId) errs.room = 'Please select an available room.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit Admission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        patient: {
          id: existingPatientId || undefined,
          fullName: fullName.trim(),
          dob,
          gender,
          phone: phone.trim(),
          emergencyContact: emergencyContact.trim(),
        },
        admission: {
          wardId: selectedWardId,
          roomId: selectedRoomId,
          roomNumber: selectedRoomNumber,
          admittedAt,
          attendingDoctor,
          admissionReason: admissionReason.trim() || 'Inpatient admission and monitoring',
          assignedNurse,
        },
        medicalHistory: {
          status: historyStatus,
          source: historyMode === 'abha' ? 'abha_demo' : 'manual',
          conditions: conditionsText
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          allergies: allergiesText
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          medications: medicationsText
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          notes: clinicalNotes.trim(),
        },
      };

      const res = await createAdmission(payload);

      if (res.success) {
        setSuccessResult(res.data);
        localStorage.removeItem('vitalwatch_admission_draft');
      }
    } catch (err) {
      console.error('Admission creation failed:', err);
      setSubmitError(
        err.message || 'Room assignment failed. The room may have been occupied. Please refresh.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success view
  if (successResult) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-[#CDEBDC] shadow-lg text-center space-y-6 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-3xl bg-[#EAF7F0] text-[#16845B] flex items-center justify-center mx-auto ring-4 ring-[#EAF7F0]">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#16845B] bg-[#EAF7F0] px-3 py-1 rounded-full border border-[#CDEBDC]">
            Admission Confirmed
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172B24]">
            Patient Successfully Admitted &amp; Room Assigned!
          </h2>
          <p className="text-xs sm:text-sm text-[#64746C]">
            Patient record and room assignment have been committed atomically to the hospital database.
          </p>
        </div>

        {/* Admission Summary Card */}
        <div className="bg-[#F7FAF8] rounded-2xl p-6 border border-[#E2EAE5] text-left space-y-3 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2EAE5]">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#64746C]">Patient</span>
              <h4 className="text-base font-bold text-[#172B24]">{successResult.patient.fullName}</h4>
            </div>
            <span className="font-mono font-bold text-xs text-[#16845B] bg-white px-3 py-1 rounded-lg border border-[#E2EAE5]">
              {successResult.patient.id}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <span className="text-[#64746C] block">Ward:</span>
              <strong className="text-[#172B24]">{successResult.ward.name}</strong>
            </div>
            <div>
              <span className="text-[#64746C] block">Room / Bed:</span>
              <strong className="text-[#16845B]">{successResult.room.roomNumber}</strong>
            </div>
            <div>
              <span className="text-[#64746C] block">Attending Doctor:</span>
              <strong className="text-[#172B24]">{successResult.admission.attendingDoctor}</strong>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(`/receptionist/wards/${successResult.ward.id}`)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#16845B] hover:bg-[#105C43] text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            View {successResult.ward.name}
          </button>

          <button
            type="button"
            onClick={() => navigate('/receptionist/patients')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-[#F7FAF8] text-[#172B24] border border-[#E2EAE5] text-xs font-bold shadow-2xs cursor-pointer"
          >
            Open Patient Directory
          </button>

          <button
            type="button"
            onClick={() => {
              setSuccessResult(null);
              setFullName('');
              setPhone('');
              setDob('');
              setExistingPatientId('');
              setConditionsText('');
              setAllergiesText('');
              setMedicationsText('');
              setClinicalNotes('');
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-[#16845B] hover:underline cursor-pointer"
          >
            + Register Another Patient
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header & Breadcrumbs */}
      <div className="space-y-2">
        <nav className="flex items-center gap-2 text-xs font-semibold text-[#64746C]">
          <Link to="/receptionist/dashboard" className="hover:text-[#16845B]">
            Dashboard
          </Link>
          <ArrowRight className="w-3.5 h-3.5" />
          <span className="text-[#172B24] font-bold">New Patient Admission &amp; Room Assignment</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B24] tracking-tight">
              Patient Registration &amp; Room Assignment
            </h1>
            <p className="text-xs sm:text-sm text-[#64746C] mt-0.5">
              Create an admission record, reserve an available hospital bed, and document initial medical history.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E2EAE5] text-[#172B24] hover:bg-[#F7FAF8] text-xs font-semibold cursor-pointer shadow-2xs"
            >
              <Save className="w-3.5 h-3.5 text-[#64746C]" />
              <span>Save Draft</span>
            </button>
          </div>
        </div>
      </div>

      {/* Submit Error Warning */}
      {submitError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Assignment Conflict:</strong>
            {submitError}
          </div>
        </div>
      )}

      {/* Multi-Section Form */}
      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        {/* SECTION A: PATIENT INFORMATION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EAE5] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2EAE5] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#EAF7F0] text-[#16845B] flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div>
                <h2 className="text-base font-bold text-[#172B24]">Patient Information</h2>
                <p className="text-xs text-[#64746C]">Demographic and emergency contact details.</p>
              </div>
            </div>

            {/* Returning Patient Search Button */}
            <button
              type="button"
              onClick={() => {
                setSearchPatientModalOpen(true);
                handleSearchPatients();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F7FAF8] hover:bg-[#EAF7F0] text-[#16845B] border border-[#CDEBDC] text-xs font-bold cursor-pointer transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Returning Patient</span>
            </button>
          </div>

          {existingPatientId && (
            <div className="p-3 rounded-xl bg-[#EAF7F0] border border-[#CDEBDC] text-[#105C43] text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16845B]" />
                <span>
                  Linked to Existing Record: <strong>{existingPatientId}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setExistingPatientId('')}
                className="text-xs underline font-bold cursor-pointer"
              >
                Clear Link
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-[#172B24] uppercase tracking-wider mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Eleanor Vance"
                className={`w-full px-3.5 py-2.5 bg-white rounded-xl border text-xs text-[#172B24] placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#16845B] ${
                  errors.fullName ? 'border-rose-400 ring-1 ring-rose-300' : 'border-[#E2EAE5]'
                }`}
              />
              {errors.fullName && <p className="text-xs text-rose-600 mt-1">{errors.fullName}</p>}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-bold text-[#172B24] uppercase tracking-wider mb-1.5">
                Date of Birth <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className={`w-full px-3.5 py-2.5 bg-white rounded-xl border text-xs text-[#172B24] focus:outline-hidden focus:ring-2 focus:ring-[#16845B] ${
                  errors.dob ? 'border-rose-400 ring-1 ring-rose-300' : 'border-[#E2EAE5]'
                }`}
              />
              {errors.dob && <p className="text-xs text-rose-600 mt-1">{errors.dob}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-[#172B24] uppercase tracking-wider mb-1.5">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#E2EAE5] text-xs text-[#172B24] focus:outline-hidden focus:ring-2 focus:ring-[#16845B]"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
                <option value="Unspecified">Prefer not to say</option>
              </select>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-[#172B24] uppercase tracking-wider mb-1.5">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className={`w-full px-3.5 py-2.5 bg-white rounded-xl border text-xs text-[#172B24] placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#16845B] ${
                  errors.phone ? 'border-rose-400 ring-1 ring-rose-300' : 'border-[#E2EAE5]'
                }`}
              />
              {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
            </div>

            {/* Emergency Contact */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#172B24] uppercase tracking-wider mb-1.5">
                Emergency Contact (Name, Relationship, Phone)
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="e.g. Thomas Vance (Spouse) - +1 (555) 234-8909"
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#E2EAE5] text-xs text-[#172B24] placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#16845B]"
              />
            </div>
          </div>
        </div>

        {/* SECTION B: ADMISSION INFORMATION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EAE5] shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 border-b border-[#E2EAE5] pb-4">
            <div className="w-8 h-8 rounded-xl bg-[#EAF7F0] text-[#16845B] flex items-center justify-center font-bold text-xs">
              B
            </div>
            <div>
              <h2 className="text-base font-bold text-[#172B24]">Admission &amp; Room Assignment</h2>
              <p className="text-xs text-[#64746C]">Select target ward and assign an available bed.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Admission Date & Time */}
            <div>
              <label className="block text-xs font-bold text-[#172B24] uppercase tracking-wider mb-1.5">
                Admission Date &amp; Time
              </label>
              <input
                type="datetime-local"
                value={admittedAt}
                onChange={(e) => setAdmittedAt(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#E2EAE5] text-xs text-[#172B24] focus:outline-hidden focus:ring-2 focus:ring-[#16845B]"
              />
            </div>

            {/* Ward Dropdown */}
            <div>
              <label className="block text-xs font-bold text-[#172B24] uppercase tracking-wider mb-1.5">
                Ward <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedWardId}
                onChange={handleWardChange}
                className={`w-full px-3.5 py-2.5 bg-white rounded-xl border text-xs text-[#172B24] focus:outline-hidden focus:ring-2 focus:ring-[#16845B] ${
                  errors.ward ? 'border-rose-400' : 'border-[#E2EAE5]'
                }`}
              >
                <option value="" disabled>
                  Select a Ward
                </option>
                {wards.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.type}) — {w.availableRooms ?? 0} available
                  </option>
                ))}
              </select>
              {errors.ward && <p className="text-xs text-rose-600 mt-1">{errors.ward}</p>}
            </div>

            {/* Room Number Dropdown */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#172B24] uppercase tracking-wider">
                  Available Room Number <span className="text-rose-500">*</span>
                </label>
                {loadingRooms && (
                  <span className="text-[10px] text-[#16845B] font-semibold">Updating beds...</span>
                )}
              </div>

              {availableRooms.length === 0 ? (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>No rooms currently available in this ward.</span>
                </div>
              ) : (
                <select
                  value={selectedRoomId}
                  onChange={handleRoomChange}
                  className={`w-full px-3.5 py-2.5 bg-white rounded-xl border text-xs text-[#172B24] focus:outline-hidden focus:ring-2 focus:ring-[#16845B] ${
                    errors.room ? 'border-rose-400' : 'border-[#E2EAE5]'
                  }`}
                >
                  <option value="" disabled>
                    Select an Available Room
                  </option>
                  {availableRooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.roomNumber} (Available)
                    </option>
                  ))}
                </select>
              )}
              {errors.room && <p className="text-xs text-rose-600 mt-1">{errors.room}</p>}
            </div>

            {/* Attending Doctor */}
            <div>
              <label className="block text-xs font-bold text-[#172B24] uppercase tracking-wider mb-1.5">
                Attending Doctor
              </label>
              <select
                value={attendingDoctor}
                onChange={(e) => setAttendingDoctor(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#E2EAE5] text-xs text-[#172B24] focus:outline-hidden focus:ring-2 focus:ring-[#16845B]"
              >
                <option value="Dr. Sarah Mehta, MD (Orthopedics / Surgery)">Dr. Sarah Mehta, MD (Orthopedics / Surgery)</option>
                <option value="Dr. Robert Thorne, MD (Pulmonology)">Dr. Robert Thorne, MD (Pulmonology)</option>
                <option value="Dr. Gregory House, MD (Cardiology)">Dr. Gregory House, MD (Cardiology)</option>
                <option value="Dr. Alistair Gordon, MD (Intensivist / ICU)">Dr. Alistair Gordon, MD (Intensivist / ICU)</option>
                <option value="Dr. Vikram Sen, MD (Emergency Medicine)">Dr. Vikram Sen, MD (Emergency Medicine)</option>
              </select>
            </div>

            {/* Assigned Nurse */}
            <div>
              <label className="block text-xs font-bold text-[#172B24] uppercase tracking-wider mb-1.5">
                Assigned Nurse / Caretaker
              </label>
              <input
                type="text"
                value={assignedNurse}
                onChange={(e) => setAssignedNurse(e.target.value)}
                placeholder="e.g. Nurse Vance, RN"
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#E2EAE5] text-xs text-[#172B24] focus:outline-hidden focus:ring-2 focus:ring-[#16845B]"
              />
            </div>

            {/* Admission Reason */}
            <div>
              <label className="block text-xs font-bold text-[#172B24] uppercase tracking-wider mb-1.5">
                Admission Reason / Primary Complaint
              </label>
              <input
                type="text"
                value={admissionReason}
                onChange={(e) => setAdmissionReason(e.target.value)}
                placeholder="e.g. Post-operative observation and vital monitoring"
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#E2EAE5] text-xs text-[#172B24] focus:outline-hidden focus:ring-2 focus:ring-[#16845B]"
              />
            </div>
          </div>
        </div>

        {/* SECTION C: MEDICAL HISTORY COLLECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EAE5] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2EAE5] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#EAF7F0] text-[#16845B] flex items-center justify-center font-bold text-xs">
                C
              </div>
              <div>
                <h2 className="text-base font-bold text-[#172B24]">Medical History Collection</h2>
                <p className="text-xs text-[#64746C]">Document prior conditions, documented allergies, and active medications.</p>
              </div>
            </div>

            {/* Action Buttons for History Collection */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setHistoryMode('manual')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  historyMode === 'manual'
                    ? 'bg-[#16845B] text-white shadow-2xs'
                    : 'bg-[#F7FAF8] text-[#172B24] border border-[#E2EAE5]'
                }`}
              >
                Manual Entry
              </button>

              <button
                type="button"
                onClick={() => {
                  setAbhaModalOpen(true);
                  handleSearchAbha();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF7F0] hover:bg-[#D4EFE0] text-[#105C43] border border-[#CDEBDC] text-xs font-bold cursor-pointer transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#16845B]" />
                <span>Collect from ABHA (Demo)</span>
              </button>
            </div>
          </div>

          {/* Notice when ABHA demo is imported */}
          {historyMode === 'abha' && (
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Simulated ABHA Record Loaded</strong>
                Medical data imported from ABHA demo repository. Please verify with patient during intake.
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Known Medical Conditions */}
            <div>
              <label className="block text-xs font-bold text-[#172B24] uppercase tracking-wider mb-1.5">
                Known Medical Conditions (Comma-separated)
              </label>
              <input
                type="text"
                value={conditionsText}
                onChange={(e) => setConditionsText(e.target.value)}
                placeholder="e.g. Hypertension, Type 2 Diabetes, Asthma"
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#E2EAE5] text-xs text-[#172B24] placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#16845B]"
              />
            </div>

            {/* Documented Allergies */}
            <div>
              <label className="block text-xs font-bold text-[#172B24] uppercase tracking-wider mb-1.5 text-rose-800">
                Documented Allergies &amp; Adverse Reactions
              </label>
              <input
                type="text"
                value={allergiesText}
                onChange={(e) => setAllergiesText(e.target.value)}
                placeholder="e.g. Penicillin (Moderate skin rash), Sulfa drugs, NKDA"
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-rose-200 text-xs text-[#172B24] placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Active Medications */}
            <div>
              <label className="block text-xs font-bold text-[#172B24] uppercase tracking-wider mb-1.5">
                Current Medications &amp; Dosages
              </label>
              <input
                type="text"
                value={medicationsText}
                onChange={(e) => setMedicationsText(e.target.value)}
                placeholder="e.g. Metformin 500mg BD, Amlodipine 5mg OD"
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#E2EAE5] text-xs text-[#172B24] placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#16845B]"
              />
            </div>

            {/* Clinical Intake Notes */}
            <div>
              <label className="block text-xs font-bold text-[#172B24] uppercase tracking-wider mb-1.5">
                Clinical Intake Notes / Observations
              </label>
              <textarea
                rows={2}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="Any special nursing observations, dietary requirements, mobility assistance notes..."
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#E2EAE5] text-xs text-[#172B24] placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#16845B]"
              />
            </div>
          </div>
        </div>

        {/* SECTION D: FORM ACTIONS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EAE5] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/receptionist/dashboard')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#E2EAE5] hover:bg-[#F7FAF8] text-[#64746C] text-xs font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-5 py-3 rounded-xl bg-white border border-[#E2EAE5] hover:bg-[#F7FAF8] text-[#172B24] text-xs font-bold cursor-pointer"
            >
              Save as Draft
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-7 py-3 rounded-xl bg-[#16845B] hover:bg-[#105C43] text-white text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Assigning Room...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Register &amp; Assign Room</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* RETURNING PATIENT SEARCH MODAL */}
      {searchPatientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-[#E2EAE5] shadow-2xl relative space-y-4">
            <button
              onClick={() => setSearchPatientModalOpen(false)}
              className="absolute right-5 top-5 p-1 rounded-full text-[#64746C] hover:bg-[#F7FAF8]"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-[#172B24]">Search Hospital Patient Database</h3>
              <p className="text-xs text-[#64746C]">Select a returning patient to auto-fill records and avoid duplicates.</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={patientSearchQuery}
                onChange={(e) => setPatientSearchQuery(e.target.value)}
                placeholder="Search patient name, phone, or ID (e.g. VW-PAT-1001)..."
                className="flex-1 px-3.5 py-2.5 bg-[#F7FAF8] rounded-xl border border-[#E2EAE5] text-xs text-[#172B24]"
              />
              <button
                type="button"
                onClick={handleSearchPatients}
                className="px-4 py-2.5 bg-[#16845B] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Search
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto divide-y divide-[#E2EAE5] border border-[#E2EAE5] rounded-2xl">
              {searchingPatients ? (
                <div className="p-6 text-center text-xs text-[#64746C]">Searching patient records...</div>
              ) : searchedPatients.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#64746C]">No existing patient records found.</div>
              ) : (
                searchedPatients.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelectExistingPatient(p)}
                    className="p-3.5 hover:bg-[#EAF7F0]/60 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <div className="font-bold text-[#172B24]">{p.fullName}</div>
                      <div className="text-[11px] text-[#64746C]">
                        {p.gender} • DOB: {p.dob} • Phone: {p.phone}
                      </div>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[#16845B] bg-white px-2 py-0.5 rounded border border-[#CDEBDC]">
                      {p.id}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SIMULATED ABHA DEMO RETRIEVAL MODAL */}
      {abhaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-[#E2EAE5] shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setAbhaModalOpen(false)}
              className="absolute right-5 top-5 p-1 rounded-full text-[#64746C] hover:bg-[#F7FAF8]"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAF7F0] text-[#16845B] text-[10px] font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                Simulated Hackathon Prototype
              </div>
              <h3 className="text-lg font-bold text-[#172B24]">
                Retrieve Patient History from ABHA (Demo)
              </h3>
              <p className="text-xs text-[#64746C]">
                Search simulated ABHA health records by ABHA ID or patient name.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={abhaSearchQuery}
                onChange={(e) => setAbhaSearchQuery(e.target.value)}
                placeholder="Enter ABHA ID (e.g. 91-8273...) or patient name..."
                className="flex-1 px-3.5 py-2.5 bg-[#F7FAF8] rounded-xl border border-[#E2EAE5] text-xs text-[#172B24]"
              />
              <button
                type="button"
                onClick={handleSearchAbha}
                className="px-4 py-2.5 bg-[#16845B] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Lookup
              </button>
            </div>

            {/* ABHA Records List */}
            <div className="space-y-3">
              {searchingAbha ? (
                <div className="p-6 text-center text-xs text-[#64746C]">Querying simulated ABHA network...</div>
              ) : (
                abhaRecords.map((rec) => (
                  <div
                    key={rec.abhaId}
                    className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5] hover:border-[#16845B] transition-all space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-[#172B24]">{rec.name}</h4>
                        <span className="font-mono text-[11px] text-[#16845B]">{rec.abhaId}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleImportAbha(rec)}
                        className="px-3.5 py-1.5 bg-[#16845B] hover:bg-[#105C43] text-white text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Import Records
                      </button>
                    </div>

                    <div className="text-[11px] text-[#64746C] space-y-1 pt-1 border-t border-[#E2EAE5]">
                      <div>
                        <strong>Conditions:</strong> {rec.conditions.join(', ')}
                      </div>
                      <div>
                        <strong className="text-rose-700">Allergies:</strong> {rec.allergies.join(', ')}
                      </div>
                      <div>
                        <strong>Medications:</strong> {rec.medications.join(', ')}
                      </div>
                      <div>
                        <strong>Verified Facility:</strong> {rec.verifiedHealthFacility}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
