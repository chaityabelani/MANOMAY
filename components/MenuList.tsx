import React from 'react'
import Image from 'next/image'
import { FiStar } from 'react-icons/fi'
import { useCart } from '../hooks/useCart'
import { MenuItem } from '../types/MenuItem'

interface MenuListProps {
  items: MenuItem[]
}

const MenuList: React.FC<MenuListProps> = ({ items }) => {
  const { addToCart } = useCart()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      {items.map(item => (
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
  )
}

export default MenuList 