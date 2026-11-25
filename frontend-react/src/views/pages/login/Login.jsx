import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CRow,
  CTooltip,
  CSpinner 
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { logo } from 'src/assets/brand/logo'
import { eye } from 'src/assets/icons/eye'

import { appHelper as H } from './../../../helper/appHelper.js'
import useAuth from 'src/hooks/useAuth'

const Login = () => {
  const navigate = useNavigate()
  const { login, loading, error } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  })

  useEffect(() => {
    if (window !== 'undefined') {
      const token = H.storage.get('access_token')
      const userLogin = H.storage.get('auth_user')

      if (token && userLogin) {
        // navigate('/dashboard', { replace: true })
        window.location.href = '#/dashboard'
      }
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const togglePassword = () => {
    setShowPassword((prev) => !prev)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const result = await login(credentials)

    if (result.success) {
      // navigate('/dashboard', { replace: true })
      setTimeout(() => {
        window.location.href = '/'
      }, 2000)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8} lg={6} xl={5}>
            <div className="d-flex flex-column gap-4">

              <div className="text-center">
                <CIcon icon={logo} height={48} />
              </div>

              <CCard className="p-4">
                <CCardBody className="d-flex flex-column gap-4">

                  <h2 className="h5 text-center mb-0">
                    Login SIMRS
                  </h2>

                  <CForm className="row gy-3" onSubmit={handleSubmit}>

                    <CCol xs={12}>
                      <CFormLabel htmlFor="username">
                        Username
                      </CFormLabel>

                      <CFormInput
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Masukkan username"
                        autoComplete="username"
                        value={credentials.username}
                        onChange={handleChange}
                        required
                      />
                    </CCol>

                    <CCol xs={12}>
                      <CFormLabel htmlFor="password">
                        Password
                      </CFormLabel>

                      <CInputGroup>
                        <CFormInput
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Masukkan password"
                          autoComplete="current-password"
                          value={credentials.password}
                          onChange={handleChange}
                          required
                        />

                        <CInputGroupText>
                          <CTooltip
                            content={
                              showPassword
                                ? 'Hide password'
                                : 'Show password'
                            }
                          >
                            <CButton
                              type="button"
                              color="link"
                              className="p-0 link-secondary"
                              onClick={() =>
                                setShowPassword((prev) => !prev)
                              }
                              aria-label={
                                showPassword
                                  ? 'Hide password'
                                  : 'Show password'
                              }
                            >
                              <CIcon icon={eye} size="sm" />
                            </CButton>
                          </CTooltip>
                        </CInputGroupText>
                      </CInputGroup>
                    </CCol>

                    <CCol xs={12}>
                      <CButton
                        color="primary"
                        type="submit"
                        className="w-100"
                        disabled={loading}
                      >
                        {loading ? <CSpinner /> : 'Login'}
                      </CButton>
                    </CCol>

                  </CForm>
                </CCardBody>
              </CCard>

            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
