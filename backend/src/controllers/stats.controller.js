import { getHospitalStats, getWardsWithStats } from '../data/store.js';

export function getOverviewStats(req, res) {
  const stats = getHospitalStats();
  const wards = getWardsWithStats();

  return res.json({
    success: true,
    data: {
      ...stats,
      wards,
    },
  });
}
