# Philo's Cakes — Cake Shop Website

A complete, production-quality React + Vite storefront for a cake shop / bakery business.

## Features

- Home page with hero, featured cakes, best sellers, reviews, and "why choose us"
- Full cakes menu across 10 categories with search, category filters and sorting
- Product details page with size selection, quantity, custom cake message and ingredients
- Cart with quantity controls, item removal, free-delivery threshold and totals
- Checkout with form validation, delivery date/time selection and a WhatsApp order option
- About Us and Contact pages (with embedded Google Map and a validated contact form)
- Cart persists in `localStorage`, so it survives page refreshes
- Fully responsive: mobile nav, mobile search, adaptive grids
- Custom "bakery" design system: cream/chocolate/pastel palette, Fraunces + Outfit type,
  a signature piped-icing underline and scalloped pastry-edge dividers

## Getting Started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
  components/   Reusable UI: Navbar, Footer, ProductCard, CartToast, etc.
  context/      CartContext — cart state + localStorage persistence
  data/         Product catalog (10 categories) and sample reviews
  pages/        Home, Menu, ProductDetails, Cart, Checkout, About, Contact, OrderSuccess, NotFound
  App.jsx       Route definitions
  main.jsx      App entry point
```

## Customizing

- **Products & prices**: edit `src/data/products.js`
- **WhatsApp number**: update `BAKERY_WHATSAPP_NUMBER` in `src/pages/Checkout.jsx` and
  `src/components/WhatsAppButton.jsx` (use full international format, digits only, e.g. `919876543210`)
- **Contact info / map / hours**: edit `src/pages/Contact.jsx`
- **Delivery fee & free-delivery threshold**: edit constants at the top of `src/context/CartContext.jsx`
- **Images**: every product currently uses a placeholder photo service (picsum.photos) seeded
  by product name for consistency — swap the `image` field in `products.js` for real photography
  when ready.

## Tech Stack

- React 18 + Vite
- React Router v6
- Tailwind CSS (custom theme: colors, fonts, animations in `tailwind.config.js`)
- Cart persistence via `localStorage` (no backend required — wire up a real API/payment
  gateway in `Checkout.jsx`'s `handlePlaceOrder` when you're ready to go live)
# shop-website
