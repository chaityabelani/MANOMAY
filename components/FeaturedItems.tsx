import React from 'react'
import Image from 'next/image'
import { FiStar } from 'react-icons/fi'
import { useCart } from '../hooks/useCart'

const featuredItems = [
  {
    id: 1,
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    rating: 4.8,
    category: 'pizza'
  },
  {
    id: 2,
    name: 'Deluxe Burger',
    description: 'Juicy beef patty with cheese, lettuce, tomato, and special sauce',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    rating: 4.6,
    category: 'burger'
  },
  {
    id: 3,
    name: 'Rainbow Roll',
    description: 'Colorful sushi roll with tuna, salmon, avocado, and cucumber',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    rating: 4.9,
    category: 'sushi'
  }
]

const FeaturedItems: React.FC = () => {
  const { addToCart } = useCart()

  return (
    <section className="py-16">
      <div className="container-custom">
        <h2 className="text-3xl font-bold mb-2 text-center">Featured Items</h2>
        <p className="text-gray-600 mb-12 text-center max-w-2xl mx-auto">
          Try our most popular dishes loved by customers
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <Image 
                  src={item.image} 
                  alt={item.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <span className="text-primary font-bold">${item.price}</span>
                </div>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <FiStar className="text-yellow-400 fill-current" />
                    <span className="ml-1">{item.rating}</span>
                  </div>
                  <button 
                    className="btn-primary"
                    onClick={() => addToCart({...item, quantity: 1})}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedItems 