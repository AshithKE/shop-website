import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container-bakery py-32 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <span className="text-6xl mb-5">🍪</span>
      <h1 className="font-display text-4xl mb-3">Page Not Found</h1>
      <p className="text-cocoa/60 mb-8 max-w-sm">
        This slice seems to have gone missing. Let's get you back to something sweet.
      </p>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </div>
  )
}
