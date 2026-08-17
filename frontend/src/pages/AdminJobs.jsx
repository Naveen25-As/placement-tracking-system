import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { adminGetJobs, adminCreateJob, adminUpdateJob, adminDeleteJob, adminGetCompanies } from '../services/adminService.js'

const emptyForm = {
  companyId: '',
  title: '',
  description: '',
  location: '',
  jobType: 'FULL_TIME',
  salary: '',
  minimumCgpa: '',
  graduationYear: '',
  deadline: '',
}

export default function AdminJobs() {
  const [jobs, setJobs] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const load = () => {
    setLoading(true)
    Promise.all([adminGetJobs(), adminGetCompanies()])
      .then(([j, c]) => {
        setJobs(j)
        setCompanies(c)
      })
      .catch(() => setError('Could not load jobs.'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const openCreate = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
  }

  const openEdit = (job) => {
    setForm({
      companyId: job.companyId,
      title: job.title,
      description: job.description || '',
      location: job.location || '',
      jobType: job.jobType,
      salary: job.salary || '',
      minimumCgpa: job.minimumCgpa ?? '',
      graduationYear: job.graduationYear ?? '',
      deadline: job.deadline || '',
    })
    setEditingId(job.id)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const payload = {
      ...form,
      companyId: Number(form.companyId),
      minimumCgpa: form.minimumCgpa === '' ? null : Number(form.minimumCgpa),
      graduationYear: form.graduationYear === '' ? null : Number(form.graduationYear),
    }
    try {
      if (editingId) {
        await adminUpdateJob(editingId, payload)
      } else {
        await adminCreateJob(payload)
      }
      setShowForm(false)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save job.')
    }
  }

  const handleDelete = async (id) => {
    try {
      await adminDeleteJob(id)
      setConfirmDeleteId(null)
      load()
    } catch {
      setError('Could not delete job.')
    }
  }

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold mb-0">Manage Jobs</h3>
          <button className="btn pt-btn-primary text-white" onClick={openCreate} disabled={companies.length === 0}>
            + Add Job
          </button>
        </div>

        {companies.length === 0 && !loading && (
          <div className="alert alert-warning">Add at least one company before creating jobs.</div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}

        {showForm && (
          <form className="card pt-card p-3 mb-4" onSubmit={handleSubmit}>
            <div className="row g-2">
              <div className="col-md-6">
                <select name="companyId" className="form-select" value={form.companyId} onChange={handleChange} required>
                  <option value="">Select Company</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <input name="title" className="form-control" placeholder="Job Title" value={form.title} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <input name="location" className="form-control" placeholder="Location" value={form.location} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <select name="jobType" className="form-select" value={form.jobType} onChange={handleChange}>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                </select>
              </div>
              <div className="col-md-4">
                <input name="salary" className="form-control" placeholder="Salary" value={form.salary} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <input
                  type="number"
                  step="0.01"
                  name="minimumCgpa"
                  className="form-control"
                  placeholder="Minimum CGPA"
                  value={form.minimumCgpa}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <input
                  type="number"
                  name="graduationYear"
                  className="form-control"
                  placeholder="Graduation Year"
                  value={form.graduationYear}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <input type="date" name="deadline" className="form-control" value={form.deadline} onChange={handleChange} />
              </div>
              <div className="col-12">
                <textarea
                  name="description"
                  className="form-control"
                  placeholder="Description"
                  rows="2"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mt-3">
              <button type="submit" className="btn pt-btn-primary text-white me-2">
                {editingId ? 'Update' : 'Create'}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="text-muted">Loading...</div>
        ) : (
          <div className="table-responsive">
            <table className="table bg-white pt-card align-middle">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Deadline</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j.id}>
                    <td>{j.companyName}</td>
                    <td>{j.title}</td>
                    <td>{j.jobType?.replace('_', ' ')}</td>
                    <td>{j.deadline}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => openEdit(j)}>
                        Edit
                      </button>
                      {confirmDeleteId === j.id ? (
                        <>
                          <button className="btn btn-sm btn-danger me-1" onClick={() => handleDelete(j.id)}>
                            Confirm
                          </button>
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => setConfirmDeleteId(null)}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button className="btn btn-sm btn-outline-danger" onClick={() => setConfirmDeleteId(j.id)}>
                          Delete
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
