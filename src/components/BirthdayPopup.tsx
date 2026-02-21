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
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/90 z-[5000] backdrop-blur-sm"
                    />

                    {/* Popup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-[5001] bg-color-bg-elevated border border-color-gold/30 p-8 text-center space-y-6 shadow-[0_0_50px_rgba(212,175,55,0.1)]"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-color-text-tertiary hover:text-color-gold transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="space-y-2">
                            <h2 className="text-3xl font-display italic text-color-gold">מזל טוב?</h2>
                            <div className="h-px w-12 bg-color-gold/30 mx-auto" />
                        </div>

                        <p className="text-lg font-display italic text-white leading-relaxed">
                            יש לך יום הולדת החודש? <br />
                            <span className="text-color-gold font-bold not-italic text-2xl">קבל 15% הנחה!!</span>
                        </p>

                        <div className="pt-4">
                            <button
                                onClick={onSignUp}
                                className="btn-luxury w-full py-4 text-sm tracking-[0.3em]"
                            >
                                הרשם עכשיו
                            </button>
                        </div>

                        <p className="text-[10px] uppercase tracking-widest text-color-text-tertiary opacity-50">
                            Devil Syndicate Exclusive
                        </p>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default BirthdayPopup;
