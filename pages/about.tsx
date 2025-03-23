import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

const About: NextPage = () => {
  return (
    <div>
      <Head>
        <title>About Us | Manomay</title>
        <meta name="description" content="Learn more about Manomay food delivery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">About Manomay</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Manomay was founded in 2020 with a simple mission: to deliver delicious, 
              high-quality food to people's homes with speed and reliability.
            </p>
            <p className="text-gray-600 mb-4">
              What started as a small operation with just a few restaurant partners has 
              grown into a beloved food delivery service connecting customers with the 
              best local restaurants in the area.
            </p>
            <p className="text-gray-600">
              We believe that good food brings people together, and we're proud to be 
              a part of countless family dinners, friendly gatherings, and quiet nights in.
            </p>
          </div>
          <div className="relative h-80 rounded-lg overflow-hidden">
            <Image 
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" 
              alt="Restaurant interior"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 md:order-1 relative h-80 rounded-lg overflow-hidden">
            <Image 
              src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1780&q=80" 
              alt="Food delivery"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              At Manomay, we're committed to making food delivery better for everyone. 
              That means working with restaurants to help them reach more customers, 
              providing delivery drivers with flexible earning opportunities, and giving 
              customers a seamless way to discover and order from their favorite restaurants.
            </p>
            <p className="text-gray-600">
              We're constantly innovating to improve our service, from developing better 
              technology to ensure hot food arrives hot, to expanding our selection of 
              restaurants to offer more diverse options.
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Quality First</h3>
              <p className="text-gray-600">
                We partner only with restaurants that meet our high standards for food quality and preparation.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Reliability</h3>
              <p className="text-gray-600">
                We strive to deliver every order on time, exactly as ordered, with no surprises.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Community</h3>
              <p className="text-gray-600">
                We support local restaurants and create opportunities for delivery partners in our community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About 