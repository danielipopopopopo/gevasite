import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BirthdayPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onSignUp: () => void;
}

const BirthdayPopup: React.FC<BirthdayPopupProps> = ({ isOpen, onClose, onSignUp }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl z-[5001] bg-color-bg-elevated border border-color-gold/30 px-16 py-12 text-center space-y-6 shadow-[0_30px_100px_rgba(0,0,0,0.8)] glow-red-intense rounded-[2rem]"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-8 text-color-text-tertiary hover:text-color-gold transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="space-y-2">
                            <h2 className="text-5xl font-display italic text-color-gold glow-text-red-intense">מזל טוב?</h2>
                            <div className="h-px w-16 bg-color-gold/30 mx-auto" />
                        </div>

                        <p className="text-xl font-display italic text-white leading-relaxed">
                            יש לך יום הולדת החודש? <br />
                            <span className="text-color-gold font-bold not-italic text-3xl mt-2 block">קבל 15% הנחה!!</span>
                        </p>

                        <div className="pt-6">
                            <button
                                onClick={onSignUp}
                                className="btn-luxury w-full py-5 text-sm tracking-[0.4em]"
                            >
                                הרשם עכשיו
                            </button>
                        </div>

                        <p className="text-[10px] uppercase tracking-[0.3em] text-color-text-tertiary opacity-40">
                            Devil Syndicate Exclusive
                        </p>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default BirthdayPopup;
