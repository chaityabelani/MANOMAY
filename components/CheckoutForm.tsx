import React, { useState } from 'react'
import { useRouter } from 'next/router'

interface CheckoutFormProps {
  subtotal: number;
  clearCart: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ subtotal, clearCart }) => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    paymentMethod: 'card'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      clearCart()
      router.push('/order-confirmation')
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <h3 className="text-lg font-bold mb-4">Delivery Information</h3>
      
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="zip" className="block text-sm font-medium mb-1">ZIP Code</label>
          <input
            type="text"
            id="zip"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="paymentMethod" className="block text-sm font-medium mb-1">Payment Method</label>
        <select
          id="paymentMethod"
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="card">Credit Card</option>
          <option value="paypal">PayPal</option>
          <option value="cash">Cash on Delivery</option>
        </select>
      </div>
      
      <button 
        type="submit" 
        className="w-full btn-primary py-3"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Processing...' : `Pay $${(subtotal + 2.99).toFixed(2)}`}
      </button>
    </form>
  )
}

export default CheckoutForm 