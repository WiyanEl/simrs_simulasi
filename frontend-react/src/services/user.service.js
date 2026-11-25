import { useApi } from './api'

const api = useApi()

const userService = {
  getAll: async (query = '') => {
    return await api.get(`/user${query ? `?${query}` : ''}`)
  },

  getById: async (id) => {
    return await api.get(`/user/${id}`)
  },

  create: async (data) => {
    return await api.post('/user', data)
  },

  update: async (id, data) => {
    return await api.put(`/user/${id}`, data)
  },

  delete: async (id) => {
    return await api.delete(`/user/${id}`)
  },

  getReferencesRole: async (id) => {
    return await api.get(`/role/references`)
  },

  getReferencesPegawai: async (id) => {
    return await api.get(`/pegawai/references-all`)
  },
}

export default userService
