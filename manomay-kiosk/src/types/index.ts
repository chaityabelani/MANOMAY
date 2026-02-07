export interface Category {
    id: string;
    name: string;
    slug: string;
    image?: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    categoryId: string;
    isPopular?: boolean;
}

export interface CartItem extends Product {
    quantity: number;
}
