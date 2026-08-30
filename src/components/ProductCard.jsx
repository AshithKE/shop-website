import { Link } from 'react-router-dom'
import { useState } from 'react'
import StarRating from './StarRating'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const defaultSize = product.sizes[0]

  const handleQuickAdd = (e) => {
    e.preventDefault()
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      sizeId: defaultSize.id,
      sizeLabel: defaultSize.label,
      price: defaultSize.price,
      quantity: 1,
      message: '',
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="group card-surface overflow-hidden flex flex-col hover:-translate-y-1.5 hover:shadow-lift"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cocoa/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {product.bestSeller && (
          <span className="seal-badge absolute top-3 left-3 bg-gold text-choc-dark text-[10px] font-utility font-bold uppercase tracking-wide w-14 h-14 flex items-center justify-center text-center leading-tight px-1 shadow-card">
            Best Seller
          </span>
        )}
        <button
          onClick={handleQuickAdd}
          className={`absolute bottom-3 right-3 rounded-full w-11 h-11 flex items-center justify-center shadow-lift transition-all duration-300 ${
            added ? 'bg-pista text-cocoa' : 'bg-cream text-choc hover:bg-choc hover:text-cream'
          } translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100`}
          aria-label={`Quick add ${product.name} to cart`}
          title="Quick add to cart"
        >
          {added ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          )}
        </button>
      </div>

      <div className="p-5 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-medium text-cocoa leading-snug">{product.name}</h3>
        </div>
        <p className="text-sm text-cocoa/65 leading-relaxed line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-auto pt-3">
          <StarRating rating={product.rating} />
          <span className="font-utility font-semibold text-choc">
            ₹{defaultSize.price}
            <span className="text-cocoa/40 text-xs font-body"> onwards</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
