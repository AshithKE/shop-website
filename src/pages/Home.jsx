import Hero from '../components/Hero'
import FeaturedCakes from '../components/FeaturedCakes'
import BestSellers from '../components/BestSellers'
import WhyChooseUs from '../components/WhyChooseUs'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedCakes />
      <BestSellers />
      <WhyChooseUs />

      <section className="bg-cream py-20 sm:py-24">
        <div className="container-bakery">
          <div className="card-surface bg-gradient-to-br from-rose-light/60 via-cream to-pista-light/50 px-8 sm:px-16 py-16 text-center relative overflow-hidden">
            <span className="absolute top-6 left-8 text-3xl animate-drift" aria-hidden="true">🎂</span>
            <span className="absolute bottom-6 right-10 text-3xl animate-drift" style={{ animationDelay: '1.5s' }} aria-hidden="true">🧁</span>
            <h2 className="text-4xl max-w-xl mx-auto text-balance">
              Planning a celebration? Let&rsquo;s bake something unforgettable.
            </h2>
            <p className="mt-4 text-cocoa/70 max-w-md mx-auto">
              Browse our full menu or message us directly on WhatsApp for a custom design quote.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/menu" className="btn-primary">Explore the Menu</Link>
              <Link to="/contact" className="btn-secondary">Talk to Us</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
