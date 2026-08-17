import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { searchCompanies } from '../services/companyService.js'

export default function Companies() {
  const [companies, setCompanies] = useState([])
  const [filters, setFilters] = useState({ search: '', industry: '', location: '', companySize: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = (params = {}) => {
    setLoading(true)
    setError('')
    searchCompanies(params)
      .then(setCompanies)
      .catch(() => setError('Could not load companies.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value })

  const handleSearch = (e) => {
    e.preventDefault()
    const params = {}
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params[k] = v
    })
    load(params)
  }

  const industries = [...new Set(companies.map((c) => c.industry).filter(Boolean))]
  const locations = [...new Set(companies.map((c) => c.location).filter(Boolean))]

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h3 className="fw-bold mb-3">Companies</h3>

        <form className="row g-2 mb-4" onSubmit={handleSearch}>
          <div className="col-md-4">
            <input
              name="search"
              className="form-control"
              placeholder="Search by name..."
              value={filters.search}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <select name="industry" className="form-select" value={filters.industry} onChange={handleChange}>
              <option value="">All Industries</option>
              {industries.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <select name="location" className="form-select" value={filters.location} onChange={handleChange}>
              <option value="">All Locations</option>
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn pt-btn-primary text-white w-100">
              Search
            </button>
          </div>
        </form>

        {error && <div className="alert alert-danger">{error}</div>}
        {loading ? (
          <div className="text-muted">Loading companies...</div>
        ) : companies.length === 0 ? (
          <div className="alert alert-secondary">No companies match your filters.</div>
        ) : (
          <div className="row g-3">
            {companies.map((c) => (
              <div className="col-md-4" key={c.id}>
                <div className="card pt-card p-3 h-100">
                  <h5 className="fw-bold">{c.name}</h5>
                  <div className="text-muted small mb-2">
                    {c.industry} {c.location && `· ${c.location}`}
                  </div>
                  <p className="small flex-grow-1">{c.description}</p>
                  {c.website && (
                    <a href={c.website} target="_blank" rel="noreferrer" className="small">
                      Visit website →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
