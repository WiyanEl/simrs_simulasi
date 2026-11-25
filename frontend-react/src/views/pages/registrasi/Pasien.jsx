import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CFormInput,
  CFormSelect,
  CButton,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CBadge,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilPencil, cilTrash, cilArrowRight } from '@coreui/icons'

import PasienModal from '../../../components/pasien/PasienModal'

import usePasien from '../../../hooks/usePasien.js'

const Pasien = () => {
  const navigate = useNavigate()
  const { loading, getData, createData, getDataById, updateData, deteleData } = usePasien()

  const [pasien, setPasien] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedPasien, setSelectedPasien] = useState(null)

  const [filters, setFilters] = useState({
    search: '',
    jenis_kelamin: '',
    is_active: '',
  })

  const fetchData = async (params = filters) => {
    try {
      const data = await getData(params)

      setPasien(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Gagal mengambil data pasien:', error)

      setPasien([])
    }
  }

  useEffect(() => {
    fetchData({})
  }, [])

  const handleFilterChange = (e) => {
    const { name, value } = e.target

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSearch = (e) => {
    e.preventDefault()

    const params = {
      search: filters.search,
      jenis_kelamin: filters.jenis_kelamin,
      is_active: filters.is_active,
    }

    fetchData(params)
  }

  const handleReset = () => {
    const defaultFilters = {
      search: '',
      jenis_kelamin: '',
      is_active: '',
    }

    setFilters(defaultFilters)
    fetchData(defaultFilters)
  }

  const handleCreate = async (formData) => {
    try {
      setSaving(true)

      if (selectedPasien) {
        await updateData(selectedPasien.id, formData)
      } else {
        await createData(formData)
      }

      await fetchData()

      setModalVisible(false)

    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = async (id) => {
    try {
      const data = await getDataById(id)

      setSelectedPasien(data)
      setModalVisible(true)

    } catch (error) {
      console.error('Gagal mengambil detail pasien:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      const data = await deteleData(id)

      fetchData()
    } catch (error) {
      console.error('Gagal menghapus pasien:', error)
    }
  }

  const registrasiRuangan = (id) => {
    navigate(`/registrasi/registrasi-ruangan?pasien_id=${id}`)
  }

  return (
    <>
      <CCard>
        <CCardHeader>
          <strong>Daftar Pasien</strong>
        </CCardHeader>

        <CCardBody>
          <form onSubmit={handleSearch}>
            <CRow className="mb-3">
              <CCol md={4}>
                <CFormInput
                  label="Pencarian"
                  name="search"
                  placeholder="No. RM, NIK, Nama, atau No. HP ..."
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </CCol>

              <CCol md={3}>
                <CFormSelect
                  label="Jenis Kelamin"
                  name="jenis_kelamin"
                  value={filters.jenis_kelamin}
                  onChange={handleFilterChange}
                  options={[
                    { label: 'Semua Jenis Tindkan', value: '' },
                    { label: 'Laki-laki', value: 'L' },
                    { label: 'Perempuan', value: 'P' },
                  ]}
                />
              </CCol>

              <CCol md={2}>
                <CFormSelect
                  label="Status"
                  name="is_active"
                  value={filters.is_active}
                  onChange={handleFilterChange}
                  options={[
                    { label: 'Semua Status', value: '' },
                    { label: 'Aktif', value: '1' },
                    { label: 'Tidak Aktif', value: '0' },
                  ]}
                />
              </CCol>

              <CCol md={3} className="d-flex align-items-end gap-2">
                <CButton
                  type="submit"
                  color="primary"
                  disabled={loading}
                >
                  Cari
                </CButton>

                <CButton
                  type="button"
                  color="secondary"
                  variant="outline"
                  onClick={handleReset}
                >
                  Reset
                </CButton>
              </CCol>
            </CRow>
          </form>
          <CRow className="mb-3">
            <CCol>
              <CButton
                color="primary"
                onClick={() => {
                  setSelectedPasien(null)
                  setModalVisible(true)
                }}
              >
                <CIcon icon={cilPlus} /> Pasien Baru
              </CButton>
            </CCol>
          </CRow>
          <div className="table-responsive">
            <CTable hover bordered align="middle" responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>No</CTableHeaderCell>
                  <CTableHeaderCell>No. RM</CTableHeaderCell>
                  <CTableHeaderCell>NIK</CTableHeaderCell>
                  <CTableHeaderCell>Nama Pasien</CTableHeaderCell>
                  <CTableHeaderCell>Jenis Kelamin</CTableHeaderCell>
                  <CTableHeaderCell>Tanggal Lahir</CTableHeaderCell>
                  <CTableHeaderCell>No. HP</CTableHeaderCell>
                  <CTableHeaderCell>Alamat</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Aksi</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={10} className="text-center py-4">
                      <CSpinner size="sm" className="me-2" />
                      Memuat data pasien...
                    </CTableDataCell>
                  </CTableRow>
                ) : pasien.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={10} className="text-center py-4">
                      Tidak ada data pasien.
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  pasien.map((item, index) => (
                    <CTableRow key={item.id}>
                      <CTableDataCell>
                        {index + 1}
                      </CTableDataCell>

                      <CTableDataCell>
                        <CBadge color="primary">
                          {item.no_rm}
                        </CBadge>
                      </CTableDataCell>

                      <CTableDataCell>
                        {item.nik || '-'}
                      </CTableDataCell>

                      <CTableDataCell>
                        <strong>{item.nama}</strong>
                      </CTableDataCell>

                      <CTableDataCell>
                        <CBadge color={item.jenis_kelamin === 'L' ? 'info' : 'warning'}>
                          {item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </CBadge>
                      </CTableDataCell>

                      <CTableDataCell>
                        {item.tanggal_lahir
                          ? new Date(`${item.tanggal_lahir}T00:00:00`).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })
                          : '-'}
                      </CTableDataCell>

                      <CTableDataCell>
                        {item.no_hp || '-'}
                      </CTableDataCell>

                      <CTableDataCell>
                        {item.alamat || '-'}
                      </CTableDataCell>

                      <CTableDataCell>
                        <CBadge color={item.is_active ? 'success' : 'danger'}>
                          {item.is_active ? 'Aktif' : 'Tidak Aktif'}
                        </CBadge>
                      </CTableDataCell>

                      <CTableDataCell>
                        <div className="d-flex align-items-center gap-2">
                          <CButton
                            color="warning"
                            size="sm"
                            title="Ubah Pasien"
                            onClick={() => handleEdit(item.id)}
                          >
                            <CIcon icon={cilPencil} />
                          </CButton>

                          {item.is_active && (
                            <>
                              <CButton
                                color="danger"
                                size="sm"
                                title="Nonaktifkan Pasien"
                                onClick={() => handleDelete(item.id)}
                                >
                                  <CIcon icon={cilTrash} />
                                </CButton>

                                <CButton
                                  color="success"
                                  size="sm"
                                  title="Registrasi Pasien"
                                  onClick={() => registrasiRuangan(item.id)}
                                >
                                  <CIcon icon={cilArrowRight} />
                                </CButton>
                            </>
                          )}
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </div>

          <div className="text-body-secondary small">
            Total data: {pasien.length} pasien
          </div>

        </CCardBody>
      </CCard>

      <PasienModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
          setSelectedPasien(null)
        }}
        onSubmit={handleCreate}
        loading={saving}
        initialData={selectedPasien}
      />
    </>
  )
}

export default Pasien