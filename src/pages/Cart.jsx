import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal, deliveryFee, total, freeDeliveryThreshold } =
    useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="container-bakery py-28 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <span className="text-6xl mb-5">🛒</span>
        <h1 className="font-display text-3xl mb-3">Your cart is empty</h1>
        <p className="text-cocoa/60 mb-8 max-w-sm">
          Looks like you haven't added any sweet treats yet. Let's fix that.
        </p>
        <Link to="/menu" className="btn-primary">Browse Cakes</Link>
      </div>
    )
  }

  const amountToFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal)

  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-cream-deep py-12">
        <div className="container-bakery">
          <span className="section-label">Step 1 of 2</span>
          <h1 className="text-4xl mt-3">Your Cart</h1>
        </div>
      </div>

      <div className="container-bakery py-12 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {amountToFreeDelivery > 0 ? (
            <div className="bg-rose-light/60 border border-rose/40 text-cocoa text-sm rounded-2xl px-5 py-3.5">
              Add <span className="font-semibold">₹{amountToFreeDelivery.toFixed(2)}</span> more
              to unlock <span className="font-semibold">free delivery</span> 🚚
            </div>
          ) : (
            <div className="bg-pista-light/60 border border-pista/50 text-cocoa text-sm rounded-2xl px-5 py-3.5">
              🎉 You've unlocked free delivery on this order!
            </div>
          )}

          {items.map((item) => (
            <div
              key={item.key}
              className="card-surface p-4 sm:p-5 flex gap-4 items-center animate-fadeUp"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 rounded-2xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg truncate">{item.name}</h3>
                    <p className="text-xs text-cocoa/50 mt-0.5">{item.sizeLabel}</p>
                    {item.message && (
                      <p className="text-xs text-choc-light mt-1 italic">
                        Message: &ldquo;{item.message}&rdquo;
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.key)}
                    className="text-cocoa/40 hover:text-rose-dark transition-colors shrink-0"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="inline-flex items-center border border-cream-line rounded-full bg-white overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.key, item.quantity - 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-cream-deep transition-colors"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-utility font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.key, item.quantity + 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-cream-deep transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-utility font-semibold text-choc">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <Link to="/menu" className="inline-flex items-center gap-2 text-choc text-sm font-medium mt-2 hover:underline">
            ← Continue shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card-surface p-7 sticky top-28">
            <h2 className="font-display text-xl mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-cocoa/70">
                <span>Subtotal</span>
                <span className="font-utility">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-cocoa/70">
                <span>Delivery</span>
                <span className="font-utility">
                  {deliveryFee === 0 ? 'Free' : `₹${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-cream-line pt-3 flex justify-between text-base font-semibold text-cocoa">
                <span>Total</span>
                <span className="font-utility text-choc">₹{total.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={() => navigate('/checkout')} className="btn-primary w-full mt-7">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
