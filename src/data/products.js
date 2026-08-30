export const categories = [
  { id: 'classic', name: 'Classic Cakes', icon: '🎂' },
]

const cakePhotos = [
  'https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=900&q=80',
]

const img = (seed) => {
  const index = Math.abs(Array.from(String(seed)).reduce((sum, char) => sum + char.charCodeAt(0), 0)) % cakePhotos.length
  return cakePhotos[index]
}

const defaultProducts = [
  {
    id: 'vanilla-cake',
    name: 'Vanilla Cake',
    category: 'classic',
    description: 'Classic vanilla sponge with soft cream frosting.',
    ingredients: ['Vanilla', 'Flour', 'Butter', 'Cream'],
    price: 300,
    rating: 4.8,
    reviews: 120,
    bestSeller: true,
    sizes: [
      { id: '0.5kg', label: '0.5 KG', price: 300 },
      { id: '1kg', label: '1 KG', price: 550 },
    ],
    image: img('vanilla-cake'),
  },
  {
    id: 'chocolate-cake',
    name: 'Chocolate Cake',
    category: 'classic',
    description: 'Rich chocolate sponge layered with decadent chocolate cream.',
    ingredients: ['Chocolate', 'Flour', 'Butter', 'Cream'],
    price: 400,
    rating: 4.9,
    reviews: 140,
    bestSeller: true,
    sizes: [
      { id: '0.5kg', label: '0.5 KG', price: 400 },
      { id: '1kg', label: '1 KG', price: 750 },
    ],
    image: img('chocolate-cake'),
  },
  {
    id: 'pineapple-cake',
    name: 'Pineapple Cake',
    category: 'classic',
    description: 'Light sponge with tropical pineapple flavour and cream.',
    ingredients: ['Pineapple', 'Flour', 'Butter', 'Cream'],
    price: 350,
    rating: 4.7,
    reviews: 95,
    bestSeller: true,
    sizes: [
      { id: '0.5kg', label: '0.5 KG', price: 350 },
      { id: '1kg', label: '1 KG', price: 650 },
    ],
    image: img('pineapple-cake'),
  },
  {
    id: 'mango-cake',
    name: 'Mango Cake',
    category: 'classic',
    description: 'Fresh mango flavour with a creamy, fruity finish.',
    ingredients: ['Mango', 'Flour', 'Butter', 'Cream'],
    price: 400,
    rating: 4.8,
    reviews: 110,
    bestSeller: true,
    sizes: [
      { id: '0.5kg', label: '0.5 KG', price: 400 },
      { id: '1kg', label: '1 KG', price: 750 },
    ],
    image: img('mango-cake'),
  },
  {
    id: 'blackcurrant-cake',
    name: 'Blackcurrant Cake',
    category: 'classic',
    description: 'Fruit-forward blackcurrant flavour with creamy layers.',
    ingredients: ['Blackcurrant', 'Flour', 'Butter', 'Cream'],
    price: 350,
    rating: 4.7,
    reviews: 90,
    bestSeller: true,
    sizes: [
      { id: '0.5kg', label: '0.5 KG', price: 350 },
      { id: '1kg', label: '1 KG', price: 650 },
    ],
    image: img('blackcurrant-cake'),
  },
  {
    id: 'strawberry-cake',
    name: 'Strawberry Cake',
    category: 'classic',
    description: 'Sweet strawberry flavour with soft cream filling.',
    ingredients: ['Strawberry', 'Flour', 'Butter', 'Cream'],
    price: 350,
    rating: 4.8,
    reviews: 100,
    bestSeller: true,
    sizes: [
      { id: '0.5kg', label: '0.5 KG', price: 350 },
      { id: '1kg', label: '1 KG', price: 650 },
    ],
    image: img('strawberry-cake'),
  },
  {
    id: 'butterscotch-cake',
    name: 'Butterscotch Cake',
    category: 'classic',
    description: 'Golden butterscotch flavour with a rich caramel finish.',
    ingredients: ['Butterscotch', 'Flour', 'Butter', 'Cream'],
    price: 400,
    rating: 4.8,
    reviews: 105,
    bestSeller: true,
    sizes: [
      { id: '0.5kg', label: '0.5 KG', price: 400 },
      { id: '1kg', label: '1 KG', price: 750 },
    ],
    image: img('butterscotch-cake'),
  },
  {
    id: 'black-forest-cake',
    name: 'Black Forest Cake',
    category: 'classic',
    description: 'Classic black forest with chocolate sponge and cherry flavour.',
    ingredients: ['Chocolate', 'Cherry', 'Flour', 'Cream'],
    price: 450,
    rating: 4.9,
    reviews: 145,
    bestSeller: true,
    sizes: [
      { id: '0.5kg', label: '0.5 KG', price: 450 },
      { id: '1kg', label: '1 KG', price: 850 },
    ],
    image: img('black-forest-cake'),
  },
  {
    id: 'white-forest-cake',
    name: 'White Forest Cake',
    category: 'classic',
    description: 'Creamy white forest cake with a soft, rich finish.',
    ingredients: ['Cream', 'Flour', 'Butter', 'Vanilla'],
    price: 450,
    rating: 4.8,
    reviews: 88,
    bestSeller: true,
    sizes: [
      { id: '0.5kg', label: '0.5 KG', price: 450 },
      { id: '1kg', label: '1 KG', price: 850 },
    ],
    image: img('white-forest-cake'),
  },
  {
    id: 'red-velvet-cake',
    name: 'Red Velvet Cake',
    category: 'classic',
    description: 'Smooth red velvet sponge with soft cream frosting.',
    ingredients: ['Red Velvet', 'Flour', 'Butter', 'Cream'],
    price: 450,
    rating: 4.9,
    reviews: 130,
    bestSeller: true,
    sizes: [
      { id: '0.5kg', label: '0.5 KG', price: 450 },
      { id: '1kg', label: '1 KG', price: 850 },
    ],
    image: img('red-velvet-cake'),
  },
]

export const PRODUCT_STORAGE_KEY = 'philo_admin_products_v1'
export let products = [...defaultProducts]

export function syncProductsFromStorage() {
  try {
    const raw = localStorage.getItem(PRODUCT_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        products = parsed
        return products
      }
    }
  } catch {
    // ignore and use default catalog
  }

  products = [...defaultProducts]
  return products
}

export function saveProductsCatalog(list) {
  const next = Array.isArray(list) && list.length > 0 ? list : [...defaultProducts]
  products = next
  localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(next))
  return products
}

syncProductsFromStorage()

export const getProductById = (id) => products.find((p) => p.id === id)
export const getProductsByCategory = (categoryId) =>
  categoryId === 'all' ? products : products.filter((p) => p.category === categoryId)
export const getBestSellers = () => products.filter((p) => p.bestSeller)
