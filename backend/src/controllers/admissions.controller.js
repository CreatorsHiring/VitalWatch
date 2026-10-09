import { admissions, assignRoomAtomically } from '../data/store.js';

export function getAllAdmissions(req, res) {
  const { status, wardId } = req.query;

  let filtered = [...admissions];

  if (status) {
    filtered = filtered.filter((a) => a.status.toLowerCase() === status.toLowerCase());
  }

  if (wardId) {
    filtered = filtered.filter((a) => a.wardId === wardId);
  }

  return res.json({
    success: true,
    count: filtered.length,
    data: filtered,
  });
}

export function getAdmissionById(req, res) {
  const { admissionId } = req.params;
  const admission = admissions.find((a) => a.id === admissionId);

  if (!admission) {
    return res.status(404).json({
      success: false,
      message: `Admission with ID '${admissionId}' not found.`,
    });
  }

  return res.json({
    success: true,
    data: admission,
  });
}

export function createAdmission(req, res) {
  try {
    const { patient, admission, medicalHistory } = req.body;

    // Validate required fields
    if (!patient || !patient.fullName || !patient.dob) {
      return res.status(400).json({
        success: false,
        message: 'Patient Full Name and Date of Birth are required.',
      });
    }

    if (!admission || !admission.wardId || (!admission.roomId && !admission.roomNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Ward and Room assignment are required.',
      });
    }

    // Atomic execution on store
    const result = assignRoomAtomically({
      patientData: patient,
      admissionData: admission,
      medicalHistoryData: medicalHistory,
    });

    return res.status(201).json({
      success: true,
      message: `Patient ${result.patient.fullName} successfully admitted to ${result.ward.name} (${result.room.roomNumber}) with ID ${result.patient.id}`,
      data: {
        patient: result.patient,
        admission: result.admission,
        room: result.room,
        ward: result.ward,
      },
    });
  } catch (err) {
    return res.status(409).json({
      success: false,
      message: err.message || 'Room assignment conflict occurred.',
    });
  }
}
