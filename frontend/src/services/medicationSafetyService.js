import { FICTIONAL_MEDICATION_RULES } from '../data/seedData';

/**
 * Fictional Rule-Based Medication Safety Engine
 * Evaluates proposed medications against patient synthetic allergy history,
 * active condition history, and concurrent medication statements.
 */

export function evaluateMedicationSafety(patient, proposedIngredient) {
  const result = {
    evaluatedAt: new Date().toISOString(),
    ruleSetVersion: FICTIONAL_MEDICATION_RULES.version,
    disclaimer: FICTIONAL_MEDICATION_RULES.disclaimer,
    proposedIngredient,
    patientId: patient?.id,
    patientName: patient?.name,
    historyStatus: patient?.history?.allergiesHistoryStatus || 'UNKNOWN',
    matches: {
      drugAllergy: [],
      drugDisease: [],
      drugDrug: [],
    },
    hasMatches: false,
    noMatchMessage: null,
    warnings: [],
  };

  if (!patient || !proposedIngredient) {
    result.warnings.push('Invalid evaluation target or empty medication selection.');
    return result;
  }

  const normalizedInput = proposedIngredient.trim().toLowerCase();

  // 1. Check Drug-Allergy Rules
  const userAllergies = patient.history?.allergies || [];
  FICTIONAL_MEDICATION_RULES.rules
    .filter((r) => r.category === 'DRUG_ALLERGY')
    .forEach((rule) => {
      if (rule.proposedIngredient.toLowerCase() === normalizedInput) {
        // Match against patient's allergy records
        const matchedAllergyRecord = userAllergies.find(
          (a) => a.ingredient.toLowerCase() === rule.matchedAllergy.toLowerCase()
        );
        if (matchedAllergyRecord) {
          result.matches.drugAllergy.push({
            ruleId: rule.id,
            severity: rule.severity,
            title: rule.title,
            description: rule.description,
            evidence: rule.evidence,
            matchedRecord: matchedAllergyRecord.name,
          });
          result.hasMatches = true;
        }
      }
    });

  // 2. Check Drug-Disease Rules
  const userConditions = patient.history?.conditions || [];
  FICTIONAL_MEDICATION_RULES.rules
    .filter((r) => r.category === 'DRUG_DISEASE')
    .forEach((rule) => {
      if (rule.proposedIngredient.toLowerCase() === normalizedInput) {
        // Match against patient's condition codes
        const matchedCond = userConditions.find(
          (c) => c.code.toLowerCase() === rule.matchedCondition.toLowerCase()
        );
        if (matchedCond) {
          result.matches.drugDisease.push({
            ruleId: rule.id,
            severity: rule.severity,
            title: rule.title,
            description: rule.description,
            evidence: rule.evidence,
            matchedRecord: matchedCond.name,
          });
          result.hasMatches = true;
        }
      }
    });

  // 3. Check Drug-Drug Rules (Unordered Pair Matching!)
  const currentMeds = patient.history?.medications || [];
  FICTIONAL_MEDICATION_RULES.rules
    .filter((r) => r.category === 'DRUG_DRUG')
    .forEach((rule) => {
      const [ingA, ingB] = rule.pair.map((s) => s.toLowerCase());
      
      // Check if input matches either ingA or ingB
      if (normalizedInput === ingA || normalizedInput === ingB) {
        const otherIngredient = normalizedInput === ingA ? ingB : ingA;
        
        // Search patient's current medications for the other ingredient
        const matchedCurrentMed = currentMeds.find(
          (m) => m.code.toLowerCase() === otherIngredient
        );

        if (matchedCurrentMed) {
          result.matches.drugDrug.push({
            ruleId: rule.id,
            severity: rule.severity,
            title: rule.title,
            description: rule.description,
            evidence: rule.evidence,
            matchedRecord: matchedCurrentMed.name,
            pairMatched: `${normalizedInput} + ${otherIngredient}`,
          });
          result.hasMatches = true;
        }
      }
    });

  // Check for Unknown/Incomplete Allergy History Warning
  if (result.historyStatus === 'UNKNOWN' || result.historyStatus === 'INCOMPLETE') {
    result.warnings.push(
      `Patient allergy history is recorded as ${result.historyStatus}. Absence of matched rules does not prove safety.`
    );
  }

  // Enforce Mandatory Exact No-Match Message
  if (!result.hasMatches) {
    result.noMatchMessage = FICTIONAL_MEDICATION_RULES.exactNoMatchMessage;
  }

  return result;
}
