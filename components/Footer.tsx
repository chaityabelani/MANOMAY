import React from 'react'
import Link from 'next/link'
import { FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi'

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Manomay</h3>
            <p className="text-gray-300">
              Delicious food delivered to your doorstep. Order online for a hassle-free dining experience.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/menu" className="text-gray-300 hover:text-white transition-colors">Menu</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <address className="not-italic text-gray-300">
              <p>123 Food Street</p>
              <p>Foodville, FD 12345</p>
              <p className="mt-2">Phone: (123) 456-7890</p>
              <p>Email: info@manomay.com</p>
            </address>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <FiFacebook className="text-2xl" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <FiInstagram className="text-2xl" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <FiTwitter className="text-2xl" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Manomay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 