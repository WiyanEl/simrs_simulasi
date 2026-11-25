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

import JadwalDokterModal from '../../../components/jadwal-dokter/JadwalDokterModal'

import useJadwalDokter from '../../../hooks/useJadwalDokter.js'

const JadwalDokter = () => {
  const { loading, getData, getDataReferences, createData, getDataById, updateData, deteleData } = useJadwalDokter()
  const [pegawaiOption, setPegawaiOption] = useState([])
  const [ruanganOption, setRuanganOption] = useState([])
  const [jadwalDokter, setJadwalDokter] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedJadwalDokter, setSelectedJadwalDokter] = useState(null)

  const [filters, setFilters] = useState({
    search: '',
    dokter_id: '',
    ruangan_id: '',
    hari: '',
    is_active: '',
  })

  useEffect(() => {
    fetchData({})
    fetchReferencesData()
  }, [])

  const fetchData = async (params = filters) => {
    try {
      const data = await getData(params)

      setJadwalDokter(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Gagal mengambil data jadwal dokter:', error)

      setJadwalDokter([])
    }
  }

  const fetchReferencesData = async () => {
    try {
      const data = await getDataReferences()

      setPegawaiOption(Array.isArray(data.pegawai) ? data.pegawai : [])
      setRuanganOption(Array.isArray(data.ruangan) ? data.ruangan : [])
    } catch (error) {
      console.error('Gagal mengambil data referensi:', error)

      setPegawaiOption([])
      setRuanganOption([])
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
      dokter_id: filters.dokter_id,
      ruangan_id: filters.ruangan_id,
      hari: filters.hari,
      is_active: filters.is_active,
    }

    fetchData(params)
  }

  const handleReset = () => {
    const defaultFilters = {
      search: '',
      dokter_id: '',
      ruangan_id: '',
      hari: '',
      is_active: '',
    }

    setFilters(defaultFilters)
    fetchData(defaultFilters)
  }

  const handleCreate = async (formData) => {
    try {
      setSaving(true)

      if (selectedJadwalDokter) {
        await updateData(selectedJadwalDokter.id, formData)
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

      setSelectedJadwalDokter(data)
      setModalVisible(true)

    } catch (error) {
      console.error('Gagal mengambil detail jadwal dokter:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      const data = await deteleData(id)

      fetchData()
    } catch (error) {
      console.error('Gagal menghapus jadwal dokter:', error)
    }
  }

  return (
    <>
      <CCard>
        <CCardHeader>
          <strong>Master Jadwal Dokter</strong>
        </CCardHeader>

        <CCardBody>
          <form onSubmit={handleSearch}>
            <CRow className="mb-3">
              <CCol md={3} className="mb-3">
                <CFormInput
                  label="Pencarian"
                  name="search"
                  placeholder="Nama Dokter atau Nama Ruangan..."
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </CCol>

              <CCol md={3} className="mb-3">
                <CFormSelect
                  label="Dokter"
                  name="dokter_id"
                  value={filters.dokter_id}
                  onChange={handleFilterChange}
                  options={[
                    { label: 'Semua Dokter', value: '' },
                    ...pegawaiOption.map((item) => ({
                      label: `${item.nama_lengkap}`,
                      value: item.id,
                    })),
                  ]}
                />
              </CCol>

              <CCol md={3} className="mb-3">
                <CFormSelect
                  label="Ruangan"
                  name="ruangan_id"
                  value={filters.ruangan_id}
                  onChange={handleFilterChange}
                  options={[
                    { label: 'Semua Ruangan', value: '' },
                    ...ruanganOption.map((item) => ({
                      label: `${item.nama}`,
                      value: item.id,
                    })),
                  ]}
                />
              </CCol>

              <CCol md={3} className="mb-3">
                <CFormSelect
                  label="Hari"
                  name="hari"
                  value={filters.hari}
                  onChange={handleFilterChange}
                  options={[
                    { label: 'Semua Hari', value: '' },
                    { label: 'Senin', value: '1' },
                    { label: 'Selasa', value: '2' },
                    { label: 'Rabu', value: '3' },
                    { label: 'Kamis', value: '4' },
                    { label: 'Jumat', value: '5' },
                    { label: 'Sabtu', value: '6' },
                    { label: 'Minggu', value: '7' },
                  ]}
                />
              </CCol>

              <CCol md={3} className="mb-3">
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

              <CCol md={3} className="d-flex align-items-end gap-2 mb-3">
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
                  setSelectedJadwalDokter(null)
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
                  <CTableHeaderCell>Nama Dokter</CTableHeaderCell>
                  <CTableHeaderCell>Poli / Ruangan</CTableHeaderCell>
                  <CTableHeaderCell>Hari</CTableHeaderCell>
                  <CTableHeaderCell>Jam Praktik</CTableHeaderCell>
                  <CTableHeaderCell>Kuota</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Aksi</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={13} className="text-center py-4">
                      <CSpinner size="sm" className="me-2" />
                      Memuat data jadwal dokter...
                    </CTableDataCell>
                  </CTableRow>
                ) : jadwalDokter.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={13} className="text-center py-4">
                      Tidak ada data jadwal dokter.
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  jadwalDokter.map((item, index) => {
                    const pegawai = item.dokter?.pegawai

                    return (
                      <CTableRow key={item.id}>
                        <CTableDataCell>{index + 1}</CTableDataCell>

                        <CTableDataCell>
                          <strong>{pegawai?.nama_lengkap || '-'}</strong>
                        </CTableDataCell>

                        <CTableDataCell>
                          <strong>{item.ruangan?.nama || '-'}</strong>
                          <div className="small text-body-secondary">
                            {item.ruangan?.lokasi || '-'}
                          </div>
                        </CTableDataCell>

                        <CTableDataCell>
                          <CBadge color="primary">
                            {item.hari_nama || item.hari || '-'}
                          </CBadge>
                        </CTableDataCell>

                        <CTableDataCell>
                          {item.jam_mulai?.substring(0, 5) || '-'}
                          {' - '}
                          {item.jam_selesai?.substring(0, 5) || '-'}
                        </CTableDataCell>

                        <CTableDataCell>
                          {item.kuota ?? '-'}
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
                              title="Ubah Jadwal"
                              onClick={() => handleEdit(item.id)}
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>

                            <CButton
                              color="danger"
                              size="sm"
                              title="Hapus Jadwal"
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
            Total data: {jadwalDokter.length} jadwal dokter
          </div>

        </CCardBody>
      </CCard>

      <JadwalDokterModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
          setSelectedJadwalDokter(null)
        }}
        onSubmit={handleCreate}
        loading={loading}
        initialData={selectedJadwalDokter}
        dokterOptions={pegawaiOption}
        ruanganOptions={ruanganOption}
      />
    </>
  )
}

export default JadwalDokter