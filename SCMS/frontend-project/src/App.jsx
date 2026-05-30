import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Suppliers from './pages/Suppliers';
import Shipments from './pages/Shipments';
import Deliveries from './pages/Deliveries';
import Reports from './pages/Reports';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="shipments" element={<Shipments />} />
        <Route path="deliveries" element={<Deliveries />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'dark:bg-slate-800 dark:text-white',
              duration: 3000,
              style: { borderRadius: '12px', fontFamily: 'Sora, sans-serif', fontSize: '14px' },
            }}
          />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
