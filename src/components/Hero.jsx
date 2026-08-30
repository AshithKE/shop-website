import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCustomerSession } from '../utils/customerAuth'

export default function Hero() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getCustomerSession())
  const navigate = useNavigate()

  useEffect(() => {
    const onAuthChanged = () => setIsLoggedIn(!!getCustomerSession())
    window.addEventListener('customer-auth-changed', onAuthChanged)
    return () => window.removeEventListener('customer-auth-changed', onAuthChanged)
  }, [])

  const handleOrderNow = () => {
    if (isLoggedIn) {
      navigate('/shop')
    } else {
      navigate('/login?redirect=/shop')
    }
  }

  return (
    <section className="relative overflow-hidden bg-cream pt-10 sm:pt-14 pb-0">
      <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-rose-light/50 blur-3xl" />
      <div className="absolute top-20 -right-16 w-80 h-80 rounded-full bg-pista-light/50 blur-3xl" />

      <div className="container-bakery relative grid lg:grid-cols-2 gap-8 items-center pb-14">
        <div className="max-w-xl animate-fadeUp">
          <span className="section-label inline-flex items-center gap-2 mb-5">
            <span className="w-8 h-px bg-gold" /> Freshly baked with love
          </span>
          <h1 className="text-5xl sm:text-6xl leading-[1.08] font-semibold text-balance mb-3">
            Philo's Cakes,
            <br />
            made for <span className="icing-underline text-choc">happy moments</span>
          </h1>
          <p className="mt-7 text-cocoa/70 text-lg leading-relaxed max-w-md">
            A small bakery with a big heart — serving homemade cakes, custom celebration bakes,
            and sweet treats made with care for every family occasion.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button onClick={handleOrderNow} className="btn-primary">
              Order Now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
            <Link to="/menu" className="btn-secondary">
              See Menu
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-6 sm:gap-8">
            <div>
              <p className="font-display text-3xl text-choc font-semibold">New</p>
              <p className="text-xs text-cocoa/55 mt-1">Fresh start</p>
            </div>
            <div className="w-px h-10 bg-cream-line" />
            <div>
              <p className="font-display text-3xl text-choc font-semibold">Daily</p>
              <p className="text-xs text-cocoa/55 mt-1">Baked fresh</p>
            </div>
            <div className="w-px h-10 bg-cream-line" />
            <div>
              <p className="font-display text-3xl text-choc font-semibold">Custom</p>
              <p className="text-xs text-cocoa/55 mt-1">For every event</p>
            </div>
          </div>
        </div>

        <div className="relative animate-fadeUp" style={{ animationDelay: '0.15s' }}>
          <div className="relative rounded-cake overflow-hidden shadow-lift aspect-[4/5] max-w-md mx-auto">
            <img
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80"
              alt="Elegant layered celebration cake, freshly decorated"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute top-6 -right-2 sm:right-2 text-4xl animate-drift" aria-hidden="true">
            🍓
          </span>
        </div>
      </div>

      <div className="scallop-edge" style={{ '--scallop-color': '#F3E7D4' }} />
    </section>
  )
}
