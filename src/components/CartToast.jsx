import { useCart } from '../context/CartContext'

export default function CartToast() {
  const { toast } = useCart()
  if (!toast) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-fadeUp">
      <div className="bg-choc text-cream px-6 py-3.5 rounded-full shadow-lift flex items-center gap-2.5 font-body text-sm">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M20 6 9 17l-5-5" />
        </svg>
        {toast}
      </div>
    </div>
  )
}
