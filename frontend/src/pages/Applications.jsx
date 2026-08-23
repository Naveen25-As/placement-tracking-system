import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { getMyApplications, getMyApplicationStats, updateApplicationStatus } from '../services/applicationService.js'

const STATUS_OPTIONS = ['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED']

const badgeClass = {
  APPLIED: 'bg-secondary',
  SHORTLISTED: 'bg-info text-dark',
  INTERVIEW: 'bg-warning text-dark',
  SELECTED: 'bg-success',
  REJECTED: 'bg-danger',
}

export default function Applications() {
  const [applications, setApplications] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([getMyApplications(), getMyApplicationStats()])
      .then(([apps, s]) => {
        setApplications(apps)
        setStats(s)
      })
      .catch(() => setError('Could not load your applications.'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id)
    try {
      await updateApplicationStatus(id, status)
      load()
    } catch {
      setError('Could not update application status.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h3 className="fw-bold mb-3">My Applications</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        {stats && (
          <div className="row g-3 mb-4">
            {Object.entries(stats).map(([key, value]) => (
              <div className="col-md-2 col-4" key={key}>
                <div className="card pt-card p-3 text-center">
                  <div className="text-muted small text-capitalize">{key}</div>
                  <div className="fs-4 fw-bold">{value}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-muted">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="alert alert-secondary">
            You haven't applied to any jobs yet. Browse the Jobs page to get started.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle bg-white pt-card">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Job</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.companyName}</td>
                    <td>{app.jobTitle}</td>
                    <td>{new Date(app.appliedDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${badgeClass[app.status]}`}>{app.status}</span>
                    </td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        style={{ width: 160 }}
                        value={app.status}
                        disabled={updatingId === app.id}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
