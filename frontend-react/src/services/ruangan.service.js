import { useApi } from './api'

const api = useApi()

const ruanganService = {
  getAll: async (query = '') => {
    return await api.get(`/ruangan${query ? `?${query}` : ''}`)
  },

  getById: async (id) => {
    return await api.get(`/ruangan/${id}`)
  },

  create: async (data) => {
    return await api.post('/ruangan', data)
  },

  update: async (id, data) => {
    return await api.put(`/ruangan/${id}`, data)
  },

  delete: async (id) => {
    return await api.delete(`/ruangan/${id}`)
  },
}

export default ruanganService
