import { Link } from 'react-router-dom'
import { products } from '../data/products'
import ProductCard from './ProductCard'

export default function FeaturedCakes() {
  const featured = [
    products.find((p) => p.id === 'vanilla-cake'),
    products.find((p) => p.id === 'chocolate-cake'),
    products.find((p) => p.id === 'black-forest-cake'),
    products.find((p) => p.id === 'red-velvet-cake'),
  ].filter(Boolean)

  return (
    <section className="bg-[#f4eadb] py-14 sm:py-18">
      <div className="container-bakery">
        <div className="flex flex-wrap items-end justify-between gap-5 mb-8">
          <div>
            <span className="section-label">Handpicked For You</span>
            <h2 className="text-4xl mt-3 icing-underline inline-block">Featured Cakes</h2>
          </div>
          <Link to="/menu" className="btn-ghost">
            View Full Menu →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-6xl mx-auto">
          {featured.map((p, i) => (
            <div key={p.id} className="animate-fadeUp" style={{ animationDelay: `${i * 0.08}s` }}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
