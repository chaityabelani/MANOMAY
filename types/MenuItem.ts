export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  category: string;
  quantity?: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
} 