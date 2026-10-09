import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Public Pages
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';

// Receptionist Layout & Pages
import ReceptionistLayout from './layouts/ReceptionistLayout';
import Dashboard from './pages/receptionist/Dashboard';
import WardsList from './pages/receptionist/WardsList';
import WardRoomsView from './pages/receptionist/WardRoomsView';
import AssignRoom from './pages/receptionist/AssignRoom';
import PatientDirectory from './pages/receptionist/PatientDirectory';
import AdmissionsList from './pages/receptionist/AdmissionsList';

// Nurse Layout & Pages
import NurseLayout from './layouts/NurseLayout';
import NurseDashboard from './pages/nurse/NurseDashboard';
import PatientProfileDetail from './pages/nurse/PatientProfileDetail';
import CheckMedicine from './pages/nurse/CheckMedicine';
import ClinicalAlerts from './pages/nurse/ClinicalAlerts';
import PatientLogs from './pages/nurse/PatientLogs';

// Scroll to top on route change or handle hash scrolling
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollManager />
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Home />} />

          {/* Authentication Split Workspace Page */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/receptionist" element={<LoginPage />} />
          <Route path="/login/caretaker" element={<LoginPage />} />

          {/* Receptionist Portal Routes */}
          <Route path="/receptionist" element={<ReceptionistLayout />}>
            <Route index element={<Navigate to="/receptionist/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="wards" element={<WardsList />} />
            <Route path="wards/:wardId" element={<WardRoomsView />} />
            <Route path="admissions/new" element={<AssignRoom />} />
            <Route path="patients" element={<PatientDirectory />} />
            <Route path="admissions" element={<AdmissionsList />} />
          </Route>

          {/* Nurse / Clinical Caretaker Portal Routes */}
          <Route path="/nurse" element={<NurseLayout />}>
            <Route index element={<Navigate to="/nurse/dashboard" replace />} />
            <Route path="dashboard" element={<NurseDashboard />} />
            <Route path="patients" element={<NurseDashboard />} />
            <Route path="patients/:patientId" element={<PatientProfileDetail />} />
            <Route path="patients/:patientId/check-medicine" element={<CheckMedicine />} />
            <Route path="check-medicine" element={<CheckMedicine />} />
            <Route path="alerts" element={<ClinicalAlerts />} />
            <Route path="logs" element={<PatientLogs />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

