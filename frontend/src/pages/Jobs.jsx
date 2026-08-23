import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { getJobs } from '../services/jobService.js'
import { applyToJob } from '../services/applicationService.js'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [applyingId, setApplyingId] = useState(null)
  const [message, setMessage] = useState(null)

  const load = () => {
    setLoading(true)
    getJobs()
      .then(setJobs)
      .catch(() => setError('Could not load job opportunities.'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleApply = async (jobId) => {
    setApplyingId(jobId)
    setMessage(null)
    try {
      await applyToJob(jobId)
      setMessage({ type: 'success', text: 'Application tracked successfully.' })
      load()
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Could not apply to this job.' })
    } finally {
      setApplyingId(null)
    }
  }

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h3 className="fw-bold mb-3">Job Opportunities</h3>

        {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="text-muted">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="alert alert-secondary">No job opportunities available right now.</div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle bg-white pt-card">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Salary</th>
                  <th>Min CGPA</th>
                  <th>Deadline</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.companyName}</td>
                    <td>{job.title}</td>
                    <td>{job.location}</td>
                    <td>
                      <span className="badge bg-secondary">{job.jobType?.replace('_', ' ')}</span>
                    </td>
                    <td>{job.salary}</td>
                    <td>{job.minimumCgpa}</td>
                    <td>{job.deadline}</td>
                    <td>
                      {job.alreadyApplied ? (
                        <span className="badge bg-success">Applied</span>
                      ) : (
                        <button
                          className="btn btn-sm pt-btn-primary text-white"
                          disabled={applyingId === job.id}
                          onClick={() => handleApply(job.id)}
                        >
                          {applyingId === job.id ? 'Applying...' : 'Track Application'}
                        </button>
                      )}
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
