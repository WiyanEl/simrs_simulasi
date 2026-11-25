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

import DokterModal from '../../../components/dokter/DokterModal'

import useDokter from '../../../hooks/useDokter.js'

const Dokter = () => {
  const { loading, getData, getDataReferences, createData, getDataById, updateData, deteleData } = useDokter()
  const [pegawaiOption, setPegawaiOption] = useState([])
  const [dokter, setDokter] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedDokter, setSelectedDokter] = useState(null)

  const [filters, setFilters] = useState({
    search: '',
    spesialisasi: '',
    is_active: '',
  })

  useEffect(() => {
    fetchData({})
    fetchReferencesData()
  }, [])

  const fetchData = async (params = filters) => {
    try {
      const data = await getData(params)

      setDokter(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Gagal mengambil data dokter:', error)

      setDokter([])
    }
  }

  const fetchReferencesData = async () => {
    try {
      const data = await getDataReferences()

      setPegawaiOption(Array.isArray(data.pegawai) ? data.pegawai : [])
    } catch (error) {
      console.error('Gagal mengambil data referensi:', error)

      setPegawaiOption([])
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
      spesialisasi: filters.spesialisasi,
      is_active: filters.is_active,
    }

    fetchData(params)
  }

  const handleReset = () => {
    const defaultFilters = {
      search: '',
      spesialisasi: '',
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

      if (selectedDokter) {
        await updateData(selectedDokter.id, formData)
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

      setSelectedDokter(data)
      setModalVisible(true)

    } catch (error) {
      console.error('Gagal mengambil detail dokter:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      const data = await deteleData(id)

      fetchData()
    } catch (error) {
      console.error('Gagal menghapus dokter:', error)
    }
  }

  return (
    <>
      <CCard>
        <CCardHeader>
          <strong>Master Data Dokter</strong>
        </CCardHeader>

        <CCardBody>
          <form onSubmit={handleSearch}>
            <CRow className="mb-3">
              <CCol md={4}>
                <CFormInput
                  label="Pencarian"
                  name="search"
                  placeholder="Nama, No STR, atau No SIP..."
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </CCol>

              <CCol md={3}>
                <CFormInput
                  label="Spesialisasi"
                  name="spesialisasi"
                  placeholder="Spesialisasi..."
                  value={filters.spesialisasi}
                  onChange={handleFilterChange}
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
                  setSelectedDokter(null)
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
                  <CTableHeaderCell>Spesialisasi</CTableHeaderCell>
                  <CTableHeaderCell>No. STR</CTableHeaderCell>
                  <CTableHeaderCell>Masa Berlaku STR</CTableHeaderCell>
                  <CTableHeaderCell>No. SIP</CTableHeaderCell>
                  <CTableHeaderCell>Masa Berlaku SIP</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Aksi</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={11} className="text-center py-4">
                      <CSpinner size="sm" className="me-2" />
                      Memuat data dokter...
                    </CTableDataCell>
                  </CTableRow>
                ) : dokter.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={11} className="text-center py-4">
                      Tidak ada data dokter.
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  dokter.map((item, index) => (
                    <CTableRow key={item.id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>

                      <CTableDataCell>
                        {item.pegawai?.kode_pegawai || '-'}
                      </CTableDataCell>

                      <CTableDataCell>
                        {item.pegawai?.nip || '-'}
                      </CTableDataCell>

                      <CTableDataCell>
                        <strong>{item.pegawai?.nama_lengkap || '-'}</strong>
                      </CTableDataCell>

                      <CTableDataCell>
                        <CBadge color="info">
                          {item.spesialisasi || '-'}
                        </CBadge>
                        {item.sub_spesialisasi && (
                          <div className="small text-body-secondary mt-1">
                            {item.sub_spesialisasi}
                          </div>
                        )}
                      </CTableDataCell>

                      <CTableDataCell>
                        {item.no_str || '-'}
                      </CTableDataCell>

                      <CTableDataCell>
                        {formatDate(item.masa_berlaku_str)}
                      </CTableDataCell>

                      <CTableDataCell>
                        {item.no_sip || '-'}
                      </CTableDataCell>

                      <CTableDataCell>
                        {formatDate(item.masa_berlaku_sip)}
                      </CTableDataCell>

                      <CTableDataCell>
                        <CBadge color={item.pegawai?.is_active ? 'success' : 'danger'}>
                          {item.pegawai?.is_active ? 'Aktif' : 'Tidak Aktif'}
                        </CBadge>
                      </CTableDataCell>

                      <CTableDataCell>
                        <div className="d-flex align-items-center gap-2">
                          <CButton
                            color="warning"
                            size="sm"
                            title="Ubah Dokter"
                            onClick={() => handleEdit(item.id)}
                          >
                            <CIcon icon={cilPencil} />
                          </CButton>

                          <CButton
                            color="danger"
                            size="sm"
                            title="Hapus Dokter"
                            onClick={() => handleDelete(item.id)}
                          >
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </div>

          <div className="text-body-secondary small">
            Total data: {dokter.length} dokter
          </div>

        </CCardBody>
      </CCard>

      <DokterModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
          setSelectedDokter(null)
        }}
        onSubmit={handleCreate}
        loading={loading}
        initialData={selectedDokter}
        pegawaiOptions={pegawaiOption}
      />
    </>
  )
}

export default Dokter