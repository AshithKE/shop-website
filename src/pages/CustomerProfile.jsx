import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCustomerSession, logoutCustomer, fetchCustomerProfile } from '../utils/customerAuth'

export default function CustomerProfile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const data = await fetchCustomerProfile()
      setProfile(data)
      setLoading(false)
    }
    load()
  }, [])

  const handleLogout = () => {
    logoutCustomer()
    navigate('/')
  }

  if (loading) return <div className="bg-cream min-h-screen flex items-center justify-center">Loading...</div>

  const session = getCustomerSession()
  const user = session?.user || profile

  return (
    <div className="bg-cream min-h-screen py-12">
      <div className="container-bakery max-w-md">
        <h1 className="text-4xl font-display text-cocoa mb-8">My Profile</h1>

        {user && (
          <div className="bg-white rounded-[28px] border border-cream-line p-8 shadow-card space-y-4">
            <div>
              <label className="text-sm text-cocoa/60">Name</label>
              <p className="text-lg font-semibold text-cocoa">{user.name}</p>
            </div>
            <div>
              <label className="text-sm text-cocoa/60">Email</label>
              <p className="text-lg font-semibold text-cocoa">{user.email}</p>
            </div>
            {user.phone && (
              <div>
                <label className="text-sm text-cocoa/60">Phone</label>
                <p className="text-lg font-semibold text-cocoa">{user.phone}</p>
              </div>
            )}
            <button onClick={handleLogout} className="btn-secondary w-full mt-6">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
