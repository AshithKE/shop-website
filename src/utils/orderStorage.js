const STORAGE_KEY = 'philo_orders_v1'

export const ORDER_STATUS_OPTIONS = [
  'Pending',
  'Accepted',
  'Preparing',
  'Out for delivery',
  'Delivered',
  'Rejected',
]

export const PAYMENT_METHODS = [
  'UPI',
  'Bank Transfer',
  'Cash on Delivery',
]

export function formatCurrency(value) {
  return `₹${Number(value || 0).toFixed(2)}`
}

export function getStoredOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveOrder(orderData) {
  const orders = getStoredOrders()
  const order = {
    ...orderData,
    status: orderData.status || 'Pending',
    createdAt: orderData.createdAt || new Date().toISOString(),
  }

  orders.push(order)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  return order
}

export function updateOrderStatus(orderId, status) {
  const orders = getStoredOrders()
  const updated = orders.map((order) =>
    order.orderId === orderId ? { ...order, status } : order
  )

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))

  if (typeof window !== 'undefined' && orderId) {
    const selectedOrder = updated.find((order) => order.orderId === orderId)
    fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        paymentStatus: selectedOrder?.paymentStatus || 'Pending',
      }),
    }).catch(() => {
      // Ignore server sync failures and keep local order flow working.
    })
  }

  return updated
}

export function getOrderById(orderId) {
  return getStoredOrders().find((order) => order.orderId === orderId) || null
}

export function getOrderSummary() {
  const orders = getStoredOrders()
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0)

  return {
    totalOrders: orders.length,
    pending: orders.filter((order) => order.status === 'Pending').length,
    confirmed: orders.filter((order) => ['Accepted', 'Confirmed'].includes(order.status || '')).length,
    preparing: orders.filter((order) => order.status === 'Preparing').length,
    delivered: orders.filter((order) => order.status === 'Delivered').length,
    totalRevenue,
  }
}
