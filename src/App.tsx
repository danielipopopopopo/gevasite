import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Send } from 'lucide-react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import AuthModal from './components/AuthModal';
import BirthdayPopup from './components/BirthdayPopup';
import type { Product } from './data/products';
import { PRODUCTS } from './data/products';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import './i18n';

interface CartItem extends Product {
  quantity: number;
}

function App() {
  const { t, i18n } = useTranslation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBirthdayPopupOpen, setIsBirthdayPopupOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -200]);

  useEffect(() => {
    document.body.dir = i18n.language === 'he' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  useEffect(() => {
    // Check for existing user session
    const savedUser = Object.keys(localStorage)
      .filter(key => key.startsWith('user_'))
      .map(key => JSON.parse(localStorage.getItem(key) || '{}'))[0];

    if (savedUser) {
      console.log('Session restored for:', savedUser.name);
      setUser(savedUser);
    }
  }, []);

  useEffect(() => {
    // Show birthday popup on entry
    console.log('App mounted, checking for birthday popup...');
    // ALERT TO PROVE CODE IS RUNNING
    window.alert('DEVIL SITE DEBUG: Version 2.1 Loaded. Press Shift+R to reset popup.');
    const hasSeenPopup = localStorage.getItem('birthday_popup_seen');
    if (!hasSeenPopup) {
      console.log('Opening birthday popup in 1.5s...');
      const timer = setTimeout(() => {
        setIsBirthdayPopupOpen(true);
        console.log('Birthday popup should be open now');
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      console.log('User already saw the popup (according to localStorage)');
    }
  }, []);

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setIsAuthModalOpen(false);
    setIsBirthdayPopupOpen(false);
    localStorage.setItem('birthday_popup_seen', 'true');
  };

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  return (
    <PayPalScriptProvider options={{
      clientId: "AWjzZRO3I_DJHgN7lywSdBI0pg1XNUaVM-yQFaFHikkou3vyUJfVLs_296ybI00mnxE5Z756duFefTG8",
      currency: "ILS",
      intent: "capture"
    }}>
      <div className="min-h-screen relative bg-color-bg">
        {/* Diagnostic Debug Button - MADE BRIGHT AND OPAQUE */}
        <div className="fixed bottom-10 left-10 z-[10000] flex flex-col gap-4">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-red-600 text-white px-6 py-4 rounded-full font-bold shadow-2xl border-4 border-white"
          >
            FORCE LOGIN MODAL
          </button>
          <button
            onClick={() => setIsBirthdayPopupOpen(true)}
            className="bg-blue-600 text-white px-6 py-4 rounded-full font-bold shadow-2xl border-4 border-white"
          >
            FORCE POPUP MODAL
          </button>
        </div>

        <Header
          cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          onCartClick={() => setIsCartOpen(true)}
          user={user}
          onAuthClick={() => setIsAuthModalOpen(true)}
        />

        {/* LUXURY HERO */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <motion.div
            style={{ y: yParallax }}
            className="absolute inset-0 z-0"
          >
            <img
              src="https://images.unsplash.com/photo-1550991152-71370edb6483?q=80&w=2000&auto=format&fit=crop"
              className="w-full h-full object-cover scale-105 opacity-40 grayscale"
              alt="Devil"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-color-bg" />
            <div className="spotlight" />
          </motion.div>

          <div className="container-luxury relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <h1 className="text-7xl lg:text-[10rem] font-display text-shimmer leading-none italic pb-2">
                Devil
              </h1>
              <p className="text-[10px] lg:text-[12px] font-medium uppercase tracking-[0.8em] text-color-text-secondary">
                {t('hero_subtitle')}
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="pt-12"
              >
                <a href="#collection" className="btn-luxury">
                  {t('explore')} <ChevronDown size={14} />
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* COLLECTION SECTION */}
        <main id="collection" className="section-luxury container-luxury space-y-24">
          <header className="text-center space-y-4">
            <h2 className="text-5xl lg:text-7xl font-display italic text-color-gold">{t('collection')}</h2>
            <div className="h-px w-20 bg-color-gold/30 mx-auto" />
            <p className="text-[10px] font-bold tracking-[0.4em] text-color-text-tertiary uppercase pt-2">Global Release Drop 01</p>
          </header>

          <div className="grid-luxury">
            {PRODUCTS.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        </main>

        {/* LUXURY FOOTER */}
        <footer className="section-luxury border-t border-color-border bg-color-bg-elevated">
          <div className="container-luxury grid grid-cols-12 gap-16">
            <div className="col-span-12 lg:col-span-12 text-center space-y-12 mb-12">
              <h1 className="text-5xl font-display text-shimmer italic">Devil Syndicate</h1>
              <div className="flex border-b border-color-border pb-4 max-w-md mx-auto focus-within:border-color-gold transition-colors">
                <input
                  type="email"
                  placeholder="ACCESS@DEVIL.STWR"
                  className="bg-transparent border-none flex-1 outline-none text-center font-body text-xs tracking-widest uppercase placeholder:opacity-20"
                />
                <button className="p-2 text-color-text-tertiary hover:text-color-gold transition-colors">
                  <Send size={18} />
                </button>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 space-y-6 lg:text-left text-center">
              <h3 className="text-[10px] font-bold tracking-[0.1em] opacity-40 uppercase">Social Presence</h3>
              <ul className="text-sm font-display space-y-3 opacity-80">
                <li><a href="#" className="hover:text-color-gold transition-all">Instagram / @devil.stwr</a></li>
                <li><a href="#" className="hover:text-color-gold transition-all">Youtube / Syndicate Archives</a></li>
              </ul>
            </div>

            <div className="col-span-12 lg:col-span-4 space-y-6 text-center">
              <h3 className="text-[10px] font-bold tracking-[0.1em] opacity-40 uppercase">Legal Drop</h3>
              <ul className="text-sm font-display space-y-3 opacity-80">
                <li><a href="#" className="hover:text-color-gold transition-all">Shipping Information</a></li>
                <li><a href="#" className="hover:text-color-gold transition-all">Return Policy</a></li>
              </ul>
            </div>

            <div className="col-span-12 lg:col-span-4 space-y-6 lg:text-right text-center">
              <h3 className="text-[10px] font-bold tracking-[0.1em] opacity-40 uppercase">Syndicate</h3>
              <ul className="text-sm font-display space-y-3 opacity-80">
                <li><a href="#" className="hover:text-color-gold transition-all">Privacy Manifesto</a></li>
                <li><a href="#" className="hover:text-color-gold transition-all">Sustainability</a></li>
              </ul>
            </div>
          </div>

          <div className="container-luxury mt-32 pt-8 border-t border-color-border flex justify-center text-[8px] font-bold tracking-[0.6em] opacity-20 uppercase">
            <span>&copy; {new Date().getFullYear()} Devil Streetwear Syndicate. All Souls Reserved.</span>
          </div>
        </footer>

        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onClearCart={() => setCartItems([])}
          user={user}
        />

        <BirthdayPopup
          isOpen={isBirthdayPopupOpen}
          onClose={() => {
            console.log('Closing birthday popup');
            setIsBirthdayPopupOpen(false);
            localStorage.setItem('birthday_popup_seen', 'true');
          }}
          onSignUp={() => {
            console.log('Signing up from popup');
            setIsBirthdayPopupOpen(false);
            setIsAuthModalOpen(true);
          }}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      </div>
    </PayPalScriptProvider>
  );
}

export default App;
