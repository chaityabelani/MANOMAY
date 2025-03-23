import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Hero: React.FC = () => {
  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" 
          alt="Delicious food"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      
      <div className="relative z-10 h-full flex items-center">
        <div className="container-custom text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Delicious Food <br />
            <span className="text-primary">Delivered to You</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            Experience the finest cuisine from the comfort of your home. 
            Order now and satisfy your cravings!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/menu" className="btn-primary text-center">
              Order Now
            </Link>
            <Link href="/menu" className="bg-white text-dark font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-all text-center">
              View Menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero 