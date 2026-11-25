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

import PegawaiModal from './../../../components/pegawai/PegawaiModal'

import usePegawai from 'src/hooks/usePegawai'

const Pegawai = () => {
  const { loading, getData, createData, getDataById, updateData, deteleData } = usePegawai()

  const [pegawai, setPegawai] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedPegawai, setSelectedPegawai] = useState(null)

  const [filters, setFilters] = useState({
    search: '',
    jenis_pegawai: '',
    is_active: '',
  })

  const fetchData = async (params = filters) => {
    try {
      const data = await getData(params)

      setPegawai(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Gagal mengambil data pegawai:', error)

      setPegawai([])
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
      jenis_pegawai: filters.jenis_pegawai,
      is_active: filters.is_active,
    }

    fetchData(params)
  }

  const handleReset = () => {
    const defaultFilters = {
      search: '',
      jenis_pegawai: '',
      is_active: '',
    }

    setFilters(defaultFilters)
    fetchData(defaultFilters)
  }

  const formatDate = (date) => {
    if (!date) return '-'

    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const handleCreate = async (formData) => {
    try {
      setSaving(true)

      if (selectedPegawai) {
        await updateData(selectedPegawai.id, formData)
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

      setSelectedPegawai(data)
      setModalVisible(true)

    } catch (error) {
      console.error('Gagal mengambil detail pegawai:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      const data = await deteleData(id)

      fetchData()
    } catch (error) {
      console.error('Gagal menghapus pegawai:', error)
    }
  }

  return (
    <>
      <CCard>
        <CCardHeader>
          <strong>Master Data Pegawai</strong>
        </CCardHeader>

        <CCardBody>
          <form onSubmit={handleSearch}>
            <CRow className="mb-3">
              <CCol md={4}>
                <CFormInput
                  label="Pencarian"
                  name="search"
                  placeholder="Nama, kode pegawai, atau NIP..."
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </CCol>

              <CCol md={3}>
                <CFormSelect
                  label="Jenis Pegawai"
                  name="jenis_pegawai"
                  value={filters.jenis_pegawai}
                  onChange={handleFilterChange}
                  options={[
                    { label: 'Semua Jenis Pegawai', value: '' },
                    { label: 'Dokter', value: 'DOKTER' },
                    { label: 'Perawat', value: 'PERAWAT' },
                    { label: 'Bidan', value: 'BIDAN' },
                    { label: 'Apoteker', value: 'APOTEKER' },
                    { label: 'Tenaga Medis', value: 'TENAGA_MEDIS' },
                    { label: 'Administrasi', value: 'ADMINISTRASI' },
                    { label: 'Non Medis', value: 'NON_MEDIS' },
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
                  setSelectedPegawai(null)
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
                  <CTableHeaderCell>Kode Pegawai</CTableHeaderCell>
                  <CTableHeaderCell>NIP</CTableHeaderCell>
                  <CTableHeaderCell>Nama Lengkap</CTableHeaderCell>
                  <CTableHeaderCell>Jenis Pegawai</CTableHeaderCell>
                  <CTableHeaderCell>No. HP</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Tanggal Bergabung</CTableHeaderCell>
                  <CTableHeaderCell>Aksi</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={9} className="text-center py-4">
                      <CSpinner size="sm" className="me-2" />
                      Memuat data pegawai...
                    </CTableDataCell>
                  </CTableRow>
                ) : pegawai.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell
                      colSpan={9}
                      className="text-center py-4"
                    >
                      Tidak ada data pegawai.
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  pegawai.map((item, index) => (
                    <CTableRow key={item.id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>

                      <CTableDataCell>
                        {item.kode_pegawai}
                      </CTableDataCell>

                      <CTableDataCell>
                        {item.nip || '-'}
                      </CTableDataCell>

                      <CTableDataCell>
                        <strong>{item.nama_lengkap}</strong>
                      </CTableDataCell>

                      <CTableDataCell>
                        <CBadge color="info">
                          {item.jenis_pegawai}
                        </CBadge>
                      </CTableDataCell>

                      <CTableDataCell>
                        {item.no_hp || '-'}
                      </CTableDataCell>

                      <CTableDataCell>
                        {item.email || '-'}
                      </CTableDataCell>

                      <CTableDataCell>
                        <CBadge color={item.is_active ? 'success' : 'danger'}>
                          {item.is_active ? 'Aktif' : 'Tidak Aktif'}
                        </CBadge>
                      </CTableDataCell>

                      <CTableDataCell>
                        {formatDate(item.tanggal_bergabung)}
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex align-items-center gap-2">
                          <CButton
                            color="warning"
                            size="sm"
                            title="Ubah Pegawai"
                            onClick={() => handleEdit(item.id)}
                          >
                            <CIcon icon={cilPencil} />
                          </CButton>

                          {item.is_active && (
                            <CButton
                              color="danger"
                              size="sm"
                              title="Hapus Pegawai"
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
            Total data: {pegawai.length} pegawai
          </div>
        </CCardBody>
      </CCard>

      <PegawaiModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
          setSelectedPegawai(null)
        }}
        onSubmit={handleCreate}
        loading={saving}
        initialData={selectedPegawai}
      />
    </>
  )
}

export default Pegawai