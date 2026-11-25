import React, {
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react'

import {
  CToast,
  CToastBody,
  CToastClose,
  CToaster,
} from '@coreui/react'

const ToastContainer = forwardRef((props, ref) => {
  const [toast, setToast] = useState(null)

  useImperativeHandle(ref, () => ({
    show: ({ severity, summary, detail, life = 3000 }) => {
      setToast({
        severity,
        summary,
        detail,
        life,
        visible: true,
      })
    },
  }))

  const colors = {
    success: 'success',
    error: 'danger',
    warn: 'warning',
    info: 'info',
    primary: 'primary',
    contrast: 'dark',
  }

  const handleClose = () => {
    setToast(null)
  }

  return (
    <CToaster placement="top-end" className="p-3">
      {toast && (
        <CToast
          key={`${toast.summary}-${toast.detail}`}
          visible={toast.visible}
          color={colors[toast.severity] || 'secondary'}
          className="text-white align-items-center"
          autohide
          delay={toast.life}
          onClose={handleClose}
        >
          <div className="d-flex">
            <CToastBody>
              <strong>{toast.summary}</strong>
              <div>{toast.detail}</div>
            </CToastBody>

            <CToastClose
              className="me-2 m-auto"
              white
              onClick={handleClose}
            />
          </div>
        </CToast>
      )}
    </CToaster>
  )
})

ToastContainer.displayName = 'ToastContainer'

export default ToastContainer
