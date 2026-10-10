import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  INITIAL_ROLES,
  INITIAL_PATIENTS,
  INITIAL_ALERTS,
  INITIAL_DEVICES,
  INITIAL_WARDS,
} from '../data/seedData';
import { evaluateMedicationSafety } from '../services/medicationSafetyService';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // State initialization
  const [currentRole, setCurrentRole] = useState(INITIAL_ROLES[0]);
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [devices, setDevices] = useState(INITIAL_DEVICES);
  const [wards, setWards] = useState(INITIAL_WARDS);

  // Simulator State
  const [simStatus, setSimStatus] = useState('STOPPED'); // 'RUNNING' | 'PAUSED' | 'STOPPED'
  const [simScenario, setSimScenario] = useState('NORMAL');
  const [simTargetId, setSimTargetId] = useState('PAT-8801');
  const [simInterval, setSimInterval] = useState(2000); // ms
  const [simLogs, setSimLogs] = useState([
    { id: 1, timestamp: new Date().toISOString(), text: 'Simulator initialized in standby mode.' }
  ]);

  const simTimerRef = useRef(null);

  // Helper log generator
  const logSimEvent = (text) => {
    const logItem = { id: Date.now() + Math.random(), timestamp: new Date().toISOString(), text };
    setSimLogs((prev) => [logItem, ...prev.slice(0, 49)]); // Keep last 50 logs
  };

  // 1. Role switcher
  const changeRole = (roleId) => {
    const roleObj = INITIAL_ROLES.find((r) => r.id === roleId) || INITIAL_ROLES[0];
    setCurrentRole(roleObj);
    logSimEvent(`Active user role switched to ${roleObj.name} (${roleObj.title}).`);
  };

  // 2. Patient Registration
  const registerPatient = (patientData) => {
    const newId = `PAT-${Math.floor(8800 + Math.random() * 1000)}`;
    const newMrn = `MRN-${Math.floor(90000 + Math.random() * 9000)}`;

    const newPatient = {
      id: newId,
      mrn: newMrn,
      name: patientData.name || 'Synthetic Patient',
      age: Number(patientData.age) || 50,
      gender: patientData.gender || 'Unknown',
      admissionReason: patientData.admissionReason || 'Clinical Observation',
      ward: patientData.ward || 'ICU Ward A',
      room: patientData.room || 'Bed 103',
      deviceId: patientData.deviceId || 'DEV-ICU-005',
      careTeam: patientData.careTeam || 'Dr. S. Jenkins',
      admissionDate: new Date().toISOString(),
      status: 'STABLE',
      vitals: {
        hr: 75,
        spo2: 98,
        temp: 36.8,
        sysBP: 120,
        diaBP: 80,
        timestamp: new Date().toISOString(),
        quality: 'VALID',
      },
      history: {
        allergies: patientData.allergies || [],
        conditions: patientData.conditions || [],
        medications: patientData.medications || [],
        allergiesHistoryStatus: patientData.allergiesHistoryStatus || 'VERIFIED',
      },
      observations: [],
    };

    setPatients((prev) => [newPatient, ...prev]);
    logSimEvent(`Registered new synthetic patient ${newPatient.name} (${newPatient.id}) assigned to ${newPatient.room}.`);
    return newPatient;
  };

  // 3. Room / Encounter Update
  const updateEncounter = (patientId, newWard, newRoom) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return { ...p, ward: newWard, room: newRoom };
        }
        return p;
      })
    );
    logSimEvent(`Updated encounter room for ${patientId} -> ${newWard} (${newRoom}).`);
  };

  // 4. Alert Status & Review Notes Update
  const updateAlertStatus = (alertId, newStatus, author, noteText) => {
    setAlerts((prev) =>
      prev.map((alt) => {
        if (alt.id === alertId) {
          const updatedNotes = [...alt.reviewNotes];
          if (noteText && noteText.trim()) {
            updatedNotes.push({
              author: author || currentRole.title,
              text: noteText.trim(),
              timestamp: new Date().toISOString(),
            });
          }
          return {
            ...alt,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            acknowledgedBy: newStatus === 'ACKNOWLEDGED' ? author : alt.acknowledgedBy,
            acknowledgedAt: newStatus === 'ACKNOWLEDGED' ? new Date().toISOString() : alt.acknowledgedAt,
            reviewNotes: updatedNotes,
          };
        }
        return alt;
      })
    );
    logSimEvent(`Alert ${alertId} updated to status '${newStatus}' by ${author || currentRole.title}.`);
  };

  // 5. Simulator Engine Loop
  const produceSimObservation = () => {
    setPatients((prevPatients) => {
      const target = prevPatients.find((p) => p.id === simTargetId);
      if (!target) return prevPatients;

      const currentVitals = { ...target.vitals };
      let newQuality = 'VALID';
      let newStatus = target.status;
      let generatedAlert = null;

      switch (simScenario) {
        case 'NORMAL':
          currentVitals.hr = Math.min(100, Math.max(60, currentVitals.hr + (Math.random() > 0.5 ? 1 : -1)));
          currentVitals.spo2 = Math.min(100, Math.max(95, currentVitals.spo2 + (Math.random() > 0.5 ? 0 : 0)));
          currentVitals.temp = Number((36.8 + Math.random() * 0.3).toFixed(1));
          currentVitals.sysBP = 120 + Math.floor(Math.random() * 4 - 2);
          currentVitals.diaBP = 80 + Math.floor(Math.random() * 4 - 2);
          newStatus = 'STABLE';
          break;

        case 'RAPID_CHANGE':
          // Rapid tachycardia elevation
          currentVitals.hr = Math.min(160, currentVitals.hr + 8);
          currentVitals.spo2 = Math.max(88, currentVitals.spo2 - 1);
          currentVitals.sysBP = currentVitals.sysBP + 4;
          newStatus = 'CRITICAL';

          if (currentVitals.hr > 130) {
            generatedAlert = {
              category: 'PHYSIOLOGICAL',
              title: 'Rapid Tachycardia Escalation',
              severity: 'CRITICAL',
              metric: 'Heart Rate',
              val: currentVitals.hr,
              unit: 'bpm',
              explanation: 'Configured rapid change scenario triggered continuous HR rise exceeding 130 bpm.',
            };
          }
          break;

        case 'MISSING_MEASUREMENT':
          currentVitals.hr = null;
          currentVitals.spo2 = null;
          newQuality = 'MISSING';
          newStatus = 'WARNING';
          break;

        case 'POOR_SIGNAL':
          currentVitals.hr = 220; // Invalid artifact
          currentVitals.spo2 = 60;
          newQuality = 'POOR_SIGNAL';
          newStatus = 'WARNING';
          break;

        case 'SENSOR_DISCONNECTED':
        case 'STALE_FEED':
          newQuality = 'STALE';
          newStatus = 'STALE_FEED';
          break;

        case 'UNUSUAL_COMBINATION':
          // ML Anomaly scenario
          currentVitals.hr = 112;
          currentVitals.sysBP = 158;
          currentVitals.temp = 38.9;
          newStatus = 'HIGH_RISK';

          generatedAlert = {
            category: 'ML_ANOMALY',
            title: 'Unusual Telemetry Vector (Isolation Forest)',
            severity: 'HIGH',
            metric: 'Anomaly Score',
            val: 0.91,
            unit: 'score',
            explanation: 'Unusual combination relative to the synthetic baseline. Multi-parameter shift flag.',
          };
          break;

        case 'RECOVERY':
          currentVitals.hr = 74;
          currentVitals.spo2 = 98;
          currentVitals.temp = 36.9;
          currentVitals.sysBP = 120;
          currentVitals.diaBP = 78;
          newQuality = 'VALID';
          newStatus = 'STABLE';
          break;

        default:
          break;
      }

      currentVitals.timestamp = new Date().toISOString();
      currentVitals.quality = newQuality;

      const newPoint = { ...currentVitals };

      // Deduplicate/Add alert if triggered
      if (generatedAlert) {
        setAlerts((prevAlerts) => {
          // Check for existing unresolved alert for same patient & title
          const existing = prevAlerts.find(
            (a) => a.patientId === target.id && a.title === generatedAlert.title && a.status !== 'RESOLVED'
          );
          if (existing) {
            return prevAlerts.map((a) =>
              a.id === existing.id
                ? { ...a, updatedAt: new Date().toISOString(), evidence: { ...a.evidence, value: generatedAlert.val } }
                : a
            );
          } else {
            const newAlertObj = {
              id: `ALT-${Math.floor(9000 + Math.random() * 1000)}`,
              patientId: target.id,
              patientName: target.name,
              bed: `${target.ward} • ${target.room}`,
              category: generatedAlert.category,
              title: generatedAlert.title,
              severity: generatedAlert.severity,
              detectedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              status: 'NEW',
              ruleId: 'SIM-DYNAMIC-RULE',
              evidence: {
                metric: generatedAlert.metric,
                value: generatedAlert.val,
                unit: generatedAlert.unit,
                dataQuality: newQuality,
              },
              explanation: generatedAlert.explanation,
              reviewNotes: [],
            };
            logSimEvent(`[ALERT CREATED] ${newAlertObj.severity} ${newAlertObj.title} for ${target.name}.`);
            return [newAlertObj, ...prevAlerts];
          }
        });
      }

      logSimEvent(`Observation packet emitted for ${target.name}: HR ${currentVitals.hr ?? '--'}, SpO2 ${currentVitals.spo2 ?? '--'}% [${newQuality}]`);

      return prevPatients.map((p) => {
        if (p.id === target.id) {
          const updatedObs = [...p.observations, newPoint].slice(-50); // Keep last 50 points
          return {
            ...p,
            status: newStatus,
            vitals: currentVitals,
            observations: updatedObs,
          };
        }
        return p;
      });
    });
  };

  // Timer lifecycle control for simulator
  useEffect(() => {
    if (simStatus === 'RUNNING') {
      simTimerRef.current = setInterval(produceSimObservation, simInterval);
    } else {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    }
    return () => {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    };
  }, [simStatus, simScenario, simTargetId, simInterval]);

  const startSim = () => {
    setSimStatus('RUNNING');
    logSimEvent(`Simulation started. Scenario: [${simScenario}] Target: [${simTargetId}] Interval: [${simInterval}ms]`);
  };

  const pauseSim = () => {
    setSimStatus('PAUSED');
    logSimEvent('Simulation paused by operator.');
  };

  const stopSim = () => {
    setSimStatus('STOPPED');
    logSimEvent('Simulation stopped.');
  };

  const resetDemo = () => {
    stopSim();
    setPatients(INITIAL_PATIENTS);
    setAlerts(INITIAL_ALERTS);
    setDevices(INITIAL_DEVICES);
    setWards(INITIAL_WARDS);
    setCurrentRole(INITIAL_ROLES[0]);
    setSimScenario('NORMAL');
    setSimLogs([{ id: Date.now(), timestamp: new Date().toISOString(), text: 'Demonstration environment reset to seed state.' }]);
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        changeRole,
        roles: INITIAL_ROLES,
        patients,
        alerts,
        devices,
        wards,
        registerPatient,
        updateEncounter,
        updateAlertStatus,
        simStatus,
        simScenario,
        setSimScenario,
        simTargetId,
        setSimTargetId,
        simInterval,
        setSimInterval,
        simLogs,
        startSim,
        pauseSim,
        stopSim,
        resetDemo,
        evaluateMedicationSafety: (patient, ing) => evaluateMedicationSafety(patient, ing),
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
