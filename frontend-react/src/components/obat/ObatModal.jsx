import React, { useState, useEffect } from 'react'

import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormCheck,
  CRow,
  CCol,
  CButton,
  CSpinner
} from '@coreui/react'

const initialForm = {
  kode: '',
  nama: '',
  satuan: '',
  is_active: true,
  stok: 0,
  stok_minimum: 0,
  harga_beli: 0,
  harga_jual: 0,
}

const ObatModal = ({
  visible,
  onClose,
  onSubmit,
  loading = false,
  initialData = null
}) => {
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    if (visible) {
      if (initialData) {
        setForm({
          kode: initialData.kode || '',
          nama: initialData.nama || '',
          satuan: initialData.satuan || '',
          is_active: initialData.is_active ?? true,
          stok: initialData.stokObat?.stok ?? 0,
          stok_minimum: initialData.stokObat?.stok_minimum ?? 0,
          harga_beli: initialData.stokObat?.harga_beli ?? 0,
          harga_jual: initialData.stokObat?.harga_jual ?? 0,
        })
      } else {
        setForm(initialForm)
      }
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
      stok: Number(form.stok),
      stok_minimum: Number(form.stok_minimum),
      harga_beli: Number(form.harga_beli),
      harga_jual: Number(form.harga_jual),
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
            {initialData ? 'Ubah Data Obat' : 'Tambah Data Obat'}
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CRow className="g-3">

            <CCol md={6}>
              <CFormInput
                label="Kode Obat"
                name="kode"
                value={form.kode}
                onChange={handleChange}
                placeholder="Contoh: OBT001"
                required
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                label="Satuan"
                name="satuan"
                value={form.satuan}
                onChange={handleChange}
                placeholder="Contoh: Tablet, Kapsul, Botol"
                required
              />
            </CCol>

            <CCol md={12}>
              <CFormInput
                label="Nama Obat"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                placeholder="Masukkan nama obat"
                required
              />
            </CCol>

            {initialData == null ? (
              <>
                <CCol md={6}>
                  <CFormInput
                    type="number"
                    label="Stok Awal"
                    name="stok"
                    value={form.stok}
                    onChange={handleChange}
                    placeholder="Masukkan jumlah stok"
                    min="0"
                    required
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="number"
                    label="Stok Minimum"
                    name="stok_minimum"
                    value={form.stok_minimum}
                    onChange={handleChange}
                    placeholder="Masukkan stok minimum"
                    min="0"
                    required
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="number"
                    label="Harga Beli (Rp)"
                    name="harga_beli"
                    value={form.harga_beli}
                    onChange={handleChange}
                    placeholder="Masukkan harga beli"
                    min="0"
                    step="0.01"
                    required
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="number"
                    label="Harga Jual (Rp)"
                    name="harga_jual"
                    value={form.harga_jual}
                    onChange={handleChange}
                    placeholder="Masukkan harga jual"
                    min="0"
                    step="0.01"
                    required
                  />
                </CCol>
              </>
            ) : null}

            <CCol md={12}>
              <CFormCheck
                id="is_active"
                name="is_active"
                label="Obat Aktif"
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

export default ObatModal