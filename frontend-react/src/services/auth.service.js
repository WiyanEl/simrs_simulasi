
import { useApi } from './api'

const api = useApi()

const authService = {
  login: async (credentials) => {
    return await api.post('/auth/login', credentials)
  },

  logout: async () => {
    return await api.post('/auth/logout', {})
  },

  getProfile: async () => {
    return await api.get('/auth/me')
  },
}

export default authService
