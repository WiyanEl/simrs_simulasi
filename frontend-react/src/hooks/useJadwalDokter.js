import { useState } from 'react'

import { appHelper as H } from './../helper/appHelper'

import jadwalDokterService from '../services/jadwal-dokter.service'

const useJadwalDokter = () => {
  const [loading, setLoading] = useState(false)

  const getDataReferences = async () => {
    setLoading(true)

    try {
      const responsePegawai = await jadwalDokterService.getReferencesPegawai()
      const responseRuangan = await jadwalDokterService.getReferencesRuangan()

      return {
        pegawai: responsePegawai.data,
        ruangan: responseRuangan.data
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

    if (filter.dokter_id) {
      params.append('dokter_id', filter.dokter_id)
    }

    if (filter.ruangan_id) {
      params.append('ruangan_id', filter.ruangan_id)
    }

    if (filter.hari) {
      params.append('hari', filter.hari)
    }

    if (filter.is_active !== '' && filter.is_active !== undefined && filter.is_active !== null) {
      params.append('is_active', filter.is_active)
    }

    const query = params.toString()

    setLoading(true)

    try {
      const response = await jadwalDokterService.getAll(query)

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
      const response = await jadwalDokterService.create(formData)

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
      const response = await jadwalDokterService.getById(id)

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
      const response = await jadwalDokterService.update(id, formData)

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
      const response = await jadwalDokterService.delete(id)

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

export default useJadwalDokter