import api from './api'

export const getMyApplications = () => api.get('/applications').then((res) => res.data)

export const getMyApplicationStats = () => api.get('/applications/stats').then((res) => res.data)

export const applyToJob = (jobId, notes) =>
  api.post('/applications', { jobId, notes }).then((res) => res.data)

export const updateApplicationStatus = (id, status, notes) =>
  api.put(`/applications/${id}/status`, { status, notes }).then((res) => res.data)
