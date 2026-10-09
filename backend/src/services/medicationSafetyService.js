import { demoMedicationRules } from '../data/demoMedicationRules.js';

export function evaluateMedicationSafety({ patient, proposedMedicine }) {
  if (!patient) {
    return {
      status: 'insufficient_data',
      message: 'Patient record not found or inaccessible.',
      findings: [],
      alternatives: [],
    };
  }

  const medName = (proposedMedicine.name || proposedMedicine.rawText || '').trim().toLowerCase();
  const medIngredient = (proposedMedicine.activeIngredient || '').trim().toLowerCase();

  // 1. Resolve to normalized ingredient
  let resolvedIngredient = demoMedicationRules.ingredients.find((ing) => {
    if (medIngredient && ing.name.toLowerCase().includes(medIngredient)) return true;
    if (medName) {
      if (ing.name.toLowerCase().includes(medName)) return true;
      if (ing.commonBrands.some((b) => medName.includes(b.toLowerCase()))) return true;
    }
    return false;
  });

  if (!resolvedIngredient) {
    // If not found in catalog, try fuzzy match
    resolvedIngredient = demoMedicationRules.ingredients.find((ing) =>
      ing.allergyClasses.some((ac) => medName.includes(ac.toLowerCase()) || medIngredient.includes(ac.toLowerCase()))
    );
  }

  const findings = [];
  const patientAllergies = (patient.medicalHistory?.allergies || []).map((a) => a.toLowerCase());
  const patientConditions = (patient.medicalHistory?.conditions || []).map((c) => c.toLowerCase());
  const patientMedications = (patient.medicalHistory?.medications || []).map((m) => m.toLowerCase());

  // Check if medical history is empty/unverified
  const hasHistory =
    patientAllergies.length > 0 || patientConditions.length > 0 || patientMedications.length > 0;

  if (!resolvedIngredient) {
    return {
      status: 'insufficient_data',
      proposedMedicine: {
        rawName: proposedMedicine.name || proposedMedicine.rawText,
        resolvedIngredient: null,
      },
      message: 'Unable to resolve proposed medicine to demonstration rule catalog. Manual pharmacist review required.',
      findings: [
        {
          type: 'unresolved_medicine',
          severity: 'Manual Verification Required',
          explanation: `The proposed medicine "${proposedMedicine.name || proposedMedicine.rawText}" could not be mapped to known ingredient IDs in the synthetic knowledge base.`,
          recommendation: 'Verify active ingredient on physical package label and conduct standard clinical checks.',
        },
      ],
      alternatives: [],
      disclaimer: demoMedicationRules.disclaimer,
    };
  }

  // 2. Evaluate Drug–Allergy Rules
  demoMedicationRules.allergyRules
    .filter((r) => r.ingredientId === resolvedIngredient.id)
    .forEach((rule) => {
      // Check if any patient allergy matches rule
      const matchedAllergy = patientAllergies.find((pa) =>
        rule.matchingAllergies.some((ma) => pa.includes(ma))
      );

      if (matchedAllergy) {
        findings.push({
          type: 'drug_allergy',
          severity: rule.severity,
          ruleId: rule.ruleId,
          matchedIngredient: resolvedIngredient.name,
          patientConflictItem: matchedAllergy,
          explanation: rule.explanation,
          source: rule.source,
          recommendation: rule.recommendation,
        });
      }
    });

  // Also check if any direct patient allergy mentions ingredient name
  if (
    patientAllergies.some((pa) => pa.includes(resolvedIngredient.name.toLowerCase())) &&
    !findings.some((f) => f.type === 'drug_allergy')
  ) {
    findings.push({
      type: 'drug_allergy',
      severity: 'Direct Allergen Match',
      ruleId: 'ALLERGY-DIRECT',
      matchedIngredient: resolvedIngredient.name,
      patientConflictItem: resolvedIngredient.name,
      explanation: `Patient medical history explicitly documents allergy to ${resolvedIngredient.name}.`,
      source: 'Patient Admission Health Record',
      recommendation: 'Do NOT administer. Consult prescribing physician for allergy-safe alternative.',
    });
  }

  // 3. Evaluate Drug–Disease Rules
  demoMedicationRules.diseaseRules
    .filter((r) => r.ingredientId === resolvedIngredient.id)
    .forEach((rule) => {
      const matchedCondition = patientConditions.find((pc) =>
        rule.matchingConditions.some((mc) => pc.includes(mc))
      );

      if (matchedCondition) {
        findings.push({
          type: 'drug_disease',
          severity: rule.severity,
          ruleId: rule.ruleId,
          matchedIngredient: resolvedIngredient.name,
          patientConflictItem: matchedCondition,
          explanation: rule.explanation,
          source: rule.source,
          recommendation: rule.recommendation,
        });
      }
    });

  // 4. Evaluate Drug–Drug Rules
  demoMedicationRules.drugDrugRules.forEach((rule) => {
    if (
      (rule.ingredientId1 === resolvedIngredient.id || rule.ingredientId2 === resolvedIngredient.id)
    ) {
      const otherIngId =
        rule.ingredientId1 === resolvedIngredient.id ? rule.ingredientId2 : rule.ingredientId1;
      const otherIng = demoMedicationRules.ingredients.find((i) => i.id === otherIngId);

      if (otherIng) {
        const matchedMed = patientMedications.find(
          (pm) =>
            pm.includes(otherIng.name.toLowerCase()) ||
            otherIng.commonBrands.some((b) => pm.includes(b.toLowerCase()))
        );

        if (matchedMed) {
          findings.push({
            type: 'drug_drug_interaction',
            severity: rule.severity,
            ruleId: rule.ruleId,
            matchedIngredient: `${resolvedIngredient.name} + ${otherIng.name}`,
            patientConflictItem: matchedMed,
            explanation: rule.explanation,
            source: rule.source,
            recommendation: rule.recommendation,
          });
        }
      }
    }
  });

  // Determine overall status
  let status = 'no_conflict_found';
  let message = 'No matching conflict found in the available demonstration rules.';

  if (findings.length > 0) {
    status = 'potential_conflict_found';
    message = `Found ${findings.length} potential medication safety finding(s) requiring clinical review.`;
  } else if (!hasHistory) {
    status = 'insufficient_data';
    message = 'Patient medical history is incomplete or unverified. Proceed with caution and verify directly.';
  }

  // Alternatives for clinical review
  const alternatives = demoMedicationRules.mockAlternatives[resolvedIngredient.id] || [];

  return {
    status,
    message,
    proposedMedicine: {
      name: proposedMedicine.name || resolvedIngredient.name,
      activeIngredient: resolvedIngredient.name,
      drugClass: resolvedIngredient.class,
    },
    patientContext: {
      patientId: patient.id,
      patientName: patient.fullName,
      ward: patient.currentWardName || 'Unassigned',
      room: patient.currentRoomNumber || 'N/A',
      allergies: patient.medicalHistory?.allergies || [],
      conditions: patient.medicalHistory?.conditions || [],
      currentMedications: patient.medicalHistory?.medications || [],
      historySource: patient.medicalHistory?.source || 'manual',
    },
    findings,
    alternatives,
    checkedAt: new Date().toISOString(),
    disclaimer: demoMedicationRules.disclaimer,
  };
}
