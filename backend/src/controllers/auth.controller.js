// Auth Controller
export function login(req, res) {
  const { identifier, password, role } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both staff email/username and password.',
    });
  }

  // Role validation & user session data
  const isReceptionist =
    role === 'receptionist' ||
    identifier.toLowerCase().includes('reception') ||
    identifier.toLowerCase().includes('frontdesk');

  const user = {
    id: isReceptionist ? 'USR-REC-01' : 'USR-RN-01',
    name: isReceptionist ? 'Eleanor Jenkins' : 'Sarah Vance, RN',
    role: isReceptionist ? 'receptionist' : 'caretaker',
    email: identifier,
    roleTitle: isReceptionist ? 'Hospital Admissions Officer' : 'Clinical Telemetry Nurse',
    avatar: isReceptionist
      ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256'
      : 'https://images.unsplash.com/photo-1594824813581-9b16957a627f?auto=format&fit=crop&q=80&w=256',
    token: `vitalwatch-token-${Date.now()}-${Math.random().toString(36).substring(7)}`,
  };

  return res.json({
    success: true,
    message: 'Authentication successful',
    data: {
      user,
      redirectTo: isReceptionist ? '/receptionist/dashboard' : '/caretaker/dashboard',
    },
  });
}

export function getCurrentUser(req, res) {
  return res.json({
    success: true,
    data: {
      id: 'USR-REC-01',
      name: 'Eleanor Jenkins',
      role: 'receptionist',
      email: 'reception.desk@vitalwatch.hospital',
      roleTitle: 'Hospital Admissions Officer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    },
  });
}
