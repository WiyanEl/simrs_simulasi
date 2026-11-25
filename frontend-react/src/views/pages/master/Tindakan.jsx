import React, { useState, useEffect } from 'react'

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
import { cilPlus, cilPencil, cilTrash } from '@coreui/icons'

import TindakanModal from '../../../components/tindakan/TindakanModal'

import useTindakan from '../../../hooks/useTindakan.js'

const Tindakan = () => {
  const { loading, getData, createData, getDataById, updateData, deteleData } = useTindakan()

  const [tindakan, setTindakan] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedTindakan, setSelectedTindakan] = useState(null)

  const [filters, setFilters] = useState({
    search: '',
    kategori: '',
    is_active: '',
  })

  const fetchData = async (params = filters) => {
    try {
      const data = await getData(params)

      setTindakan(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Gagal mengambil data tindakan:', error)

      setTindakan([])
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
      kategori: filters.kategori,
      is_active: filters.is_active,
    }

    fetchData(params)
  }

  const handleReset = () => {
    const defaultFilters = {
      search: '',
      kategori: '',
      is_active: '',
    }

    setFilters(defaultFilters)
    fetchData(defaultFilters)
  }

  const handleCreate = async (formData) => {
    try {
      setSaving(true)

      if (selectedTindakan) {
        await updateData(selectedTindakan.id, formData)
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

      setSelectedTindakan(data)
      setModalVisible(true)

    } catch (error) {
      console.error('Gagal mengambil detail tindakan:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      const data = await deteleData(id)

      fetchData()
    } catch (error) {
      console.error('Gagal menghapus tindakan:', error)
    }
  }

  return (
    <>
      <CCard>
        <CCardHeader>
          <strong>Master Data Tindakan</strong>
        </CCardHeader>

        <CCardBody>
          <form onSubmit={handleSearch}>
            <CRow className="mb-3">
              <CCol md={3}>
                <CFormInput
                  label="Pencarian"
                  name="search"
                  placeholder="Nama atau kode tindakan"
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </CCol>

              <CCol md={3}>
                <CFormSelect
                  label="Kategori"
                  name="kategori"
                  value={filters.kategori}
                  onChange={handleFilterChange}
                  options={[
                    { label: 'Semua Jenis Tindkan', value: '' },
                    { label: 'Konsultasi', value: 'KONSULTASI' },
                    { label: 'Pemeriksaan', value: 'PEMERIKSAAN' },
                    { label: 'Laboratorium', value: 'LABORATORIUM' },
                    { label: 'Radiologi', value: 'RADIOLOGI' },
                    { label: 'Tindakan Medis', value: 'TINDAKAN_MEDIS' },
                    { label: 'Operasi', value: 'OPERASI' },
                    { label: 'Lainnya', value: 'LAINNYA' }
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
                  setSelectedTindakan(null)
                  setModalVisible(true)
                }}
              >
                <CIcon icon={cilPlus} /> Tambah
              </CButton>
            </CCol>
          </CRow>
          <div className="table-responsive">
            <CTable hover bordered align="middle" responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>No</CTableHeaderCell>
                  <CTableHeaderCell>Kode Tindakan</CTableHeaderCell>
                  <CTableHeaderCell>Nama Tindakan</CTableHeaderCell>
                  <CTableHeaderCell>Kategori</CTableHeaderCell>
                  <CTableHeaderCell>Deskripsi</CTableHeaderCell>
                  <CTableHeaderCell>Tarif</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Aksi</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={8} className="text-center py-4">
                      <CSpinner size="sm" className="me-2" />
                      Memuat data tindakan...
                    </CTableDataCell>
                  </CTableRow>
                ) : tindakan.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={8} className="text-center py-4">
                      Tidak ada data tindakan.
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  tindakan.map((item, index) => (
                    <CTableRow key={item.id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>

                      <CTableDataCell>
                        {item.kode}
                      </CTableDataCell>

                      <CTableDataCell>
                        <strong>{item.nama}</strong>
                      </CTableDataCell>

                      <CTableDataCell>
                        <CBadge color="info">
                          {item.kategori}
                        </CBadge>
                      </CTableDataCell>

                      <CTableDataCell>
                        {item.deskripsi || '-'}
                      </CTableDataCell>

                      <CTableDataCell>
                        {Number(item.tarif).toLocaleString('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                        })}
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
                            title="Ubah Tindakan"
                            onClick={() => handleEdit(item.id)}
                          >
                            <CIcon icon={cilPencil} />
                          </CButton>

                          {item.is_active && (
                            <CButton
                              color="danger"
                              size="sm"
                              title="Hapus Tindakan"
                              onClick={() => handleDelete(item.id)}
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>
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
            Total data: {tindakan.length} tindakan
          </div>
        </CCardBody>
      </CCard>

      <TindakanModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
          setSelectedTindakan(null)
        }}
        onSubmit={handleCreate}
        loading={saving}
        initialData={selectedTindakan}
      />
    </>
  )
}

export default Tindakan