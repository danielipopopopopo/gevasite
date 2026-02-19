import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Product } from '../data/products';
import { PayPalButtons } from '@paypal/react-paypal-js';
import emailjs from '@emailjs/browser';

interface CartItem extends Product {
    quantity: number;
}

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    onRemove: (id: string) => void;
    onUpdateQuantity: (id: string, delta: number) => void;
    onClearCart: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onRemove, onUpdateQuantity, onClearCart }) => {
    const { t, i18n } = useTranslation();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        street: '',
        houseNum: '',
        floor: '',
        apartment: ''
    });

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const deliveryFee = items.length > 0 ? 20 : 0;
    const total = subtotal + deliveryFee;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOrderSuccess = async (details: any) => {
        const fullAddress = `${formData.city}, ${formData.street} ${formData.houseNum}, קומה ${formData.floor}, דירה ${formData.apartment}`;
        const templateParams = {
            to_email: 'devils.stwr@gmail.com',
            from_name: formData.name,
            customer_email: formData.email,
            customer_phone: formData.phone,
            order_id: details.id,
            address: fullAddress,
            items: items.map(i => `${i.name} x ${i.quantity}`).join(', '),
            total: total,
        };

        try {
            await emailjs.send(
                'service_tk0s4if',
                'template_hqeerai',
                templateParams,
                'aZIGA07ljKe5H9voY'
            );
            alert(t('orderSuccess'));
            onClearCart();
            onClose();
        } catch (error) {
            console.error('Email error:', error);
            alert('Order confirmed. Notification failed.');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 z-[2000] backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ x: i18n.language === 'he' ? '-100%' : '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: i18n.language === 'he' ? '-100%' : '100%' }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className={`fixed inset-y-0 ${i18n.language === 'he' ? 'left-0' : 'right-0'} w-full lg:w-[450px] bg-color-bg z-[2100] flex flex-col border-l border-color-border shadow-2xl`}
                    >
                        <div className="p-8 lg:p-12 flex items-center justify-between border-b border-color-border">
                            <h2 className="text-4xl font-display text-color-gold">{t('cart')}</h2>
                            <button onClick={onClose} className="p-2 text-color-text-tertiary hover:text-color-gold transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-8 lg:px-12 py-12 space-y-10">
                            {items.length === 0 ? (
                                <div className="text-center py-40 opacity-20">
                                    <ShoppingBag size={64} className="mx-auto mb-8" />
                                    <p className="text-sm font-bold uppercase tracking-widest">{t('emptyCart')}</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-6 items-center group">
                                        <div className="w-24 aspect-[3/4] overflow-hidden bg-color-bg-elevated border border-color-border">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div className="flex justify-between items-start gap-4">
                                                <h4 className="text-xl font-display text-color-text-primary leading-none">{item.name}</h4>
                                                <button onClick={() => onRemove(item.id)} className="text-color-text-tertiary hover:text-color-gold transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <p className="text-lg font-display text-color-gold italic">{t('shekels')}{item.price}</p>

                                            <div className="flex items-center gap-4 pt-2">
                                                <div className="flex items-center border border-color-border rounded-sm">
                                                    <button onClick={() => onUpdateQuantity(item.id, -1)} className="px-3 py-1 text-xs hover:bg-white/5 transition-colors">-</button>
                                                    <span className="px-4 text-[10px] font-bold border-x border-color-border">{item.quantity}</span>
                                                    <button onClick={() => onUpdateQuantity(item.id, 1)} className="px-3 py-1 text-xs hover:bg-white/5 transition-colors">+</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-8 lg:p-12 glass-luxury border-t border-color-border space-y-8">
                                {!isCheckingOut ? (
                                    <>
                                        <div className="space-y-4">
                                            <div className="flex justify-between text-color-text-tertiary text-[10px] font-bold uppercase tracking-[0.2em]">
                                                <span>{t('deliveryFee')}</span>
                                                <span>{t('shekels')}{deliveryFee}</span>
                                            </div>
                                            <div className="flex justify-between items-end pt-2 border-t border-color-border/10">
                                                <span className="text-lg font-bold uppercase tracking-widest">{t('total')}</span>
                                                <span className="text-4xl font-display text-color-gold italic">{t('shekels')}{total}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setIsCheckingOut(true)}
                                            className="btn-luxury w-full flex items-center justify-between"
                                        >
                                            {t('checkout')} <ArrowRight size={18} />
                                        </button>
                                    </>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="grid gap-2">
                                            <input type="text" name="name" placeholder={t('name')} required className="w-full bg-transparent border-b border-color-border p-3 text-sm font-body outline-none focus:border-color-gold transition-colors placeholder:opacity-30" onChange={handleInputChange} />
                                            <div className="grid grid-cols-2 gap-2">
                                                <input type="email" name="email" placeholder={t('email')} required className="w-full bg-transparent border-b border-color-border p-3 text-sm font-body outline-none focus:border-color-gold transition-colors placeholder:opacity-30" onChange={handleInputChange} />
                                                <input type="tel" name="phone" placeholder={t('phone')} required className="w-full bg-transparent border-b border-color-border p-3 text-sm font-body outline-none focus:border-color-gold transition-colors placeholder:opacity-30" onChange={handleInputChange} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input type="text" name="city" placeholder={t('city')} required className="w-full bg-transparent border-b border-color-border p-3 text-sm font-body outline-none focus:border-color-gold transition-colors placeholder:opacity-30" onChange={handleInputChange} />
                                                <input type="text" name="street" placeholder={t('street')} required className="w-full bg-transparent border-b border-color-border p-3 text-sm font-body outline-none focus:border-color-gold transition-colors placeholder:opacity-30" onChange={handleInputChange} />
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                <input type="text" name="houseNum" placeholder={t('houseNum')} required className="w-full bg-transparent border-b border-color-border p-3 text-sm font-body outline-none focus:border-color-gold transition-colors placeholder:opacity-30" onChange={handleInputChange} />
                                                <input type="text" name="floor" placeholder={t('floor')} required className="w-full bg-transparent border-b border-color-border p-3 text-sm font-body outline-none focus:border-color-gold transition-colors placeholder:opacity-30" onChange={handleInputChange} />
                                                <input type="text" name="apartment" placeholder={t('apartment')} required className="w-full bg-transparent border-b border-color-border p-3 text-sm font-body outline-none focus:border-color-gold transition-colors placeholder:opacity-30" onChange={handleInputChange} />
                                            </div>
                                        </div>

                                        <PayPalButtons
                                            style={{ layout: "vertical", color: "gold", shape: "pill", label: "pay" }}
                                            createOrder={(_data, actions) => {
                                                return actions.order.create({
                                                    intent: 'CAPTURE',
                                                    purchase_units: [{ amount: { currency_code: 'ILS', value: total.toString() } }],
                                                });
                                            }}
                                            onApprove={(_data, actions) => {
                                                return actions.order!.capture().then((details) => {
                                                    handleOrderSuccess(details);
                                                });
                                            }}
                                        />

                                        <button onClick={() => setIsCheckingOut(false)} className="w-full text-color-text-tertiary hover:text-color-text-primary uppercase font-bold text-[9px] tracking-[0.3em] text-center transition-colors">
                                            Return To Bag
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Cart;
