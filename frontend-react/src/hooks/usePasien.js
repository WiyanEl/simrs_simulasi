import { useState } from 'react'

import { appHelper as H } from './../helper/appHelper'

import pasienService from './../services/pasien.service'

const usePasien = () => {
  const [loading, setLoading] = useState(false)

  const getData = async (filter = {}) => {
    const params = new URLSearchParams()

    if (filter.search) {
      params.append('search', filter.search)
    }

    if (filter.kategori) {
      params.append('kategori', filter.kategori)
    }

    const query = params.toString()

    setLoading(true)

    try {
      const response = await pasienService.getAll(query)

      return response.data
    } catch (err) {
      console.error('Gagal mengambil data pasien:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createData = async (formData) => {
    setLoading(true)

    try {
      const response = await pasienService.create(formData)

      return response.data
    } catch (err) {
      console.error('Gagal simpan data pasien:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getDataById = async (id) => {
    setLoading(true)

    try {
      const response = await pasienService.getById(id)

      return response.data
    } catch (err) {
      console.error('Gagal ambil data pasien:', err)
      throw err
    } finally {
      setLoading(false)
    }
  } 

  const updateData = async (id, formData) => {
    setLoading(true)

    try {
      const response = await pasienService.update(id, formData)

      return response.data
    } catch (err) {
      console.error('Gagal simpan data pasien:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deteleData = async (id) => {
    try {
      const response = await pasienService.delete(id)

      return response.data
    } catch (err) {
      console.error('Gagal hapus data pasien:', err)
      throw err
    } finally {

    }
  }

  return {
    loading,
    getData,
    createData,
    getDataById,
    updateData,
    deteleData
  }
}

export default usePasien