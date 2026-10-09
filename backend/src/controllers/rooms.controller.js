import { rooms, wards, patients } from '../data/store.js';

export function getAllRooms(req, res) {
  const { status, wardId, search } = req.query;

  let filtered = [...rooms];

  if (status) {
    filtered = filtered.filter((r) => r.status.toLowerCase() === status.toLowerCase());
  }

  if (wardId) {
    filtered = filtered.filter((r) => r.wardId === wardId);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((r) => r.roomNumber.toLowerCase().includes(q));
  }

  const enrichedRooms = filtered.map((room) => {
    const ward = wards.find((w) => w.id === room.wardId);
    let patient = null;
    if (room.currentPatientId) {
      const p = patients.find((pat) => pat.id === room.currentPatientId);
      if (p) {
        patient = {
          id: p.id,
          fullName: p.fullName,
          gender: p.gender,
          dob: p.dob,
        };
      }
    }

    return {
      ...room,
      wardName: ward ? ward.name : 'Unknown Ward',
      wardType: ward ? ward.type : 'General',
      patient,
    };
  });

  return res.json({
    success: true,
    count: enrichedRooms.length,
    data: enrichedRooms,
  });
}

export function getRoomById(req, res) {
  const { roomId } = req.params;
  const room = rooms.find((r) => r.id === roomId);

  if (!room) {
    return res.status(404).json({
      success: false,
      message: `Room with ID '${roomId}' not found.`,
    });
  }

  const ward = wards.find((w) => w.id === room.wardId);
  let patient = null;
  if (room.currentPatientId) {
    patient = patients.find((p) => p.id === room.currentPatientId) || null;
  }

  return res.json({
    success: true,
    data: {
      ...room,
      wardName: ward ? ward.name : 'Unknown Ward',
      wardType: ward ? ward.type : 'General',
      patient,
    },
  });
}
