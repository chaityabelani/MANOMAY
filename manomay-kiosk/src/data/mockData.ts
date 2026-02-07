import { Category, Product } from "@/types";

export const CATEGORIES: Category[] = [
    { id: "1", name: "Burgers", slug: "burgers" },
    { id: "2", name: "Pizza", slug: "pizza" },
    { id: "3", name: "Drinks", slug: "drinks" },
    { id: "4", name: "Ice Cream", slug: "ice-cream" },
];

export const PRODUCTS: Product[] = [
    {
        id: "p1",
        name: "Classic Cheese Burger",
        description: "Juicy beef patty with cheddar cheese, lettuce, tomato, and house sauce.",
        price: 149,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
        categoryId: "1",
        isPopular: true,
    },
    {
        id: "p2",
        name: "Spicy Chicken Burger",
        description: "Crispy chicken fillet with spicy mayo and pickles.",
        price: 189,
        image: "https://images.unsplash.com/photo-1615297349122-c363c669991e?w=600&q=80",
        categoryId: "1",
    },
    {
        id: "p3",
        name: "Margherita Pizza",
        description: "Classic tomato sauce, mozzarella, and basil.",
        price: 299,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80",
        categoryId: "2",
    },
    {
        id: "p4",
        name: "Pepperoni Feast",
        description: "Loaded with pepperoni and extra cheese.",
        price: 349,
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80",
        categoryId: "2",
        isPopular: true,
    },
    {
        id: "p5",
        name: "Cola Zero",
        description: "Refreshing zero sugar cola.",
        price: 49,
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&q=80",
        categoryId: "3",
    },
    {
        id: "p6",
        name: "Fresh Lemonade",
        description: "Freshly squeezed lemons with mint.",
        price: 69,
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&q=80",
        categoryId: "3",
    },
    {
        id: "p7",
        name: "Chocolate Sundae",
        description: "Vanilla ice cream with hot fudge sauce.",
        price: 99,
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80",
        categoryId: "4",
    },
];
