import { reviews } from '../data/reviews'
import StarRating from './StarRating'

export default function Reviews() {
  return (
    <section className="bg-choc-dark py-20 sm:py-28 relative overflow-hidden text-cream">
      <div className="scallop-edge" style={{ '--scallop-color': '#4A2818' }} />
      <div className="container-bakery pt-6">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="section-label text-gold-light">Loved By Many</span>
          <h2 className="text-4xl mt-3 text-cream">What Our Customers Say</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={r.id}
              className="bg-cream/[0.06] border border-cream/10 rounded-cake p-7 backdrop-blur-sm animate-fadeUp hover:bg-cream/[0.09] transition-colors duration-500"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <StarRating rating={r.rating} showValue={false} />
              <p className="mt-4 text-cream/85 leading-relaxed text-[15px]">&ldquo;{r.text}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-gold/20 text-gold-light flex items-center justify-center font-display font-semibold">
                  {r.name[0]}
                </span>
                <div>
                  <p className="text-sm font-semibold text-cream">{r.name}</p>
                  <p className="text-xs text-cream/50">{r.occasion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
