export default function StarRating({ rating, size = 14, showValue = true }) {
  const full = Math.round(rating)
  return (
    <span className="inline-flex items-center gap-1">
      <span className="flex items-center" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={i < full ? '#C69A3E' : 'none'}
            stroke="#C69A3E"
            strokeWidth="1.5"
          >
            <path d="M12 2.5 15 9l7 .9-5.1 4.8 1.4 6.9L12 18l-6.3 3.6 1.4-6.9L2 9.9 9 9z" />
          </svg>
        ))}
      </span>
      {showValue && <span className="text-xs text-cocoa/60 font-utility">{rating.toFixed(1)}</span>}
    </span>
  )
}
