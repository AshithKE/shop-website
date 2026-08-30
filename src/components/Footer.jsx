import { Link } from 'react-router-dom'
import { categories } from '../data/products'

export default function Footer() {
  return (
    <footer className="bg-choc-dark text-cream/90 relative overflow-hidden">
      <div className="scallop-edge-flip" style={{ '--scallop-color': '#4A2818' }} />
      <div className="container-bakery pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🍰</span>
              <span className="font-display text-xl font-semibold text-cream">Philo's Cakes</span>
            </Link>
            <p className="text-sm text-cream/70 leading-relaxed max-w-xs">
              Handcrafted cakes and pastries, baked fresh daily in Devarakolli, Made Post &amp; Village, Madikeri Tq, Kodagu.
            </p>
            <div className="flex gap-3 mt-5">
              {['Instagram', 'Facebook', 'WhatsApp'].map((s) => (
                <span
                  key={s}
                  className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center text-xs hover:bg-gold hover:text-choc-dark transition-colors duration-300 cursor-pointer"
                  title={s}
                >
                  {s[0]}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg mb-4 text-gold-light">Explore</h4>
            <ul className="space-y-2.5 text-sm text-cream/75">
              <li><Link to="/" className="hover:text-gold transition-colors">Home</Link></li>
              <li><Link to="/menu" className="hover:text-gold transition-colors">Cakes Menu</Link></li>
              <li><Link to="/track-order" className="hover:text-gold transition-colors">Track Order</Link></li>
              <li><Link to="/about" className="hover:text-gold transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
              <li><Link to="/cart" className="hover:text-gold transition-colors">My Cart</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg mb-4 text-gold-light">Categories</h4>
            <ul className="space-y-2.5 text-sm text-cream/75">
              {categories.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <Link to={`/menu?category=${c.id}`} className="hover:text-gold transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg mb-4 text-gold-light">Get in touch</h4>
            <ul className="space-y-2.5 text-sm text-cream/75">
              <li>Devarakolli, Made Post &amp; Village</li>
              <li>Madikeri Tq, Kodagu</li>
              <li>+91 6363407808</li>
              <li>@philo.s_kitchen</li>
              <li>Open daily · 8am – 9pm</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream/50">
          <p>© {new Date().getFullYear()} Philo's Cakes. All rights reserved.</p>
          <p>Baked with 🤎 for people who love beautiful cakes.</p>
        </div>
      </div>
    </footer>
  )
}
