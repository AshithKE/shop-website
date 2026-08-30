import { Link } from 'react-router-dom'
import { getBestSellers } from '../data/products'
import ProductCard from './ProductCard'

export default function BestSellers() {
  const bestSellers = getBestSellers().slice(0, 4)

  return (
    <section className="bg-cream py-14 sm:py-18">
      <div className="container-bakery">
        <div className="flex flex-wrap items-end justify-between gap-5 mb-8">
          <div>
            <span className="section-label">Customer Favourites</span>
            <h2 className="text-4xl mt-3 icing-underline inline-block">Best Sellers</h2>
          </div>
          <Link to="/menu" className="btn-ghost">
            See All Best Sellers →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {bestSellers.map((p, i) => (
            <div key={p.id} className="animate-fadeUp" style={{ animationDelay: `${i * 0.08}s` }}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
