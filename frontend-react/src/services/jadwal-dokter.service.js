import { useApi } from './api'

const api = useApi()

const jadwalDokterService = {
  getAll: async (query = '') => {
    return await api.get(`/jadwal-dokter${query ? `?${query}` : ''}`)
  },

  getById: async (id) => {
    return await api.get(`/jadwal-dokter/${id}`)
  },

  create: async (data) => {
    return await api.post('/jadwal-dokter', data)
  },

  update: async (id, data) => {
    return await api.put(`/jadwal-dokter/${id}`, data)
  },

  delete: async (id) => {
    return await api.delete(`/jadwal-dokter/${id}`)
  },

  getReferencesPegawai: async () => {
    return await api.get(`/dokter/references`)
  },

  getReferencesRuangan: async () => {
    return await api.get(`/ruangan/references`)
  }
}

export default jadwalDokterService
