import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getMyProfile } from '../services/profileService.js'
import { getMyApplicationStats } from '../services/applicationService.js'

export default function Dashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [appStats, setAppStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getMyProfile(), getMyApplicationStats()])
      .then(([profileData, stats]) => {
        setProfile(profileData)
        setAppStats(stats)
      })
      .catch(() => setError('Could not load dashboard data'))
      .finally(() => setLoading(false))
  }, [])

  const totalApplications = appStats
    ? appStats.applied + appStats.shortlisted + appStats.interview + appStats.selected + appStats.rejected
    : 0

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h3 className="fw-bold mb-1">Welcome, {user?.name}</h3>
        <p className="text-muted mb-4">Here's where your placement prep stands today.</p>

        {error && <div className="alert alert-warning">{error}</div>}

        <div className="row g-3">
          <div className="col-md-3 col-6">
            <div className="card pt-card p-3">
              <div className="text-muted small">Profile Completion</div>
              <div className="fs-3 fw-bold">{loading ? '—' : `${profile?.profileCompletionPercentage ?? 0}%`}</div>
              <div className="progress mt-2" style={{ height: 6 }}>
                <div
                  className="progress-bar pt-btn-primary"
                  style={{ width: `${profile?.profileCompletionPercentage ?? 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className="card pt-card p-3">
              <div className="text-muted small">Applications</div>
              <div className="fs-3 fw-bold">{loading ? '—' : totalApplications}</div>
              <div className="text-muted small">{loading ? '' : `${appStats?.interview ?? 0} in interview stage`}</div>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className="card pt-card p-3">
              <div className="text-muted small">Coding Problems Solved</div>
              <div className="fs-3 fw-bold">—</div>
              <div className="text-muted small">Coming in Phase 3</div>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className="card pt-card p-3">
              <div className="text-muted small">Aptitude Score</div>
              <div className="fs-3 fw-bold">—</div>
              <div className="text-muted small">Coming in Phase 3</div>
            </div>
          </div>
        </div>

        <div className="alert alert-info mt-4 mb-0">
          Authentication, profile management, companies, jobs and application tracking are fully
          wired to the database. Coding practice, aptitude tests, interviews and tasks widgets will
          populate here as each module is added.
        </div>
      </div>
    </>
  )
}
