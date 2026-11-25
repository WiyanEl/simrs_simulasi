import React, { useState, useEffect } from 'react'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilPencil, cilTrash } from '@coreui/icons'

import UserModal from '../../../components/user/UserModal'

import useUser from '../../../hooks/useUser.js'

const User = () => {
  const { loading, getData, getDataReferences, createData, getDataById, updateData, deteleData } = useUser()

  const [user, setUser] = useState([])
  const [roleOption, setRoleOption] = useState([])
  const [pegawaiOption, setPegawaiOption] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const [filters, setFilters] = useState({
    search: '',
    role_id: '',
  })

  const fetchData = async (params = filters) => {
    try {
      const data = await getData(params)

      setUser(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Gagal mengambil data user:', error)

      setUser([])
    }
  }

  const fetchReferencesData = async () => {
    try {
      const data = await getDataReferences()

      setRoleOption(Array.isArray(data.role) ? data.role : [])
      setPegawaiOption(Array.isArray(data.pegawai) ? data.pegawai : [])
    } catch (error) {
      console.error('Gagal mengambil data referensi:', error)

      setRoleOption([])
      setPegawaiOption([])
    }
  }

  useEffect(() => {
    fetchData({})
    fetchReferencesData()
  }, [])

  const handleFilterChange = (e) => {
    const { name, value } = e.target

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSearch = (e) => {
    e.preventDefault()

    const params = {
      search: filters.search,
      role_id: filters.role_id
    }

    fetchData(params)
  }

  const handleReset = () => {
    const defaultFilters = {
      search: '',
      role_id: ''
    }

    setFilters(defaultFilters)
    fetchData(defaultFilters)
  }

  const handleCreate = async (formData) => {
    try {
      setSaving(true)

      if (selectedUser) {
        await updateData(selectedUser.id, formData)
      } else {
        await createData(formData)
      }

      await fetchData()

      setModalVisible(false)

    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = async (id) => {
    try {
      const data = await getDataById(id)

      setSelectedUser(data)
      setModalVisible(true)

    } catch (error) {
      console.error('Gagal mengambil detail pengguna:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      const data = await deteleData(id)

      fetchData()
    } catch (error) {
      console.error('Gagal menghapus pengguna:', error)
    }
  }

  return (
    <>
      <CCard>
        <CCardHeader>
          <strong>Master Data Pengguna</strong>
        </CCardHeader>
        <CCardBody>
          <form onSubmit={handleSearch}>
            <CRow className="mb-3">
              <CCol md={3}>
                <CFormInput
                  label="Pencarian"
                  name="search"
                  placeholder="Username, email. atau nama pengguna ..."
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </CCol>

              <CCol md={2}>
                <CFormSelect
                  label="Role"
                  name="role_id"
                  value={filters.role_id}
                  onChange={handleFilterChange}
                  options={[
                    { label: 'Semua Role', value: '' },
                    ...roleOption.map((item) => ({
                      label: `${item.name}`,
                      value: item.id,
                    })),
                  ]}
                />
              </CCol>

              <CCol md={3} className="d-flex align-items-end gap-2">
                <CButton
                  type="submit"
                  color="primary"
                  disabled={loading}
                >
                  Cari
                </CButton>

                <CButton
                  type="button"
                  color="secondary"
                  variant="outline"
                  onClick={handleReset}
                >
                  Reset
                </CButton>
              </CCol>
            </CRow>
          </form>

          <CRow className="mb-3">
            <CCol>
              <CButton
                color="primary"
                onClick={() => {
                  setSelectedUser(null)
                  setModalVisible(true)
                }}
              >
                <CIcon icon={cilPlus} /> Tambah
              </CButton>
            </CCol>
          </CRow>

          <div className="table-responsive">
            <CTable hover bordered align="middle" responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>No</CTableHeaderCell>
                  <CTableHeaderCell>Nama Pegawai</CTableHeaderCell>
                  <CTableHeaderCell>Username</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Role / Hak Akses</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Aksi</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={7} className="text-center py-4">
                      <CSpinner size="sm" className="me-2" />
                      Memuat data pengguna...
                    </CTableDataCell>
                  </CTableRow>
                ) : user.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={7} className="text-center py-4">
                      Tidak ada data pengguna.
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  user.map((item, index) => (
                    <CTableRow key={item.id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>

                      <CTableDataCell>
                        <strong>{item.pegawai?.nama || '-'}</strong>
                        <div className="small text-body-secondary">
                          ID Pegawai: {item.pegawai_id || '-'}
                        </div>
                      </CTableDataCell>

                      <CTableDataCell>
                        <strong>{item.username}</strong>
                      </CTableDataCell>

                      <CTableDataCell>
                        {item.email || '-'}
                      </CTableDataCell>

                      <CTableDataCell>
                        <div className="d-flex flex-wrap gap-1">
                          {item.roles?.length > 0 ? (
                            item.roles.map((role) => (
                              <CBadge
                                key={role.id}
                                color="info"
                              >
                                {role.name}
                              </CBadge>
                            ))
                          ) : (
                            <span className="text-body-secondary">Belum ada role</span>
                          )}
                        </div>
                      </CTableDataCell>

                      <CTableDataCell>
                        <CBadge color={item.status === 10 ? 'success' : 'danger'}>
                          {item.status === 10 ? 'Aktif' : 'Tidak Aktif'}
                        </CBadge>
                      </CTableDataCell>

                      <CTableDataCell>
                        <div className="d-flex align-items-center gap-2">
                          <CButton
                            color="warning"
                            size="sm"
                            title="Ubah Pengguna"
                            onClick={() => handleEdit(item.id)}
                          >
                            <CIcon icon={cilPencil} />
                          </CButton>

                          {item.status === 10 ? (
                            <CButton
                              color="danger"
                              size="sm"
                              title="Nonaktifkan Pengguna"
                              onClick={() => handleDelete(item.id)}
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>
                          ) : null}
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </div>

          <div className="text-body-secondary small">
            Total data: {user.length} pengguna
          </div>

        </CCardBody>
      </CCard>

      <UserModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
          setSelectedUser(null)
        }}
        onSubmit={handleCreate}
        loading={saving}
        initialData={selectedUser}
        pegawaiOptions={pegawaiOption}
        roleOptions={roleOption}
      />
    </>
  )
}

export default User