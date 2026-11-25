import { useApi } from './api'

const api = useApi()

const pegawaiService = {
  getAll: async (query = '') => {
    return await api.get(`/pegawai${query ? `?${query}` : ''}`)
  },

  getById: async (id) => {
    return await api.get(`/pegawai/${id}`)
  },

  create: async (data) => {
    return await api.post('/pegawai', data)
  },

  update: async (id, data) => {
    return await api.put(`/pegawai/${id}`, data)
  },

  delete: async (id) => {
    return await api.delete(`/pegawai/${id}`)
  },
}

export default pegawaiService
