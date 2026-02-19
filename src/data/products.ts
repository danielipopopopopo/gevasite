export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: 'shirt' | 'jacket';
}

export const PRODUCTS: Product[] = [
    {
        id: 's1',
        name: 'Demon Oversized Tee',
        price: 120,
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop',
        category: 'shirt'
    },
    {
        id: 's2',
        name: 'Hellfire Graphic Shirt',
        price: 140,
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop',
        category: 'shirt'
    },
    {
        id: 'j1',
        name: 'Ghost Bomber Jacket',
        price: 350,
        image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=1000&auto=format&fit=crop',
        category: 'jacket'
    },
    {
        id: 'j2',
        name: 'Biker Leather Jacket',
        price: 450,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop',
        category: 'jacket'
    },
    {
        id: 's3',
        name: 'Black Hole Tee',
        price: 110,
        image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop',
        category: 'shirt'
    },
    {
        id: 'j3',
        name: 'Red Velvet Jacket',
        price: 280,
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop',
        category: 'jacket'
    }
];
