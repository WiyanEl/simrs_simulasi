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

import ObatModal from '../../../components/obat/ObatModal'

import useObat from '../../../hooks/useObat.js'

const Obat = () => {
  const { loading, getData, createData, getDataById, updateData, deteleData } = useObat()
  const [obat, setObat] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedObat, setSelectedObat] = useState(null)

  const [filters, setFilters] = useState({
    search: '',
    status_stok: '',
    is_active: '',
  })

  useEffect(() => {
    fetchData({})
  }, [])

  const fetchData = async (params = filters) => {
    try {
      const data = await getData(params)

      setObat(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Gagal mengambil data obat:', error)

      setObat([])
    }
  }

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
      status_stok: filters.status_stok,
      is_active: filters.is_active,
    }

    fetchData(params)
  }

  const handleReset = () => {
    const defaultFilters = {
      search: '',
      status_stok: '',
      is_active: '',
    }

    setFilters(defaultFilters)
    fetchData(defaultFilters)
  }

  const handleCreate = async (formData) => {
    try {
      setSaving(true)

      if (selectedObat) {
        await updateData(selectedObat.id, formData)
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

      setSelectedObat(data)
      setModalVisible(true)

    } catch (error) {
      console.error('Gagal mengambil detail obat:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      const data = await deteleData(id)

      fetchData()
    } catch (error) {
      console.error('Gagal menghapus obat:', error)
    }
  }

  return (
    <>
      <CCard>
        <CCardHeader>
          <strong>Master Data Obat</strong>
        </CCardHeader>

        <CCardBody>
          <form onSubmit={handleSearch}>
            <CRow className="mb-3">
              <CCol md={3}>
                <CFormInput
                  label="Pencarian"
                  name="search"
                  placeholder="Kode Obat, Nama Obat, atau Satuan Obat ..."
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </CCol>

              <CCol md={2}>
                <CFormSelect
                  label="Status Stok"
                  name="status_stok"
                  value={filters.status_stok}
                  onChange={handleFilterChange}
                  options={[
                    { label: 'Semua Status', value: '' },
                    { label: 'Habis', value: 'habis' },
                    { label: 'Menipis', value: 'menipis' },
                    { label: 'Tersedia', value: 'tersedia' }
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
                  setSelectedObat(null)
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
                  <CTableHeaderCell>Kode Obat</CTableHeaderCell>
                  <CTableHeaderCell>Nama Obat</CTableHeaderCell>
                  <CTableHeaderCell>Satuan</CTableHeaderCell>
                  <CTableHeaderCell>Stok</CTableHeaderCell>
                  <CTableHeaderCell>Stok Minimum</CTableHeaderCell>
                  <CTableHeaderCell>Harga Beli</CTableHeaderCell>
                  <CTableHeaderCell>Harga Jual</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Aksi</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={10} className="text-center py-4">
                      <CSpinner size="sm" className="me-2" />
                      Memuat data obat...
                    </CTableDataCell>
                  </CTableRow>
                ) : obat.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={10} className="text-center py-4">
                      Tidak ada data obat.
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  obat.map((item, index) => {
                    const stok = item.stokObat
                    const jumlahStok = Number(stok?.stok || 0)
                    const stokMinimum = Number(stok?.stok_minimum || 0)

                    let statusStok = 'success'
                    let labelStok = 'Tersedia'

                    if (jumlahStok === 0) {
                      statusStok = 'danger'
                      labelStok = 'Habis'
                    } else if (jumlahStok <= stokMinimum) {
                      statusStok = 'warning'
                      labelStok = 'Menipis'
                    }

                    return (
                      <CTableRow key={item.id}>
                        <CTableDataCell>{index + 1}</CTableDataCell>

                        <CTableDataCell>
                          <strong>{item.kode || '-'}</strong>
                        </CTableDataCell>

                        <CTableDataCell>
                          <strong>{item.nama || '-'}</strong>
                        </CTableDataCell>

                        <CTableDataCell>
                          {item.satuan || '-'}
                        </CTableDataCell>

                        <CTableDataCell>
                          <CBadge color={statusStok}>
                            {jumlahStok}
                          </CBadge>
                        </CTableDataCell>

                        <CTableDataCell>
                          {stokMinimum}
                        </CTableDataCell>

                        <CTableDataCell>
                          {stok
                            ? `Rp ${Number(stok.harga_beli).toLocaleString('id-ID')}`
                            : '-'}
                        </CTableDataCell>

                        <CTableDataCell>
                          {stok
                            ? `Rp ${Number(stok.harga_jual).toLocaleString('id-ID')}`
                            : '-'}
                        </CTableDataCell>

                        <CTableDataCell>
                          <div className="d-flex flex-column gap-1">
                            <CBadge color={item.is_active ? 'success' : 'danger'}>
                              {item.is_active ? 'Aktif' : 'Tidak Aktif'}
                            </CBadge>

                            <CBadge color={statusStok}>
                              {labelStok}
                            </CBadge>
                          </div>
                        </CTableDataCell>

                        <CTableDataCell>
                          <div className="d-flex align-items-center gap-2">
                            <CButton
                              color="warning"
                              size="sm"
                              title="Ubah Obat"
                              onClick={() => handleEdit(item.id)}
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>

                            <CButton
                              color="danger"
                              size="sm"
                              title="Hapus Obat"
                              onClick={() => handleDelete(item.id)}
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    )
                  })
                )}
              </CTableBody>
            </CTable>
          </div>

          <div className="text-body-secondary small">
            Total data: {obat.length} obat
          </div>

          <ObatModal 
            visible={modalVisible}
            onClose={() => {
              setModalVisible(false)
              setSelectedObat(null)
            }}
            onSubmit={handleCreate}
            loading={loading}
            initialData={selectedObat}
          />
        </CCardBody>
      </CCard>
    </>
  )
}

export default Obat