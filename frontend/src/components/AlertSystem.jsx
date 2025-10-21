import React, { createContext, useContext, useState, useEffect } from 'react'

const AlertContext = createContext()

export function useAlert() {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider')
  }
  return context
}

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([])
  const [confirmDialog, setConfirmDialog] = useState(null)

  const showAlert = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random()
    const alert = { id, message, type, duration }
    
    setAlerts(prev => [...prev, alert])
    
    if (duration > 0) {
      setTimeout(() => {
        removeAlert(id)
      }, duration)
    }
    
    return id
  }

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
  }

  const showConfirm = (message, options = {}) => {
    return new Promise((resolve) => {
      setConfirmDialog({
        message,
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        type: options.type || 'warning',
        onConfirm: () => {
          setConfirmDialog(null)
          resolve(true)
        },
        onCancel: () => {
          setConfirmDialog(null)
          resolve(false)
        }
      })
    })
  }

  const value = {
    showAlert,
    showConfirm,
    success: (msg, duration) => showAlert(msg, 'success', duration),
    error: (msg, duration) => showAlert(msg, 'error', duration),
    warning: (msg, duration) => showAlert(msg, 'warning', duration),
    info: (msg, duration) => showAlert(msg, 'info', duration)
  }

  return (
    <AlertContext.Provider value={value}>
      {children}
      <AlertContainer alerts={alerts} onRemove={removeAlert} />
      {confirmDialog && <ConfirmDialog {...confirmDialog} />}
    </AlertContext.Provider>
  )
}

function AlertContainer({ alerts, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none">
      {alerts.map(alert => (
        <Alert key={alert.id} alert={alert} onRemove={onRemove} />
      ))}
    </div>
  )
}

function Alert({ alert, onRemove }) {
  const [isExiting, setIsExiting] = useState(false)

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => onRemove(alert.id), 300)
  }

  const getAlertStyles = () => {
    const baseStyles = 'flex items-start gap-3 p-4 rounded-lg shadow-lg border pointer-events-auto transition-all duration-300'
    
    const typeStyles = {
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800'
    }

    const animationClass = isExiting 
      ? 'opacity-0 translate-x-full' 
      : 'opacity-100 translate-x-0'

    return `${baseStyles} ${typeStyles[alert.type]} ${animationClass}`
  }

  const getIcon = () => {
    const iconClass = 'w-6 h-6 flex-shrink-0'
    
    switch (alert.type) {
      case 'success':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      case 'error':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )
      case 'warning':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )
      case 'info':
      default:
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  return (
    <div className={getAlertStyles()}>
      {getIcon()}
      <div className="flex-1 text-sm font-medium">{alert.message}</div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
        aria-label="Close alert"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  )
}

function ConfirmDialog({ message, confirmText, cancelText, type, onConfirm, onCancel }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10)
  }, [])

  const handleConfirm = () => {
    setIsVisible(false)
    setTimeout(onConfirm, 200)
  }

  const handleCancel = () => {
    setIsVisible(false)
    setTimeout(onCancel, 200)
  }

  const getIconColor = () => {
    switch (type) {
      case 'danger':
        return 'text-red-600'
      case 'warning':
        return 'text-yellow-600'
      case 'info':
        return 'text-blue-600'
      default:
        return 'text-yellow-600'
    }
  }

  const getConfirmButtonStyles = () => {
    const baseStyles = 'px-6 py-2.5 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
    
    switch (type) {
      case 'danger':
        return `${baseStyles} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`
      case 'warning':
        return `${baseStyles} bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500`
      case 'info':
        return `${baseStyles} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`
      default:
        return `${baseStyles} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`
    }
  }

  return (
    <div 
      className={`fixed inset-0 z-[10000] flex items-center justify-center p-4 transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={handleCancel}
      />
      
      {/* Dialog */}
      <div 
        className={`relative bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-200 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        <div className="p-6">
          {/* Icon */}
          <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 ${
            type === 'danger' ? 'bg-red-100' : type === 'info' ? 'bg-blue-100' : 'bg-yellow-100'
          }`}>
            <svg className={`h-8 w-8 ${getIconColor()}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          {/* Message */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Action</h3>
            <p className="text-gray-600">{message}</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 px-6 py-2.5 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 ${getConfirmButtonStyles()}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
