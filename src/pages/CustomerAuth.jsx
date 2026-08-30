import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { loginCustomer, registerCustomer, resetCustomerPassword, getCustomerSession } from '../utils/customerAuth'

export default function CustomerAuth() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const redirect = searchParams.get('redirect') || '/shop'

  useEffect(() => {
    if (getCustomerSession()) navigate(redirect)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (mode === 'login') {
        const res = await loginCustomer(form.email, form.password)
        if (res.ok) {
          navigate(redirect)
        } else {
          setError(res.error)
        }
      } else if (mode === 'signup') {
        if (form.password !== form.confirmPassword) {
          setError('Passwords do not match')
        } else if (form.password.length < 6) {
          setError('Password must be at least 6 characters')
        } else {
          const res = await registerCustomer(form.name, form.email, form.phone, form.password)
          if (res.ok) {
            navigate(redirect)
          } else {
            setError(res.error)
          }
        }
      } else if (mode === 'reset') {
        if (form.password.length < 6) {
          setError('Password must be at least 6 characters')
        } else {
          const res = await resetCustomerPassword(form.email, form.password)
          if (res.ok) {
            setError('')
            setMode('login')
            setForm({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
          } else {
            setError(res.error)
          }
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-[28px] border border-cream-line shadow-card max-w-md w-full p-8">
        <div className="text-center mb-8">
          <span className="text-5xl mb-3 inline-block">🍰</span>
          <h1 className="text-3xl mt-3 font-display text-cocoa">
            {mode === 'login' && 'Customer Login'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'reset' && 'Reset Password'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="input-field"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
                className="input-field"
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="input-field"
          />

          <input
            type="password"
            name="password"
            placeholder={mode === 'reset' ? 'New Password' : 'Password'}
            value={form.password}
            onChange={handleChange}
            required
            className="input-field"
          />

          {(mode === 'signup' || mode === 'reset') && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="input-field"
            />
          )}

          {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Processing...' : mode === 'login' ? 'Login' : mode === 'signup' ? 'Sign Up' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-6 space-y-3 text-center">
          {mode === 'login' && (
            <>
              <button
                onClick={() => {
                  setMode('reset')
                  setError('')
                }}
                className="text-amber-700 hover:text-amber-900 font-medium text-sm block w-full"
              >
                Forgot Password?
              </button>
              <p className="text-cocoa/60 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setMode('signup')
                    setError('')
                  }}
                  className="text-amber-700 hover:text-amber-900 font-semibold"
                >
                  Sign Up
                </button>
              </p>
            </>
          )}

          {mode === 'signup' && (
            <p className="text-cocoa/60 text-sm">
              Already have an account?{' '}
              <button
                onClick={() => {
                  setMode('login')
                  setError('')
                }}
                className="text-amber-700 hover:text-amber-900 font-semibold"
              >
                Login
              </button>
            </p>
          )}

          {mode === 'reset' && (
            <button
              onClick={() => {
                setMode('login')
                setError('')
              }}
              className="text-amber-700 hover:text-amber-900 font-medium text-sm block w-full"
            >
              Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
