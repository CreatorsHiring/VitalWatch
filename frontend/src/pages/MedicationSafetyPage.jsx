import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Select, Input } from '../components/ui/Input';
import { FICTIONAL_MEDICATION_RULES } from '../data/seedData';
import { Pill, ShieldAlert, CheckCircle, AlertTriangle, FileText, Search, Send } from 'lucide-react';

export function MedicationSafetyPage() {
  const { patients, evaluateMedicationSafety, currentRole } = useApp();

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || 'PAT-8801');
  const [selectedMedId, setSelectedMedId] = useState(FICTIONAL_MEDICATION_RULES.availableMeds[0].id);
  const [customIngredient, setCustomIngredient] = useState('');
  const [useCustomInput, setUseCustomInput] = useState(false);

  const [evaluationResult, setEvaluationResult] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewOutcome, setReviewOutcome] = useState(null);

  const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handleRunCheck = (e) => {
    e.preventDefault();
    let ingredientToCheck = '';
    if (useCustomInput) {
      ingredientToCheck = customIngredient.trim();
    } else {
      const medObj = FICTIONAL_MEDICATION_RULES.availableMeds.find((m) => m.id === selectedMedId);
      ingredientToCheck = medObj ? medObj.ingredient : '';
    }

    if (!ingredientToCheck) return;

    const res = evaluateMedicationSafety(patient, ingredientToCheck);
    setEvaluationResult(res);
    setReviewOutcome(null);
    setReviewNotes('');
  };

  const handleRecordReview = (outcome) => {
    setReviewOutcome({
      outcome,
      notes: reviewNotes,
      reviewer: currentRole.title,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-navy-950 text-white rounded-lg p-5 border border-navy-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-400">
            <Pill className="w-4 h-4 text-teal-400 shrink-0" />
            Pharmacology Safety Engine • {FICTIONAL_MEDICATION_RULES.version}
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mt-1">
            Fictional Rule-Based Medication Safety Review
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Evaluates proposed synthetic pharmacotherapy against recorded patient allergy history, active conditions, and concurrent medication statements.
          </p>
        </div>
        <div className="text-right text-xs font-mono text-slate-400">
          <span className="inline-block px-2 py-1 bg-amber-900/60 text-amber-200 border border-amber-700/50 rounded font-bold uppercase">
            Synthetic Demo Ruleset
          </span>
        </div>
      </div>

      {/* Main Grid: Evaluation Form + Results View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Target Form */}
        <div className="space-y-4">
          <Card title="Order Verification Form" subtitle="Select patient context & proposed ingredient.">
            <form onSubmit={handleRunCheck} className="space-y-4">
              {/* Patient Selection */}
              <Select
                label="Target Synthetic Patient"
                value={selectedPatientId}
                onChange={(e) => {
                  setSelectedPatientId(e.target.value);
                  setEvaluationResult(null);
                }}
                options={patients.map((p) => ({
                  value: p.id,
                  label: `${p.name} (${p.id} • ${p.ward})`,
                }))}
              />

              {/* Patient Intake Status Badge */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
                <div className="flex justify-between font-semibold text-slate-800">
                  <span>Allergy Verification Status:</span>
                  <Badge severity={patient.history?.allergiesHistoryStatus === 'UNKNOWN' ? 'WARNING' : 'STABLE'} size="sm">
                    {patient.history?.allergiesHistoryStatus || 'VERIFIED'}
                  </Badge>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Documented Allergies: <strong>{patient.history?.allergies?.length || 0}</strong> | Active Meds: <strong>{patient.history?.medications?.length || 0}</strong>
                </div>
              </div>

              {/* Medication Selection Mode Toggle */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  Proposed Medication / Ingredient
                </label>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-700 pb-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="medMode"
                      checked={!useCustomInput}
                      onChange={() => setUseCustomInput(false)}
                      className="text-teal-600 focus:ring-teal-600"
                    />
                    <span>Demo Catalog</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="medMode"
                      checked={useCustomInput}
                      onChange={() => setUseCustomInput(true)}
                      className="text-teal-600 focus:ring-teal-600"
                    />
                    <span>Custom Ingredient Code</span>
                  </label>
                </div>

                {!useCustomInput ? (
                  <Select
                    value={selectedMedId}
                    onChange={(e) => setSelectedMedId(e.target.value)}
                    options={FICTIONAL_MEDICATION_RULES.availableMeds.map((m) => ({
                      value: m.id,
                      label: m.name,
                    }))}
                  />
                ) : (
                  <Input
                    placeholder="e.g. synthetic-nitrate-z"
                    value={customIngredient}
                    onChange={(e) => setCustomIngredient(e.target.value)}
                  />
                )}
              </div>

              <Button type="submit" variant="primary" fullWidth icon={Search}>
                Run Safety Evaluation
              </Button>
            </form>
          </Card>
        </div>

        {/* Right 2 Cols: Evaluation Results & Workflow Panel */}
        <div className="lg:col-span-2 space-y-4">
          {!evaluationResult ? (
            <Card bodyClassName="p-12 text-center text-slate-400 space-y-2">
              <Pill className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">Ready for Safety Evaluation</p>
              <p className="text-xs max-w-md mx-auto">
                Select a synthetic patient and proposed medication, then click <strong>Run Safety Evaluation</strong> to test drug-allergy, drug-disease, and drug-drug rules.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Mandatory Disclaimer & Version Card */}
              <Card
                title={`Safety Evaluation Report: ${evaluationResult.proposedIngredient}`}
                subtitle={`Target Patient: ${evaluationResult.patientName} (${evaluationResult.patientId})`}
                actions={
                  <Badge severity={evaluationResult.hasMatches ? 'CRITICAL' : 'STABLE'}>
                    {evaluationResult.hasMatches ? 'Rule Match Found' : 'No Rule Match'}
                  </Badge>
                }
              >
                <div className="space-y-4">
                  {/* Rule Set Disclaimer */}
                  <div className="p-3 bg-slate-900 text-slate-300 rounded border border-slate-800 text-xs font-mono flex items-center justify-between">
                    <span>Rule Engine: {evaluationResult.ruleSetVersion}</span>
                    <span className="text-amber-400 font-bold">{evaluationResult.disclaimer}</span>
                  </div>

                  {/* Warning Messages */}
                  {evaluationResult.warnings.map((w, idx) => (
                    <div key={idx} className="p-3 bg-amber-50 border border-amber-300 rounded text-xs text-amber-900 font-medium flex items-start gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </div>
                  ))}

                  {/* MANDATORY EXACT NO-MATCH MESSAGE */}
                  {evaluationResult.noMatchMessage && (
                    <div className="p-4 bg-emerald-50 border-2 border-emerald-500 rounded-lg text-emerald-950 font-bold text-sm text-center shadow-xs">
                      <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                      "{evaluationResult.noMatchMessage}"
                    </div>
                  )}

                  {/* 1. Drug-Allergy Match Results */}
                  {evaluationResult.matches.drugAllergy.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-red-700 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        Drug–Allergy Conflict Detected
                      </h4>
                      {evaluationResult.matches.drugAllergy.map((m, idx) => (
                        <div key={idx} className="p-3 bg-red-50 border border-red-200 rounded text-xs space-y-1">
                          <div className="flex justify-between font-bold text-red-900">
                            <span>{m.title}</span>
                            <Badge severity="CRITICAL" size="sm">{m.ruleId}</Badge>
                          </div>
                          <p className="text-slate-700">{m.description}</p>
                          <div className="text-[10px] text-slate-500 font-mono">Matched Record: {m.matchedRecord} | Source: {m.evidence}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 2. Drug-Disease Match Results */}
                  {evaluationResult.matches.drugDisease.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        Drug–Disease Contraindication Detected
                      </h4>
                      {evaluationResult.matches.drugDisease.map((m, idx) => (
                        <div key={idx} className="p-3 bg-amber-50 border border-amber-200 rounded text-xs space-y-1">
                          <div className="flex justify-between font-bold text-amber-900">
                            <span>{m.title}</span>
                            <Badge severity="HIGH" size="sm">{m.ruleId}</Badge>
                          </div>
                          <p className="text-slate-700">{m.description}</p>
                          <div className="text-[10px] text-slate-500 font-mono">Matched Condition: {m.matchedRecord} | Source: {m.evidence}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 3. Drug-Drug Match Results (Unordered Pair) */}
                  {evaluationResult.matches.drugDrug.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-red-700 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        Drug–Drug Interaction Conflict (Unordered Pair Match)
                      </h4>
                      {evaluationResult.matches.drugDrug.map((m, idx) => (
                        <div key={idx} className="p-3 bg-red-50 border border-red-200 rounded text-xs space-y-1">
                          <div className="flex justify-between font-bold text-red-900">
                            <span>{m.title}</span>
                            <Badge severity="CRITICAL" size="sm">{m.ruleId}</Badge>
                          </div>
                          <p className="text-slate-700">{m.description}</p>
                          <div className="text-[10px] text-slate-500 font-mono">Co-Administered Medication: {m.matchedRecord} | Pair: {m.pairMatched}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>

              {/* Human Review & Decision Workflow Panel */}
              <Card title="Pharmacist / Clinician Review Disposition" subtitle="Human-in-the-loop review requirement.">
                <div className="space-y-3">
                  {reviewOutcome ? (
                    <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg space-y-2">
                      <div className="flex justify-between text-xs font-bold text-teal-900">
                        <span>Review Outcome Recorded: {reviewOutcome.outcome}</span>
                        <span className="font-mono font-normal">{new Date(reviewOutcome.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-xs text-slate-700">Notes: {reviewOutcome.notes || 'No review notes provided.'}</p>
                      <div className="text-[10px] text-slate-500 font-mono">Reviewer Role: {reviewOutcome.reviewer}</div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        rows={2}
                        placeholder="Enter clinical rationale or review notes..."
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        className="clinical-input text-xs"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRecordReview('HOLD_ORDER')}
                        >
                          Hold Order (Do Not Administer)
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRecordReview('OVERRIDE_WITH_RATIONALE')}
                        >
                          Override with Clinical Rationale
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleRecordReview('VERIFIED_SAFE')}
                        >
                          Verify Order
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
