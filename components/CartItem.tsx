import React from 'react'
import Image from 'next/image'
import { FiMinus, FiPlus, FiTrash } from 'react-icons/fi'
import { CartItem as CartItemType } from '../types/MenuItem'

interface CartItemProps {
  item: CartItemType;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, removeFromCart, updateQuantity }) => {
  return (
    <div className="flex items-center border-b py-4">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
        <Image 
          src={item.image} 
          alt={item.name}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      
      <div className="ml-4 flex-1">
        <h3 className="text-lg font-medium">{item.name}</h3>
        <p className="text-primary font-bold">${item.price}</p>
      </div>
      
      <div className="flex items-center">
        <button 
          className="p-1 text-gray-500 hover:text-primary"
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
        >
          <FiMinus />
        </button>
        <span className="mx-2 w-8 text-center">{item.quantity}</span>
        <button 
          className="p-1 text-gray-500 hover:text-primary"
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <FiPlus />
        </button>
      </div>
      
      <div className="ml-4 text-right">
        <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
        <button 
          className="mt-1 text-red-500 hover:text-red-700"
          onClick={() => removeFromCart(item.id)}
        >
          <FiTrash />
        </button>
      </div>
    </div>
  )
}

export default CartItem 