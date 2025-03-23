'use client';

import React from 'react';
import Image from 'next/image';
import { FaUtensils, FaPizzaSlice, FaHamburger, FaIceCream } from 'react-icons/fa';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Category } from './types';

const Home: React.FC = () => {
  const categories: Category[] = [
    { name: 'Main Course', icon: <FaUtensils className="w-8 h-8" /> },
    { name: 'Pizza', icon: <FaPizzaSlice className="w-8 h-8" /> },
    { name: 'Burgers', icon: <FaHamburger className="w-8 h-8" /> },
    { name: 'Desserts', icon: <FaIceCream className="w-8 h-8" /> },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070"
              alt="Delicious food background"
              fill
              className="object-cover brightness-50"
              priority
            />
          </div>
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-5xl font-bold mb-4">Welcome to Manomay</h1>
            <p className="text-xl mb-8">Discover the most delicious food in town</p>
            <button className="btn-primary">Order Now</button>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Food Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <div key={index} className="card text-center hover:scale-105 cursor-pointer">
                  <div className="flex justify-center mb-4 text-primary">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Dishes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="card">
                  <div className="relative h-48 mb-4">
                    <Image
                      src={`https://images.unsplash.com/photo-${item === 1 ? '1504674900247-0877df9cc836' : item === 2 ? '1513104890138-7c749659a591' : '1565299624946-b28f40a0ae38'}?q=80&w=2070`}
                      alt={`Featured dish ${item}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Delicious Dish {item}</h3>
                  <p className="text-gray-600 mb-4">A mouth-watering description of the dish that will make you want to order it right away.</p>
                  <button className="btn-secondary w-full">Add to Cart</button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home; 