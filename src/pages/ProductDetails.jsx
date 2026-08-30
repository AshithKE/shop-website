import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProductById, getProductsByCategory, syncProductsFromStorage } from '../data/products'
import StarRating from '../components/StarRating'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import { useSocket } from '../context/SocketContext'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { socket } = useSocket()
  const [liveProduct, setLiveProduct] = useState(() => getProductById(id))
  const product = liveProduct || getProductById(id)

  useEffect(() => {
    const refreshProduct = () => {
      syncProductsFromStorage()
      setLiveProduct(getProductById(id))
    }

    refreshProduct()
    if (!socket) return

    const handleProductUpdate = () => refreshProduct()
    socket.on('productUpdated', handleProductUpdate)
    socket.on('productDeleted', handleProductUpdate)

    return () => {
      socket.off('productUpdated', handleProductUpdate)
      socket.off('productDeleted', handleProductUpdate)
    }
  }, [id, socket])

  const [sizeId, setSizeId] = useState(product?.sizes[0]?.id)
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')
  const [tab, setTab] = useState('description')
  const [added, setAdded] = useState(false)

  const related = useMemo(
    () =>
      product
        ? getProductsByCategory(product.category)
            .filter((p) => p.id !== product.id)
            .slice(0, 4)
        : [],
    [product]
  )

  if (!product) {
    return (
      <div className="container-bakery py-32 text-center">
        <h1 className="font-display text-3xl mb-4">Cake not found</h1>
        <p className="text-cocoa/60 mb-8">This item may have been moved or is no longer available.</p>
        <Link to="/menu" className="btn-primary">Back to Menu</Link>
      </div>
    )
  }

  const selectedSize = product.sizes.find((s) => s.id === sizeId) || product.sizes[0]

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      sizeId: selectedSize.id,
      sizeLabel: selectedSize.label,
      price: selectedSize.price,
      quantity,
      message: message.trim(),
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="bg-cream">
      <div className="container-bakery py-8">
        <nav className="text-sm text-cocoa/55 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-choc">Home</Link>
          <span>/</span>
          <Link to="/menu" className="hover:text-choc">Cakes Menu</Link>
          <span>/</span>
          <span className="text-cocoa">{product.name}</span>
        </nav>
      </div>

      <div className="container-bakery pb-16 grid lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="animate-fadeUp">
          <div className="relative rounded-cake overflow-hidden shadow-lift aspect-square">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            {product.bestSeller && (
              <span className="seal-badge absolute top-5 left-5 bg-gold text-choc-dark text-xs font-utility font-bold uppercase tracking-wide w-16 h-16 flex items-center justify-center text-center leading-tight px-1 shadow-card">
                Best Seller
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="animate-fadeUp" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-4xl leading-tight">{product.name}</h1>
          <div className="flex items-center gap-3 mt-3">
            <StarRating rating={product.rating} />
            <span className="text-sm text-cocoa/50">({product.reviews} reviews)</span>
          </div>
          <p className="mt-5 text-cocoa/70 leading-relaxed">{product.description}</p>

          <p className="font-utility text-3xl font-semibold text-choc mt-6">
            ₹{selectedSize.price.toFixed(2)}
          </p>

          {/* Size selector */}
          <div className="mt-7">
            <p className="text-sm font-semibold text-cocoa mb-3">Choose size</p>
            <div className="flex flex-wrap gap-2.5">
              {product.sizes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSizeId(s.id)}
                  className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                    s.id === sizeId
                      ? 'bg-choc text-cream border-choc shadow-card'
                      : 'bg-white text-cocoa/75 border-cream-line hover:border-choc/40'
                  }`}
                >
                  {s.label} · ₹{s.price}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-7">
            <p className="text-sm font-semibold text-cocoa mb-3">Quantity</p>
            <div className="inline-flex items-center border border-cream-line rounded-full bg-white overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-11 h-11 flex items-center justify-center text-lg text-cocoa hover:bg-cream-deep transition-colors"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-10 text-center font-utility font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                className="w-11 h-11 flex items-center justify-center text-lg text-cocoa hover:bg-cream-deep transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Custom message */}
          <div className="mt-7">
            <label htmlFor="cake-message" className="text-sm font-semibold text-cocoa mb-3 block">
              Message on the cake <span className="text-cocoa/40 font-normal">(optional)</span>
            </label>
            <input
              id="cake-message"
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 40))}
              type="text"
              placeholder="e.g. Happy Birthday Zara!"
              className="w-full bg-white border border-cream-line rounded-xl px-4 py-3 text-sm outline-none focus:border-gold transition-colors"
            />
            <p className="text-xs text-cocoa/40 mt-1.5">{message.length}/40 characters</p>
          </div>

          <div className="mt-9 flex flex-wrap gap-4">
            <button
              onClick={handleAddToCart}
              className={`btn-primary flex-1 sm:flex-none sm:min-w-[220px] ${added ? '!bg-pista !text-cocoa' : ''}`}
            >
              {added ? (
                <>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Added to Cart
                </>
              ) : (
                <>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                  </svg>
                  Add to Cart
                </>
              )}
            </button>
            <button
              onClick={() => {
                handleAddToCart()
                navigate('/cart')
              }}
              className="btn-secondary"
            >
              Buy Now
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-12 border-t border-cream-line pt-6">
            <div className="flex gap-6 border-b border-cream-line">
              {['description', 'ingredients'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`pb-3 text-sm font-medium capitalize transition-colors ${
                    tab === t ? 'text-choc border-b-2 border-choc' : 'text-cocoa/50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="pt-5 text-sm text-cocoa/70 leading-relaxed">
              {tab === 'description' ? (
                <p>{product.description} Every cake from Philo's Cakes is baked fresh with care and made to order for your special moments.</p>
              ) : (
                <ul className="grid grid-cols-2 gap-2">
                  {product.ingredients.map((ing) => (
                    <li key={ing} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold" /> {ing}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="bg-cream-deep py-16">
          <div className="container-bakery">
            <h2 className="text-3xl mb-8 icing-underline inline-block">You May Also Like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
