import React, { createContext, useContext, useState, useCallback } from 'react'

const AlertContext = createContext(null)

export function AlertProvider({ children }) {
  const [modal, setModal] = useState(null)

  const alert = useCallback((message, opts = {}) => {
    return new Promise(resolve => {
      setModal({ type: 'alert', message, opts, resolve })
    })
  }, [])

  const confirm = useCallback((message, opts = {}) => {
    return new Promise(resolve => {
      setModal({ type: 'confirm', message, opts, resolve })
    })
  }, [])

  const close = useCallback((result) => {
    if (modal && modal.resolve) modal.resolve(result)
    setModal(null)
  }, [modal])

  return (
    <AlertContext.Provider value={{ alert, confirm }}>
      {children}
      {modal && (
        <AlertModal modal={modal} onClose={close} />
      )}
    </AlertContext.Provider>
  )
}

export function useAlert() {
  const ctx = useContext(AlertContext)
  if (!ctx) throw new Error('useAlert must be used within AlertProvider')
  return ctx
}

function AlertModal({ modal, onClose }) {
  const { type, message, opts } = modal
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={() => onClose(false)} />

      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="bg-gray-900 text-white rounded-lg shadow-xl p-6">
          <div className="mb-4">
            <p className="text-sm leading-relaxed">{message}</p>
          </div>
          <div className="flex justify-end gap-3">
            {type === 'confirm' && (
              <button
                className="px-4 py-2 bg-transparent border border-gray-600 text-gray-300 rounded hover:bg-gray-800"
                onClick={() => onClose(false)}
              >
                Cancel
              </button>
            )}

            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={() => onClose(true)}
            >
              {type === 'confirm' ? (opts.confirmText || 'Delete') : (opts.okText || 'OK')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlertProvider
