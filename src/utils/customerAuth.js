const CUSTOMER_SESSION_KEY = 'philo_customer_session'
const API_BASE = 'http://localhost:5000'

export function getCustomerSession() {
  try {
    const raw = localStorage.getItem(CUSTOMER_SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setCustomerSession(session) {
  if (session) {
    localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(session))
    window.dispatchEvent(new Event('customer-auth-changed'))
  }
}

export function clearCustomerSession() {
  localStorage.removeItem(CUSTOMER_SESSION_KEY)
  window.dispatchEvent(new Event('customer-auth-changed'))
}

export async function registerCustomer(name, email, phone, password) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password }),
    })
    const data = await res.json()
    if (res.ok && data.token) {
      setCustomerSession({ token: data.token, user: data.user })
      return { ok: true, user: data.user }
    }
    return { ok: false, error: data.message || 'Registration failed' }
  } catch (err) {
    return { ok: false, error: err.message }
  }
}

export async function loginCustomer(email, password) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (res.ok && data.token) {
      setCustomerSession({ token: data.token, user: data.user })
      return { ok: true, user: data.user }
    }
    return { ok: false, error: data.message || 'Login failed' }
  } catch (err) {
    return { ok: false, error: err.message }
  }
}

export async function resetCustomerPassword(email, newPassword) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword }),
    })
    const data = await res.json()
    if (res.ok) {
      return { ok: true }
    }
    return { ok: false, error: data.message || 'Reset failed' }
  } catch (err) {
    return { ok: false, error: err.message }
  }
}

export function logoutCustomer() {
  clearCustomerSession()
}

export async function fetchCustomerProfile() {
  const session = getCustomerSession()
  if (!session?.token) return null
  try {
    const res = await fetch(`${API_BASE}/api/customer/profile`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })
    if (res.ok) return await res.json()
    if (res.status === 401) clearCustomerSession()
    return null
  } catch {
    return null
  }
}

export async function fetchCustomerOrders() {
  const session = getCustomerSession()
  if (!session?.token) return []
  try {
    const res = await fetch(`${API_BASE}/api/customer/orders`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })
    if (res.ok) return await res.json()
    if (res.status === 401) clearCustomerSession()
    return []
  } catch {
    return []
  }
}
