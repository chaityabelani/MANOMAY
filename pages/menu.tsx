import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import MenuList from '../components/MenuList'
import MenuFilter from '../components/MenuFilter'
import { menuItems } from '../data/menuItems'

const Menu: NextPage = () => {
  const [filter, setFilter] = useState('all')
  
  const filteredItems = filter === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === filter)

  return (
    <div>
      <Head>
        <title>Menu | Manomay</title>
        <meta name="description" content="Browse our delicious menu" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Our Menu</h1>
        
        <MenuFilter activeFilter={filter} setFilter={setFilter} />
        <MenuList items={filteredItems} />
      </div>
    </div>
  )
}

export default Menu 