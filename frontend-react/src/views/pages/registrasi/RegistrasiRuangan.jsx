import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CButton,
  CSpinner,
  CAlert,
} from '@coreui/react'

import usePasien from '../../../hooks/usePasien'
import useJadwalDokter from '../../../hooks/useJadwalDokter'
import usePendaftaran from '../../../hooks/usePendaftaran'

const getToday = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const initialForm = {
  pasien_id: '',
  ruangan_id: '',
  dokter_id: '',
  jadwal_dokter_id: '',
  tanggal_kunjungan: getToday(),
  jenis_kunjungan: 'BARU',
  jenis_pembayaran: 'UMUM',
  keluhan: '',
}

const RegistrasiRuangan = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const pasien_id = searchParams.get('pasien_id')
  const pendaftaran_id = searchParams.get('pendaftaran_id')

  const { getDataById } = usePasien()
  const { getDataReferences, getData } = useJadwalDokter()
  const { loading, createData, getDataById: getPendaftaranById, updateData } = usePendaftaran()

  const [pasien, setPasien] = useState({})
  const [ruanganOption, setRuanganOption] = useState([])
  const [pegawaiOption, setPegawaiOption] = useState([])
  const [jadwalOption, setJadwalOption] = useState([])

  const [loadingPasien, setLoadingPasien] = useState(false)
  const [loadingJadwal, setLoadingJadwal] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)

  const [form, setForm] = useState({
    ...initialForm,
    pasien_id: pasien_id || '',
  })

  const fetchDataPasien = async () => {
    if (!pasien_id) return

    setLoadingPasien(true)

    try {
      const data = await getDataById(pasien_id)
      setPasien(data)
    } catch (error) {
      console.error('Gagal mengambil detail pasien:', error)
    } finally {
      setLoadingPasien(false)
    }
  }

  const fetchReferencesData = async () => {
    try {
      const data = await getDataReferences()

      setPegawaiOption(Array.isArray(data?.pegawai) ? data.pegawai : [])
      setRuanganOption(Array.isArray(data?.ruangan) ? data.ruangan : [])
    } catch (error) {
      console.error('Gagal mengambil data referensi:', error)
    }
  }

  const fetchDataPendaftaran = async () => {
    if (!pendaftaran_id) return

    try {
      const data = await getPendaftaranById(pendaftaran_id)

      setForm({
        pasien_id: data.pasien_id || '',
        ruangan_id: data.ruangan_id || '',
        dokter_id: data.dokter_id || '',
        jadwal_dokter_id: data.jadwal_dokter_id || '',
        tanggal_kunjungan: data.tanggal_kunjungan || getToday(),
        jenis_kunjungan: data.jenis_kunjungan || 'BARU',
        jenis_pembayaran: data.jenis_pembayaran || 'UMUM',
        keluhan: data.keluhan || '',
      })
    } catch (error) {
      console.error('Gagal mengambil data pendaftaran:', error)
    }
  }

  useEffect(() => {
    fetchDataPasien()
    fetchReferencesData()
  }, [pasien_id])

  useEffect(() => {
  if (pendaftaran_id) {
    fetchDataPendaftaran()
  }
}, [pendaftaran_id])

  useEffect(() => {
    const fetchJadwalDokter = async () => {
      if (!form.ruangan_id || !form.dokter_id) {
        setJadwalOption([])
        return
      }

      setLoadingJadwal(true)
      setJadwalOption([])

      try {
        const response = await getData({
          ruangan_id: form.ruangan_id,
          dokter_id: form.dokter_id,
          is_active: true,
        })

        const data = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : []

        setJadwalOption(data)
      } catch (error) {
        console.error('Gagal mengambil jadwal dokter:', error)
        setJadwalOption([])
      } finally {
        setLoadingJadwal(false)
      }
    }

    fetchJadwalDokter()
  }, [form.ruangan_id, form.dokter_id])

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      }

      if (name === 'ruangan_id') {
        updated.dokter_id = ''
        updated.jadwal_dokter_id = ''
      }

      if (name === 'dokter_id') {
        updated.jadwal_dokter_id = ''
      }

      return updated
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.pasien_id) {
      setErrorMessage('Pasien belum dipilih.')
      return
    }

    if (
      !form.ruangan_id ||
      !form.dokter_id ||
      !form.jadwal_dokter_id ||
      !form.tanggal_kunjungan
    ) {
      setErrorMessage('Lengkapi tanggal, ruangan, dokter, dan jadwal praktik.')
      return
    }

    const payload = {
      ...form,
      pasien_id: Number(form.pasien_id),
      ruangan_id: Number(form.ruangan_id),
      dokter_id: Number(form.dokter_id),
      jadwal_dokter_id: Number(form.jadwal_dokter_id),
    }

    setLoadingSubmit(true)

    try {
      let response

      if (pendaftaran_id) {
        response = await updateData(pendaftaran_id, payload)
      } else {
        response = await createData(payload)
      }

      setTimeout(() => {
        navigate('/registrasi')
      }, 1500)
    } catch (error) {
      console.error('Gagal menyimpan pendaftaran:', error)
    } finally {
      setLoadingSubmit(false)
    }
  }

  const formatJadwal = (jadwal) => {
    const hari = jadwal.hari_nama || jadwal.hari || ''
    const mulai = jadwal.jam_mulai || ''
    const selesai = jadwal.jam_selesai || ''

    return `${hari} (${mulai} - ${selesai})`
  }

  return (
    <>
      <CCard className="mb-3">
        <CCardHeader className="fw-semibold">
          Informasi Pasien
        </CCardHeader>

        <CCardBody>
          {loadingPasien ? (
            <div className="text-center p-3">
              <CSpinner size="sm" /> Memuat data pasien...
            </div>
          ) : (
            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <small className="text-body-secondary">
                    No. Rekam Medis
                  </small>
                  <div className="fw-bold text-primary">
                    {pasien?.no_rm || '-'}
                  </div>
                </div>

                <div className="mb-3">
                  <small className="text-body-secondary">
                    Nama Pasien
                  </small>
                  <div className="fw-semibold">
                    {pasien?.nama || '-'}
                  </div>
                </div>

                <div className="mb-3">
                  <small className="text-body-secondary">NIK</small>
                  <div>{pasien?.nik || '-'}</div>
                </div>
              </CCol>

              <CCol md={6}>
                <div className="mb-3">
                  <small className="text-body-secondary">
                    Jenis Kelamin
                  </small>
                  <div>
                    {pasien?.jenis_kelamin === 'L'
                      ? 'Laki-laki'
                      : pasien?.jenis_kelamin === 'P'
                        ? 'Perempuan'
                        : '-'}
                  </div>
                </div>

                <div className="mb-3">
                  <small className="text-body-secondary">
                    Tanggal Lahir
                  </small>
                  <div>{pasien?.tanggal_lahir || '-'}</div>
                </div>

                <div className="mb-3">
                  <small className="text-body-secondary">No. HP</small>
                  <div>{pasien?.no_hp || '-'}</div>
                </div>
              </CCol>

              <CCol md={12}>
                <div className="mb-2">
                  <small className="text-body-secondary">Alamat</small>
                  <div>{pasien?.alamat || '-'}</div>
                </div>
              </CCol>
            </CRow>
          )}
        </CCardBody>
      </CCard>

      <CCard>
        <CCardHeader className="fw-semibold">
          Form Registrasi Kunjungan
        </CCardHeader>

        <CCardBody>

          <CForm onSubmit={handleSubmit}>
            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <label className="form-label">
                    Tanggal Kunjungan
                  </label>

                  <CFormInput
                    type="date"
                    name="tanggal_kunjungan"
                    value={form.tanggal_kunjungan}
                    onChange={handleChange}
                    required
                  />
                </div>
              </CCol>

              <CCol md={6}>
                <div className="mb-3">
                  <label className="form-label">
                    Jenis Kunjungan
                  </label>

                  <CFormSelect
                    name="jenis_kunjungan"
                    value={form.jenis_kunjungan}
                    onChange={handleChange}
                    required
                  >
                    <option value="BARU">Pasien Baru</option>
                    <option value="LAMA">Pasien Lama</option>
                  </CFormSelect>
                </div>
              </CCol>

              <CCol md={6}>
                <div className="mb-3">
                  <label className="form-label">
                    Ruangan / Poli
                  </label>

                  <CFormSelect
                    name="ruangan_id"
                    value={form.ruangan_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Pilih Ruangan</option>

                    {ruanganOption.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nama}
                      </option>
                    ))}
                  </CFormSelect>
                </div>
              </CCol>

              <CCol md={6}>
                <div className="mb-3">
                  <label className="form-label">
                    Dokter
                  </label>

                  <CFormSelect
                    name="dokter_id"
                    value={form.dokter_id}
                    onChange={handleChange}
                    disabled={!form.ruangan_id}
                    required
                  >
                    <option value="">
                      {form.ruangan_id
                        ? 'Pilih Dokter'
                        : 'Pilih ruangan terlebih dahulu'}
                    </option>

                    {pegawaiOption.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nama_lengkap || item.nama}
                      </option>
                    ))}
                  </CFormSelect>
                </div>
              </CCol>

              <CCol md={12}>
                <div className="mb-3">
                  <label className="form-label">
                    Jadwal Praktik Dokter
                  </label>

                  <CFormSelect
                    name="jadwal_dokter_id"
                    value={form.jadwal_dokter_id}
                    onChange={handleChange}
                    disabled={
                      !form.ruangan_id ||
                      !form.dokter_id ||
                      loadingJadwal ||
                      jadwalOption.length === 0
                    }
                    required
                  >
                    <option value="">
                      {loadingJadwal
                        ? 'Memuat jadwal dokter...'
                        : !form.ruangan_id || !form.dokter_id
                          ? 'Pilih ruangan dan dokter terlebih dahulu'
                          : jadwalOption.length === 0
                            ? 'Jadwal dokter tidak tersedia'
                            : 'Pilih Jadwal Praktik'}
                    </option>

                    {jadwalOption.map((item) => (
                      <option key={item.id} value={item.id}>
                        {formatJadwal(item)}
                      </option>
                    ))}
                  </CFormSelect>

                  {loadingJadwal && (
                    <small className="text-primary">
                      <CSpinner size="sm" className="me-1" />
                      Mengambil jadwal dokter...
                    </small>
                  )}
                </div>
              </CCol>

              <CCol md={6}>
                <div className="mb-3">
                  <label className="form-label">
                    Jenis Pembayaran
                  </label>

                  <CFormSelect
                    name="jenis_pembayaran"
                    value={form.jenis_pembayaran}
                    onChange={handleChange}
                    required
                  >
                    <option value="UMUM">Umum</option>
                  </CFormSelect>
                </div>
              </CCol>

              <CCol md={12}>
                <div className="mb-3">
                  <label className="form-label">
                    Keluhan Pasien
                  </label>

                  <CFormTextarea
                    name="keluhan"
                    rows={3}
                    value={form.keluhan}
                    onChange={handleChange}
                    placeholder="Masukkan keluhan pasien..."
                  />
                </div>
              </CCol>
            </CRow>

            <div className="d-flex justify-content-end gap-2">
              <CButton
                color="secondary"
                variant="outline"
                type="button"
                onClick={() => navigate(-1)}
                disabled={loadingSubmit}
              >
                Kembali
              </CButton>

              <CButton
                color={pendaftaran_id ? 'warning' : 'primary'}
                type="submit"
                disabled={loadingSubmit || loadingJadwal}
              >
                {loadingSubmit ? (
                  <CSpinner size="sm" className="me-2" />
                ) : (
                  pendaftaran_id ? 'Ubah' : 'Simpan'
                )}
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </>
  )
}

export default RegistrasiRuangan