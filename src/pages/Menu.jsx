import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProducts, getCategories } from '../utils/adminStorage'
import ProductCard from '../components/ProductCard'
import CategoryFilter from '../components/CategoryFilter'
import { useSocket } from '../context/SocketContext'

const SORTS = [
  { id: 'popular', label: 'Most Popular' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Top Rated' },
]

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all')
  const [query, setQuery] = useState(searchParams.get('search') || '')
  const [sort, setSort] = useState('popular')
  const [products, setProducts] = useState(getProducts())
  const [categories, setCategories] = useState(getCategories())
  const { socket, isConnected } = useSocket()

  useEffect(() => {
    const loadCatalog = () => {
      setProducts(getProducts())
      setCategories(getCategories())
    }

    loadCatalog()

    if (!socket) return

    const onProductUpdated = () => loadCatalog()
    const onStockUpdated = () => loadCatalog()
    const onCategoryUpdated = () => loadCatalog()
    const onOfferUpdated = () => loadCatalog()

    socket.on('productCreated', onProductUpdated)
    socket.on('productUpdated', onProductUpdated)
    socket.on('productDeleted', onProductUpdated)
    socket.on('stockUpdated', onStockUpdated)
    socket.on('categoryCreated', onCategoryUpdated)
    socket.on('categoryUpdated', onCategoryUpdated)
    socket.on('categoryDeleted', onCategoryUpdated)
    socket.on('offerUpdated', onOfferUpdated)

    return () => {
      socket.off('productCreated', onProductUpdated)
      socket.off('productUpdated', onProductUpdated)
      socket.off('productDeleted', onProductUpdated)
      socket.off('stockUpdated', onStockUpdated)
      socket.off('categoryCreated', onCategoryUpdated)
      socket.off('categoryUpdated', onCategoryUpdated)
      socket.off('categoryDeleted', onCategoryUpdated)
      socket.off('offerUpdated', onOfferUpdated)
    }
  }, [socket])

  useEffect(() => {
    const params = {}
    if (activeCategory !== 'all') params.category = activeCategory
    if (query) params.search = query
    setSearchParams(params, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, query])

  const filtered = useMemo(() => {
    let list = products
    if (activeCategory !== 'all') list = list.filter((p) => p.category === activeCategory)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      )
    }
    const sorted = [...list]
    if (sort === 'price-asc') sorted.sort((a, b) => a.sizes[0].price - b.sizes[0].price)
    if (sort === 'price-desc') sorted.sort((a, b) => b.sizes[0].price - a.sizes[0].price)
    if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating)
    if (sort === 'popular') sorted.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0))
    return sorted
  }, [activeCategory, query, sort])

  const activeCategoryName =
    activeCategory === 'all' ? 'All Cakes' : categories.find((c) => c.id === activeCategory)?.name

  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-cream-deep pt-14 pb-10">
        <div className="container-bakery text-center">
          <span className="section-label">Our Full Collection</span>
          <h1 className="text-4xl sm:text-5xl mt-3 icing-underline inline-block">Cakes Menu</h1>
          <p className="mt-6 text-cocoa/65 max-w-lg mx-auto">
            From everyday indulgence to once-in-a-lifetime celebrations — every cake is baked
            fresh to order.
          </p>

          <div className="max-w-lg mx-auto mt-8 relative">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="absolute left-5 top-1/2 -translate-y-1/2 text-cocoa/40"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search cakes, cupcakes, pastries…"
              className="w-full bg-white border border-cream-line rounded-full pl-12 pr-5 py-3.5 text-sm outline-none focus:border-gold transition-colors shadow-card"
            />
          </div>
        </div>
      </div>

      <div className="container-bakery py-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
          <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white border border-cream-line rounded-full px-5 py-2.5 text-sm outline-none focus:border-gold shrink-0 w-fit"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <p className="text-sm text-cocoa/55 mb-6">
          Showing <span className="font-semibold text-choc">{filtered.length}</span> result
          {filtered.length !== 1 && 's'} in{' '}
          <span className="font-semibold text-choc">{activeCategoryName}</span>
          {query && (
            <>
              {' '}
              for &ldquo;<span className="italic">{query}</span>&rdquo;
            </>
          )}
          {!isConnected && <span className="ml-2 text-amber-700">• Reconnecting…</span>}
        </p>

        {filtered.length > 0 ? (
          <div className="max-w-5xl mx-auto overflow-hidden rounded-[28px] border border-cream-line bg-white shadow-card">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-cream-deep text-cocoa/80">
                  <tr>
                    <th className="px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em]">Cake</th>
                    <th className="px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-center">
                      ½ KG
                    </th>
                    <th className="px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-center">
                      1 KG
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, index) => {
                    const halfKg = p.sizes?.find((size) => size.id === '0.5kg') || p.sizes?.[0]
                    const oneKg = p.sizes?.find((size) => size.id === '1kg') || p.sizes?.[1] || p.sizes?.[0]

                    return (
                      <tr
                        key={p.id}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-cream/40'}
                      >
                        <td className="px-5 py-4 align-middle">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center text-xl shadow-sm">
                              🎂
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-cocoa">{p.name}</span>
                                {p.bestSeller && (
                                  <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-700">
                                    Best Seller
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-cocoa/55 mt-1">{p.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center align-middle">
                          <span className="inline-flex items-center justify-center rounded-full bg-cream px-3 py-1.5 text-sm font-semibold text-cocoa shadow-sm">
                            ₹{halfKg?.price ?? p.price}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center align-middle">
                          <span className="inline-flex items-center justify-center rounded-full bg-choc px-3 py-1.5 text-sm font-semibold text-white shadow-sm">
                            ₹{oneKg?.price ?? p.price}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-24">
            <span className="text-5xl mb-4 inline-block">🔍</span>
            <h3 className="font-display text-2xl mb-2">No cakes found</h3>
            <p className="text-cocoa/60 mb-6">Try a different search term or browse another category.</p>
            <button
              onClick={() => {
                setQuery('')
                setActiveCategory('all')
              }}
              className="btn-secondary"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
