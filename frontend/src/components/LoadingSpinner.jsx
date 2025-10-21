import React from 'react'

export default function LoadingSpinner({ size = 'default', text = 'Loading...' }) {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    default: 'w-12 h-12 border-3',
    large: 'w-16 h-16 border-4'
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`${sizeClasses[size]} border-red-200 border-t-red-600 rounded-full animate-spin`}></div>
      {text && <p className="mt-4 text-gray-600 text-sm md:text-base">{text}</p>}
    </div>
  )
}
