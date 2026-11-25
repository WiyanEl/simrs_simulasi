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
  kode: '',
  nama: '',
  jenis_ruangan: '',
  lokasi: '',
  keterangan: '',
  is_active: true,
}

const RuanganModal = ({
  visible,
  onClose,
  onSubmit,
  loading = false,
  initialData = null
}) => {
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
          <CModalTitle>
            {initialData ? 'Ubah Data Ruangan' : 'Tambah Data Ruangan'}
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CRow className="g-3">

            <CCol md={6}>
              <CFormInput
                label="Kode Ruangan"
                name="kode"
                value={form.kode}
                onChange={handleChange}
                placeholder="Contoh: POL001"
                required
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                label="Nama Ruangan"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                placeholder="Contoh: Poli Penyakit Dalam"
                required
              />
            </CCol>

            <CCol md={6}>
              <CFormSelect
                label="Jenis Ruangan"
                name="jenis_ruangan"
                value={form.jenis_ruangan}
                onChange={handleChange}
                required
                options={[
                  { label: 'Pilih Jenis Ruangan', value: '' },
                  { label: 'Rawat Jalan', value: 'RAWAT_JALAN' },
                  { label: 'Gawat Darurat', value: 'GAWAT_DARURAT' },
                  { label: 'Penunjang', value: 'PENUNJANG' },
                  { label: 'Lainnya', value: 'LAINNYA' }
                ]}
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                label="Lokasi"
                name="lokasi"
                value={form.lokasi}
                onChange={handleChange}
                placeholder="Contoh: Gedung A Lantai 1"
              />
            </CCol>

            <CCol md={12}>
              <CFormTextarea
                label="Keterangan"
                name="keterangan"
                value={form.keterangan}
                onChange={handleChange}
                placeholder="Masukkan keterangan ruangan"
                rows={3}
              />
            </CCol>

            <CCol md={12}>
              <CFormCheck
                id="ruangan_is_active"
                name="is_active"
                label="Ruangan Aktif"
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

export default RuanganModal
