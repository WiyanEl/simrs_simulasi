import { useState } from 'react'

import { appHelper as H } from './../helper/appHelper'

import pegawaiService from './../services/pegawai.service'

const usePegawai = () => {
  const [loading, setLoading] = useState(false)

  const getData = async (filter = {}) => {
    const params = new URLSearchParams()

    if (filter.search) {
      params.append('search', filter.search)
    }

    if (filter.jenis_pegawai) {
      params.append('jenis_pegawai', filter.jenis_pegawai)
    }

    if (filter.is_active !== '' && filter.is_active !== undefined && filter.is_active !== null) {
      params.append('is_active', filter.is_active)
    }

    const query = params.toString()

    setLoading(true)

    try {
      const response = await pegawaiService.getAll(query)

      return response.data
    } catch (err) {
      console.error('Gagal mengambil data pegawai:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createData = async (formData) => {
    setLoading(true)

    try {
      const response = await pegawaiService.create(formData)

      return response.data
    } catch (err) {
      console.error('Gagal simpan data pegawai:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getDataById = async (id) => {
    setLoading(true)

    try {
      const response = await pegawaiService.getById(id)

      return response.data
    } catch (err) {
      console.error('Gagal ambil data pegawai:', err)
      throw err
    } finally {
      setLoading(false)
    }
  } 

  const updateData = async (id, formData) => {
    setLoading(true)

    try {
      const response = await pegawaiService.update(id, formData)

      return response.data
    } catch (err) {
      console.error('Gagal simpan data pegawai:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deteleData = async (id) => {
    try {
      const response = await pegawaiService.delete(id)

      return response.data
    } catch (err) {
      console.error('Gagal hapus data pegawai:', err)
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

export default usePegawai