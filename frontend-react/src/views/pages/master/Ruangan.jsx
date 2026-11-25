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

import RuanganModal from '../../../components/ruangan/RuanganModal'

import useRuangan from '../../../hooks/useRuangan.js'

const Ruangan = () => {
  const { loading, getData, createData, getDataById, updateData, deteleData } = useRuangan()

  const [ruangan, setRuangan] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedRuangan, setSelectedRuangan] = useState(null)

  const [filters, setFilters] = useState({
    search: '',
    jenis_ruangan: '',
  })

  const fetchData = async (params = filters) => {
    try {
      const data = await getData(params)

      setRuangan(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Gagal mengambil data ruangan:', error)

      setRuangan([])
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
      jenis_ruangan: filters.jenis_ruangan,
    }

    fetchData(params)
  }

  const handleReset = () => {
    const defaultFilters = {
      search: '',
      jenis_ruangan: ''
    }

    setFilters(defaultFilters)
    fetchData(defaultFilters)
  }

  const handleCreate = async (formData) => {
    try {
      setSaving(true)

      if (selectedRuangan) {
        await updateData(selectedRuangan.id, formData)
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

      setSelectedRuangan(data)
      setModalVisible(true)

    } catch (error) {
      console.error('Gagal mengambil detail ruangan:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      const data = await deteleData(id)

      fetchData()
    } catch (error) {
      console.error('Gagal menghapus ruangan:', error)
    }
  }

  return (
    <>
      <CCard>
        <CCardHeader>
          <strong>Master Data Ruangan</strong>
        </CCardHeader>

        <CCardBody>
          <form onSubmit={handleSearch}>
            <CRow className="mb-3">
              <CCol md={4}>
                <CFormInput
                  label="Pencarian"
                  name="search"
                  placeholder="Nama atau kode ruangan"
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </CCol>

              <CCol md={3}>
                <CFormSelect
                  label="Jenis Ruangan"
                  name="jenis_ruangan"
                  value={filters.jenis_ruangan}
                  onChange={handleFilterChange}
                  options={[
                    { label: 'Semua Jenis Ruangan', value: '' },
                    { label: 'Rawat Jalan', value: 'RAWAT_JALAN' },
                    { label: 'Gawat Darurat', value: 'GAWAT_DARURAT' },
                    { label: 'Penunjang', value: 'PENUNJANG' },
                    { label: 'Lainnya', value: 'LAINNYA' }
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
                  setSelectedRuangan(null)
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
                  <CTableHeaderCell>Kode Ruangan</CTableHeaderCell>
                  <CTableHeaderCell>Nama Ruangan</CTableHeaderCell>
                  <CTableHeaderCell>Jenis Ruangan</CTableHeaderCell>
                  <CTableHeaderCell>Lokasi</CTableHeaderCell>
                  <CTableHeaderCell>Keterangan</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Aksi</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={8} className="text-center py-4">
                      <CSpinner size="sm" className="me-2" />
                      Memuat data ruangan...
                    </CTableDataCell>
                  </CTableRow>
                ) : ruangan.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={8} className="text-center py-4">
                      Tidak ada data ruangan.
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  ruangan.map((item, index) => (
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
                          {item.jenis_ruangan}
                        </CBadge>
                      </CTableDataCell>

                      <CTableDataCell>
                        {item.lokasi || '-'}
                      </CTableDataCell>

                      <CTableDataCell>
                        {item.keterangan || '-'}
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
                            title="Ubah Ruangan"
                            onClick={() => handleEdit(item.id)}
                          >
                            <CIcon icon={cilPencil} />
                          </CButton>

                          {item.is_active && (
                            <CButton
                              color="danger"
                              size="sm"
                              title="Hapus Ruangan"
                              onClick={() => handleDelete(item.id)}
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>
                          ) }
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </div>

          <div className="text-body-secondary small">
            Total data: {ruangan.length} ruangan
          </div>

        </CCardBody>
      </CCard>

      <RuanganModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
          setSelectedRuangan(null)
        }}
        onSubmit={handleCreate}
        loading={saving}
        initialData={selectedRuangan}
      />
    </>
  )
}

export default Ruangan