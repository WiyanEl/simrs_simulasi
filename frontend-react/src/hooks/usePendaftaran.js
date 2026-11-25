import { useState } from 'react'

import { appHelper as H } from './../helper/appHelper'

import pendaftaranService from './../services/pendaftaran.service'

const usePendaftaran = () => {
  const [loading, setLoading] = useState(false)

  const getData = async (filter = {}) => {
    const params = new URLSearchParams()

    if (filter.search) {
      params.append('search', filter.search)
    }

    if (filter.tanggal_mulai) {
      params.append('tanggal_mulai', filter.tanggal_mulai)
    }

    if (filter.tanggal_selesai) {
      params.append('tanggal_selesai', filter.tanggal_selesai)
    }

    if (filter.ruangan_id) {
      params.append('ruangan_id', filter.ruangan_id)
    }

    if (filter.dokter_id) {
      params.append('dokter_id', filter.dokter_id)
    }

    if (filter.status) {
      params.append('status', filter.status)
    }

    params.append('limit', 10)

    const query = params.toString()

    setLoading(true)

    try {
      const response = await pendaftaranService.getAll(query)

      return response.data
    } catch (err) {
      console.error('Gagal mengambil data pendaftaran:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createData = async (formData) => {
    setLoading(true)

    try {
      const response = await pendaftaranService.create(formData)

      return response.data
    } catch (err) {
      console.error('Gagal simpan data pendaftaran:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getDataById = async (id) => {
    setLoading(true)

    try {
      const response = await pendaftaranService.getById(id)

      return response.data
    } catch (err) {
      console.error('Gagal ambil data pendaftaran:', err)
      throw err
    } finally {
      setLoading(false)
    }
  } 

  const updateData = async (id, formData) => {
    setLoading(true)

    try {
      const response = await pendaftaranService.update(id, formData)

      return response.data
    } catch (err) {
      console.error('Gagal simpan data pendaftaran:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const batalDaftar = async (id, formData) => {
    try {
      const response = await pendaftaranService.batal(id, formData)

      return response.data
    } catch (err) {
      console.error('Gagal hapus data pendaftaran:', err)
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
    batalDaftar
  }
}

export default usePendaftaran