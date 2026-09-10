import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './layouts/AppLayout';
import { Loader2 } from 'lucide-react';

import Landing    from './pages/Landing';
import Login      from './pages/Login';
import Signup     from './pages/Signup';
import Dashboard  from './pages/Dashboard';
import WaitTimer  from './pages/WaitTimer';
import History    from './pages/History';
import Analytics  from './pages/Analytics';
import Prediction from './pages/Prediction';
import Feedback   from './pages/Feedback';
import Profile    from './pages/Profile';
import About      from './pages/About';

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"       element={<AuthRoute><Landing /></AuthRoute>} />
      <Route path="/login"  element={<AuthRoute><Login /></AuthRoute>} />
      <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard"  element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/timer"      element={<AppLayout><WaitTimer /></AppLayout>} />
        <Route path="/history"    element={<AppLayout><History /></AppLayout>} />
        <Route path="/analytics"  element={<AppLayout><Analytics /></AppLayout>} />
        <Route path="/prediction" element={<AppLayout><Prediction /></AppLayout>} />
        <Route path="/feedback"   element={<AppLayout><Feedback /></AppLayout>} />
        <Route path="/profile"    element={<AppLayout><Profile /></AppLayout>} />
        <Route path="/about"      element={<AppLayout><About /></AppLayout>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
