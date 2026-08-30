import {
  products as defaultProducts,
  categories as defaultCategories,
  syncProductsFromStorage,
  saveProductsCatalog,
} from '../data/products'
import { getStoredOrders } from './orderStorage'

export const ADMIN_STORAGE_KEY = 'philo_admin_session'
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'philo123',
}

const PRODUCT_STORAGE_KEY = 'philo_admin_products_v1'
const CATEGORY_STORAGE_KEY = 'philo_admin_categories_v1'

export function getAdminSession() {
  try {
    const raw = sessionStorage.getItem(ADMIN_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setAdminSession(value) {
  sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(value))
}

export function clearAdminSession() {
  sessionStorage.removeItem(ADMIN_STORAGE_KEY)
}

export function loginAdmin(username, password) {
  const trimmedUser = String(username || '').trim()
  const trimmedPass = String(password || '').trim()
  const valid = trimmedUser === ADMIN_CREDENTIALS.username && trimmedPass === ADMIN_CREDENTIALS.password

  if (valid) {
    setAdminSession({ username: trimmedUser, loggedInAt: new Date().toISOString() })
    return true
  }

  return false
}

export function getCategories() {
  try {
    const raw = localStorage.getItem(CATEGORY_STORAGE_KEY)
    if (raw) {
      const list = JSON.parse(raw)
      if (Array.isArray(list) && list.length > 0) return list
    }
  } catch {
    // fallback below
  }

  localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(defaultCategories))
  return defaultCategories
}

export function syncCategoriesFromServer(categoriesList) {
  const next = Array.isArray(categoriesList) ? categoriesList : defaultCategories
  localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(next))
  return next
}

export function saveCategories(list) {
  const categories = Array.isArray(list) ? list : []
  localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories))
  return categories
}

export function getProducts() {
  const products = syncProductsFromStorage()
  if (Array.isArray(products) && products.length > 0) return products

  const next = Array.isArray(defaultProducts) ? [...defaultProducts] : []
  localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(next))
  return next
}

export function syncProductsFromServer(productsList) {
  const next = Array.isArray(productsList) ? productsList : defaultProducts
  localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(next))
  return next
}

export function saveProducts(list) {
  const products = Array.isArray(list) ? list : []
  return saveProductsCatalog(products)
}

export function upsertProduct(product) {
  const list = getProducts()
  const normalized = {
    ...product,
    id: product.id || String(product.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    price: Number(product.price || 0),
    stock: Number(product.stock || 0),
    discount: Number(product.discount || 0),
    rating: Number(product.rating || 4.7),
    reviews: Number(product.reviews || 0),
    bestSeller: Boolean(product.bestSeller),
    category: product.category || 'classic',
    image: product.image || 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&w=900&q=80',
    sizes: Array.isArray(product.sizes) && product.sizes.length > 0
      ? product.sizes.map((size) => ({
          id: size.id || size.label || 'default',
          label: size.label || 'Regular',
          price: Number(size.price || product.price || 0),
        }))
      : [{ id: 'regular', label: 'Regular', price: Number(product.price || 0) }],
  }

  const existingIndex = list.findIndex((item) => item.id === normalized.id)
  const next = [...list]

  if (existingIndex >= 0) {
    next[existingIndex] = { ...next[existingIndex], ...normalized }
  } else {
    next.push(normalized)
  }

  saveProducts(next)
  return normalized
}

export function deleteProduct(productId) {
  const next = getProducts().filter((product) => product.id !== productId)
  saveProducts(next)
  return next
}

export function getLowStockProducts() {
  return getProducts().filter((product) => Number(product.stock || 0) <= 5)
}

export function getCustomerAccounts() {
  const orders = getStoredOrders()
  const accountMap = new Map()

  orders.forEach((order) => {
    const customer = order.form || {}
    const email = (customer.email || 'unknown@philo').trim()
    const phone = (customer.phone || 'Unknown').trim()
    const key = `${email}|${phone}`

    if (!accountMap.has(key)) {
      accountMap.set(key, {
        name: customer.name || 'Guest Customer',
        email,
        phone,
        totalSpent: 0,
        orders: 0,
        lastOrder: order.createdAt || new Date().toISOString(),
      })
    }

    const account = accountMap.get(key)
    account.totalSpent += Number(order.total || 0)
    account.orders += 1
    account.lastOrder = new Date(account.lastOrder) > new Date(order.createdAt || 0)
      ? account.lastOrder
      : order.createdAt || account.lastOrder
  })

  return Array.from(accountMap.values()).sort((a, b) => b.totalSpent - a.totalSpent)
}
