'use client'

import { useToast } from '@/lib/hooks/use-toast'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'glass-card glass-transition',
            'flex items-start gap-3 p-4 shadow-lg',
            'animate-in slide-in-from-right duration-300'
          )}
        >
          <div className="flex-shrink-0 mt-0.5">
            {toast.type === 'success' && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            {toast.type === 'error' && (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
            {toast.type === 'warning' && (
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            )}
            {toast.type === 'info' && (
              <Info className="h-5 w-5 text-blue-500" />
            )}
          </div>

          <p className="flex-1 text-sm">{toast.message}</p>

          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
