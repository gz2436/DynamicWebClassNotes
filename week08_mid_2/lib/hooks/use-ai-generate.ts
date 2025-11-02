'use client'

import { useState, useCallback } from 'react'
import { logError, handleApiError } from '@/lib/error-handler'

export type GenerationType = 'experience' | 'skills' | 'summary'

interface GenerateOptions {
  type: GenerationType
  context: Record<string, unknown>
}

interface UseAIGenerateReturn<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  generate: (options: GenerateOptions) => Promise<T | null>
  reset: () => void
}

export function useAIGenerate<T>(): UseAIGenerateReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(async (options: GenerateOptions): Promise<T | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const result = await response.json()
      setData(result)
      return result
    } catch (err) {
      const errorMessage = handleApiError(err)
      logError(err, `AI Generate - ${options.type}`)
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return { data, isLoading, error, generate, reset }
}
