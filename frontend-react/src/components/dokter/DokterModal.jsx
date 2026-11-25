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
  CRow,
  CCol,
  CButton,
  CSpinner
} from '@coreui/react'

const initialForm = {
  pegawai_id: '',
  no_str: '',
  masa_berlaku_str: '',
  no_sip: '',
  masa_berlaku_sip: '',
  spesialisasi: '',
  sub_spesialisasi: '',
}

const DokterModal = ({
  visible,
  onClose,
  onSubmit,
  loading = false,
  initialData = null,
  pegawaiOptions = [],
}) => {
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    if (visible) {
      setForm(
        initialData
          ? {
              ...initialForm,
              ...initialData,
              pegawai_id: initialData.pegawai_id || '',
              sub_spesialisasi: initialData.sub_spesialisasi || '',
            }
          : initialForm
      )
    }
  }, [visible, initialData])

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    onSubmit({
      ...form,
      pegawai_id: Number(form.pegawai_id),
      sub_spesialisasi: form.sub_spesialisasi || null,
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
            {initialData ? 'Ubah Data Dokter' : 'Tambah Data Dokter'}
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CRow className="g-3">

            <CCol md={12}>
              <CFormSelect
                label="Pegawai"
                name="pegawai_id"
                value={form.pegawai_id}
                onChange={handleChange}
                required
                options={[
                  { label: 'Pilih Pegawai Dokter', value: '' },
                  ...pegawaiOptions.map((item) => ({
                    label: `${item.nama_lengkap}`,
                    value: item.id,
                  })),
                ]}
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                label="No. STR"
                name="no_str"
                value={form.no_str}
                onChange={handleChange}
                placeholder="Masukkan nomor STR"
                required
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                type="date"
                label="Masa Berlaku STR"
                name="masa_berlaku_str"
                value={form.masa_berlaku_str}
                onChange={handleChange}
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                label="No. SIP"
                name="no_sip"
                value={form.no_sip}
                onChange={handleChange}
                placeholder="Masukkan nomor SIP"
                required
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                type="date"
                label="Masa Berlaku SIP"
                name="masa_berlaku_sip"
                value={form.masa_berlaku_sip}
                onChange={handleChange}
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                label="Spesialisasi"
                name="spesialisasi"
                value={form.spesialisasi}
                onChange={handleChange}
                placeholder="Contoh: Penyakit Dalam"
                required
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                label="Sub Spesialisasi"
                name="sub_spesialisasi"
                value={form.sub_spesialisasi}
                onChange={handleChange}
                placeholder="Contoh: Kardiologi"
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

export default DokterModal
