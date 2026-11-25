import { useApi } from './api'

const api = useApi()

const dokterService = {
  getAll: async (query = '') => {
    return await api.get(`/dokter${query ? `?${query}` : ''}`)
  },

  getById: async (id) => {
    return await api.get(`/dokter/${id}`)
  },

  create: async (data) => {
    return await api.post('/dokter', data)
  },

  update: async (id, data) => {
    return await api.put(`/dokter/${id}`, data)
  },

  delete: async (id) => {
    return await api.delete(`/dokter/${id}`)
  },

  getReferencesPegawai: async () => {
    return await api.get(`/pegawai/references`)
  }
}

export default dokterService
