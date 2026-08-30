import { useEffect, useMemo, useState } from 'react'
import { getStoredOrders, formatCurrency, ORDER_STATUS_OPTIONS, updateOrderStatus, getOrderSummary } from '../utils/orderStorage'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const summary = useMemo(() => getOrderSummary(), [orders])

  const refreshOrders = () => {
    const stored = getStoredOrders()
    const sorted = [...stored].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    setOrders(sorted)
  }

  useEffect(() => {
    refreshOrders()
  }, [])

  const handleStatusChange = (orderId, status) => {
    updateOrderStatus(orderId, status)
    refreshOrders()
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-cream-deep py-12">
        <div className="container-bakery">
          <span className="section-label">Admin Panel</span>
          <h1 className="text-4xl mt-3">Orders Dashboard</h1>
        </div>
      </div>

      <div className="container-bakery py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="card-surface p-5">
            <p className="text-sm text-cocoa/55">Total Orders</p>
            <h3 className="text-3xl mt-2">{summary.totalOrders}</h3>
          </div>
          <div className="card-surface p-5">
            <p className="text-sm text-cocoa/55">Pending</p>
            <h3 className="text-3xl mt-2">{summary.pending}</h3>
          </div>
          <div className="card-surface p-5">
            <p className="text-sm text-cocoa/55">Confirmed</p>
            <h3 className="text-3xl mt-2">{summary.confirmed}</h3>
          </div>
          <div className="card-surface p-5">
            <p className="text-sm text-cocoa/55">Preparing</p>
            <h3 className="text-3xl mt-2">{summary.preparing}</h3>
          </div>
          <div className="card-surface p-5">
            <p className="text-sm text-cocoa/55">Revenue</p>
            <h3 className="text-3xl mt-2">{formatCurrency(summary.totalRevenue)}</h3>
          </div>
        </div>

        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-cream-deep text-cocoa">
                <tr>
                  <th className="px-5 py-4">Order ID</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Phone</th>
                  <th className="px-5 py-4">Products</th>
                  <th className="px-5 py-4">Payment</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-8 text-center text-cocoa/60">
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.orderId} className="border-t border-cream-line align-top">
                      <td className="px-5 py-4 font-semibold text-choc">{order.orderId}</td>
                      <td className="px-5 py-4">
                        <div>{order.form?.name}</div>
                        <div className="text-cocoa/50">{order.form?.deliveryDate}</div>
                      </td>
                      <td className="px-5 py-4">{order.form?.phone}</td>
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          {order.items?.map((item) => (
                            <div key={`${order.orderId}-${item.productId}-${item.sizeId}`} className="text-cocoa/70">
                              {item.name} ({item.sizeLabel}) × {item.quantity}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-cocoa">{order.paymentMethod || 'UPI'}</div>
                        <div className="text-cocoa/50">{order.paymentStatus || 'Pending'}</div>
                      </td>
                      <td className="px-5 py-4 font-utility text-choc">{formatCurrency(order.total)}</td>
                      <td className="px-5 py-4">
                        <select
                          value={order.status || 'Pending'}
                          onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                          className="bg-white border border-cream-line rounded-full px-3 py-2 text-sm outline-none focus:border-gold"
                        >
                          {ORDER_STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
