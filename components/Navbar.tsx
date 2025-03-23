import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiShoppingCart, FiMenu, FiX } from 'react-icons/fi'
import { useCart } from '../hooks/useCart'

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { cart } = useCart()
  
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0)
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container-custom">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">Manomay</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/menu" className="font-medium hover:text-primary transition-colors">
              Menu
            </Link>
            <Link href="/about" className="font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="font-medium hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
          
          <div className="flex items-center">
            <Link href="/cart" className="relative p-2">
              <FiShoppingCart className="text-2xl" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            
            {/* Mobile menu button */}
            <button 
              className="ml-4 md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <Link href="/" className="block py-2 font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/menu" className="block py-2 font-medium hover:text-primary transition-colors">
              Menu
            </Link>
            <Link href="/about" className="block py-2 font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="block py-2 font-medium hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar 