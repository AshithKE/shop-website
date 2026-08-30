import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAdmin } from '../utils/adminStorage'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('philo123')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const valid = loginAdmin(username, password)

    if (!valid) {
      setError('Invalid admin credentials.')
      return
    }

    navigate('/admin')
  }

  return (
    <div className="bg-cream min-h-screen flex items-center justify-center px-4 py-16">
      <div className="card-surface w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <span className="section-label">Restricted Access</span>
          <h1 className="text-3xl mt-3">Admin Login</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-cocoa mb-1.5 block">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white border border-cream-line rounded-xl px-4 py-3 text-sm outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-cocoa mb-1.5 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-cream-line rounded-xl px-4 py-3 text-sm outline-none focus:border-gold"
            />
          </div>

          {error && <p className="text-xs text-rose-dark">{error}</p>}

          <button type="submit" className="btn-primary w-full">Login to Dashboard</button>
        </form>
      </div>
    </div>
  )
}
