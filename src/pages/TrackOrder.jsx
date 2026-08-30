import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getOrderById, formatCurrency, ORDER_STATUS_OPTIONS } from '../utils/orderStorage'
import { useSocket } from '../context/SocketContext'

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('')
  const [searchedId, setSearchedId] = useState('')
  const { socket } = useSocket()
  const [refreshToken, setRefreshToken] = useState(0)
  const order = useMemo(() => getOrderById(searchedId), [searchedId, refreshToken])

  useEffect(() => {
    if (!socket || !searchedId) return

    const handleOrderUpdate = (updatedOrder) => {
      if (updatedOrder && updatedOrder.orderId === searchedId) {
        setRefreshToken((value) => value + 1)
      }
    }

    socket.on('orderStatusUpdated', handleOrderUpdate)
    return () => socket.off('orderStatusUpdated', handleOrderUpdate)
  }, [socket, searchedId])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchedId(orderId.trim())
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-cream-deep py-12">
        <div className="container-bakery">
          <span className="section-label">Order Tracking</span>
          <h1 className="text-4xl mt-3">Track Your Order</h1>
        </div>
      </div>

      <div className="container-bakery py-12">
        <div className="card-surface p-7 max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter your order ID"
              className="w-full bg-white border border-cream-line rounded-full px-5 py-3 text-sm outline-none focus:border-gold"
            />
            <button type="submit" className="btn-primary !py-3 !px-6">
              Track
            </button>
          </form>
        </div>

        {!searchedId ? (
          <div className="text-center py-16 text-cocoa/65">
            Enter your order ID to check the current status of your cake order.
          </div>
        ) : !order ? (
          <div className="text-center py-16 text-cocoa/65">
            No order found for <span className="font-semibold text-choc">{searchedId}</span>.
          </div>
        ) : (
          <div className="mt-10 max-w-3xl mx-auto space-y-6">
            <div className="card-surface p-7">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-cocoa/45">Order ID</p>
                  <h2 className="text-2xl mt-1">{order.orderId}</h2>
                </div>
                <span className="inline-flex items-center rounded-full bg-pista/60 px-3 py-1.5 text-sm font-medium text-cocoa">
                  {order.status}
                </span>
              </div>
            </div>

            <div className="card-surface p-7">
              <h3 className="text-xl mb-6">Progress</h3>
              <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
                {ORDER_STATUS_OPTIONS.map((status, index) => {
                  const currentIndex = ORDER_STATUS_OPTIONS.indexOf(order.status)
                  const active = currentIndex >= index
                  const isCurrent = currentIndex === index
                  const isLast = index === ORDER_STATUS_OPTIONS.length - 1

                  return (
                    <div key={status} className="flex items-center flex-1 min-w-[120px]">
                      <div className="flex items-center w-full">
                        <div className="flex flex-col items-center">
                          <span
                            className={`flex items-center justify-center rounded-full border-2 transition-all ${
                              isCurrent
                                ? 'h-5 w-5 border-choc bg-choc shadow-card ring-2 ring-rose-light'
                                : active
                                  ? 'h-4 w-4 border-choc bg-choc'
                                  : 'h-4 w-4 border-cream-line bg-white'
                            }`}
                          />
                          <span
                            className={`mt-2 text-center text-[11px] font-medium transition-colors ${
                              isCurrent ? 'text-choc font-semibold' : active ? 'text-choc' : 'text-cocoa/40'
                            }`}
                          >
                            {status}
                          </span>
                        </div>
                        {!isLast && (
                          <span
                            className={`ml-2 h-[2px] flex-1 rounded-full ${
                              currentIndex > index ? 'bg-choc' : 'bg-cream-line'
                            }`}
                          />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="card-surface p-7">
              <h3 className="text-xl mb-4">Order Details</h3>
              <div className="space-y-3 text-sm text-cocoa/70">
                <p><span className="font-semibold text-cocoa">Customer:</span> {order.form?.name}</p>
                <p><span className="font-semibold text-cocoa">Phone:</span> {order.form?.phone}</p>
                <p><span className="font-semibold text-cocoa">Email:</span> {order.form?.email}</p>
                <p><span className="font-semibold text-cocoa">Address:</span> {order.form?.address}</p>
                <p><span className="font-semibold text-cocoa">Delivery Date:</span> {order.form?.deliveryDate}</p>
                <p><span className="font-semibold text-cocoa">Delivery Time:</span> {order.form?.deliveryTime}</p>
                <p><span className="font-semibold text-cocoa">Payment Method:</span> {order.paymentMethod || 'UPI'}</p>
                <p><span className="font-semibold text-cocoa">Payment Status:</span> {order.paymentStatus || 'Pending'}</p>
                <p><span className="font-semibold text-cocoa">Total:</span> {formatCurrency(order.total)}</p>
              </div>
            </div>

            <div className="card-surface p-7">
              <h3 className="text-xl mb-4">Items</h3>
              <div className="space-y-3">
                {order.items?.map((item) => (
                  <div key={`${item.productId}-${item.sizeId}-${item.message || 'no-message'}`} className="flex items-center justify-between gap-3 border-b border-cream-line pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-cocoa">{item.name}</p>
                      <p className="text-xs text-cocoa/50">{item.sizeLabel} × {item.quantity}</p>
                    </div>
                    <span className="font-utility text-choc">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Link to="/menu" className="btn-primary">Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
