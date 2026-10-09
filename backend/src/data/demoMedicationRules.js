// VitalWatch Demonstration Medication Safety Knowledge Base (Synthetic Demo Rules)
// Version 1.0.0 — For clinical decision-support demonstration and hackathon review only.

export const demoMedicationRules = {
  version: '1.0.0-demo',
  disclaimer: 'Synthetic demonstration rule-base. Illustrative findings only. Final prescription decisions require professional review by a licensed physician or clinical pharmacist.',
  
  // Normalized ingredient catalog with common brand names
  ingredients: [
    {
      id: 'ING-AMOXICILLIN',
      name: 'Amoxicillin',
      class: 'Penicillin-class beta-lactam antibiotic',
      commonBrands: ['Amoxil', 'Trimox', 'Augmentin (combo)'],
      allergyClasses: ['Penicillin', 'Beta-lactam antibiotics', 'Penicillin-derived'],
    },
    {
      id: 'ING-PENICILLIN-V',
      name: 'Penicillin V',
      class: 'Natural Penicillin antibiotic',
      commonBrands: ['Pen-VK', 'Veetids'],
      allergyClasses: ['Penicillin', 'Beta-lactam antibiotics'],
    },
    {
      id: 'ING-IBUPROFEN',
      name: 'Ibuprofen',
      class: 'Non-Steroidal Anti-Inflammatory Drug (NSAID)',
      commonBrands: ['Advil', 'Motrin', 'Brufen', 'Nurofen'],
      allergyClasses: ['NSAIDs', 'Aspirin/NSAID triad', 'Ibuprofen'],
    },
    {
      id: 'ING-ASPIRIN',
      name: 'Aspirin (Acetylsalicylic Acid)',
      class: 'Salicylate / NSAID antiplatelet',
      commonBrands: ['Ecotrin', 'Bayer Aspirin', 'Disprin'],
      allergyClasses: ['Aspirin', 'NSAIDs', 'Salicylates'],
    },
    {
      id: 'ING-PROPRANOLOL',
      name: 'Propranolol',
      class: 'Non-selective Beta-Adrenergic Blocker',
      commonBrands: ['Inderal', 'InnoPran XL'],
      allergyClasses: ['Beta Blockers'],
    },
    {
      id: 'ING-METFORMIN',
      name: 'Metformin Hydrochloride',
      class: 'Biguanide antidiabetic agent',
      commonBrands: ['Glucophage', 'Fortamet', 'Riomet'],
      allergyClasses: ['Metformin'],
    },
    {
      id: 'ING-CIPROFLOXACIN',
      name: 'Ciprofloxacin',
      class: 'Fluoroquinolone broad-spectrum antibacterial',
      commonBrands: ['Cipro', 'Ciloxan'],
      allergyClasses: ['Fluoroquinolones', 'Ciprofloxacin'],
    },
    {
      id: 'ING-WARFARIN',
      name: 'Warfarin Sodium',
      class: 'Vitamin K Antagonist Anticoagulant',
      commonBrands: ['Coumadin', 'Jantoven'],
      allergyClasses: ['Warfarin'],
    },
    {
      id: 'ING-CODEINE',
      name: 'Codeine Phosphate',
      class: 'Opioid analgesic & antitussive',
      commonBrands: ['Tylenol with Codeine', 'Codral'],
      allergyClasses: ['Opioids', 'Codeine'],
    },
    {
      id: 'ING-VANCOMYCIN',
      name: 'Vancomycin',
      class: 'Glycopeptide antibiotic',
      commonBrands: ['Vancocin'],
      allergyClasses: ['Vancomycin'],
    },
    {
      id: 'ING-AZITHROMYCIN',
      name: 'Azithromycin',
      class: 'Macrolide antibacterial',
      commonBrands: ['Zithromax', 'Z-Pak'],
      allergyClasses: ['Macrolides'],
    },
    {
      id: 'ING-PARACETAMOL',
      name: 'Paracetamol / Acetaminophen',
      class: 'Analgesic and antipyretic',
      commonBrands: ['Tylenol', 'Panadol', 'Calpol'],
      allergyClasses: ['Paracetamol'],
    },
    {
      id: 'ING-CELECOXIB',
      name: 'Celecoxib',
      class: 'COX-2 Selective NSAID',
      commonBrands: ['Celebrex'],
      allergyClasses: ['Sulfa drugs', 'NSAIDs'],
    },
  ],

  // 1. Drug–Allergy Rules
  allergyRules: [
    {
      ruleId: 'ALLERGY-RULE-001',
      ingredientId: 'ING-AMOXICILLIN',
      matchingAllergies: ['penicillin', 'amoxicillin', 'beta-lactam', 'ampicillin'],
      severity: 'High Priority Conflict',
      explanation: 'Amoxicillin is an aminopenicillin. Cross-reactivity in penicillin-allergic patients can trigger severe cutaneous eruptions, bronchospasm, or anaphylactoid shock.',
      source: 'VitalWatch Demonstration Clinical Safety Standards',
      recommendation: 'Do NOT administer. Review with prescribing clinician for alternative non-beta-lactam antimicrobial (e.g. Macrolide/Azithromycin or Doxycycline).',
    },
    {
      ruleId: 'ALLERGY-RULE-002',
      ingredientId: 'ING-PENICILLIN-V',
      matchingAllergies: ['penicillin', 'beta-lactam'],
      severity: 'Critical Rule Alert',
      explanation: 'Direct allergen match. Patient has documented Penicillin allergy.',
      source: 'VitalWatch Demonstration Clinical Safety Standards',
      recommendation: 'Select alternative antimicrobial class following clinical allergy review.',
    },
    {
      ruleId: 'ALLERGY-RULE-003',
      ingredientId: 'ING-IBUPROFEN',
      matchingAllergies: ['ibuprofen', 'nsaid', 'nsaids', 'aspirin', 'salicylate'],
      severity: 'High Priority Conflict',
      explanation: 'Ibuprofen is an NSAID. Cross-sensitivity with documented NSAID or Aspirin allergy can trigger severe asthma attacks, angioedema, or urticaria.',
      source: 'VitalWatch Demonstration Clinical Safety Standards',
      recommendation: 'Avoid NSAIDs. Consider Paracetamol / Acetaminophen for analgesia after physician review.',
    },
    {
      ruleId: 'ALLERGY-RULE-004',
      ingredientId: 'ING-ASPIRIN',
      matchingAllergies: ['aspirin', 'nsaid', 'salicylate', 'nsaids'],
      severity: 'High Priority Conflict',
      explanation: 'Patient has documented Aspirin/NSAID sensitivity.',
      source: 'VitalWatch Demonstration Clinical Safety Standards',
      recommendation: 'Evaluate antiplatelet alternatives (e.g. Clopidogrel) under cardiology guidance.',
    },
    {
      ruleId: 'ALLERGY-RULE-005',
      ingredientId: 'ING-CODEINE',
      matchingAllergies: ['codeine', 'opioid', 'opioids', 'morphine'],
      severity: 'Moderate Priority Conflict',
      explanation: 'Codeine triggers documented opioid hypersensitivity or severe gastrointestinal adverse reaction in this patient record.',
      source: 'VitalWatch Demonstration Clinical Safety Standards',
      recommendation: 'Use non-opioid analgesic ladder or alternative pain-management protocol.',
    },
    {
      ruleId: 'ALLERGY-RULE-006',
      ingredientId: 'ING-CELECOXIB',
      matchingAllergies: ['sulfa', 'sulfonamide', 'sulfa drugs', 'nsaid'],
      severity: 'High Priority Conflict',
      explanation: 'Celecoxib contains a sulfonamide moiety and is contraindicated in patients with documented sulfa drug hypersensitivity.',
      source: 'VitalWatch Demonstration Clinical Safety Standards',
      recommendation: 'Avoid sulfonamide-containing agents. Review with clinical pharmacist.',
    },
  ],

  // 2. Drug–Disease Contraindication Rules
  diseaseRules: [
    {
      ruleId: 'DISEASE-RULE-001',
      ingredientId: 'ING-PROPRANOLOL',
      matchingConditions: ['asthma', 'copd', 'bronchospasm', 'reactive airway disease'],
      severity: 'Critical Contraindication',
      explanation: 'Non-selective beta-blockers block beta-2 receptors in bronchial smooth muscle, leading to severe bronchoconstriction and life-threatening exacerbation of Asthma/COPD.',
      source: 'VitalWatch Safety Knowledge Base',
      recommendation: 'Contraindicated in Asthma/COPD. Use cardioselective beta-1 blockers (e.g. Metoprolol/Atenolol) with caution or alternative antiarrhythmics.',
    },
    {
      ruleId: 'DISEASE-RULE-002',
      ingredientId: 'ING-IBUPROFEN',
      matchingConditions: ['chronic kidney disease', 'acute kidney injury', 'renal failure', 'peptic ulcer', 'gastric ulcer', 'heart failure'],
      severity: 'High Priority Contraindication',
      explanation: 'NSAIDs inhibit renal prostaglandin synthesis, reducing GFR and worsening renal impairment or heart failure fluid retention. Also increases gastrointestinal mucosal ulceration risk.',
      source: 'VitalWatch Safety Knowledge Base',
      recommendation: 'Avoid nephrotoxic NSAIDs in renal compromise. Use topical agents or Paracetamol under medical supervision.',
    },
    {
      ruleId: 'DISEASE-RULE-003',
      ingredientId: 'ING-METFORMIN',
      matchingConditions: ['acute kidney injury', 'sepsis', 'severe renal impairment', 'septic shock'],
      severity: 'Critical Safety Warning',
      explanation: 'In hemodynamic instability, sepsis, or acute renal decline, Metformin accumulation poses a risk of severe lactic acidosis.',
      source: 'VitalWatch Safety Knowledge Base',
      recommendation: 'Hold Metformin during acute sepsis / renal stress. Manage glycemic control with sliding scale insulin.',
    },
    {
      ruleId: 'DISEASE-RULE-004',
      ingredientId: 'ING-WARFARIN',
      matchingConditions: ['active bleeding', 'hemorrhagic stroke', 'severe thrombocytopenia', 'peptic ulcer bleeding'],
      severity: 'Critical Contraindication',
      explanation: 'Anticoagulation in active hemorrhage or severe bleeding lesions can cause catastrophic blood loss.',
      source: 'VitalWatch Safety Knowledge Base',
      recommendation: 'Immediate hold. Check PT/INR and consult hematology/attending intensivist.',
    },
  ],

  // 3. Drug–Drug Interaction Rules
  drugDrugRules: [
    {
      ruleId: 'DRUG-DRUG-001',
      ingredientId1: 'ING-WARFARIN',
      ingredientId2: 'ING-ASPIRIN',
      severity: 'Major Bleeding Interaction',
      explanation: 'Concurrent administration of Warfarin (anticoagulant) and Aspirin (antiplatelet) significantly increases the risk of major upper GI and intracranial hemorrhage.',
      source: 'VitalWatch Demonstration Drug Interaction Matrix',
      recommendation: 'Dual therapy requires explicit clinical indication (e.g. mechanical heart valve + ACS) and close INR / hemoglobin monitoring.',
    },
    {
      ruleId: 'DRUG-DRUG-002',
      ingredientId1: 'ING-WARFARIN',
      ingredientId2: 'ING-IBUPROFEN',
      severity: 'Major Interaction',
      explanation: 'NSAIDs displace warfarin from protein binding sites and compromise gastric mucosal barrier, multiplying bleeding risk.',
      source: 'VitalWatch Demonstration Drug Interaction Matrix',
      recommendation: 'Avoid combining NSAIDs with Warfarin. Use Paracetamol for analgesia.',
    },
  ],

  // 4. Illustrative Mock Alternatives for Clinical Review
  mockAlternatives: {
    'ING-AMOXICILLIN': [
      {
        name: 'Azithromycin 500mg Oral',
        class: 'Macrolide Antibiotic',
        reason: 'Illustrative non-beta-lactam alternative for respiratory tract infection coverage in penicillin-allergic patients.',
      },
      {
        name: 'Clindamycin 300mg Oral',
        class: 'Lincosamide Antibiotic',
        reason: 'Illustrative alternative for skin/soft tissue and dental coverage.',
      },
    ],
    'ING-IBUPROFEN': [
      {
        name: 'Paracetamol (Acetaminophen) 1000mg',
        class: 'Non-opioid Analgesic / Antipyretic',
        reason: 'Gentle on gastrointestinal mucosa and safe in mild renal impairment.',
      },
      {
        name: 'Topical Diclofenac Gel 1%',
        class: 'Topical NSAID',
        reason: 'Low systemic absorption for localized joint / musculoskeletal pain.',
      },
    ],
    'ING-PROPRANOLOL': [
      {
        name: 'Metoprolol Tartrate 25mg BD',
        class: 'Cardioselective Beta-1 Blocker',
        reason: 'Significantly less beta-2 bronchial effect than non-selective propranolol.',
      },
      {
        name: 'Amlodipine 5mg OD',
        class: 'Dihydropyridine Calcium Channel Blocker',
        reason: 'Non-beta blocker antihypertensive option.',
      },
    ],
  },
};
