import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import CartItem from '../components/CartItem'
import CheckoutForm from '../components/CheckoutForm'
import { useCart } from '../hooks/useCart'

const Cart: NextPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
  const [subtotal, setSubtotal] = useState(0)
  
  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    setSubtotal(total)
  }, [cart])

  return (
    <div>
      <Head>
        <title>Your Cart | Manomay</title>
        <meta name="description" content="Review your order and checkout" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Your Cart</h1>
        
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl mb-4">Your cart is empty</p>
            <a href="/menu" className="btn-primary">Browse Menu</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cart.map(item => (
                <CartItem 
                  key={item.id} 
                  item={item} 
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                />
              ))}
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg h-fit">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Delivery Fee</span>
                <span>$2.99</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                <span>Total</span>
                <span>${(subtotal + 2.99).toFixed(2)}</span>
              </div>
              
              <CheckoutForm subtotal={subtotal} clearCart={clearCart} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart 