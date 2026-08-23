import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { getMyProfile, updateMyProfile } from '../services/profileService.js'

const emptyForm = {
  name: '',
  phone: '',
  college: '',
  degree: '',
  branch: '',
  semester: '',
  cgpa: '',
  graduationYear: '',
  bio: '',
  githubUrl: '',
  linkedinUrl: '',
  portfolioUrl: '',
}

export default function Profile() {
  const [form, setForm] = useState(emptyForm)
  const [completion, setCompletion] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    getMyProfile()
      .then((data) => {
        setForm({
          name: data.name || '',
          phone: data.phone || '',
          college: data.college || '',
          degree: data.degree || '',
          branch: data.branch || '',
          semester: data.semester ?? '',
          cgpa: data.cgpa ?? '',
          graduationYear: data.graduationYear ?? '',
          bio: data.bio || '',
          githubUrl: data.githubUrl || '',
          linkedinUrl: data.linkedinUrl || '',
          portfolioUrl: data.portfolioUrl || '',
        })
        setCompletion(data.profileCompletionPercentage)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    setFieldErrors({})
    setSaving(true)
    try {
      const payload = {
        ...form,
        semester: form.semester === '' ? null : Number(form.semester),
        cgpa: form.cgpa === '' ? null : Number(form.cgpa),
        graduationYear: form.graduationYear === '' ? null : Number(form.graduationYear),
      }
      const updated = await updateMyProfile(payload)
      setCompletion(updated.profileCompletionPercentage)
      setMessage({ type: 'success', text: 'Profile updated successfully.' })
    } catch (err) {
      if (err.response?.data?.validationErrors) {
        setFieldErrors(err.response.data.validationErrors)
      }
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Could not update profile.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container py-5 text-center text-muted">Loading profile...</div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container py-4" style={{ maxWidth: 760 }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold mb-0">My Profile</h3>
          <span className="badge pt-btn-primary text-white">{completion}% complete</span>
        </div>

        {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

        <form onSubmit={handleSubmit} className="card pt-card p-4">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input name="name" className="form-control" value={form.name} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input name="phone" className="form-control" value={form.phone} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">College</label>
              <input name="college" className="form-control" value={form.college} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Degree</label>
              <input name="degree" className="form-control" value={form.degree} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Branch</label>
              <input name="branch" className="form-control" value={form.branch} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Semester</label>
              <input
                type="number"
                name="semester"
                className="form-control"
                value={form.semester}
                onChange={handleChange}
                min="1"
                max="12"
              />
              {fieldErrors.semester && <div className="text-danger small">{fieldErrors.semester}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label">CGPA</label>
              <input
                type="number"
                step="0.01"
                name="cgpa"
                className="form-control"
                value={form.cgpa}
                onChange={handleChange}
                min="0"
                max="10"
              />
              {fieldErrors.cgpa && <div className="text-danger small">{fieldErrors.cgpa}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label">Graduation Year</label>
              <input
                type="number"
                name="graduationYear"
                className="form-control"
                value={form.graduationYear}
                onChange={handleChange}
              />
            </div>
            <div className="col-12">
              <label className="form-label">Bio</label>
              <textarea name="bio" className="form-control" rows="3" value={form.bio} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">GitHub URL</label>
              <input name="githubUrl" className="form-control" value={form.githubUrl} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">LinkedIn URL</label>
              <input name="linkedinUrl" className="form-control" value={form.linkedinUrl} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Portfolio URL</label>
              <input name="portfolioUrl" className="form-control" value={form.portfolioUrl} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="btn pt-btn-primary text-white mt-4" disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>

        <div className="alert alert-info mt-4 mb-0">
          Skills, Projects and Certifications management arrive in a later phase and will factor into
          your profile completion percentage once added.
        </div>
      </div>
    </>
  )
}
