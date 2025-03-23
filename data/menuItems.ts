import { MenuItem } from '../types/MenuItem';

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    rating: 4.8,
    category: 'pizza'
  },
  {
    id: 2,
    name: 'Pepperoni Pizza',
    description: 'Classic pizza topped with pepperoni slices',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1780&q=80',
    rating: 4.7,
    category: 'pizza'
  },
  {
    id: 3,
    name: 'Vegetarian Pizza',
    description: 'Fresh vegetables on a crispy crust with tomato sauce and cheese',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    rating: 4.5,
    category: 'pizza'
  },
  {
    id: 4,
    name: 'Classic Burger',
    description: 'Beef patty with lettuce, tomato, and special sauce',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    rating: 4.6,
    category: 'burger'
  },
  {
    id: 5,
    name: 'Cheese Burger',
    description: 'Classic burger with melted cheese',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    rating: 4.7,
    category: 'burger'
  },
  {
    id: 6,
    name: 'Veggie Burger',
    description: 'Plant-based patty with fresh vegetables',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1585238342-7684c019e1cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1780&q=80',
    rating: 4.4,
    category: 'burger'
  },
  {
    id: 7,
    name: 'California Roll',
    description: 'Crab, avocado, and cucumber wrapped in seaweed and rice',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    rating: 4.8,
    category: 'sushi'
  },
  {
    id: 8,
    name: 'Spicy Tuna Roll',
    description: 'Spicy tuna and cucumber wrapped in seaweed and rice',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    rating: 4.9,
    category: 'sushi'
  },
  {
    id: 9,
    name: 'Chocolate Cake',
    description: 'Rich chocolate cake with chocolate ganache',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1789&q=80',
    rating: 4.7,
    category: 'dessert'
  },
  {
    id: 10,
    name: 'Cheesecake',
    description: 'Creamy cheesecake with berry compote',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    rating: 4.8,
    category: 'dessert'
  },
  {
    id: 11,
    name: 'Ice Cream Sundae',
    description: 'Vanilla ice cream with chocolate sauce and toppings',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1827&q=80',
    rating: 4.6,
    category: 'dessert'
  },
  {
    id: 12,
    name: 'Chicken Curry',
    description: 'Spicy chicken curry with rice',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1604579905647-9e5e3bfac7f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    rating: 4.8,
    category: 'main'
  }
]; 