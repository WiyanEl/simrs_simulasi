import React, { Suspense, useEffect, useRef } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import ToastContainer from './components/ToastContainer'
import { appHelper } from './helper/appHelper'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

const Login = React.lazy(() => import('./views/pages/login/Login'))

const App = () => {
  const toastRef = useRef(null)

  const { isColorModeSet, setColorMode } = useColorModes(
    'coreui-free-react-admin-template-theme',
  )

  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const theme = urlParams.get('theme')

    if (theme && /^[A-Za-z0-9\s]+$/.test(theme)) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, [])

  useEffect(() => {
    appHelper.setToast(toastRef.current)

    return () => {
      appHelper.setToast(null)
    }
  }, [])

  return (
    <>
      <ToastContainer ref={toastRef} />

      <HashRouter>
        <Suspense
          fallback={
            <div className="pt-3 text-center">
              <CSpinner color="primary" variant="grow" />
            </div>
          }
        >
          <Routes>
            {/* Default Route */}
            <Route
              path="/"
              element={<Navigate to="/login" replace />}
            />

            {/* Public Route */}
            <Route
              path="/login"
              element={<Login />}
            />

            {/* Protected / Main Application */}
            <Route
              path="/*"
              element={<DefaultLayout />}
            />
          </Routes>
        </Suspense>
      </HashRouter>
    </>
  )
}

export default App