import { useApi } from './api'

const api = useApi()

const obatService = {
  getAll: async (query = '') => {
    return await api.get(`/obat${query ? `?${query}` : ''}`)
  },

  getById: async (id) => {
    return await api.get(`/obat/${id}`)
  },

  create: async (data) => {
    return await api.post('/obat', data)
  },

  update: async (id, data) => {
    return await api.put(`/obat/${id}`, data)
  },

  delete: async (id) => {
    return await api.delete(`/obat/${id}`)
  }
}

export default obatService
