import { useState } from 'react'

import { appHelper as H } from './../helper/appHelper'

import tindakanService from './../services/tindakan.service'

const useTindakan = () => {
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
      const response = await tindakanService.getAll(query)

      return response.data
    } catch (err) {
      console.error('Gagal mengambil data tindakan:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createData = async (formData) => {
    setLoading(true)

    try {
      const response = await tindakanService.create(formData)

      return response.data
    } catch (err) {
      console.error('Gagal simpan data tindakan:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getDataById = async (id) => {
    setLoading(true)

    try {
      const response = await tindakanService.getById(id)

      return response.data
    } catch (err) {
      console.error('Gagal ambil data tindakan:', err)
      throw err
    } finally {
      setLoading(false)
    }
  } 

  const updateData = async (id, formData) => {
    setLoading(true)

    try {
      const response = await tindakanService.update(id, formData)

      return response.data
    } catch (err) {
      console.error('Gagal simpan data tindakan:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deteleData = async (id) => {
    try {
      const response = await tindakanService.delete(id)

      return response.data
    } catch (err) {
      console.error('Gagal hapus data tindakan:', err)
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

export default useTindakan