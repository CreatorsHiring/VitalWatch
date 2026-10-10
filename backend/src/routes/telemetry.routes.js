
import express from 'express';
import { patients } from '../data/store.js';
import { ingestVitalReading } from '../data/vitalsAndAlertsStore.js';

const router = express.Router();

const REQUIRED_FIELDS = [
  'heartRate',
  'spo2',
  'systolicBp',
  'diastolicBp',
  'temperature',
];

const RANGES = {
  heartRate: [1, 300],
  spo2: [0, 100],
  systolicBp: [1, 300],
  diastolicBp: [1, 200],
  temperature: [25, 45],
};

router.post('/', (req, res) => {
  // 1. Authenticate the simulated device.
  const expectedToken = process.env.DEVICE_INGEST_TOKEN;

  if (
    !expectedToken ||
    req.get('X-Device-Token') !== expectedToken
  ) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or missing device token',
    });
  }

  const { deviceId, ...reading } = req.body ?? {};

  // 2. Bind this device to a patient on the server.
  const configuredDeviceId = process.env.WOKWI_DEVICE_ID;
  const patientId = process.env.WOKWI_PATIENT_ID;

  if (
    !configuredDeviceId ||
    !patientId ||
    deviceId !== configuredDeviceId
  ) {
    return res.status(403).json({
      success: false,
      message: 'Device is not configured',
    });
  }

  const patient = patients.find(
    (p) =>
      p.id === patientId &&
      p.admissionStatus === 'Admitted'
  );

  if (!patient) {
    return res.status(404).json({
      success: false,
      message: 'Configured admitted patient not found',
    });
  }

  // 3. Reject missing, non-numeric or out-of-range values.
  for (const field of REQUIRED_FIELDS) {
    const value = reading[field];
    const [min, max] = RANGES[field];

    if (
      typeof value !== 'number' ||
      !Number.isFinite(value) ||
      value < min ||
      value > max
    ) {
      return res.status(400).json({
        success: false,
        message: `Invalid reading: ${field}`,
      });
    }
  }

  // 4. Save using VitalWatch's existing ingestion logic.
  const savedReading = ingestVitalReading(patientId, {
    heartRate: reading.heartRate,
    spo2: reading.spo2,
    systolicBp: reading.systolicBp,
    diastolicBp: reading.diastolicBp,
    temperature: reading.temperature,
    signalQuality: reading.signalQuality ?? 'Simulated',
  });

  return res.status(201).json({
    success: true,
    message: 'Vital reading received',
    patient: {
      id: patient.id,
      name: patient.name,
    },
    reading: savedReading,
  });
});

export default router;
