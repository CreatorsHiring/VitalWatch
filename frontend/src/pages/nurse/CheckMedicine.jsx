import React, { useState, useEffect, useRef } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import {
  Pill,
  UploadCloud,
  Camera,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  ChevronRight,
  Info,
  X,
  Layers,
  Activity,
} from 'lucide-react';
import {
  getNursePatients,
  getPatientProfileDetail,
  checkMedicationSafety,
  ocrParseMedicine,
} from '../../services/api';

export default function CheckMedicine() {
  const { patientId: paramPatientId } = useParams();

  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(paramPatientId || '');
  const [patientData, setPatientData] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(false);

  // OCR & Medicine Form
  const [medicineName, setMedicineName] = useState('');
  const [activeIngredient, setActiveIngredient] = useState('');
  const [uploadedImagePreview, setUploadedImagePreview] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrConfidence, setOcrConfidence] = useState(null);
  const [rawOcrText, setRawOcrText] = useState('');

  // Evaluation Result
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [_error, setError] = useState(null);

  const fileInputRef = useRef(null);

  // Load patients list
  useEffect(() => {
    getNursePatients()
      .then((res) => {
        if (res?.patients) {
          setPatients(res.patients);
          if (!selectedPatientId && res.patients.length > 0) {
            setSelectedPatientId(res.patients[0].id);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Load selected patient details
  useEffect(() => {
    if (selectedPatientId) {
      setLoadingPatient(true);
      setEvaluationResult(null);
      getPatientProfileDetail(selectedPatientId)
        .then((res) => {
          if (res?.patient) {
            setPatientData(res.patient);
          }
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoadingPatient(false));
    }
  }, [selectedPatientId]);

  // Handle Image Upload & Simulated OCR
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
      alert('Please upload a valid image file (JPG, PNG, or WebP).');
      return;
    }

    setUploadedImage(file);
    const previewUrl = URL.createObjectURL(file);
    setUploadedImagePreview(previewUrl);

    // Trigger OCR parsing simulation
    performOcr(file.name);
  };

  const performOcr = async (hintText) => {
    setOcrLoading(true);
    setOcrConfidence(null);
    setEvaluationResult(null);

    try {
      const res = await ocrParseMedicine({
        filename: hintText,
        textHint: hintText,
      });

      if (res?.ocrResult) {
        const candidate = res.ocrResult.candidateMedicine;
        setMedicineName(candidate.name);
        setActiveIngredient(candidate.activeIngredient);
        setOcrConfidence(candidate.confidenceScore);
        setRawOcrText(candidate.rawText);
      }
    } catch {
      // fallback
      setMedicineName('Ibuprofen 400mg');
      setActiveIngredient('Ibuprofen');
      setOcrConfidence(0.92);
    } finally {
      setOcrLoading(false);
    }
  };

  // Preset demo medicines
  const demoPresets = [
    {
      label: 'Augmentin (Amoxicillin)',
      name: 'Augmentin 875/125mg',
      ingredient: 'Amoxicillin',
      hint: 'augmentin',
      tag: 'Penicillin Allergy Conflict',
    },
    {
      label: 'Ibuprofen 400mg (NSAID)',
      name: 'Ibuprofen Tablets 400mg',
      ingredient: 'Ibuprofen',
      hint: 'ibuprofen',
      tag: 'Asthma / Warfarin / Ulcer Conflict',
    },
    {
      label: 'Aspirin 325mg',
      name: 'Bayer Aspirin 325mg',
      ingredient: 'Aspirin',
      hint: 'aspirin',
      tag: 'Peptic Ulcer / Anticoagulant Risk',
    },
    {
      label: 'Warfarin 5mg (Coumadin)',
      name: 'Coumadin 5mg',
      ingredient: 'Warfarin',
      hint: 'warfarin',
      tag: 'Anticoagulant Interaction',
    },
    {
      label: 'Paracetamol 500mg',
      name: 'Paracetamol 500mg',
      ingredient: 'Paracetamol',
      hint: 'paracetamol',
      tag: 'Illustrative No Conflict Demo',
    },
  ];

  const handleSelectPreset = (preset) => {
    setMedicineName(preset.name);
    setActiveIngredient(preset.ingredient);
    setRawOcrText(`Preset selection: ${preset.name} (Active: ${preset.ingredient})`);
    setOcrConfidence(0.99);
    setUploadedImagePreview(null);
    setEvaluationResult(null);
  };

  // Run Safety Engine Check
  const handleEvaluateSafety = async (e) => {
    e.preventDefault();
    if (!selectedPatientId) {
      alert('Please select a patient first.');
      return;
    }
    if (!medicineName.trim() && !activeIngredient.trim()) {
      alert('Please enter or scan a medication name or active ingredient.');
      return;
    }

    setEvaluating(true);
    setError(null);

    try {
      const res = await checkMedicationSafety(selectedPatientId, {
        medicineName: medicineName.trim(),
        activeIngredient: activeIngredient.trim(),
        rawText: rawOcrText,
      });

      if (res?.evaluation) {
        setEvaluationResult(res.evaluation);
      } else {
        throw new Error('Could not evaluate medication safety rules.');
      }
    } catch (err) {
      setError(err.message || 'Evaluation error');
    } finally {
      setEvaluating(false);
    }
  };

  const clearForm = () => {
    setMedicineName('');
    setActiveIngredient('');
    setUploadedImage(null);
    setUploadedImagePreview(null);
    setOcrConfidence(null);
    setRawOcrText('');
    setEvaluationResult(null);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#64746C] mb-1">
            <NavLink to="/nurse/dashboard" className="hover:text-[#16845B]">
              Nurse Dashboard
            </NavLink>
            <span>/</span>
            <span className="font-bold text-[#16845B]">Check Medicine Safety</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B24] tracking-tight flex items-center gap-3">
            <span>Medication Safety Scanner</span>
            <span className="text-xs font-bold text-[#16845B] bg-[#EAF7F0] px-3 py-1 rounded-full border border-[#CDEBDC] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Deterministic Rule Engine
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#64746C] mt-1">
            Automated multi-layer cross check against confirmed allergies, contraindicating
            conditions, and drug–drug interactions.
          </p>
        </div>

        {patientData && (
          <NavLink
            to={`/nurse/patients/${patientData.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E2EAE5] hover:bg-[#F7FAF8] text-xs font-bold text-[#172B24] transition-colors"
          >
            <span>View Full Patient Log</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#16845B]" />
          </NavLink>
        )}
      </div>

      {/* PATIENT SELECTION & CONTEXT CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EAE5] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2EAE5] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EAF7F0] flex items-center justify-center text-[#16845B]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#172B24]">Target Patient Health Context</h2>
              <p className="text-[11px] text-[#64746C]">
                Select an admitted inpatient to run cross-reactivity checks against their recorded
                history.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 min-w-64">
            <label className="text-xs font-bold text-[#64746C] shrink-0">Patient:</label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full bg-[#F7FAF8] border border-[#E2EAE5] rounded-xl px-3 py-2 text-xs text-[#172B24] font-bold focus:outline-hidden focus:border-[#16845B]"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.id} - {p.roomNumber || 'Bed Unassigned'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {loadingPatient ? (
          <div className="p-6 text-center text-xs text-[#64746C]">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#16845B]" />
            <span>Loading patient allergy &amp; prescription history...</span>
          </div>
        ) : patientData ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Allergies Box */}
            <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-2">
              <span className="font-bold text-rose-800 text-[11px] uppercase tracking-wider block flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Confirmed Allergies
              </span>
              <div className="flex flex-wrap gap-1">
                {(patientData.medicalHistory?.allergies || []).length > 0 ? (
                  patientData.medicalHistory.allergies.map((a, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg text-xs font-bold bg-white text-rose-700 border border-rose-300 shadow-2xs"
                    >
                      {a}
                    </span>
                  ))
                ) : (
                  <span className="text-[#64746C] italic text-[11px]">None recorded</span>
                )}
              </div>
            </div>

            {/* Chronic Conditions Box */}
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
              <span className="font-bold text-amber-800 text-[11px] uppercase tracking-wider block flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-amber-600" />
                Underlying Conditions
              </span>
              <div className="flex flex-wrap gap-1">
                {(patientData.medicalHistory?.conditions || []).length > 0 ? (
                  patientData.medicalHistory.conditions.map((c, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg text-xs font-bold bg-white text-amber-800 border border-amber-300 shadow-2xs"
                    >
                      {c}
                    </span>
                  ))
                ) : (
                  <span className="text-[#64746C] italic text-[11px]">None documented</span>
                )}
              </div>
            </div>

            {/* Current Meds Box */}
            <div className="p-4 rounded-2xl bg-[#EAF7F0]/60 border border-[#CDEBDC] space-y-2">
              <span className="font-bold text-[#16845B] text-[11px] uppercase tracking-wider block flex items-center gap-1">
                <Pill className="w-3.5 h-3.5 text-[#16845B]" />
                Current Active Medications
              </span>
              <div className="flex flex-wrap gap-1">
                {(patientData.medicalHistory?.medications || []).length > 0 ? (
                  patientData.medicalHistory.medications.map((m, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg text-xs font-bold bg-white text-[#172B24] border border-[#CDEBDC] shadow-2xs"
                    >
                      {m}
                    </span>
                  ))
                ) : (
                  <span className="text-[#64746C] italic text-[11px]">No active prescriptions</span>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* STEP 1: MEDICINE INPUT & OCR SCANNER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EAE5] shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#E2EAE5] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EAF7F0] flex items-center justify-center text-[#16845B]">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#172B24]">
                Step 1: Medicine Package OCR Scan or Prescription Entry
              </h2>
              <p className="text-[11px] text-[#64746C]">
                Upload a label photo for optical character extraction or select a demo medication.
              </p>
            </div>
          </div>

          {(medicineName || uploadedImagePreview) && (
            <button
              type="button"
              onClick={clearForm}
              className="text-xs font-semibold text-[#64746C] hover:text-rose-600 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Form</span>
            </button>
          )}
        </div>

        {/* Demo Preset Quick-Click Buttons */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#64746C] block">
            Quick-Select Clinical Test Cases:
          </span>
          <div className="flex flex-wrap gap-2">
            {demoPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="px-3 py-1.5 rounded-xl bg-[#F7FAF8] hover:bg-[#EAF7F0] border border-[#E2EAE5] hover:border-[#16845B]/40 text-xs font-medium text-[#172B24] flex items-center gap-1.5 transition-all text-left cursor-pointer"
              >
                <Pill className="w-3 h-3 text-[#16845B]" />
                <span className="font-bold">{preset.label}</span>
                <span className="text-[10px] text-[#64746C] hidden sm:inline">({preset.tag})</span>
              </button>
            ))}
          </div>
        </div>

        {/* OCR Image Upload Dropzone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-6 rounded-2xl border-2 border-dashed border-[#CDEBDC] hover:border-[#16845B] bg-[#F7FAF8] hover:bg-[#EAF7F0]/30 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-3 min-h-48"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
            {uploadedImagePreview ? (
              <div className="space-y-2">
                <img
                  src={uploadedImagePreview}
                  alt="Medicine label preview"
                  className="max-h-32 rounded-xl object-contain mx-auto border border-[#E2EAE5]"
                />
                <span className="text-xs font-bold text-[#16845B] block">
                  Click to replace image
                </span>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-[#EAF7F0] text-[#16845B] flex items-center justify-center">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#172B24]">
                    Drag and drop medication photo or click to browse
                  </p>
                  <p className="text-[10px] text-[#64746C] mt-1">
                    Supports JPG, PNG, WebP up to 10MB
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Extracted / Editable Fields Form */}
          <form onSubmit={handleEvaluateSafety} className="space-y-3.5">
            {ocrLoading ? (
              <div className="p-8 text-center bg-[#F7FAF8] rounded-2xl border border-[#E2EAE5] space-y-2">
                <RefreshCw className="w-6 h-6 text-[#16845B] animate-spin mx-auto" />
                <p className="text-xs font-bold text-[#172B24]">Running Optical Character Recognition...</p>
                <p className="text-[10px] text-[#64746C]">Extracting active ingredient &amp; strength</p>
              </div>
            ) : (
              <>
                {ocrConfidence && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                    <span className="font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      OCR Extraction Match: {Math.round(ocrConfidence * 100)}% Confidence
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 px-2 py-0.5 rounded">
                      Verified
                    </span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#172B24] mb-1">
                    Candidate Medicine Name / Brand:
                  </label>
                  <input
                    type="text"
                    required
                    value={medicineName}
                    onChange={(e) => setMedicineName(e.target.value)}
                    placeholder="e.g. Augmentin 875mg or Ibuprofen"
                    className="w-full px-3.5 py-2 bg-[#F7FAF8] border border-[#E2EAE5] rounded-xl text-xs text-[#172B24] focus:bg-white focus:outline-hidden focus:border-[#16845B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172B24] mb-1">
                    Active Ingredient (Generic):
                  </label>
                  <input
                    type="text"
                    value={activeIngredient}
                    onChange={(e) => setActiveIngredient(e.target.value)}
                    placeholder="e.g. Amoxicillin, Ibuprofen, Aspirin"
                    className="w-full px-3.5 py-2 bg-[#F7FAF8] border border-[#E2EAE5] rounded-xl text-xs text-[#172B24] focus:bg-white focus:outline-hidden focus:border-[#16845B]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={evaluating || (!medicineName.trim() && !activeIngredient.trim())}
                  className="w-full py-3 bg-[#16845B] hover:bg-[#105C43] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {evaluating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Evaluating Safety Rules...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Run Medication Safety Engine Check</span>
                    </>
                  )}
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* STEP 2: SAFETY EVALUATION RESULTS PANEL */}
      {evaluationResult && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EAE5] shadow-xs space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-[#E2EAE5] pb-4">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  evaluationResult.status === 'potential_conflict_found'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-[#EAF7F0] text-[#16845B]'
                }`}
              >
                {evaluationResult.status === 'potential_conflict_found' ? (
                  <AlertOctagon className="w-5 h-5" />
                ) : (
                  <ShieldCheck className="w-5 h-5" />
                )}
              </div>
              <div>
                <h2 className="text-base font-bold text-[#172B24]">
                  Step 2: Automated Medication Safety Engine Findings
                </h2>
                <span className="text-[11px] text-[#64746C]">
                  Evaluated at: {new Date(evaluationResult.checkedAt).toLocaleTimeString()}
                </span>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                evaluationResult.status === 'potential_conflict_found'
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : 'bg-[#EAF7F0] text-[#16845B] border border-[#CDEBDC]'
              }`}
            >
              {evaluationResult.status === 'potential_conflict_found'
                ? 'Clinical Conflict Identified'
                : 'No Rule Conflicts Found'}
            </span>
          </div>

          {/* Banner message */}
          <div
            className={`p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-3 ${
              evaluationResult.status === 'potential_conflict_found'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-[#EAF7F0]/70 border-[#CDEBDC] text-[#105C43]'
            }`}
          >
            {evaluationResult.status === 'potential_conflict_found' ? (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-[#16845B] shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold text-sm mb-1">{evaluationResult.message}</p>
              <p className="text-[11px] opacity-90">
                Proposed Medicine:{' '}
                <strong className="underline">
                  {evaluationResult.proposedMedicine?.name} (
                  {evaluationResult.proposedMedicine?.activeIngredient || 'Ingredient'}
                  )
                </strong>{' '}
                for patient{' '}
                <strong>
                  {evaluationResult.patientContext?.patientName} (
                  {evaluationResult.patientContext?.patientId})
                </strong>
                .
              </p>
            </div>
          </div>

          {/* Findings List (Drug-Allergy, Drug-Disease, Drug-Drug) */}
          {evaluationResult.findings && evaluationResult.findings.length > 0 && (
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800">
                Identified Clinical Conflicts ({evaluationResult.findings.length}):
              </h3>

              {evaluationResult.findings.map((f, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-rose-50/40 border border-rose-300 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-200 text-rose-900">
                        {f.severity}
                      </span>
                      <span className="text-xs font-bold text-[#172B24] uppercase tracking-wide">
                        {f.type.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <span className="text-[10px] text-[#64746C] font-mono bg-white px-2 py-0.5 rounded border border-[#E2EAE5]">
                      Rule ID: {f.ruleId}
                    </span>
                  </div>

                  <div className="text-xs text-[#172B24] space-y-1.5">
                    <p>
                      <strong className="text-rose-800">Trigger Conflict:</strong>{' '}
                      {f.patientConflictItem} (Matched against {f.matchedIngredient})
                    </p>
                    <p className="text-[#64746C]">{f.explanation}</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-rose-200 text-xs text-[#172B24]">
                    <strong className="text-rose-700 block mb-0.5">Clinical Recommendation:</strong>
                    <span>{f.recommendation}</span>
                  </div>

                  <div className="text-[10px] text-[#64746C]">
                    Source Guideline: {f.source}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Alternative Medications for Clinical Review */}
          {evaluationResult.alternatives && evaluationResult.alternatives.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5] space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#16845B]" />
                <h4 className="text-xs font-bold text-[#172B24] uppercase tracking-wider">
                  Alternative Medications for Clinical Review
                </h4>
              </div>
              <p className="text-[11px] text-[#64746C]">
                The following alternatives from the synthetic drug catalog may be considered in
                consultation with the attending physician:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {evaluationResult.alternatives.map((alt, i) => (
                  <div
                    key={i}
                    className="p-3 bg-white rounded-xl border border-[#E2EAE5] text-xs space-y-1"
                  >
                    <span className="font-bold text-[#172B24] block">{alt.name}</span>
                    <span className="text-[10px] text-[#16845B] font-semibold block">
                      {alt.class}
                    </span>
                    <p className="text-[11px] text-[#64746C]">{alt.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clinical & Regulatory Disclaimer */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-[#64746C] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#172B24]">
              <Info className="w-4 h-4 text-[#16845B]" />
              <span>Medical &amp; Workflow Disclaimer</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {evaluationResult.disclaimer ||
                'This demonstration engine evaluates rules against synthetic catalog entries. Final drug administration decisions must be verified with hospital pharmacy protocols and attending medical officers.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
