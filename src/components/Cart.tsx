import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, ArrowRight, ArrowLeft, Check } from 'lucide-react';
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

type Step = 1 | 2 | 3;

const stepLabels: Record<Step, string> = {
    1: 'Bag',
    2: 'Shipping',
    3: 'Payment',
};

const StepIndicator: React.FC<{ step: Step }> = ({ step }) => (
    <div className="flex items-center justify-center gap-0 mb-1">
        {([1, 2, 3] as Step[]).map((s, idx) => (
            <React.Fragment key={s}>
                <div className="flex flex-col items-center gap-1">
                    <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-500 ${s < step
                            ? 'bg-color-gold border-color-gold text-black'
                            : s === step
                                ? 'border-color-gold text-color-gold bg-transparent'
                                : 'border-color-border text-color-text-tertiary bg-transparent'
                            }`}
                    >
                        {s < step ? <Check size={12} /> : s}
                    </div>
                    <span
                        className={`text-[8px] font-bold uppercase tracking-widest transition-all duration-500 ${s === step ? 'text-color-gold' : 'text-color-text-tertiary opacity-40'
                            }`}
                    >
                        {stepLabels[s]}
                    </span>
                </div>
                {idx < 2 && (
                    <div
                        className={`h-px w-10 mb-4 transition-all duration-700 ${s < step ? 'bg-color-gold' : 'bg-color-border'
                            }`}
                    />
                )}
            </React.Fragment>
        ))}
    </div>
);


const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onRemove, onUpdateQuantity, onClearCart }) => {
    const { t, i18n } = useTranslation();
    const [step, setStep] = useState<Step>(1);
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

    const goTo = (next: Step) => {
        setStep(next);
    };

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            setStep(1);
        }, 500);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const isShippingValid = formData.name && formData.email && formData.phone &&
        formData.city && formData.street && formData.houseNum;

    const handleOrderSuccess = async (details: any) => {
        const fullAddress = `${formData.city}, ${formData.street} ${formData.houseNum}, קומה ${formData.floor}, דירה ${formData.apartment}`;
        const templateParams = {
            email: formData.email, // Matches {{email}} in your 'To Email' field
            from_name: formData.name,
            customer_email: formData.email,
            customer_phone: formData.phone,
            order_id: details.id,
            address: fullAddress,
            orders: items.map(item => ({
                name: item.name,
                price: item.price,
                units: item.quantity
            })),
            total: total,
            'cost.shipping': 0,
            'cost.tax': 0
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
            handleClose();
        } catch (error) {
            console.error('Email error:', error);
            alert('Order confirmed. Notification failed.');
        }
    };

    const stepTitles: Record<Step, string> = {
        1: t('cart'),
        2: 'Shipping',
        3: 'Payment',
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/80 z-[2000] backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ x: i18n.language === 'he' ? '-100%' : '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: i18n.language === 'he' ? '-100%' : '100%' }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className={`fixed inset-y-0 ${i18n.language === 'he' ? 'left-0' : 'right-0'} w-full lg:w-[450px] bg-color-bg z-[2100] flex flex-col border-l border-color-border shadow-2xl overflow-hidden`}
                    >
                        {/* Header */}
                        <div className="p-8 lg:p-12 flex items-center justify-between border-b border-color-border flex-shrink-0">
                            <div>
                                <h2 className="text-4xl font-display text-color-gold">{stepTitles[step]}</h2>
                            </div>
                            <button onClick={handleClose} className="p-2 text-color-text-tertiary hover:text-color-gold transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Step Indicator (only show on steps 2+) */}
                        {step > 1 && (
                            <div className="px-8 lg:px-12 pt-8 flex-shrink-0">
                                <StepIndicator step={step} />
                            </div>
                        )}

                        {/* Step Content */}
                        <div className="flex-1 overflow-y-auto">
                            <AnimatePresence mode="wait" initial={false}>
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        {/* Cart Items */}
                                        <div className="px-8 lg:px-12 py-10 space-y-10">
                                            {items.length === 0 ? (
                                                <div className="text-center py-40 opacity-20">
                                                    <ShoppingBag size={64} className="mx-auto mb-8" />
                                                    <p className="text-sm font-bold uppercase tracking-widest">{t('emptyCart')}</p>
                                                </div>
                                            ) : (
                                                items.map((item) => (
                                                    <div key={item.id} className="flex gap-6 items-center group">
                                                        <div className="w-24 aspect-[3/4] overflow-hidden bg-color-bg-elevated border border-color-border flex-shrink-0">
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
                                                                    <button onClick={() => onUpdateQuantity(item.id, -1)} className="px-3 py-1 text-xs hover:bg-black/5 transition-colors">-</button>
                                                                    <span className="px-4 text-[10px] font-bold border-x border-color-border">{item.quantity}</span>
                                                                    <button onClick={() => onUpdateQuantity(item.id, 1)} className="px-3 py-1 text-xs hover:bg-black/5 transition-colors">+</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        <div className="px-8 lg:px-12 py-10 space-y-4">
                                            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-color-text-tertiary opacity-50 mb-6">Contact Information</p>
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder={t('name')}
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                autoComplete="name"
                                                className="w-full bg-transparent border-b border-color-border p-3 text-sm font-body outline-none focus:border-color-gold transition-colors placeholder:opacity-30"
                                            />
                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    placeholder={t('email')}
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                    autoComplete="email"
                                                    className="w-full bg-transparent border-b border-color-border p-3 text-sm font-body outline-none focus:border-color-gold transition-colors placeholder:opacity-30"
                                                />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    placeholder={t('phone')}
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    required
                                                    autoComplete="tel"
                                                    className="w-full bg-transparent border-b border-color-border p-3 text-sm font-body outline-none focus:border-color-gold transition-colors placeholder:opacity-30"
                                                />
                                            </div>
                                            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-color-text-tertiary opacity-50 mt-8 mb-2 pt-4">Delivery Address</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    type="text"
                                                    name="city"
                                                    placeholder={t('city')}
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full bg-transparent border-b border-color-border p-3 text-sm font-body outline-none focus:border-color-gold transition-colors placeholder:opacity-30"
                                                />
                                                <input
                                                    type="text"
                                                    name="street"
                                                    placeholder={t('street')}
                                                    value={formData.street}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full bg-transparent border-b border-color-border p-3 text-sm font-body outline-none focus:border-color-gold transition-colors placeholder:opacity-30"
                                                />
                                            </div>
                                            <div className="grid grid-cols-3 gap-3">
                                                <input
                                                    type="text"
                                                    name="houseNum"
                                                    placeholder={t('houseNum')}
                                                    value={formData.houseNum}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full bg-transparent border-b border-color-border p-3 text-sm font-body outline-none focus:border-color-gold transition-colors placeholder:opacity-30"
                                                />
                                                <input
                                                    type="text"
                                                    name="floor"
                                                    placeholder={t('floor')}
                                                    value={formData.floor}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-transparent border-b border-color-border p-3 text-sm font-body outline-none focus:border-color-gold transition-colors placeholder:opacity-30"
                                                />
                                                <input
                                                    type="text"
                                                    name="apartment"
                                                    placeholder={t('apartment')}
                                                    value={formData.apartment}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-transparent border-b border-color-border p-3 text-sm font-body outline-none focus:border-color-gold transition-colors placeholder:opacity-30"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        <div className="px-8 lg:px-12 py-10 space-y-8">
                                            {/* Order Summary */}
                                            <div className="space-y-4">
                                                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-color-text-tertiary opacity-50">Order Summary</p>
                                                {items.map(item => (
                                                    <div key={item.id} className="flex justify-between text-sm font-body">
                                                        <span className="opacity-70">{item.name} <span className="opacity-40">× {item.quantity}</span></span>
                                                        <span className="font-display text-color-gold">{t('shekels')}{item.price * item.quantity}</span>
                                                    </div>
                                                ))}
                                                <div className="border-t border-color-border/20 pt-3 flex justify-between text-[10px] text-color-text-tertiary uppercase tracking-widest">
                                                    <span>{t('deliveryFee')}</span>
                                                    <span>{t('shekels')}{deliveryFee}</span>
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <span className="text-sm font-bold uppercase tracking-widest">{t('total')}</span>
                                                    <span className="text-3xl font-display text-color-gold italic">{t('shekels')}{total}</span>
                                                </div>
                                            </div>

                                            {/* Shipping to */}
                                            <div className="glass-luxury border border-color-border/30 p-4 space-y-1">
                                                <p className="text-[8px] font-bold uppercase tracking-[0.3em] opacity-40">Shipping To</p>
                                                <p className="text-sm font-display">{formData.name}</p>
                                                <p className="text-xs opacity-60">{formData.city}, {formData.street} {formData.houseNum}</p>
                                                <p className="text-xs opacity-40">{formData.email} · {formData.phone}</p>
                                            </div>

                                            {/* PayPal */}
                                            <div className="pt-2">
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
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>


                        {/* Footer — actions */}
                        {items.length > 0 && (
                            <div className="px-8 lg:px-12 py-8 glass-luxury border-t border-color-border space-y-4 flex-shrink-0">
                                {step === 1 && (
                                    <>
                                        <div className="space-y-3">
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
                                            onClick={() => goTo(2)}
                                            className="btn-luxury w-full flex items-center justify-between"
                                        >
                                            {t('checkout')} <ArrowRight size={18} />
                                        </button>
                                    </>
                                )}

                                {step === 2 && (
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => goTo(3)}
                                            disabled={!isShippingValid}
                                            className="btn-luxury w-full flex items-center justify-between disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            Continue to Payment <ArrowRight size={18} />
                                        </button>
                                        <button onClick={() => goTo(1)} className="w-full flex items-center justify-center gap-2 text-color-text-tertiary hover:text-color-text-primary uppercase font-bold text-[9px] tracking-[0.3em] transition-colors">
                                            <ArrowLeft size={12} /> Back to Bag
                                        </button>
                                    </div>
                                )}

                                {step === 3 && (
                                    <button onClick={() => goTo(2)} className="w-full flex items-center justify-center gap-2 text-color-text-tertiary hover:text-color-text-primary uppercase font-bold text-[9px] tracking-[0.3em] transition-colors">
                                        <ArrowLeft size={12} /> Back to Shipping
                                    </button>
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
