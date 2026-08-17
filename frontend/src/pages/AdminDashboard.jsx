import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { adminGetApplicationStats, adminGetCompanies, adminGetJobs } from '../services/adminService.js'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [companyCount, setCompanyCount] = useState(null)
  const [jobCount, setJobCount] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([adminGetApplicationStats(), adminGetCompanies(), adminGetJobs()])
      .then(([s, companies, jobs]) => {
        setStats(s)
        setCompanyCount(companies.length)
        setJobCount(jobs.length)
      })
      .catch(() => setError('Could not load admin statistics.'))
  }, [])

  const totalApplications = stats
    ? stats.applied + stats.shortlisted + stats.interview + stats.selected + stats.rejected
    : null

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h3 className="fw-bold mb-1">Admin Dashboard</h3>
        <p className="text-muted mb-4">Signed in as {user?.name} ({user?.email})</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row g-3 mb-4">
          <div className="col-md-3 col-6">
            <div className="card pt-card p-3">
              <div className="text-muted small">Total Companies</div>
              <div className="fs-3 fw-bold">{companyCount ?? '—'}</div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card pt-card p-3">
              <div className="text-muted small">Total Jobs</div>
              <div className="fs-3 fw-bold">{jobCount ?? '—'}</div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card pt-card p-3">
              <div className="text-muted small">Total Applications</div>
              <div className="fs-3 fw-bold">{totalApplications ?? '—'}</div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card pt-card p-3">
              <div className="text-muted small">Selected Students</div>
              <div className="fs-3 fw-bold">{stats?.selected ?? '—'}</div>
            </div>
          </div>
        </div>

        <div className="d-flex gap-2 mb-4">
          <Link to="/admin/companies" className="btn pt-btn-primary text-white">
            Manage Companies
          </Link>
          <Link to="/admin/jobs" className="btn pt-btn-primary text-white">
            Manage Jobs
          </Link>
        </div>

        <div className="alert alert-info mb-0">
          Student management, coding problems, aptitude questions, and interview resource
          management are built in the next phases. Companies, jobs, and application statistics
          above are live and backed by MySQL.
        </div>
      </div>
    </>
  )
}
