import React from 'react'

interface MenuFilterProps {
  activeFilter: string;
  setFilter: (filter: string) => void;
}

const categories = [
  { id: 'all', name: 'All' },
  { id: 'pizza', name: 'Pizza' },
  { id: 'burger', name: 'Burgers' },
  { id: 'sushi', name: 'Sushi' },
  { id: 'dessert', name: 'Desserts' },
  { id: 'main', name: 'Main Courses' }
]

const MenuFilter: React.FC<MenuFilterProps> = ({ activeFilter, setFilter }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {categories.map(category => (
        <button
          key={category.id}
          className={`px-4 py-2 rounded-full ${
            activeFilter === category.id 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          onClick={() => setFilter(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}

export default MenuFilter 