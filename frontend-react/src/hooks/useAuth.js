import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { appHelper as H } from './../helper/appHelper'

import authService from '../services/auth.service'

const useAuth = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const login = async (credentials) => {
    if (credentials.username == '') {
      H.showToast('warning', 'Username wajib diisi!')
      return
    }

    if (credentials.password == '') {
      H.showToast('warning', 'Password wajib diisi!')
      return
    }

    setLoading(true)

    try {
      const response = await authService.login(credentials)

      const data = response.data ?? response

      const token =
        data.access_token ??
        data.token ??
        data.accessToken

      const user = data.user ?? null

      if (!token) {
        throw new Error('Token autentikasi tidak ditemukan.')
      }

      H.storage.set('access_token', token)

      if (user) {
        H.storage.set('auth_user', JSON.stringify(user))
      }

      return {
        success: true,
        user,
        data,
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await authService.logout()

    H.storage.remove('access_token')
    H.storage.remove('auth_user')

    navigate('/login', { replace: true })
  }

  return {
    login,
    logout,
    loading,
  }
}

export default useAuth
