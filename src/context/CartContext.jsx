import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'sweetmoments_cart_v1'
const DELIVERY_FLAT_FEE = 6
const FREE_DELIVERY_THRESHOLD = 60

function loadInitialCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// A cart line is uniquely identified by product id + size id + message,
// so the same cake with a different size or message is a separate line.
function lineKey(item) {
  return [item.productId, item.sizeId, item.message || ''].join('::')
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadInitialCart)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2400)
    return () => clearTimeout(t)
  }, [toast])

  const addItem = useCallback((newItem) => {
    setItems((prev) => {
      const key = lineKey(newItem)
      const existing = prev.find((it) => lineKey(it) === key)
      if (existing) {
        return prev.map((it) =>
          lineKey(it) === key ? { ...it, quantity: it.quantity + newItem.quantity } : it
        )
      }
      return [...prev, newItem]
    })
    setToast(`${newItem.name} added to cart`)
  }, [])

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((it) => lineKey(it) !== key))
  }, [])

  const updateQuantity = useCallback((key, quantity) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((it) => lineKey(it) !== key)
        : prev.map((it) => (lineKey(it) === key ? { ...it, quantity } : it))
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const cartWithKeys = useMemo(
    () => items.map((it) => ({ ...it, key: lineKey(it) })),
    [items]
  )

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [items]
  )

  const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FLAT_FEE
  const total = subtotal + deliveryFee
  const itemCount = items.reduce((sum, it) => sum + it.quantity, 0)

  const value = {
    items: cartWithKeys,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    deliveryFee,
    total,
    itemCount,
    freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
    toast,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
