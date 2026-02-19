import React from 'react';
import { motion } from 'framer-motion';
import type { Product } from '../data/products';
import { useTranslation } from 'react-i18next';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6 group"
        >
            <div className="relative aspect-[3/4] overflow-hidden bg-color-bg-elevated border border-color-border hover:border-color-border-hover transition-colors duration-500">
                <motion.img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-8 backdrop-blur-[2px]">
                    <button
                        onClick={() => onAddToCart(product)}
                        className="btn-luxury w-full flex items-center justify-center gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                    >
                        {t('addToCart')} <ShoppingBag size={18} strokeWidth={1.5} />
                    </button>
                </div>
            </div>

            <div className="space-y-2 px-2">
                <div className="flex justify-between items-baseline gap-4">
                    <h3 className="text-2xl font-display text-color-text-primary tracking-tight">
                        {product.name}
                    </h3>
                    <p className="text-xl font-display text-color-gold italic">
                        {t('shekels')}{product.price}
                    </p>
                </div>
                <p className="text-[10px] text-color-text-tertiary uppercase tracking-[0.3em]">
                    {product.category}
                </p>
            </div>
        </motion.div>
    );
};

export default ProductCard;
