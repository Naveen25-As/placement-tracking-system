import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/user/UserDashboard';
import ApplicationsList from './pages/user/ApplicationsList';
import ApplicationForm from './pages/user/ApplicationForm';
import EditApplication from './pages/user/EditApplication';
import Profile from './pages/user/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import LoginActivity from './pages/admin/LoginActivity';
import AdminPlacements from './pages/admin/AdminPlacements';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { useAuth } from './context/AuthContext';

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Home />;
  return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/placements" element={<ApplicationsList />} />
        <Route path="/placements/new" element={<ApplicationForm />} />
        <Route path="/placements/:id/edit" element={<EditApplication />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/login-activities" element={<LoginActivity />} />
        <Route path="/admin/placements" element={<AdminPlacements />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
