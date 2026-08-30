import { useEffect, useState } from 'react'
import { fetchCustomerOrders } from '../utils/customerAuth'

export default function CustomerOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const data = await fetchCustomerOrders()
      setOrders(data || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="bg-cream min-h-screen py-12">
      <div className="container-bakery">
        <h1 className="text-4xl font-display text-cocoa mb-8">My Orders</h1>

        {loading ? (
          <p className="text-cocoa/60">Loading...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-cocoa/60">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.orderId} className="bg-white rounded-[28px] border border-cream-line p-6 shadow-card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-cocoa">Order {order.orderId}</h3>
                    <p className="text-sm text-cocoa/60">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${order.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-lg font-semibold text-choc">₹{order.total}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
