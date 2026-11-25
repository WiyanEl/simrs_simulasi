import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CForm,
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
  CAlert,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormTextarea
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilPencil, cilTrash, cilWarning } from '@coreui/icons'

import { appHelper as H } from '../../../helper/appHelper'
import usePendaftaran from '../../../hooks/usePendaftaran'
import useJadwalDokter from '../../../hooks/useJadwalDokter'

const getToday = () => {
  const date = new Date()

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const initialFilter = {
  search: '',
  tanggal_mulai: getToday(),
  tanggal_selesai: getToday(),
  ruangan_id: '',
  dokter_id: '',
  status: '',
}

const Registrasi = () => {
  const navigate = useNavigate()
  const { getData, loading, batalDaftar } = usePendaftaran()
  const { getDataReferences } = useJadwalDokter()

  const [data, setData] = useState([])
  const [ruanganOption, setRuanganOption] = useState([])
  const [dokterOption, setDokterOption] = useState([])

  const [filter, setFilter] = useState(initialFilter)
  const [errorMessage, setErrorMessage] = useState('')

  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedPendaftaranId, setSelectedPendaftaranId] = useState(null)
  const [alasanBatal, setAlasanBatal] = useState('')
  const [loadingCancel, setLoadingCancel] = useState(false)
  const [cancelError, setCancelError] = useState('')

  const fetchReferences = async () => {
    try {
      const response = await getDataReferences()

      setRuanganOption(
        Array.isArray(response?.ruangan) ? response.ruangan : []
      )

      setDokterOption(
        Array.isArray(response?.pegawai) ? response.pegawai : []
      )
    } catch (error) {
      console.error('Gagal mengambil referensi:', error)
    }
  }

  const fetchData = async (params = filter) => {
    setErrorMessage('')

    if (!params.tanggal_mulai || !params.tanggal_selesai) {
      setErrorMessage('Tanggal mulai dan tanggal selesai wajib diisi.')
      return
    }

    if (params.tanggal_mulai > params.tanggal_selesai) {
      setErrorMessage(
        'Tanggal mulai tidak boleh melebihi tanggal selesai.'
      )
      return
    }

    try {
      const response = await getData(params)

      const result = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : []

      setData(result)
    } catch (error) {
      console.error('Gagal mengambil data pendaftaran:', error)

      setData([])
      setErrorMessage(
        error.response?.data?.message ||
        'Gagal mengambil data pendaftaran.'
      )
    }
  }

  useEffect(() => {
    fetchReferences()
    fetchData(initialFilter)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchData()
  }

  const handleReset = () => {
    setFilter(initialFilter)
    fetchData(initialFilter)
  }

  const getStatusBadge = (status) => {
    const colors = {
      TERDAFTAR: 'success',
      DIBATALKAN: 'danger',
      SELESAI: 'primary',
      DIPROSES: 'info',
    }

    return (
      <CBadge color={colors[status] || 'secondary'}>
        {status || '-'}
      </CBadge>
    )
  }

  const getAntreanBadge = (status) => {
    const colors = {
      MENUNGGU: 'warning',
      DIPANGGIL: 'info',
      DILAYANI: 'primary',
      SELESAI: 'success',
      BATAL: 'danger',
    }

    return (
      <CBadge color={colors[status] || 'secondary'}>
        {status || '-'}
      </CBadge>
    )
  }

  const handleEdit = (pasien_id, pendaftaran_id) => {
    navigate(`/registrasi/registrasi-ruangan?pasien_id=${pasien_id}&pendaftaran_id=${pendaftaran_id}`)
  }

  const handleCancel = async (id) => {
    setSelectedPendaftaranId(id)
    setAlasanBatal('')
    setCancelError('')
    setShowCancelModal(true)
  }

  const handleSubmitCancel = async (e) => {
    e.preventDefault()

    if (!alasanBatal.trim()) {
      H.showToast('warning', 'Alasan pembatalan wajib diisi.')
      return
    }

    setLoadingCancel(true)

    try {
      await batalDaftar(selectedPendaftaranId, {
        alasan: alasanBatal.trim(),
      })

      setShowCancelModal(false)
      setSelectedPendaftaranId(null)
      setAlasanBatal('')

      fetchData()
    } catch (error) {
      console.error('Gagal membatalkan pendaftaran:', error)
    } finally {
      setLoadingCancel(false)
    }
  }

  return (
    <>
      <CCard className="mb-3">
        <CCardHeader className="fw-semibold">
          Daftar Registrasi Pasien
        </CCardHeader>

        <CCardBody>
          {errorMessage && (
            <CAlert color="danger">
              {errorMessage}
            </CAlert>
          )}

          <CForm onSubmit={handleSubmit}>
            <CRow>
              <CCol md={3}>
                <div className="mb-3">
                  <label className="form-label">
                    Pencarian
                  </label>

                  <CFormInput
                    name="search"
                    value={filter.search}
                    onChange={handleChange}
                    placeholder="No. registrasi, No. RM, NIK, atau nama pasien..."
                  />
                </div>
              </CCol>

              <CCol md={3}>
                <div className="mb-3">
                  <label className="form-label">
                    Tanggal Mulai <span className="text-danger">*</span>
                  </label>

                  <CFormInput
                    type="date"
                    name="tanggal_mulai"
                    value={filter.tanggal_mulai}
                    onChange={handleChange}
                    required
                  />
                </div>
              </CCol>

              <CCol md={3}>
                <div className="mb-3">
                  <label className="form-label">
                    Tanggal Selesai <span className="text-danger">*</span>
                  </label>

                  <CFormInput
                    type="date"
                    name="tanggal_selesai"
                    value={filter.tanggal_selesai}
                    onChange={handleChange}
                    required
                  />
                </div>
              </CCol>

              <CCol md={3}>
                <div className="mb-3">
                  <label className="form-label">
                    Ruangan
                  </label>

                  <CFormSelect
                    name="ruangan_id"
                    value={filter.ruangan_id}
                    onChange={handleChange}
                  >
                    <option value="">Semua Ruangan</option>

                    {ruanganOption.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nama}
                      </option>
                    ))}
                  </CFormSelect>
                </div>
              </CCol>

              <CCol md={3}>
                <div className="mb-3">
                  <label className="form-label">
                    Dokter
                  </label>

                  <CFormSelect
                    name="dokter_id"
                    value={filter.dokter_id}
                    onChange={handleChange}
                  >
                    <option value="">Semua Dokter</option>

                    {dokterOption.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nama_lengkap || item.nama}
                      </option>
                    ))}
                  </CFormSelect>
                </div>
              </CCol>

              <CCol md={3}>
                <div className="mb-3">
                  <label className="form-label">
                    Status Pendaftaran
                  </label>

                  <CFormSelect
                    name="status"
                    value={filter.status}
                    onChange={handleChange}
                  >
                    <option value="">Semua Status</option>
                    <option value="TERDAFTAR">Terdaftar</option>
                    <option value="DIBATALKAN">Dibatalkan</option>
                  </CFormSelect>
                </div>
              </CCol>

              <CCol md={3} className="d-flex align-items-center gap-2">
                <CButton
                  color="secondary"
                  variant="outline"
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                >
                  Reset
                </CButton>

                <CButton
                  color="primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <CSpinner size="sm" className="me-2" />
                    </>
                  ) : (
                    'Cari Data'
                  )}
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>

      <CCard>
        <CCardHeader className="fw-semibold d-flex justify-content-between align-items-center">
          <span>Data Registrasi</span>

          <CBadge color="primary">
            {data.length} Data
          </CBadge>
        </CCardHeader>

        <CCardBody>
          <div className="table-responsive">
            <CTable hover bordered align="middle">
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>No.</CTableHeaderCell>
                  <CTableHeaderCell>No. Registrasi</CTableHeaderCell>
                  <CTableHeaderCell>Tanggal</CTableHeaderCell>
                  <CTableHeaderCell>Pasien</CTableHeaderCell>
                  <CTableHeaderCell>Ruangan</CTableHeaderCell>
                  <CTableHeaderCell>Dokter</CTableHeaderCell>
                  <CTableHeaderCell>Antrean</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Aksi</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={8} className="text-center py-4">
                      <CSpinner size="sm" className="me-2" />
                      Memuat data...
                    </CTableDataCell>
                  </CTableRow>
                ) : data.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={8} className="text-center py-4">
                      Tidak ada data registrasi.
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  data.map((item, index) => (
                    <CTableRow key={item.id}>
                      <CTableDataCell>
                        {index + 1}
                      </CTableDataCell>

                      <CTableDataCell>
                        <div className="fw-semibold text-primary">
                          {item.no_registrasi}
                        </div>
                        <small className="text-body-secondary">
                          {item.jenis_kunjungan}
                        </small>
                      </CTableDataCell>

                      <CTableDataCell>
                        {item.tanggal_kunjungan}
                      </CTableDataCell>

                      <CTableDataCell>
                        <div className="fw-semibold">
                          {item.pasien?.nama || '-'}
                        </div>
                        <small className="text-body-secondary">
                          RM: {item.pasien?.no_rm || '-'}
                        </small>
                      </CTableDataCell>

                      <CTableDataCell>
                        {item.ruangan?.nama || '-'}
                      </CTableDataCell>

                      <CTableDataCell>
                        {item.dokter?.nama_lengkap ||
                          item.dokter?.nama ||
                          '-'}
                      </CTableDataCell>

                      <CTableDataCell>
                        <div className="fw-semibold">
                          {item.antrean?.kode_antrean || '-'}
                        </div>
                        <small>
                          {getAntreanBadge(item.antrean?.status)}
                        </small>
                      </CTableDataCell>

                      <CTableDataCell>
                        {getStatusBadge(item.status)}
                      </CTableDataCell>
                      <CTableDataCell>
                        {item.status != 'DIBATALKAN' ? (
                          <div className="d-flex align-items-center gap-2">
                            <CButton
                              color="warning"
                              size="sm"
                              title="Ubah Pendaftaran"
                              onClick={() => handleEdit(item.pasien_id, item.id)}
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>
                            <CButton
                              color="danger"
                              size="sm"
                              title="Batal Daftar"
                              onClick={() => handleCancel(item.id)}
                            >
                              <CIcon icon={cilWarning} />
                            </CButton>
                          </div>
                        ) : null}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>
      <CModal
        visible={showCancelModal}
        onClose={() => {
          if (!loadingCancel) {
            setShowCancelModal(false)
          }
        }}
        backdrop="static"
      >
        <CForm onSubmit={handleSubmitCancel}>
          <CModalHeader>
            <CModalTitle>Konfirmasi Pembatalan Pendaftaran</CModalTitle>
          </CModalHeader>

          <CModalBody>
            <CAlert color="warning">
              Pendaftaran yang dibatalkan tidak dapat diproses kembali.
              Pastikan alasan pembatalan sudah benar.
            </CAlert>

            {cancelError && (
              <CAlert color="danger">
                {cancelError}
              </CAlert>
            )}

            <CFormTextarea
              label="Alasan Pembatalan"
              placeholder="Masukkan alasan pembatalan pendaftaran..."
              rows={4}
              value={alasanBatal}
              onChange={(e) => {
                setAlasanBatal(e.target.value)
                setCancelError('')
              }}
              required
            />
          </CModalBody>

          <CModalFooter>
            <CButton
              color="secondary"
              variant="outline"
              disabled={loadingCancel}
              onClick={() => setShowCancelModal(false)}
            >
              Tutup
            </CButton>

            <CButton
              color="danger"
              type="submit"
              disabled={loadingCancel || !alasanBatal.trim()}
            >
              {loadingCancel ? (
                <>
                  <CSpinner size="sm" className="me-2" />
                  Memproses...
                </>
              ) : (
                'Konfirmasi Pembatalan'
              )}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}

export default Registrasi