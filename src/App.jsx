import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import PatientLayout from './components/layout/PatientLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Clinician Pages
import Dashboard from './pages/Dashboard';
import NewCase from './pages/NewCase';
import Analysis from './pages/Analysis';
import Report from './pages/Report';
import CaseArchive from './pages/CaseArchive';
import Settings from './pages/Settings';
import Help from './pages/Help';
import DeviceManager from './pages/DeviceManager';

// Patient Pages
import PatientPortal from './pages/patient/PatientPortal';
import PatientReports from './pages/patient/PatientReports';
import PatientReport from './pages/patient/PatientReport';
import Education from './pages/patient/Education';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Clinician Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute allowedRoles={['clinician', 'doctor', 'admin']}>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="new-case" element={<NewCase />} />
              <Route path="analysis" element={<Analysis />} />
              <Route path="report" element={<Report />} />
              <Route path="cases" element={<CaseArchive />} />
              <Route path="devices" element={<DeviceManager />} />
              <Route path="settings" element={<Settings />} />
              <Route path="help" element={<Help />} />
            </Route>

            {/* Patient Routes */}
            <Route
              path="/patient"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <PatientLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/patient/portal" replace />} />
              <Route path="portal" element={<PatientPortal />} />
              <Route path="reports" element={<PatientReports />} />
              <Route path="report" element={<PatientReport />} />
              <Route path="education" element={<Education />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
