
import axios from 'axios'

import { appHelper as H } from './../helper/appHelper'

const baseUrl = import.meta.env.VITE_API_BASE_URL

let api

export const createApi = () => {
  api = axios.create({
    baseURL: baseUrl,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token')

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    },
    (error) => Promise.reject(error),
  )

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const url = error.config?.url || ''
      const status = error.response?.status
      const data = error.response?.data

      if (status === 422) {
        const response = error.response.data

        if (response.message) {
          H.showToast('error', response.message)
        }

        const errors = response.errors
        const firstError = Object.values(errors).flat()[0]

        H.showToast('error', firstError || response.message)
      } else if (status === 401) {
        if (url.includes('auth/login')) {
          H.showToast('error', error.response.data.message)
        } else {
          localStorage.removeItem('access_token')
          localStorage.removeItem('auth_user')

          window.location.hash = '#/login'
        }
      } else if (status === 403) {
        H.showToast('error', error.response.data.message)
      } else if (status === 404) {
        H.showToast('error', error.response.data.message)
      } else if (status === 409) {
        H.showToast('error', error.response.data.message)
      } else if (status >= 500) {
        H.showToast('error', error.response.data.message)
      }

      return Promise.reject(error)
    },
  )

  return api
}

const apiInstance = createApi()

export const useApi = () => {
  return {
    get: (url, params) =>
      apiInstance.get(url, { params }).then(handleAllResponse),

    post: (url, data, onUploadProgress) =>
      apiInstance
        .post(url, data, { onUploadProgress })
        .then(handleAllResponse),

    put: (url, data, onUploadProgress) =>
      apiInstance
        .put(url, data, { onUploadProgress })
        .then(handleAllResponse),

    delete: (url, data) =>
      apiInstance
        .delete(url, { data })
        .then(handleAllResponse),
  }
}

// Response Handler
const handleAllResponse = (response, skipMessage = false) => {
  const responseMessage = response.data?.message || 'Sukses'
  const responseCode = response.status || 200

  if (responseCode >= 200 && responseCode < 300) {
    H.showToast('success', responseMessage)
  }

  return response.data
}

export default apiInstance
