import { useState } from 'react'

import { appHelper as H } from './../helper/appHelper'

import obatService from '../services/obat.service'

const useObat = () => {
  const [loading, setLoading] = useState(false)

  const getData = async (filter = {}) => {
    const params = new URLSearchParams()

    if (filter.search) {
      params.append('search', filter.search)
    }

    if (filter.status_stok) {
      params.append('status_stok', filter.status_stok)
    }

    if (filter.is_active !== '' && filter.is_active !== undefined && filter.is_active !== null) {
      params.append('is_active', filter.is_active)
    }

    const query = params.toString()

    setLoading(true)

    try {
      const response = await obatService.getAll(query)

      return response.data
    } catch (err) {
      console.error('Gagal mengambil data obat:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createData = async (formData) => {
    setLoading(true)

    try {
      const response = await obatService.create(formData)

      return response.data
    } catch (err) {
      console.error('Gagal simpan data obat:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getDataById = async (id) => {
    setLoading(true)

    try {
      const response = await obatService.getById(id)

      return response.data
    } catch (err) {
      console.error('Gagal ambil data obat:', err)
      throw err
    } finally {
      setLoading(false)
    }
  } 

  const updateData = async (id, formData) => {
    setLoading(true)

    try {
      const response = await obatService.update(id, formData)

      return response.data
    } catch (err) {
      console.error('Gagal simpan data obat:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deteleData = async (id) => {
    try {
      const response = await obatService.delete(id)

      return response.data
    } catch (err) {
      console.error('Gagal hapus data obat:', err)
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

export default useObat