import { useState } from 'react'

import { appHelper as H } from './../helper/appHelper'

import dokterService from '../services/dokter.service'

const useDokter = () => {
  const [loading, setLoading] = useState(false)

  const getDataReferences = async () => {
    setLoading(true)

    try {
      const response = await dokterService.getReferencesPegawai()

      return {
        pegawai: response.data
      }
    } catch (err) {
      
    } finally {
      setLoading(false)
    }
  }

  const getData = async (filter = {}) => {
    const params = new URLSearchParams()

    if (filter.search) {
      params.append('search', filter.search)
    }

    if (filter.spesialisasi) {
      params.append('spesialisasi', filter.spesialisasi)
    }

    if (filter.is_active !== '' && filter.is_active !== undefined && filter.is_active !== null) {
      params.append('is_active', filter.is_active)
    }

    const query = params.toString()

    setLoading(true)

    try {
      const response = await dokterService.getAll(query)

      return response.data
    } catch (err) {
      console.error('Gagal mengambil data dokter:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createData = async (formData) => {
    setLoading(true)

    try {
      const response = await dokterService.create(formData)

      return response.data
    } catch (err) {
      console.error('Gagal simpan data dokter:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getDataById = async (id) => {
    setLoading(true)

    try {
      const response = await dokterService.getById(id)

      return response.data
    } catch (err) {
      console.error('Gagal ambil data dokter:', err)
      throw err
    } finally {
      setLoading(false)
    }
  } 

  const updateData = async (id, formData) => {
    setLoading(true)

    try {
      const response = await dokterService.update(id, formData)

      return response.data
    } catch (err) {
      console.error('Gagal simpan data dokter:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deteleData = async (id) => {
    try {
      const response = await dokterService.delete(id)

      return response.data
    } catch (err) {
      console.error('Gagal hapus data dokter:', err)
      throw err
    } finally {

    }
  }

  return {
    loading,
    getData,
    getDataReferences,
    createData,
    getDataById,
    updateData,
    deteleData
  }
}

export default useDokter