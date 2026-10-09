import { wards, rooms, patients, getWardsWithStats } from '../data/store.js';

export function getAllWards(req, res) {
  const wardsWithStats = getWardsWithStats();
  return res.json({
    success: true,
    data: wardsWithStats,
  });
}

export function getWardById(req, res) {
  const { wardId } = req.params;
  const wardsWithStats = getWardsWithStats();
  const ward = wardsWithStats.find((w) => w.id === wardId);

  if (!ward) {
    return res.status(404).json({
      success: false,
      message: `Ward with ID '${wardId}' not found.`,
    });
  }

  return res.json({
    success: true,
    data: ward,
  });
}

export function getWardRooms(req, res) {
  const { wardId } = req.params;
  const ward = wards.find((w) => w.id === wardId);

  if (!ward) {
    return res.status(404).json({
      success: false,
      message: `Ward with ID '${wardId}' not found.`,
    });
  }

  const wardRooms = rooms
    .filter((r) => r.wardId === wardId)
    .map((room) => {
      let patient = null;
      if (room.currentPatientId) {
        const foundPatient = patients.find((p) => p.id === room.currentPatientId);
        if (foundPatient) {
          patient = {
            id: foundPatient.id,
            fullName: foundPatient.fullName,
            dob: foundPatient.dob,
            gender: foundPatient.gender,
            phone: foundPatient.phone,
            createdAt: foundPatient.createdAt,
            medicalHistory: foundPatient.medicalHistory,
          };
        }
      }

      return {
        ...room,
        wardName: ward.name,
        patient,
      };
    });

  return res.json({
    success: true,
    ward,
    data: wardRooms,
  });
}
