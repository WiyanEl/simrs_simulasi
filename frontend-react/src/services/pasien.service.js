import { useApi } from './api'

const api = useApi()

const pasienService = {
  getAll: async (query = '') => {
    return await api.get(`/pasien${query ? `?${query}` : ''}`)
  },

  getById: async (id) => {
    return await api.get(`/pasien/${id}`)
  },

  create: async (data) => {
    return await api.post('/pasien', data)
  },

  update: async (id, data) => {
    return await api.put(`/pasien/${id}`, data)
  },

  delete: async (id) => {
    return await api.delete(`/pasien/${id}`)
  },
}

export default pasienService
