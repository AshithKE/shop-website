import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { createServer } from 'http'
import { Server } from 'socket.io'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
})

const port = process.env.PORT || 5000
const hasRazorpayKeys = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
const dataDir = path.join(__dirname, 'data')

const defaultCategories = [
  { id: 'classic', name: 'Classic Cakes', icon: '🎂' },
]

const defaultProducts = [
  {
    id: 'vanilla-cake',
    name: 'Vanilla Cake',
    category: 'classic',
    description: 'Classic vanilla sponge with soft cream frosting.',
    ingredients: ['Vanilla', 'Flour', 'Butter', 'Cream'],
    price: 300,
    stock: 25,
    discount: 0,
    rating: 4.8,
    reviews: 120,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&w=900&q=80',
    sizes: [
      { id: '0.5kg', label: '0.5 KG', price: 300 },
      { id: '1kg', label: '1 KG', price: 550 },
    ],
  },
  {
    id: 'chocolate-cake',
    name: 'Chocolate Cake',
    category: 'classic',
    description: 'Rich chocolate sponge layered with decadent chocolate cream.',
    ingredients: ['Chocolate', 'Flour', 'Butter', 'Cream'],
    price: 400,
    stock: 18,
    discount: 0,
    rating: 4.9,
    reviews: 140,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=900&q=80',
    sizes: [
      { id: '0.5kg', label: '0.5 KG', price: 400 },
      { id: '1kg', label: '1 KG', price: 750 },
    ],
  },
]

const defaultOffers = [
  { id: 'welcome-10', title: 'Welcome Offer', discount: 10, enabled: true, expiresAt: '2099-12-31T23:59:59.000Z' },
]

app.use(cors())
app.use(express.json())

async function ensureDataFiles() {
  await fs.mkdir(dataDir, { recursive: true })

  const files = {
    'products.json': defaultProducts,
    'categories.json': defaultCategories,
    'offers.json': defaultOffers,
    'orders.json': [],
  }

  for (const [name, value] of Object.entries(files)) {
    const filePath = path.join(dataDir, name)
    try {
      await fs.access(filePath)
    } catch {
      await fs.writeFile(filePath, JSON.stringify(value, null, 2))
    }
  }
}

async function readJson(fileName, fallback) {
  try {
    const filePath = path.join(dataDir, fileName)
    const raw = await fs.readFile(filePath, 'utf8')
    const parsed = JSON.parse(raw)
    return parsed && Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

async function writeJson(fileName, data) {
  const filePath = path.join(dataDir, fileName)
  await fs.writeFile(filePath, JSON.stringify(data, null, 2))
  return data
}

function normalizeProduct(product) {
  return {
    ...product,
    id: String(product.id || product.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    stock: Number(product.stock || 0),
    price: Number(product.price || 0),
    discount: Number(product.discount || 0),
    rating: Number(product.rating || 4.7),
    reviews: Number(product.reviews || 0),
    bestSeller: Boolean(product.bestSeller),
    sizes: Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes : [{ id: 'regular', label: 'Regular', price: Number(product.price || 0) }],
    image: product.image || 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&w=900&q=80',
    category: product.category || 'classic',
  }
}

function emitCatalogUpdate(eventName, payload) {
  io.emit(eventName, payload)
}

app.get('/api/config', (req, res) => {
  res.json({ keyId: process.env.RAZORPAY_KEY_ID || '' })
})

app.get('/api/catalog', async (req, res) => {
  try {
    const [products, categories, offers] = await Promise.all([
      readJson('products.json', defaultProducts),
      readJson('categories.json', defaultCategories),
      readJson('offers.json', defaultOffers),
    ])
    res.json({ products, categories, offers })
  } catch (error) {
    res.status(500).json({ message: 'Unable to load catalog.', error: error.message })
  }
})

app.get('/api/products', async (req, res) => {
  try {
    const products = await readJson('products.json', defaultProducts)
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Unable to load products.', error: error.message })
  }
})

app.post('/api/products', async (req, res) => {
  try {
    const existing = await readJson('products.json', defaultProducts)
    const nextProduct = normalizeProduct(req.body)
    const productExists = existing.some((product) => product.id === nextProduct.id)
    const updated = productExists
      ? existing.map((product) => (product.id === nextProduct.id ? nextProduct : product))
      : [...existing, nextProduct]

    await writeJson('products.json', updated)
    emitCatalogUpdate('productCreated', nextProduct)
    res.status(201).json(nextProduct)
  } catch (error) {
    res.status(500).json({ message: 'Unable to create product.', error: error.message })
  }
})

app.put('/api/products/:id', async (req, res) => {
  try {
    const existing = await readJson('products.json', defaultProducts)
    const nextProduct = normalizeProduct({ ...req.body, id: req.params.id })
    const updated = existing.map((product) => (product.id === req.params.id ? nextProduct : product))

    await writeJson('products.json', updated)
    emitCatalogUpdate('productUpdated', nextProduct)
    res.json(nextProduct)
  } catch (error) {
    res.status(500).json({ message: 'Unable to update product.', error: error.message })
  }
})

app.delete('/api/products/:id', async (req, res) => {
  try {
    const existing = await readJson('products.json', defaultProducts)
    const remaining = existing.filter((product) => product.id !== req.params.id)
    await writeJson('products.json', remaining)
    emitCatalogUpdate('productDeleted', { id: req.params.id })
    res.json({ id: req.params.id, deleted: true })
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete product.', error: error.message })
  }
})

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await readJson('categories.json', defaultCategories)
    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: 'Unable to load categories.', error: error.message })
  }
})

app.post('/api/categories', async (req, res) => {
  try {
    const existing = await readJson('categories.json', defaultCategories)
    const category = {
      id: req.body.id || String(req.body.name || 'new-category').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: req.body.name || 'New Category',
      icon: req.body.icon || '🎂',
    }
    const updated = [...existing.filter((item) => (item.id || item.name) !== category.id), category]
    await writeJson('categories.json', updated)
    emitCatalogUpdate('categoryCreated', category)
    res.status(201).json(category)
  } catch (error) {
    res.status(500).json({ message: 'Unable to create category.', error: error.message })
  }
})

app.put('/api/categories/:id', async (req, res) => {
  try {
    const existing = await readJson('categories.json', defaultCategories)
    const updatedCategory = {
      id: req.params.id,
      name: req.body.name || 'Updated Category',
      icon: req.body.icon || '🎂',
    }
    const updated = existing.map((item) => ((item.id || item.name) === req.params.id ? updatedCategory : item))
    await writeJson('categories.json', updated)
    emitCatalogUpdate('categoryUpdated', updatedCategory)
    res.json(updatedCategory)
  } catch (error) {
    res.status(500).json({ message: 'Unable to update category.', error: error.message })
  }
})

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const existing = await readJson('categories.json', defaultCategories)
    const remaining = existing.filter((item) => (item.id || item.name) !== req.params.id)
    await writeJson('categories.json', remaining)
    emitCatalogUpdate('categoryDeleted', { id: req.params.id })
    res.json({ id: req.params.id, deleted: true })
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete category.', error: error.message })
  }
})

app.get('/api/offers', async (req, res) => {
  try {
    const offers = await readJson('offers.json', defaultOffers)
    res.json(offers)
  } catch (error) {
    res.status(500).json({ message: 'Unable to load offers.', error: error.message })
  }
})

app.post('/api/offers', async (req, res) => {
  try {
    const existing = await readJson('offers.json', defaultOffers)
    const offer = {
      id: req.body.id || `offer-${Date.now()}`,
      title: req.body.title || 'New Offer',
      discount: Number(req.body.discount || 0),
      enabled: req.body.enabled !== false,
      expiresAt: req.body.expiresAt || '2099-12-31T23:59:59.000Z',
    }
    const updated = [...existing.filter((item) => item.id !== offer.id), offer]
    await writeJson('offers.json', updated)
    emitCatalogUpdate('offerUpdated', offer)
    res.status(201).json(offer)
  } catch (error) {
    res.status(500).json({ message: 'Unable to save offer.', error: error.message })
  }
})

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await readJson('orders.json', [])
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Unable to load orders.', error: error.message })
  }
})

app.get('/api/orders/:id', async (req, res) => {
  try {
    const orders = await readJson('orders.json', [])
    const order = orders.find((item) => item.orderId === req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' })
    }
    return res.json(order)
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load order.', error: error.message })
  }
})

app.post('/api/orders', async (req, res) => {
  try {
    const orders = await readJson('orders.json', [])
    const order = {
      ...req.body,
      createdAt: req.body.createdAt || new Date().toISOString(),
      orderId: req.body.orderId || `PH-${Date.now().toString().slice(-6)}`,
      status: req.body.status || 'Pending',
      paymentStatus: req.body.paymentStatus || 'Pending',
    }
    const updated = [...orders.filter((item) => item.orderId !== order.orderId), order]
    await writeJson('orders.json', updated)
    io.emit('orderCreated', order)
    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: 'Unable to save order.', error: error.message })
  }
})

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const orders = await readJson('orders.json', [])
    const updatedOrders = orders.map((order) =>
      order.orderId === req.params.id ? { ...order, status: req.body.status || order.status, paymentStatus: req.body.paymentStatus || order.paymentStatus } : order
    )
    await writeJson('orders.json', updatedOrders)
    const updated = updatedOrders.find((order) => order.orderId === req.params.id)
    io.emit('orderStatusUpdated', updated)
    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: 'Unable to update order status.', error: error.message })
  }
})

const razorpay = hasRazorpayKeys
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null

function normalizeAmount(value) {
  return Math.round(Number(value || 0) * 100)
}

app.post('/api/create-razorpay-order', async (req, res) => {
  try {
    if (!hasRazorpayKeys || !razorpay) {
      return res.status(503).json({
        message: 'Razorpay is not configured yet. Add your test keys to the .env file before starting payment.',
      })
    }

    const { orderId, total, customer, items, subtotal, deliveryFee, notes, cakeMessage } = req.body

    if (!orderId || !customer || !customer.name || !customer.phone || !customer.email || !customer.address) {
      return res.status(400).json({ message: 'Customer details are required.' })
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty.' })
    }

    const amountInPaise = normalizeAmount(total)
    if (amountInPaise <= 0) {
      return res.status(400).json({ message: 'Order total must be greater than zero.' })
    }

    const payload = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: String(orderId),
      notes: {
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        address: customer.address,
        subtotal: String(subtotal || 0),
        deliveryFee: String(deliveryFee || 0),
        notes: notes || '',
        cakeMessage: cakeMessage || '',
        itemCount: String(items.length),
      },
    }

    const razorpayOrder = await razorpay.orders.create(payload)

    return res.json({
      keyId: process.env.RAZORPAY_KEY_ID,
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    })
  } catch (error) {
    console.error('create razorpay order error:', error)
    return res.status(500).json({
      message: 'Failed to create Razorpay order.',
      error: error.message,
    })
  }
})

app.post('/api/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
      total,
      customer,
      items,
      subtotal,
      deliveryFee,
      notes,
      cakeMessage,
    } = req.body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Incomplete Razorpay payment response.' })
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid Razorpay signature.' })
    }

    const amountInPaise = normalizeAmount(total)
    if (amountInPaise <= 0) {
      return res.status(400).json({ message: 'Invalid payment amount.' })
    }

    const orders = await readJson('orders.json', [])
    const existingOrder = orders.find((order) => order.orderId === orderId)
    if (existingOrder && existingOrder.paymentStatus === 'Paid') {
      return res.status(200).json({ message: 'Payment already processed.', success: true, orderId })
    }

    const verifiedOrder = {
      ...(existingOrder || { orderId, createdAt: new Date().toISOString() }),
      customer,
      items,
      subtotal,
      deliveryFee,
      total,
      notes,
      cakeMessage,
      paymentMethod: 'Razorpay',
      paymentStatus: 'Paid',
      status: 'Confirmed',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature,
    }

    const updatedOrders = [...orders.filter((order) => order.orderId !== orderId), verifiedOrder]
    await writeJson('orders.json', updatedOrders)
    io.emit('orderStatusUpdated', verifiedOrder)

    return res.json({ success: true, message: 'Payment verified successfully.', orderId })
  } catch (error) {
    console.error('verify payment error:', error)
    return res.status(500).json({ message: 'Payment verification failed.', error: error.message })
  }
})

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  socket.emit('connectionStatus', { connected: true })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

await ensureDataFiles()

httpServer.listen(port, () => {
  if (!hasRazorpayKeys) {
    console.warn('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are not configured. Payment API is running in warning mode. Add your test keys to .env to enable Razorpay.')
  }
  console.log(`Razorpay server running on http://localhost:${port}`)
})
