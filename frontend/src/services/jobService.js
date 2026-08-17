import api from './api'

export const getJobs = () => api.get('/jobs').then((res) => res.data)

export const getJob = (id) => api.get(`/jobs/${id}`).then((res) => res.data)
