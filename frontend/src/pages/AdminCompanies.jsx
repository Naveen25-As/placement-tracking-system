import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { adminGetCompanies, adminCreateCompany, adminUpdateCompany, adminDeleteCompany } from '../services/adminService.js'

const emptyForm = { name: '', description: '', website: '', location: '', industry: '', companySize: '' }

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const load = () => {
    setLoading(true)
    adminGetCompanies()
      .then(setCompanies)
      .catch(() => setError('Could not load companies.'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const openCreate = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
  }

  const openEdit = (company) => {
    setForm({ ...company })
    setEditingId(company.id)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editingId) {
        await adminUpdateCompany(editingId, form)
      } else {
        await adminCreateCompany(form)
      }
      setShowForm(false)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save company.')
    }
  }

  const handleDelete = async (id) => {
    try {
      await adminDeleteCompany(id)
      setConfirmDeleteId(null)
      load()
    } catch {
      setError('Could not delete company.')
    }
  }

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold mb-0">Manage Companies</h3>
          <button className="btn pt-btn-primary text-white" onClick={openCreate}>
            + Add Company
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {showForm && (
          <form className="card pt-card p-3 mb-4" onSubmit={handleSubmit}>
            <div className="row g-2">
              <div className="col-md-6">
                <input name="name" className="form-control" placeholder="Name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <input name="website" className="form-control" placeholder="Website" value={form.website} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <input name="industry" className="form-control" placeholder="Industry" value={form.industry} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <input name="location" className="form-control" placeholder="Location" value={form.location} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <input name="companySize" className="form-control" placeholder="Company Size" value={form.companySize} onChange={handleChange} />
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
                  <th>Name</th>
                  <th>Industry</th>
                  <th>Location</th>
                  <th>Size</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.industry}</td>
                    <td>{c.location}</td>
                    <td>{c.companySize}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => openEdit(c)}>
                        Edit
                      </button>
                      {confirmDeleteId === c.id ? (
                        <>
                          <button className="btn btn-sm btn-danger me-1" onClick={() => handleDelete(c.id)}>
                            Confirm
                          </button>
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => setConfirmDeleteId(null)}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button className="btn btn-sm btn-outline-danger" onClick={() => setConfirmDeleteId(c.id)}>
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
