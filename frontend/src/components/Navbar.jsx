import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg pt-navbar sticky-top">
      <div className="container-fluid px-4">
        <Link className="navbar-brand pt-brand" to="/">
          Placement Tracker
        </Link>
        <div className="d-flex align-items-center gap-3">
          {user ? (
            <>
              <Link className="btn btn-sm btn-outline-secondary" to={user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}>
                Dashboard
              </Link>
              {user.role === 'STUDENT' && (
                <>
                  <Link className="btn btn-sm btn-outline-secondary" to="/profile">
                    Profile
                  </Link>
                  <Link className="btn btn-sm btn-outline-secondary" to="/companies">
                    Companies
                  </Link>
                  <Link className="btn btn-sm btn-outline-secondary" to="/jobs">
                    Jobs
                  </Link>
                  <Link className="btn btn-sm btn-outline-secondary" to="/applications">
                    Applications
                  </Link>
                </>
              )}
              {user.role === 'ADMIN' && (
                <>
                  <Link className="btn btn-sm btn-outline-secondary" to="/admin/companies">
                    Companies
                  </Link>
                  <Link className="btn btn-sm btn-outline-secondary" to="/admin/jobs">
                    Jobs
                  </Link>
                </>
              )}
              <span className="text-muted small">{user.name}</span>
              <button className="btn btn-sm btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-sm btn-outline-primary" to="/login">
                Login
              </Link>
              <Link className="btn btn-sm pt-btn-primary text-white" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
