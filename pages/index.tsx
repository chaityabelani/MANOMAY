import type { NextPage } from 'next'
import Head from 'next/head'
import Hero from '../components/Hero'
import FeaturedItems from '../components/FeaturedItems'
import Categories from '../components/Categories'
import Testimonials from '../components/Testimonials'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Manomay - Delicious Food Delivered</title>
        <meta name="description" content="Order delicious food online with Manomay" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Hero />
        <Categories />
        <FeaturedItems />
        <Testimonials />
      </main>
    </div>
  )
}

export default Home 