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
  username: '',
  email: '',
  password: '',
  role_id: '',
  status: 0,
}

const UserModal = ({
  visible,
  onClose,
  onSubmit,
  loading = false,
  initialData = null,
  pegawaiOptions = [],
  roleOptions = [],
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
              role_id: initialData.role_id || '',
              status: initialData.status || 0,
              password: '',
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

    const payload = {
      ...form,
      pegawai_id: Number(form.pegawai_id),
      role_id: Number(form.role_id),
    }

    if (!payload.password) {
      delete payload.password
    }

    onSubmit(payload)
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
            {initialData ? 'Ubah Data Pengguna' : 'Tambah Data Pengguna'}
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CRow className="g-3">

            <CCol md={6}>
              <CFormSelect
                label="Pegawai"
                name="pegawai_id"
                value={form.pegawai_id}
                onChange={handleChange}
                required
                options={[
                  { label: 'Pilih Pegawai', value: '' },
                  ...pegawaiOptions.map((item) => ({
                    label: item.nama_lengkap,
                    value: item.id,
                  })),
                ]}
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Masukkan username"
                required
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                type="email"
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Masukkan email"
                required
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                type="password"
                label="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder={
                  initialData
                    ? 'Kosongkan jika tidak diubah'
                    : 'Masukkan password'
                }
                required={!initialData}
                autoComplete="new-password"
              />
            </CCol>

            <CCol md={6}>
              <CFormSelect
                label="Role"
                name="role_id"
                value={form.role_id}
                onChange={handleChange}
                required
                options={[
                  { label: 'Pilih Role', value: '' },
                  ...roleOptions.map((item) => ({
                    label: item.name,
                    value: item.id,
                  })),
                ]}
              />
            </CCol>

            <CCol md={6}>
              <CFormSelect
                label="Role"
                name="status"
                value={form.status}
                onChange={handleChange}
                required
                options={[
                  { label: 'Pilih Status', value: '' },
                  { label: 'Aktif', value: 10 },
                  { label: 'Tidak Aktif', value: 0 },
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

export default UserModal
