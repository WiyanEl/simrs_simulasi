import { useApi } from './api'

const api = useApi()

const tindakanService = {
  getAll: async (query = '') => {
    return await api.get(`/tindakan${query ? `?${query}` : ''}`)
  },

  getById: async (id) => {
    return await api.get(`/tindakan/${id}`)
  },

  create: async (data) => {
    return await api.post('/tindakan', data)
  },

  update: async (id, data) => {
    return await api.put(`/tindakan/${id}`, data)
  },

  delete: async (id) => {
    return await api.delete(`/tindakan/${id}`)
  },
}

export default tindakanService
