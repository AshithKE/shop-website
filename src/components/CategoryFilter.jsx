import { categories } from '../data/products'

export default function CategoryFilter({ active, onChange }) {
  const all = [{ id: 'all', name: 'All Cakes', icon: '🍮' }, ...categories]

  return (
    <div className="flex gap-2.5 overflow-x-auto pb-3 -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-none">
      {all.map((c) => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className={`shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-300 whitespace-nowrap ${
            active === c.id
              ? 'bg-choc text-cream border-choc shadow-card'
              : 'bg-white text-cocoa/75 border-cream-line hover:border-choc/40 hover:text-choc'
          }`}
        >
          <span>{c.icon}</span>
          {c.name}
        </button>
      ))}
    </div>
  )
}
