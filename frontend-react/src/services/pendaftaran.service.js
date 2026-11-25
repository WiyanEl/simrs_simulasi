import { useApi } from './api'

const api = useApi()

const pendaftaranService = {
  getAll: async (query = '') => {
    return await api.get(`/pendaftaran${query ? `?${query}` : ''}`)
  },

  getById: async (id) => {
    return await api.get(`/pendaftaran/${id}`)
  },

  create: async (data) => {
    return await api.post('/pendaftaran', data)
  },

  update: async (id, data) => {
    return await api.put(`/pendaftaran/${id}`, data)
  },

  batal: async (id, data) => {
    return await api.post(`/pendaftaran/${id}/batal`, data)
  },
}

export default pendaftaranService
