import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getCustomerSession } from '../utils/customerAuth'

export default function ProtectedCustomerRoute({ children }) {
  const location = useLocation()
  const [session, setSession] = useState(getCustomerSession())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
    const onAuthChanged = () => setSession(getCustomerSession())
    window.addEventListener('customer-auth-changed', onAuthChanged)
    return () => window.removeEventListener('customer-auth-changed', onAuthChanged)
  }, [])

  if (loading) return null

  if (!session?.token) {
    const redirect = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?redirect=${redirect}`} replace />
  }

  return children
}
