import { useState } from 'react'

const hours = [
  { day: 'Monday – Friday', time: '8:00 AM – 9:00 PM' },
  { day: 'Saturday', time: '8:00 AM – 10:00 PM' },
  { day: 'Sunday', time: '9:00 AM – 8:00 PM' },
]

const initialForm = { name: '', email: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Please enter your name'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = 'Enter a valid email'
    if (!form.message.trim() || form.message.trim().length < 10)
      errs.message = 'Message should be at least 10 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setSent(true)
    setForm(initialForm)
    setTimeout(() => setSent(false), 4000)
  }

  const inputClass = (field) =>
    `w-full bg-white border rounded-xl px-4 py-3 text-sm outline-none transition-colors ${
      errors[field] ? 'border-rose-dark focus:border-rose-dark' : 'border-cream-line focus:border-gold'
    }`

  return (
    <div className="bg-cream">
      <div className="bg-cream-deep py-16 text-center">
        <div className="container-bakery">
          <span className="section-label">We'd Love to Hear From You</span>
          <h1 className="text-5xl mt-3 icing-underline inline-block">Contact Us</h1>
          <p className="mt-6 text-cocoa/65 max-w-lg mx-auto">
            Questions about an order, custom cake designs, or bulk requests? Reach out any way
            that suits you.
          </p>
        </div>
      </div>

      <div className="container-bakery py-16 grid lg:grid-cols-5 gap-10">
        {/* Info column */}
        <div className="lg:col-span-2 space-y-4">
          {[
            { icon: '📞', label: 'Phone', value: '+91 6363407808', href: 'tel:+916363407808' },
            { icon: '💬', label: 'WhatsApp', value: 'Chat with us instantly', href: 'https://wa.me/916363407808' },
            { icon: '📷', label: 'Instagram', value: '@philo.s_kitchen', href: 'https://instagram.com/philo.s_kitchen' },
            { icon: '📍', label: 'Address', value: 'Devarakolli, Made Post & Village, Madikeri Tq, Kodagu' },
          ].map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href?.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className={`card-surface p-5 flex items-start gap-4 ${c.href ? 'hover:-translate-y-1 hover:shadow-lift' : ''}`}
            >
              <span className="text-2xl">{c.icon}</span>
              <div>
                <p className="text-xs uppercase tracking-wide text-cocoa/45 font-utility">{c.label}</p>
                <p className="text-cocoa font-medium mt-0.5">{c.value}</p>
              </div>
            </a>
          ))}

          <div className="card-surface p-5">
            <p className="text-xs uppercase tracking-wide text-cocoa/45 font-utility mb-3">Business Hours</p>
            <ul className="space-y-2">
              {hours.map((h) => (
                <li key={h.day} className="flex justify-between text-sm">
                  <span className="text-cocoa/70">{h.day}</span>
                  <span className="font-medium text-cocoa">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-cake overflow-hidden shadow-card aspect-video">
            <iframe
              title="Philo's Cakes location on Google Maps"
              src="https://www.google.com/maps?q=Devarakolli%2C%20Made%20Post%20%26%20Village%2C%20Madikeri%20Tq%2C%20Kodagu&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Form column */}
        <div className="lg:col-span-3">
          <div className="card-surface p-8">
            <h2 className="font-display text-2xl mb-6">Send Us a Message</h2>
            {sent && (
              <div className="bg-pista-light/60 border border-pista/50 text-cocoa text-sm rounded-xl px-4 py-3 mb-5 animate-fadeUp">
                Thanks for reaching out — we'll get back to you within a few hours! 🎉
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-cocoa mb-1.5 block">Your Name *</label>
                  <input value={form.name} onChange={update('name')} className={inputClass('name')} placeholder="Jane Doe" />
                  {errors.name && <p className="text-xs text-rose-dark mt-1.5">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-cocoa mb-1.5 block">Email *</label>
                  <input value={form.email} onChange={update('email')} type="email" className={inputClass('email')} placeholder="jane@email.com" />
                  {errors.email && <p className="text-xs text-rose-dark mt-1.5">{errors.email}</p>}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-cocoa mb-1.5 block">Message *</label>
                <textarea
                  value={form.message}
                  onChange={update('message')}
                  rows={5}
                  className={inputClass('message')}
                  placeholder="Tell us about your order, event date, or custom cake idea…"
                />
                {errors.message && <p className="text-xs text-rose-dark mt-1.5">{errors.message}</p>}
              </div>
              <button type="submit" className="btn-primary w-full sm:w-auto">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
