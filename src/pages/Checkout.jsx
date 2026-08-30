import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { saveOrder } from '../utils/orderStorage'
import { getCustomerSession } from '../utils/customerAuth'

const BAKERY_WHATSAPP_NUMBER = '916363407808'

const initialForm = {
  name: '',
  phone: '',
  email: '',
  address: '',
  deliveryDate: '',
  deliveryTime: '',
  cakeMessage: '',
  notes: '',
}

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

export default function Checkout() {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [paymentMethod, setPaymentMethod] = useState('Dummy Payment')
  const [paymentStatus, setPaymentStatus] = useState('Awaiting payment')
  const [paymentError, setPaymentError] = useState('')
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Please enter your full name'
    if (!/^[0-9+\-\s]{7,15}$/.test(form.phone.trim())) errs.phone = 'Enter a valid phone number'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = 'Enter a valid email address'
    if (!form.address.trim() || form.address.trim().length < 10)
      errs.address = 'Enter a complete delivery address'
    if (!form.deliveryDate) errs.deliveryDate = 'Choose a delivery date'
    else if (form.deliveryDate < todayISO()) errs.deliveryDate = 'Delivery date cannot be in the past'
    if (!form.deliveryTime) errs.deliveryTime = 'Choose a delivery time'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const orderSummaryText = useMemo(() => {
    const lines = items.map(
      (it) =>
        `• ${it.name} (${it.sizeLabel}) x${it.quantity} — ₹${(it.price * it.quantity).toFixed(2)}${
          it.message ? ` [Message: "${it.message}"]` : ''
        }`
    )
    return lines.join('\n')
  }, [items])

  const buildWhatsAppLink = () => {
    const msg =
      `*New Order — Philo's Cakes*\n\n` +
      `${orderSummaryText}\n\n` +
      `Subtotal: ₹${subtotal.toFixed(2)}\nDelivery: ${deliveryFee === 0 ? 'Free' : `₹${deliveryFee.toFixed(2)}` }\nTotal: ₹${total.toFixed(2)}\nPayment: ${paymentMethod}\nPayment Status: ${paymentStatus}\n\n` +
      `*Customer Details*\n` +
      `Name: ${form.name || '-'}\nPhone: ${form.phone || '-'}\nEmail: ${form.email || '-'}\n` +
      `Address: ${form.address || '-'}\nDelivery Date: ${form.deliveryDate || '-'}\nDelivery Time: ${form.deliveryTime || '-'}\n` +
      (form.cakeMessage ? `Cake Message: ${form.cakeMessage}\n` : '') +
      (form.notes ? `Order Notes: ${form.notes}\n` : '')
    return `https://wa.me/${BAKERY_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
  }

  const handleWhatsAppOrder = () => {
    if (!validate()) return
    window.open(buildWhatsAppLink(), '_blank', 'noopener,noreferrer')
  }

  const finishOrder = (orderMethod, paymentState = 'Paid') => {
    const orderId = `PH-${Date.now().toString().slice(-6)}`
    const savedOrder = saveOrder({
      orderId,
      form,
      items,
      subtotal,
      deliveryFee,
      total,
      paymentMethod: orderMethod,
      paymentStatus: paymentState,
      status: 'Confirmed',
    })

    sessionStorage.setItem('sweetmoments_last_order', JSON.stringify(savedOrder))
    clearCart()
    navigate('/order-success', {
      state: {
        orderId,
        paymentMethod: orderMethod,
        paymentStatus: paymentState,
        total,
      },
    })
  }

  const submitOrderToServer = async (orderData) => {
    const session = getCustomerSession()
    const headers = {
      'Content-Type': 'application/json',
    }
    if (session?.token) {
      headers.Authorization = `Bearer ${session.token}`
    }

    const response = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers,
      body: JSON.stringify(orderData),
    })

    if (!response.ok && response.status === 401) {
      navigate('/login?redirect=/checkout')
      throw new Error('Session expired. Please login again.')
    }

    return response.json()
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setPaymentError('')
    setIsProcessingPayment(true)

    try {
      if (paymentMethod === 'Dummy Payment' || paymentMethod === 'Cash on Delivery') {
        setPaymentStatus(paymentMethod === 'Dummy Payment' ? 'Paid' : 'Pending confirmation')
        
        const orderId = `PH-${Date.now().toString().slice(-6)}`
        await submitOrderToServer({
          orderId,
          items,
          subtotal,
          deliveryFee,
          total,
          paymentMethod,
          paymentStatus: paymentMethod === 'Dummy Payment' ? 'Paid' : 'Pending confirmation',
          status: 'Confirmed',
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          address: form.address,
          deliveryDate: form.deliveryDate,
          deliveryTime: form.deliveryTime,
          cakeMessage: form.cakeMessage,
          notes: form.notes,
        })

        finishOrder(paymentMethod, paymentMethod === 'Dummy Payment' ? 'Paid' : 'Pending confirmation')
        return
      }

      const orderId = `PH-${Date.now().toString().slice(-6)}`
      const response = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          customer: {
            name: form.name,
            phone: form.phone,
            email: form.email,
            address: form.address,
            deliveryDate: form.deliveryDate,
            deliveryTime: form.deliveryTime,
          },
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            sizeId: item.sizeId,
            sizeLabel: item.sizeLabel,
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal,
          deliveryFee,
          total,
          notes: form.notes,
          cakeMessage: form.cakeMessage,
        }),
      })

      const rawText = await response.text()
      const data = rawText ? JSON.parse(rawText) : {}

      if (!response.ok) {
        throw new Error(data.message || 'Unable to start payment.')
      }

      const razorpayOptions = {
        key: data.keyId,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Philo's Cakes",
        description: 'Cake order payment',
        order_id: data.order.id,
        handler: async function (razorpayResponse) {
          try {
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...razorpayResponse,
                orderId,
                customer: {
                  name: form.name,
                  phone: form.phone,
                  email: form.email,
                  address: form.address,
                  deliveryDate: form.deliveryDate,
                  deliveryTime: form.deliveryTime,
                },
                items: items.map((item) => ({
                  productId: item.productId,
                  name: item.name,
                  sizeId: item.sizeId,
                  sizeLabel: item.sizeLabel,
                  quantity: item.quantity,
                  price: item.price,
                })),
                subtotal,
                deliveryFee,
                total,
                notes: form.notes,
                cakeMessage: form.cakeMessage,
              }),
            })

            const verifyText = await verifyResponse.text()
            const verifyData = verifyText ? JSON.parse(verifyText) : {}

            if (!verifyResponse.ok) {
              throw new Error(verifyData.message || 'Payment verification failed.')
            }

            const savedOrder = saveOrder({
              orderId,
              form,
              items,
              subtotal,
              deliveryFee,
              total,
              paymentMethod: 'Razorpay',
              paymentStatus: 'Paid',
              status: 'Confirmed',
              razorpayOrderId: razorpayResponse.razorpay_order_id,
              razorpayPaymentId: razorpayResponse.razorpay_payment_id,
              razorpaySignature: razorpayResponse.razorpay_signature,
            })

            sessionStorage.setItem('sweetmoments_last_order', JSON.stringify(savedOrder))
            clearCart()
            navigate('/order-success', {
              state: {
                orderId,
                paymentMethod: 'Razorpay',
                paymentStatus: 'Paid',
                total,
              },
            })
          } catch (error) {
            setPaymentError(error.message || 'Payment verification failed. Please contact support.')
            setIsProcessingPayment(false)
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        notes: {
          address: form.address,
          orderId,
        },
        theme: {
          color: '#7b4b3a',
        },
        modal: {
          ondismiss: () => {
            setIsProcessingPayment(false)
            setPaymentError('Payment was cancelled. Please try again.')
          },
        },
      }

      const rzp = new window.Razorpay(razorpayOptions)
      rzp.open()
    } catch (error) {
      setPaymentStatus('Demo mode active')
      setPaymentError('Razorpay is unavailable right now. Your order has been marked as a demo payment and can still be placed.')
      setIsProcessingPayment(false)
      finishOrder('Dummy Payment', 'Paid')
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-bakery py-28 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <span className="text-6xl mb-5">🧁</span>
        <h1 className="font-display text-3xl mb-3">Nothing to checkout yet</h1>
        <p className="text-cocoa/60 mb-8">Add a few sweet treats to your cart first.</p>
        <Link to="/menu" className="btn-primary">Browse Cakes</Link>
      </div>
    )
  }

  const inputClass = (field) =>
    `w-full bg-white border rounded-xl px-4 py-3 text-sm outline-none transition-colors ${
      errors[field] ? 'border-rose-dark focus:border-rose-dark' : 'border-cream-line focus:border-gold'
    }`

  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-cream-deep py-12">
        <div className="container-bakery">
          <span className="section-label">Step 2 of 2</span>
          <h1 className="text-4xl mt-3">Checkout</h1>
        </div>
      </div>

      <div className="container-bakery py-12 grid lg:grid-cols-3 gap-10">
        <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-8" noValidate>
          <div className="card-surface p-7">
            <h2 className="font-display text-xl mb-6">Contact Details</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-cocoa mb-1.5 block">Full Name *</label>
                <input value={form.name} onChange={update('name')} className={inputClass('name')} placeholder="Jane Doe" />
                {errors.name && <p className="text-xs text-rose-dark mt-1.5">{errors.name}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-cocoa mb-1.5 block">Phone Number *</label>
                <input value={form.phone} onChange={update('phone')} className={inputClass('phone')} placeholder="+91 6363407808" />
                {errors.phone && <p className="text-xs text-rose-dark mt-1.5">{errors.phone}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-cocoa mb-1.5 block">Email *</label>
                <input value={form.email} onChange={update('email')} type="email" className={inputClass('email')} placeholder="jane@email.com" />
                {errors.email && <p className="text-xs text-rose-dark mt-1.5">{errors.email}</p>}
              </div>
            </div>
          </div>

          <div className="card-surface p-7">
            <h2 className="font-display text-xl mb-6">Delivery Details</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-cocoa mb-1.5 block">Delivery Address *</label>
                <textarea
                  value={form.address}
                  onChange={update('address')}
                  rows={3}
                  className={inputClass('address')}
                  placeholder="House / flat no., street, area, city, pincode"
                />
                {errors.address && <p className="text-xs text-rose-dark mt-1.5">{errors.address}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-cocoa mb-1.5 block">Delivery Date *</label>
                <input
                  value={form.deliveryDate}
                  onChange={update('deliveryDate')}
                  type="date"
                  min={todayISO()}
                  className={inputClass('deliveryDate')}
                />
                {errors.deliveryDate && <p className="text-xs text-rose-dark mt-1.5">{errors.deliveryDate}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-cocoa mb-1.5 block">Delivery Time *</label>
                <select value={form.deliveryTime} onChange={update('deliveryTime')} className={inputClass('deliveryTime')}>
                  <option value="">Select a time slot</option>
                  <option value="9am - 12pm">9:00 AM – 12:00 PM</option>
                  <option value="12pm - 3pm">12:00 PM – 3:00 PM</option>
                  <option value="3pm - 6pm">3:00 PM – 6:00 PM</option>
                  <option value="6pm - 9pm">6:00 PM – 9:00 PM</option>
                </select>
                {errors.deliveryTime && <p className="text-xs text-rose-dark mt-1.5">{errors.deliveryTime}</p>}
              </div>
            </div>
          </div>

          <div className="card-surface p-7">
            <h2 className="font-display text-xl mb-6">Payment</h2>
            <div className="space-y-5">
              <div className="rounded-2xl bg-rose-light/40 border border-cream-line p-4 text-sm text-cocoa/75">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-cocoa/45">Secure payment</p>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      paymentStatus === 'Paid'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {paymentStatus}
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="text-base font-semibold text-cocoa">Payment method</p>
                  <label className="block text-sm font-medium text-cocoa mb-1.5">Choose a payment option</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className={inputClass('paymentMethod')}
                  >
                    <option value="Dummy Payment">Dummy Payment</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                    <option value="Razorpay">Razorpay</option>
                  </select>
                  <p className="text-cocoa/70">Final amount to pay: ₹{total.toFixed(2)}</p>
                  <p className="text-xs text-cocoa/55">
                    {paymentMethod === 'Razorpay'
                      ? 'This will try the Razorpay checkout when keys are configured.'
                      : paymentMethod === 'Cash on Delivery'
                        ? 'Payment will be collected when the order is delivered.'
                        : 'Demo payment accepted instantly for testing and preview flow.'}
                  </p>
                </div>
              </div>

              {paymentError && (
                <p className="text-xs text-rose-dark mt-1.5">{paymentError}</p>
              )}

              <div>
                <label className="text-sm font-medium text-cocoa mb-1.5 block">
                  Cake Message <span className="text-cocoa/40 font-normal">(optional)</span>
                </label>
                <input
                  value={form.cakeMessage}
                  onChange={update('cakeMessage')}
                  className={inputClass('cakeMessage')}
                  placeholder="e.g. Happy Anniversary, Sam & Priya!"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-cocoa mb-1.5 block">
                  Order Notes <span className="text-cocoa/40 font-normal">(optional)</span>
                </label>
                <textarea
                  value={form.notes}
                  onChange={update('notes')}
                  rows={3}
                  className={inputClass('notes')}
                  placeholder="Allergies, delivery instructions, gate codes, etc."
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button type="submit" className="btn-primary flex-1" disabled={isProcessingPayment}>
              {isProcessingPayment ? 'Processing...' : 'Proceed to Payment'}
            </button>
            <button type="button" onClick={handleWhatsAppOrder} className="btn-secondary flex-1 !border-pista !text-cocoa hover:!bg-pista">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.5-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z" />
                <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
              </svg>
              Order via WhatsApp
            </button>
          </div>
          <p className="text-xs text-cocoa/45">
            * Placing an order confirms you agree to our delivery terms. WhatsApp orders open a
            pre-filled message you can review and send directly to our bakery team.
          </p>
        </form>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card-surface p-7 sticky top-28">
            <h2 className="font-display text-xl mb-6">Order Summary</h2>
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {items.map((it) => (
                <div key={it.key} className="flex gap-3 items-center">
                  <img src={it.image} alt={it.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{it.name}</p>
                    <p className="text-xs text-cocoa/50">{it.sizeLabel} × {it.quantity}</p>
                  </div>
                  <span className="text-sm font-utility font-semibold text-choc">
                    ₹{(it.price * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-cream-line mt-5 pt-5 space-y-3 text-sm">
              <div className="flex justify-between text-cocoa/70">
                <span>Subtotal</span>
                <span className="font-utility">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-cocoa/70">
                <span>Delivery</span>
                <span className="font-utility">{deliveryFee === 0 ? 'Free' : `₹${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="border-t border-cream-line pt-3 flex justify-between text-base font-semibold">
                <span>Total</span>
                <span className="font-utility text-choc">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
