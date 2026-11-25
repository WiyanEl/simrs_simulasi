import React, { useState, useEffect } from 'react'

import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormSelect,
  CFormInput,
  CRow,
  CCol,
  CButton,
  CSpinner
} from '@coreui/react'

const initialForm = {
  dokter_id: '',
  ruangan_id: '',
  hari: '',
  jam_mulai: '',
  jam_selesai: '',
  kuota: 0,
  is_active: true,
}

const hariOptions = [
  { label: 'Senin', value: 1 },
  { label: 'Selasa', value: 2 },
  { label: 'Rabu', value: 3 },
  { label: 'Kamis', value: 4 },
  { label: 'Jumat', value: 5 },
  { label: 'Sabtu', value: 6 },
  { label: 'Minggu', value: 7 },
]

const JadwalDokterModal = ({
  visible,
  onClose,
  onSubmit,
  loading = false,
  initialData = null,
  dokterOptions = [],
  ruanganOptions = [],
}) => {
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    if (visible) {
      setForm(
        initialData
          ? {
              ...initialForm,
              ...initialData,
              dokter_id: initialData.dokter_id || '',
              ruangan_id: initialData.ruangan_id || '',
              hari: initialData.hari || '',
              kuota: initialData.kuota ?? 0,
              is_active: initialData.is_active ?? true,
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
      dokter_id: Number(form.dokter_id),
      ruangan_id: Number(form.ruangan_id),
      hari: Number(form.hari),
      kuota: Number(form.kuota),
      is_active: form.is_active === true || form.is_active === 'true',
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
            {initialData ? 'Ubah Jadwal Dokter' : 'Tambah Jadwal Dokter'}
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CRow className="g-3">

            <CCol md={6}>
              <CFormSelect
                label="Dokter"
                name="dokter_id"
                value={form.dokter_id}
                onChange={handleChange}
                required
                options={[
                  { label: 'Pilih Dokter', value: '' },
                  ...dokterOptions.map((item) => ({
                    label: item.nama_lengkap,
                    value: item.id,
                  })),
                ]}
              />
            </CCol>

            <CCol md={6}>
              <CFormSelect
                label="Ruangan"
                name="ruangan_id"
                value={form.ruangan_id}
                onChange={handleChange}
                required
                options={[
                  { label: 'Pilih Ruangan', value: '' },
                  ...ruanganOptions.map((item) => ({
                    label: item.nama,
                    value: item.id,
                  })),
                ]}
              />
            </CCol>

            <CCol md={12}>
              <CFormSelect
                label="Hari"
                name="hari"
                value={form.hari}
                onChange={handleChange}
                required
                options={[
                  { label: 'Pilih Hari', value: '' },
                  ...hariOptions,
                ]}
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                type="time"
                label="Jam Mulai"
                name="jam_mulai"
                value={form.jam_mulai}
                onChange={handleChange}
                required
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                type="time"
                label="Jam Selesai"
                name="jam_selesai"
                value={form.jam_selesai}
                onChange={handleChange}
                required
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                type="number"
                label="Kuota Pasien"
                name="kuota"
                value={form.kuota}
                onChange={handleChange}
                placeholder="Masukkan kuota pasien"
                min={1}
                required
              />
            </CCol>

            <CCol md={6}>
              <CFormSelect
                label="Status"
                name="is_active"
                value={String(form.is_active)}
                onChange={handleChange}
                options={[
                  { label: 'Aktif', value: 'true' },
                  { label: 'Tidak Aktif', value: 'false' },
                ]}
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

export default JadwalDokterModal
