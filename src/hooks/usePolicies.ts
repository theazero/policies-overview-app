import { useEffect, useState } from 'react'
import type { Policy } from '../types'

function isPolicy(value: unknown): value is Policy {
  if (typeof value !== 'object' || value === null) return false
  const policy = value as Record<string, unknown>
  return typeof policy.policyNumber === 'number'
    && typeof policy.productName === 'string'
    && typeof policy.policyDescription === 'string'
    && (policy.policyStatus === 'Active' || policy.policyStatus === 'Inactive')
    && typeof policy.policyStartDate === 'string'
    && typeof policy.yearlyPrice === 'number'
}

export function usePolicies() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadPolicies() {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL
        if (!baseUrl) throw new Error('API-adress saknas')
        const response = await fetch(`${baseUrl.replace(/\/$/, '')}/policies/List`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('Kunde inte hämta försäkringar')
        const data: unknown = await response.json()
        if (!Array.isArray(data) || !data.every(isPolicy)) throw new Error('Ogiltigt API-svar')
        if (!controller.signal.aborted) setPolicies(data)
      } catch {
        if (!controller.signal.aborted) setError(true)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void loadPolicies()
    return () => controller.abort()
  }, [attempt])

  function retry() {
    setLoading(true)
    setError(false)
    setAttempt(current => current + 1)
  }

  return { policies, loading, error, retry }
}
