import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Cakes Menu' },
  { to: '/track-order', label: 'Track Order' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { itemCount } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [navigate])

  const submitSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/menu?search=${encodeURIComponent(query.trim())}`)
      setSearchOpen(false)
      setQuery('')
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-cream/95 backdrop-blur-md shadow-card' : 'bg-cream/70 backdrop-blur-sm'
      }`}
    >
      <div className="container-bakery flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="text-3xl group-hover:animate-drift inline-block">🍰</span>
          <span className="font-display text-2xl font-semibold text-cocoa tracking-tight">
            Philo's Cakes
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative font-body text-[15px] font-medium transition-colors duration-200 py-2 ${
                  isActive ? 'text-choc icing-underline' : 'text-cocoa/80 hover:text-choc'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            aria-label="Search cakes"
            onClick={() => setSearchOpen((s) => !s)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-cocoa hover:bg-cream-deep transition-colors duration-200"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>

          <Link
            to="/cart"
            aria-label="View cart"
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-cocoa hover:bg-cream-deep transition-colors duration-200"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-choc text-cream text-[10px] font-utility font-semibold w-5 h-5 rounded-full flex items-center justify-center animate-popIn">
                {itemCount}
              </span>
            )}
          </Link>

          <Link to="/menu" className="hidden sm:inline-flex btn-primary !py-2.5 !px-5 text-sm">
            Order Now
          </Link>

          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-cocoa hover:bg-cream-deep"
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-cream-line bg-cream animate-fadeUp">
          <form onSubmit={submitSearch} className="container-bakery py-4 flex gap-3">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search for cakes, cupcakes, pastries…"
              className="flex-1 bg-white border border-cream-line rounded-full px-5 py-2.5 text-sm outline-none focus:border-gold transition-colors"
            />
            <button type="submit" className="btn-primary !py-2.5 !px-6 text-sm">
              Search
            </button>
          </form>
        </div>
      )}

      {open && (
        <div className="lg:hidden border-t border-cream-line bg-cream animate-fadeUp">
          <nav className="container-bakery py-5 flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `py-3 px-2 rounded-lg font-body text-base border-b border-cream-line last:border-0 ${
                    isActive ? 'text-choc font-semibold' : 'text-cocoa/80'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link to="/menu" className="btn-primary mt-4 w-full">
              Order Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
