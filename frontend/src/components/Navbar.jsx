import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="brand-icon">📋</span>
          Placement Tracker
        </Link>

        <button className="nav-toggle" aria-label="Toggle menu" onClick={() => {
          document.querySelector('.nav-links')?.classList.toggle('open');
        }}>
          ☰
        </button>

        <div className="nav-links">
          {user ? (
            <>
              {isAdmin ? (
                <>
                  <Link to="/admin" className={isActive('/admin') && !isActive('/admin/users') && !isActive('/admin/login') && !isActive('/admin/placements') ? 'active' : ''}>Dashboard</Link>
                  <Link to="/admin/users" className={isActive('/admin/users') ? 'active' : ''}>Users</Link>
                  <Link to="/admin/login-activities" className={isActive('/admin/login-activities') ? 'active' : ''}>Login Activity</Link>
                  <Link to="/admin/placements" className={isActive('/admin/placements') ? 'active' : ''}>Placements</Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>Dashboard</Link>
                  <Link to="/placements" className={isActive('/placements') ? 'active' : ''}>Applications</Link>
                  <Link to="/profile" className={isActive('/profile') ? 'active' : ''}>Profile</Link>
                </>
              )}
              <span className="nav-user">{user.name}</span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className={isActive('/login') ? 'active' : ''}>Login</Link>
              <Link to="/register" className={`btn btn-primary btn-sm ${isActive('/register') ? 'active' : ''}`}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
