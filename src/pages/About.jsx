import { Link } from 'react-router-dom'

const values = [
  {
    icon: '🌱',
    title: 'Quality Ingredients',
    text: 'We source real dairy butter, Madagascar vanilla and Belgian couverture chocolate from trusted local suppliers — nothing artificial, ever.',
  },
  {
    icon: '🔥',
    title: 'Freshly Baked',
    text: 'Every cake, cupcake and pastry is baked the same day it\'s collected or delivered. No freezers, no shortcuts.',
  },
  {
    icon: '🎂',
    title: 'Custom Cake Service',
    text: 'Our in-house decorators work with you one-on-one — from flavour to fondant sculpting — to design a cake that matches your vision exactly.',
  },
]

export default function About() {
  return (
    <div className="bg-cream">
      <div className="bg-cream-deep pt-16 pb-0 relative overflow-hidden">
        <div className="container-bakery grid lg:grid-cols-2 gap-12 items-center pb-16">
          <div className="animate-fadeUp">
            <span className="section-label">Our Story</span>
            <h1 className="text-5xl mt-3 leading-tight text-balance">
              Baking <span className="icing-underline">happiness</span>, one layer at a time
            </h1>
            <p className="mt-6 text-cocoa/70 leading-relaxed">
              Philo's Cakes started in Devarakolli with one oven, a warm kitchen and a big dream
              — to bring truly handcrafted cakes and sweet treats to every celebration in the
              village and nearby communities. Today, that dream is still the heart of everything
              we bake, with care in every layer and every order.
            </p>
            <p className="mt-4 text-cocoa/70 leading-relaxed">
              We keep it personal, fresh and honest — from birthday cakes to everyday cravings —
              because the best cakes are the ones made with love, patience and a little extra joy.
            </p>
            <Link to="/menu" className="btn-primary mt-8 inline-flex">Explore Our Cakes</Link>
          </div>
          <div className="relative animate-fadeUp" style={{ animationDelay: '0.15s' }}>
            <img
              src="https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&w=900&q=80"
              alt="Baker decorating a cake in the Philo's Cakes kitchen"
              className="rounded-cake shadow-lift object-cover w-full aspect-[4/5]"
            />
          </div>
        </div>
        <div className="scallop-edge" style={{ '--scallop-color': '#FBF6EE' }} />
      </div>

      <div className="container-bakery py-20">
        <div className="text-center max-w-lg mx-auto mb-14">
          <span className="section-label">What We Stand For</span>
          <h2 className="text-4xl mt-3 icing-underline inline-block">Our Values</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <div
              key={v.title}
              className="card-surface p-8 text-center hover:-translate-y-1.5 hover:shadow-lift animate-fadeUp"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span className="text-4xl mb-4 inline-block">{v.icon}</span>
              <h3 className="font-display text-xl mb-2">{v.title}</h3>
              <p className="text-sm text-cocoa/65 leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-choc-dark text-cream py-20 relative">
        <div className="scallop-edge" style={{ '--scallop-color': '#4A2818' }} />
        <div className="container-bakery pt-6 grid sm:grid-cols-3 gap-8 text-center">
          <div>
            <p className="font-display text-4xl text-gold-light font-semibold">8+</p>
            <p className="text-sm text-cream/60 mt-2">Years of baking experience</p>
          </div>
          <div>
            <p className="font-display text-4xl text-gold-light font-semibold">12,000+</p>
            <p className="text-sm text-cream/60 mt-2">Cakes lovingly delivered</p>
          </div>
          <div>
            <p className="font-display text-4xl text-gold-light font-semibold">4.9 / 5</p>
            <p className="text-sm text-cream/60 mt-2">Average customer rating</p>
          </div>
        </div>
      </div>
    </div>
  )
}
