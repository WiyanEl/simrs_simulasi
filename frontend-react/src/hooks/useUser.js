import { useState } from 'react'

import { appHelper as H } from './../helper/appHelper'

import userService from './../services/user.service'

const useUser = () => {
  const [loading, setLoading] = useState(false)

  const getDataReferences = async () => {
    setLoading(true)

    try {
      const responseRole = await userService.getReferencesRole()
      const responsePegawai = await userService.getReferencesPegawai()

      return {
        role: responseRole.data,
        pegawai: responsePegawai.data,
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

    if (filter.role_id) {
      params.append('role_id', filter.role_id)
    }

    const query = params.toString()

    setLoading(true)

    try {
      const response = await userService.getAll(query)

      return response.data
    } catch (err) {
      console.error('Gagal mengambil data pengguna:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createData = async (formData) => {
    setLoading(true)

    try {
      const response = await userService.create(formData)

      return response.data
    } catch (err) {
      console.error('Gagal simpan data pengguna:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getDataById = async (id) => {
    setLoading(true)

    try {
      const response = await userService.getById(id)

      return response.data
    } catch (err) {
      console.error('Gagal ambil data pengguna:', err)
      throw err
    } finally {
      setLoading(false)
    }
  } 

  const updateData = async (id, formData) => {
    setLoading(true)

    try {
      const response = await userService.update(id, formData)

      return response.data
    } catch (err) {
      console.error('Gagal simpan data pengguna:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deteleData = async (id) => {
    try {
      const response = await userService.delete(id)

      return response.data
    } catch (err) {
      console.error('Gagal hapus data pengguna:', err)
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
    deteleData,
    getDataReferences
  }
}

export default useUser