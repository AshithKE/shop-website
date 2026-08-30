import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { categories as defaultCategories } from '../data/products'
import { clearAdminSession, getCategories, getCustomerAccounts, getLowStockProducts, getProducts, saveCategories, saveProducts, upsertProduct, deleteProduct, getAdminSession } from '../utils/adminStorage'
import { formatCurrency, getStoredOrders, ORDER_STATUS_OPTIONS, updateOrderStatus } from '../utils/orderStorage'

const emptyProductForm = {
  id: '',
  name: '',
  category: 'classic',
  description: '',
  price: '',
  stock: '',
  discount: '',
  image: '',
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const adminSession = getAdminSession()
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [productForm, setProductForm] = useState(emptyProductForm)
  const [editingId, setEditingId] = useState('')

  useEffect(() => {
    if (!adminSession) {
      navigate('/admin/login')
      return
    }

    refreshData()
  }, [adminSession, navigate])

  const refreshData = () => {
    const storedOrders = getStoredOrders()
    const sortedOrders = [...storedOrders].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    setOrders(sortedOrders)
    setProducts(getProducts())
    setCategories(getCategories())
  }

  const summary = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0)
    const pending = orders.filter((order) => (order.status || 'Pending') === 'Pending').length
    const confirmed = orders.filter((order) => ['Accepted', 'Confirmed'].includes(order.status || '')).length
    const preparing = orders.filter((order) => (order.status || 'Preparing') === 'Preparing').length
    const refunded = orders.filter((order) => (order.status || 'Refunded') === 'Refunded').length
    const lowStock = getLowStockProducts()

    return {
      totalOrders: orders.length,
      totalRevenue,
      pending,
      confirmed,
      preparing,
      refunded,
      lowStock: lowStock.length,
      customerAccounts: getCustomerAccounts().length,
    }
  }, [orders])

  const handleStatusChange = (orderId, value) => {
    updateOrderStatus(orderId, value)
    refreshData()
  }

  const handleRefund = (orderId) => {
    const stored = getStoredOrders()
    const updated = stored.map((order) =>
      order.orderId === orderId ? { ...order, status: 'Refunded', paymentStatus: 'Refunded' } : order
    )
    localStorage.setItem('philo_orders_v1', JSON.stringify(updated))
    refreshData()
  }

  const handleProductSubmit = (event) => {
    event.preventDefault()
    const price = Number(productForm.price || 0)
    const stock = Number(productForm.stock || 0)

    if (!productForm.name.trim() || !price || !stock) {
      return
    }

    const normalizedProduct = {
      id: editingId || productForm.id || productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: productForm.name.trim(),
      category: productForm.category || 'classic',
      description: productForm.description || 'Fresh bakery item',
      price,
      stock,
      discount: Number(productForm.discount || 0),
      image: productForm.image || 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&w=900&q=80',
      sizes: [{ id: 'regular', label: 'Regular', price }],
      rating: 4.8,
      reviews: 0,
      bestSeller: false,
    }

    const nextProducts = upsertProduct(normalizedProduct)
    const nextCategories = [...getCategories()]
    const categoryKey = normalizedProduct.category
    const categoryExists = nextCategories.some((item) => (item.id || item.name) === categoryKey)

    if (!categoryExists) {
      nextCategories.push({
        id: categoryKey,
        name: categoryKey
          .split('-')
          .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
          .join(' '),
        icon: '🎂',
      })
    }

    saveProducts(nextProducts)
    saveCategories(nextCategories)
    setProducts(nextProducts)
    setCategories(nextCategories)
    setProductForm(emptyProductForm)
    setEditingId('')
  }

  const startEditProduct = (product) => {
    setEditingId(product.id)
    setProductForm({
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description,
      price: String(product.price || ''),
      stock: String(product.stock || ''),
      discount: String(product.discount || ''),
      image: product.image || '',
    })
  }

  const removeProduct = (productId) => {
    const next = deleteProduct(productId)
    setProducts(next)
  }

  const handleLogout = () => {
    clearAdminSession()
    navigate('/admin/login')
  }

  const customerAccounts = useMemo(() => getCustomerAccounts(), [orders])

  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-cream-deep py-12">
        <div className="container-bakery flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="section-label">Admin Panel</span>
            <h1 className="text-4xl mt-3">Philo's Bakery Dashboard</h1>
          </div>
          <button onClick={handleLogout} className="btn-secondary !border-rose-dark !text-rose-dark">
            Logout
          </button>
        </div>
      </div>

      <div className="container-bakery py-8">
        <div className="flex flex-wrap gap-3 mb-8">
          {['orders', 'products', 'customers', 'reports'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab ? 'bg-choc text-white' : 'bg-white text-cocoa border border-cream-line'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
          <div className="card-surface p-5"><p className="text-sm text-cocoa/55">Total Orders</p><h3 className="text-3xl mt-2">{summary.totalOrders}</h3></div>
          <div className="card-surface p-5"><p className="text-sm text-cocoa/55">Revenue</p><h3 className="text-3xl mt-2">{formatCurrency(summary.totalRevenue)}</h3></div>
          <div className="card-surface p-5"><p className="text-sm text-cocoa/55">Pending</p><h3 className="text-3xl mt-2">{summary.pending}</h3></div>
          <div className="card-surface p-5"><p className="text-sm text-cocoa/55">Preparing</p><h3 className="text-3xl mt-2">{summary.preparing}</h3></div>
          <div className="card-surface p-5"><p className="text-sm text-cocoa/55">Low Stock</p><h3 className="text-3xl mt-2">{summary.lowStock}</h3></div>
        </div>

        {activeTab === 'orders' && (
          <div className="card-surface overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-cream-deep text-cocoa">
                  <tr>
                    <th className="px-5 py-4">Order ID</th>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Payment</th>
                    <th className="px-5 py-4">Total</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr><td colSpan="6" className="px-5 py-8 text-center text-cocoa/60">No orders yet.</td></tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.orderId} className="border-t border-cream-line align-top">
                        <td className="px-5 py-4 font-semibold text-choc">{order.orderId}</td>
                        <td className="px-5 py-4">
                          <div>{order.form?.name}</div>
                          <div className="text-cocoa/50">{order.form?.phone}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div>{order.paymentMethod || 'Dummy Payment'}</div>
                          <div className="text-cocoa/50">{order.paymentStatus || 'Pending'}</div>
                        </td>
                        <td className="px-5 py-4 font-utility text-choc">{formatCurrency(order.total)}</td>
                        <td className="px-5 py-4">
                          <select value={order.status || 'Pending'} onChange={(e) => handleStatusChange(order.orderId, e.target.value)} className="bg-white border border-cream-line rounded-full px-3 py-2 text-sm outline-none focus:border-gold">
                            {ORDER_STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
                            <option value="Refunded">Refunded</option>
                          </select>
                        </td>
                        <td className="px-5 py-4">
                          <button type="button" onClick={() => handleRefund(order.orderId)} className="btn-secondary !py-2 !px-3 text-xs">
                            Refund
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="grid xl:grid-cols-[1.2fr_0.8fr] gap-6">
            <div className="card-surface p-6">
              <h2 className="text-xl mb-5">Add or Edit Product</h2>
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-cocoa mb-1.5 block">Product name</label>
                    <input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="w-full bg-white border border-cream-line rounded-xl px-4 py-3 text-sm outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-cocoa mb-1.5 block">Category</label>
                    <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="w-full bg-white border border-cream-line rounded-xl px-4 py-3 text-sm outline-none focus:border-gold">
                      {categories.length ? categories.map((category) => (
                        <option key={category.id || category.name} value={category.id || category.name}>{category.name || category}</option>
                      )) : defaultCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-cocoa mb-1.5 block">Price</label>
                    <input type="number" min="0" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} className="w-full bg-white border border-cream-line rounded-xl px-4 py-3 text-sm outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-cocoa mb-1.5 block">Stock</label>
                    <input type="number" min="0" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} className="w-full bg-white border border-cream-line rounded-xl px-4 py-3 text-sm outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-cocoa mb-1.5 block">Discount (%)</label>
                    <input type="number" min="0" value={productForm.discount} onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })} className="w-full bg-white border border-cream-line rounded-xl px-4 py-3 text-sm outline-none focus:border-gold" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-cocoa mb-1.5 block">Image URL</label>
                    <input value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} className="w-full bg-white border border-cream-line rounded-xl px-4 py-3 text-sm outline-none focus:border-gold" placeholder="https://..." />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-cocoa mb-1.5 block">Description</label>
                    <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} rows={3} className="w-full bg-white border border-cream-line rounded-xl px-4 py-3 text-sm outline-none focus:border-gold" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="submit" className="btn-primary">{editingId ? 'Update Product' : 'Add Product'}</button>
                  {editingId && (
                    <button type="button" onClick={() => { setEditingId(''); setProductForm(emptyProductForm) }} className="btn-secondary">Cancel</button>
                  )}
                </div>
              </form>
            </div>

            <div className="card-surface p-6">
              <h2 className="text-xl mb-5">Products & Inventory</h2>
              <div className="space-y-3 max-h-[540px] overflow-y-auto pr-2">
                {products.map((product) => (
                  <div key={product.id} className="border border-cream-line rounded-2xl p-3 flex gap-3">
                    <img src={product.image} alt={product.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-cocoa truncate">{product.name}</p>
                        <span className="text-xs px-2 py-1 rounded-full bg-pista/60 text-cocoa">{product.stock} in stock</span>
                      </div>
                      <p className="text-xs text-cocoa/55">{product.category}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-utility text-choc">₹{Number(product.price || 0).toFixed(2)}</span>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => startEditProduct(product)} className="text-xs font-medium text-choc">Edit</button>
                          <button type="button" onClick={() => removeProduct(product.id)} className="text-xs font-medium text-rose-dark">Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="card-surface p-6">
            <h2 className="text-xl mb-5">Customer Accounts</h2>
            <div className="space-y-3">
              {customerAccounts.map((account) => (
                <div key={`${account.email}-${account.phone}`} className="border border-cream-line rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="font-semibold text-cocoa">{account.name}</p>
                    <p className="text-xs text-cocoa/55">{account.email} • {account.phone}</p>
                  </div>
                  <div className="text-sm text-cocoa/70">
                    <div>Total spent: <span className="font-utility text-choc">{formatCurrency(account.totalSpent)}</span></div>
                    <div>Orders: {account.orders}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="card-surface p-6">
              <p className="text-sm text-cocoa/55">Total Revenue</p>
              <h3 className="text-3xl mt-2">{formatCurrency(summary.totalRevenue)}</h3>
            </div>
            <div className="card-surface p-6">
              <p className="text-sm text-cocoa/55">Refunds</p>
              <h3 className="text-3xl mt-2">{summary.refunded}</h3>
            </div>
            <div className="card-surface p-6">
              <p className="text-sm text-cocoa/55">Customer Accounts</p>
              <h3 className="text-3xl mt-2">{summary.customerAccounts}</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
