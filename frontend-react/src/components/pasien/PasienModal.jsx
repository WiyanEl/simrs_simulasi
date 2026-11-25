import React, { useState, useEffect } from 'react'

import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CFormCheck,
  CRow,
  CCol,
  CButton,
  CSpinner,
  CFormLabel
} from '@coreui/react'

const initialForm = {
  nik: '',
  no_kk: '',
  nama: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  jenis_kelamin: '',
  golongan_darah: '',
  agama: '',
  status_perkawinan: '',
  pekerjaan: '',
  pendidikan: '',
  alamat: '',
  provinsi: '',
  kabupaten: '',
  kecamatan: '',
  kelurahan: '',
  kode_pos: '',
  no_hp: '',
  email: '',
  nama_penanggung_jawab: '',
  hubungan_penanggung_jawab: '',
  no_hp_penanggung_jawab: '',
  is_active: true,
}

const PasienModal = ({
  visible,
  onClose,
  onSubmit,
  loading = false,
  initialData = null
}) => {
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    if (visible) {
      setForm(
        initialData
          ? {
              ...initialForm,
              ...initialData,
              nik: initialData.nik || '',
              no_kk: initialData.no_kk || '',
              tanggal_lahir: initialData.tanggal_lahir || '',
              is_active: initialData.is_active ?? true,
            }
          : initialForm
      )
    }
  }, [visible, initialData])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    onSubmit({
      ...form,
      nik: form.nik || null,
      no_kk: form.no_kk || null,
      email: form.email || null,
    })
  }

  return (
    <CModal
      visible={visible}
      onClose={onClose}
      size="xl"
      backdrop="static"
      aria-labelledby="ScrollingLongContentExampleLabel"
    >
      <CForm onSubmit={handleSubmit}>
        <CModalHeader>
          <CModalTitle id="ScrollingLongContentExampleLabel">
            {initialData ? 'Ubah Data Pasien' : 'Tambah Data Pasien'}
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          <h6 className="fw-bold mb-3">Identitas Pasien</h6>

          <CRow className="g-3">
            <CCol md={6}>
              <CFormInput
                label="NIK"
                name="nik"
                value={form.nik}
                onChange={handleChange}
                placeholder="Masukkan NIK"
                maxLength={16}
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                label="Nomor KK"
                name="no_kk"
                value={form.no_kk}
                onChange={handleChange}
                placeholder="Masukkan nomor KK"
                maxLength={16}
              />
            </CCol>

            <CCol md={12}>
              <CFormInput
                label="Nama Lengkap"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap pasien"
                required
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                label="Tempat Lahir"
                name="tempat_lahir"
                value={form.tempat_lahir}
                onChange={handleChange}
                placeholder="Contoh: Bandung"
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                type="date"
                label="Tanggal Lahir"
                name="tanggal_lahir"
                value={form.tanggal_lahir}
                onChange={handleChange}
              />
            </CCol>

            <CCol md={6}>
              <CFormSelect
                label="Jenis Kelamin"
                name="jenis_kelamin"
                value={form.jenis_kelamin}
                onChange={handleChange}
                required
                options={[
                  { label: 'Pilih Jenis Kelamin', value: '' },
                  { label: 'Laki-laki', value: 'L' },
                  { label: 'Perempuan', value: 'P' },
                ]}
              />
            </CCol>

            <CCol md={6}>
              <CFormSelect
                label="Golongan Darah"
                name="golongan_darah"
                value={form.golongan_darah}
                onChange={handleChange}
                options={[
                  { label: 'Pilih Golongan Darah', value: '' },
                  { label: 'A', value: 'A' },
                  { label: 'B', value: 'B' },
                  { label: 'AB', value: 'AB' },
                  { label: 'O', value: 'O' },
                ]}
              />
            </CCol>
          </CRow>

          <hr className="my-4" />

          <h6 className="fw-bold mb-3">Data Pribadi</h6>

          <CRow className="g-3">
            <CCol md={6}>
              <CFormSelect
                label="Agama"
                name="agama"
                value={form.agama}
                onChange={handleChange}
                options={[
                  { label: 'Pilih Agama', value: '' },
                  { label: 'Islam', value: 'Islam' },
                  { label: 'Kristen', value: 'Kristen' },
                  { label: 'Katolik', value: 'Katolik' },
                  { label: 'Hindu', value: 'Hindu' },
                  { label: 'Buddha', value: 'Buddha' },
                  { label: 'Konghucu', value: 'Konghucu' },
                  { label: 'Lainnya', value: 'Lainnya' },
                ]}
              />
            </CCol>

            <CCol md={6}>
              <CFormSelect
                label="Status Perkawinan"
                name="status_perkawinan"
                value={form.status_perkawinan}
                onChange={handleChange}
                options={[
                  { label: 'Pilih Status Perkawinan', value: '' },
                  { label: 'Belum Kawin', value: 'BELUM_KAWIN' },
                  { label: 'Kawin', value: 'KAWIN' },
                  { label: 'Cerai Hidup', value: 'CERAI_HIDUP' },
                  { label: 'Cerai Mati', value: 'CERAI_MATI' },
                ]}
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                label="Pekerjaan"
                name="pekerjaan"
                value={form.pekerjaan}
                onChange={handleChange}
                placeholder="Masukkan pekerjaan"
              />
            </CCol>

            <CCol md={6}>
              <CFormSelect
                label="Pendidikan"
                name="pendidikan"
                value={form.pendidikan}
                onChange={handleChange}
                options={[
                  { label: 'Pilih Pendidikan', value: '' },
                  { label: 'Tidak Sekolah', value: 'TIDAK_SEKOLAH' },
                  { label: 'SD', value: 'SD' },
                  { label: 'SMP', value: 'SMP' },
                  { label: 'SMA / SMK', value: 'SMA' },
                  { label: 'D1', value: 'D1' },
                  { label: 'D2', value: 'D2' },
                  { label: 'D3', value: 'D3' },
                  { label: 'D4', value: 'D4' },
                  { label: 'S1', value: 'S1' },
                  { label: 'S2', value: 'S2' },
                  { label: 'S3', value: 'S3' },
                ]}
              />
            </CCol>
          </CRow>

          <hr className="my-4" />

          <h6 className="fw-bold mb-3">Alamat dan Kontak</h6>

          <CRow className="g-3">
            <CCol md={12}>
              <CFormTextarea
                label="Alamat Lengkap"
                name="alamat"
                value={form.alamat}
                onChange={handleChange}
                placeholder="Masukkan alamat lengkap"
                rows={2}
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                label="Provinsi"
                name="provinsi"
                value={form.provinsi}
                onChange={handleChange}
                placeholder="Masukkan provinsi"
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                label="Kabupaten / Kota"
                name="kabupaten"
                value={form.kabupaten}
                onChange={handleChange}
                placeholder="Masukkan kabupaten/kota"
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                label="Kecamatan"
                name="kecamatan"
                value={form.kecamatan}
                onChange={handleChange}
                placeholder="Masukkan kecamatan"
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                label="Kelurahan / Desa"
                name="kelurahan"
                value={form.kelurahan}
                onChange={handleChange}
                placeholder="Masukkan kelurahan/desa"
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                label="Kode Pos"
                name="kode_pos"
                value={form.kode_pos}
                onChange={handleChange}
                placeholder="Contoh: 40135"
                maxLength={5}
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                label="Nomor HP"
                name="no_hp"
                value={form.no_hp}
                onChange={handleChange}
                placeholder="Contoh: 081234567890"
              />
            </CCol>

            <CCol md={12}>
              <CFormInput
                type="email"
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Contoh: pasien@email.com"
              />
            </CCol>
          </CRow>

          <hr className="my-4" />

          <h6 className="fw-bold mb-3">Penanggung Jawab</h6>

          <CRow className="g-3">
            <CCol md={6}>
              <CFormInput
                label="Nama Penanggung Jawab"
                name="nama_penanggung_jawab"
                value={form.nama_penanggung_jawab}
                onChange={handleChange}
                placeholder="Masukkan nama penanggung jawab"
              />
            </CCol>

            <CCol md={6}>
              <CFormSelect
                label="Hubungan dengan Pasien"
                name="hubungan_penanggung_jawab"
                value={form.hubungan_penanggung_jawab}
                onChange={handleChange}
                options={[
                  { label: 'Pilih Hubungan', value: '' },
                  { label: 'Ayah', value: 'Ayah' },
                  { label: 'Ibu', value: 'Ibu' },
                  { label: 'Suami', value: 'Suami' },
                  { label: 'Istri', value: 'Istri' },
                  { label: 'Anak', value: 'Anak' },
                  { label: 'Saudara', value: 'Saudara' },
                  { label: 'Wali', value: 'Wali' },
                  { label: 'Lainnya', value: 'Lainnya' },
                ]}
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                label="Nomor HP Penanggung Jawab"
                name="no_hp_penanggung_jawab"
                value={form.no_hp_penanggung_jawab}
                onChange={handleChange}
                placeholder="Contoh: 081234567891"
              />
            </CCol>
          </CRow>

          <hr className="my-4" />

          <CRow>
            <CCol md={12}>
              <CFormCheck
                id="pasien_is_active"
                name="is_active"
                label="Pasien Aktif"
                checked={form.is_active}
                onChange={handleChange}
              />
            </CCol>
          </CRow>
        </CModalBody>

        <CModalFooter>
          <CButton
            color="secondary"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </CButton>

          <CButton
            color={initialData ? 'warning' : 'primary'}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <CSpinner size="sm" />
            ) : (
              initialData ? 'Ubah' : 'Simpan'
            )}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

export default PasienModal
