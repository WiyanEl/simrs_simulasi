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
  kategori: '',
  deskripsi: '',
  tarif: '',
  is_active: true,
}

const TindakanModal = ({
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
              tarif: initialData.tarif || '',
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
      tarif: form.tarif.toString(),
    })
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
            {initialData ? 'Ubah Data Tindakan' : 'Tambah Data Tindakan'}
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CRow className="g-3">

            <CCol md={6}>
              <CFormInput
                label="Kode Tindakan"
                name="kode"
                value={form.kode}
                onChange={handleChange}
                placeholder="Contoh: TDK001"
                required
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                label="Nama Tindakan"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                placeholder="Contoh: Konsultasi Dokter Umum"
                required
              />
            </CCol>

            <CCol md={6}>
              <CFormSelect
                label="Kategori"
                name="kategori"
                value={form.kategori}
                onChange={handleChange}
                required
                options={[
                  { label: 'Pilih Kategori', value: '' },
                  { label: 'Konsultasi', value: 'KONSULTASI' },
                  { label: 'Pemeriksaan', value: 'PEMERIKSAAN' },
                  { label: 'Laboratorium', value: 'LABORATORIUM' },
                  { label: 'Radiologi', value: 'RADIOLOGI' },
                  { label: 'Tindakan Medis', value: 'TINDAKAN_MEDIS' },
                  { label: 'Operasi', value: 'OPERASI' },
                  { label: 'Lainnya', value: 'LAINNYA' }
                ]}
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                type="number"
                label="Tarif (Rp)"
                name="tarif"
                value={form.tarif}
                onChange={handleChange}
                placeholder="Contoh: 85000"
                min="0"
                step="0.01"
                required
              />
            </CCol>

            <CCol md={12}>
              <CFormTextarea
                label="Deskripsi"
                name="deskripsi"
                value={form.deskripsi}
                onChange={handleChange}
                placeholder="Masukkan deskripsi tindakan"
                rows={3}
              />
            </CCol>

            <CCol md={12}>
              <CFormCheck
                id="tindakan_is_active"
                name="is_active"
                label="Tindakan Aktif"
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

export default TindakanModal
