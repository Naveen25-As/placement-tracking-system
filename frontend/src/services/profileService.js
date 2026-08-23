import api from './api'

export const getMyProfile = () => api.get('/profile').then((res) => res.data)

export const updateMyProfile = (payload) => api.put('/profile', payload).then((res) => res.data)
