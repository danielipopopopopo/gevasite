import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
    cartCount: number;
    onCartClick: () => void;
    user?: any;
    onAuthClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick, user, onAuthClick }) => {
    const { t, i18n } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'he' : 'en';
        i18n.changeLanguage(newLang);
        document.body.dir = newLang === 'he' ? 'rtl' : 'ltr';
    };

    const navItems = [
        { name: t('home'), href: '#' },
        { name: t('collection'), href: '#collection' },
    ];

    return (
        <header className="fixed top-0 left-0 w-full z-[1000] p-4 lg:p-8 flex justify-center">
            <div className="w-full max-w-6xl flex items-center justify-between glass-luxury rounded-full h-[65px] px-8 transition-all duration-500">
                <div className="flex items-center gap-8">
                    <button className="lg:hidden p-2 text-color-gold" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <h1 className="text-2xl lg:text-3xl font-display text-shimmer tracking-tighter cursor-default">
                        Devil
                    </h1>

                    <nav className="hidden lg:flex gap-10">
                        {navItems.map((item) => (
                            <a key={item.name} href={item.href} className="text-[10px] font-medium uppercase tracking-[0.25em] text-color-text-secondary hover:text-color-gold transition-colors">
                                {item.name}
                            </a>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-8">
                    <button onClick={toggleLanguage} className="text-[10px] font-bold tracking-[0.2em] uppercase text-color-text-secondary hover:text-color-gold transition-colors">
                        {t('language')}
                    </button>

                    <button onClick={onAuthClick} className="flex items-center gap-2 text-color-text-secondary hover:text-color-gold transition-colors">
                        <User size={20} strokeWidth={1.5} />
                        {user && (
                            <span className="hidden lg:block text-[9px] font-bold uppercase tracking-widest">{user.name}</span>
                        )}
                    </button>

                    <button onClick={onCartClick} className="relative group p-2 text-color-text-secondary hover:text-color-gold transition-colors">
                        <ShoppingBag size={20} strokeWidth={1.5} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-color-gold text-black text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: -10 }}
                        className="lg:hidden fixed inset-x-4 top-24 bg-color-bg border border-color-border rounded-3xl p-8 flex flex-col gap-8 shadow-2xl backdrop-blur-3xl"
                    >
                        {navItems.map((item, i) => (
                            <motion.a
                                key={item.name}
                                href={item.href}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => setIsMenuOpen(false)}
                                className="text-4xl font-display lowercase hover:text-color-gold transition-all"
                            >
                                {item.name}
                            </motion.a>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
