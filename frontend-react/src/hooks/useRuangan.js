import { useState } from 'react'

import { appHelper as H } from './../helper/appHelper'

import ruanganService from './../services/ruangan.service'

const useRuangan = () => {
  const [loading, setLoading] = useState(false)

  const getData = async (filter = {}) => {
    const params = new URLSearchParams()

    if (filter.search) {
      params.append('search', filter.search)
    }

    if (filter.jenis_ruangan) {
      params.append('jenis_ruangan', filter.jenis_ruangan)
    }

    const query = params.toString()

    setLoading(true)

    try {
      const response = await ruanganService.getAll(query)

      return response.data
    } catch (err) {
      console.error('Gagal mengambil data ruangan:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createData = async (formData) => {
    setLoading(true)

    try {
      const response = await ruanganService.create(formData)

      return response.data
    } catch (err) {
      console.error('Gagal simpan data ruangan:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getDataById = async (id) => {
    setLoading(true)

    try {
      const response = await ruanganService.getById(id)

      return response.data
    } catch (err) {
      console.error('Gagal ambil data ruangan:', err)
      throw err
    } finally {
      setLoading(false)
    }
  } 

  const updateData = async (id, formData) => {
    setLoading(true)

    try {
      const response = await ruanganService.update(id, formData)

      return response.data
    } catch (err) {
      console.error('Gagal simpan data ruangan:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deteleData = async (id) => {
    try {
      const response = await ruanganService.delete(id)

      return response.data
    } catch (err) {
      console.error('Gagal hapus data ruangan:', err)
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

export default useRuangan