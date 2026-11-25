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
  CSpinner
} from '@coreui/react'

const initialForm = {
  kode_pegawai: '',
  nip: '',
  nama_lengkap: '',
  jenis_kelamin: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  no_hp: '',
  email: '',
  alamat: '',
  jenis_pegawai: '',
  tanggal_bergabung: '',
  is_active: true,
}

const PegawaiModal = ({ visible, onClose, onSubmit, loading = false, initialData = null }) => {
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    if (visible) {
      setForm(initialData || initialForm)
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
    onSubmit(form)
  }

  return (
    <CModal
      visible={visible}
      onClose={onClose}
      size="lg"
      backdrop="static"
    >
      <CForm onSubmit={handleSubmit}>
        <CModalHeader>
          <CModalTitle>{initialData ? 'Ubah Data Pegawai' : 'Tambah Data Pegawai'}</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CRow className="g-3">

            <CCol md={6}>
              <CFormInput
                label="Kode Pegawai"
                name="kode_pegawai"
                value={form.kode_pegawai}
                onChange={handleChange}
                placeholder="Contoh: PGW001"
                required
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                label="NIP"
                name="nip"
                value={form.nip}
                onChange={handleChange}
                placeholder="Masukkan NIP"
              />
            </CCol>

            <CCol md={12}>
              <CFormInput
                label="Nama Lengkap"
                name="nama_lengkap"
                value={form.nama_lengkap}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                required
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
                label="Jenis Pegawai"
                name="jenis_pegawai"
                value={form.jenis_pegawai}
                onChange={handleChange}
                required
                options={[
                  { label: 'Pilih Jenis Pegawai', value: '' },
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
              <CFormInput
                label="No. HP"
                name="no_hp"
                value={form.no_hp}
                onChange={handleChange}
                placeholder="08xxxxxxxxxx"
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                type="email"
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="nama@example.com"
              />
            </CCol>

            <CCol md={12}>
              <CFormTextarea
                label="Alamat"
                name="alamat"
                value={form.alamat}
                onChange={handleChange}
                placeholder="Masukkan alamat lengkap"
                rows={2}
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                type="date"
                label="Tanggal Bergabung"
                name="tanggal_bergabung"
                value={form.tanggal_bergabung}
                onChange={handleChange}
              />
            </CCol>

            <CCol md={6} className="d-flex align-items-end">
              <CFormCheck
                id="is_active"
                name="is_active"
                label="Pegawai Aktif"
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
            {loading ? <CSpinner /> : (initialData ? 'Ubah' : 'Simpan')}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

export default PegawaiModal