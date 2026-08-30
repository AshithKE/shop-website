const points = [
  {
    icon: '🌾',
    title: 'Premium Ingredients',
    text: 'Real butter, Madagascar vanilla and Belgian chocolate — never shortcuts, never substitutes.',
  },
  {
    icon: '🕐',
    title: 'Baked Fresh Daily',
    text: 'Every cake is baked to order the same day, never frozen, never sitting on a shelf.',
  },
  {
    icon: '🎨',
    title: 'Custom Designs',
    text: 'From 3D sculpted cakes to photo prints — our decorators bring any theme to life.',
  },
  {
    icon: '🚚',
    title: 'On-Time Delivery',
    text: 'Careful, temperature-controlled delivery so your cake arrives exactly as it left our kitchen.',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="bg-cream-deep py-20 sm:py-28">
      <div className="container-bakery">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="section-label">Our Promise</span>
          <h2 className="text-4xl mt-3 icing-underline inline-block">Why Choose Philo's Cakes</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((p, i) => (
            <div
              key={p.title}
              className="text-center card-surface p-8 hover:shadow-lift hover:-translate-y-1.5 animate-fadeUp"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <span className="seal-badge w-16 h-16 mx-auto bg-rose-light flex items-center justify-center text-2xl mb-5">
                {p.icon}
              </span>
              <h3 className="font-display text-lg mb-2">{p.title}</h3>
              <p className="text-sm text-cocoa/65 leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
