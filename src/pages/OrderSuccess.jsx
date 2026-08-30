import { Link, useLocation } from 'react-router-dom'

export default function OrderSuccess() {
  const location = useLocation()
  const orderId = location.state?.orderId || 'SM-000000'

  return (
    <div className="container-bakery py-28 min-h-[70vh] flex flex-col items-center justify-center text-center">
      <span className="seal-badge w-24 h-24 bg-pista flex items-center justify-center text-4xl mb-6 animate-popIn">
        ✓
      </span>
      <h1 className="font-display text-4xl mb-3">Payment Successful / Order Confirmed</h1>
      <p className="text-cocoa/65 max-w-md mb-2">
        Thank you for ordering with Philo's Cakes. Your order reference is:
      </p>
      <p className="font-utility text-xl text-choc font-semibold mb-8">{orderId}</p>
      <p className="text-cocoa/60 max-w-md mb-8">
        Your payment has been verified successfully. We will contact you shortly for delivery details and updates.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        <Link to="/track-order" className="btn-secondary">Track My Order</Link>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/menu" className="btn-primary">Order More Treats</Link>
        <Link to="/" className="btn-secondary">Back to Home</Link>
      </div>
    </div>
  )
}
