import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar } from 'lucide-react';

interface UserData {
    name: string;
    email: string;
    birthMonth: number;
}

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (user: UserData) => void;
}

const MONTHS_HE = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
];

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        birthMonth: new Date().getMonth() + 1
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const userData = {
            name: 'Member',
            email: 'member@syndicate.com',
            birthMonth: formData.birthMonth
        };

        localStorage.setItem('birthday_user', JSON.stringify(userData));
        onSuccess(userData);
    };

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
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl z-[5001] glass-modal px-16 py-12 shadow-[0_30px_100px_rgba(0,0,0,0.8)] glow-red-intense rounded-[2rem]"
                    >
                        <button onClick={onClose} className="absolute top-6 right-8 text-color-text-tertiary hover:text-white transition-colors">
                            <X size={24} />
                        </button>

                        <div className="text-center space-y-1 mb-10">
                            <h2 className="text-4xl font-display italic text-color-gold glow-text-red-intense">
                                עדכון יום הולדת
                            </h2>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-color-text-tertiary opacity-60">
                                Get Your Exclusive Birthday Discount
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-[0.2em] text-color-gold flex items-center gap-3">
                                    <Calendar size={14} /> חודש יום הולדת (להנחה בלעדית)
                                </label>
                                <select
                                    className="modal-input w-full p-5 outline-none cursor-pointer text-sm text-white rounded-xl appearance-none"
                                    style={{ color: 'white' }}
                                    value={formData.birthMonth}
                                    onChange={e => setFormData({ ...formData, birthMonth: parseInt(e.target.value) })}
                                >
                                    {MONTHS_HE.map((month, idx) => (
                                        <option key={idx} value={idx + 1}>{month}</option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit" className="btn-luxury w-full py-5 mt-6 text-sm tracking-[0.4em]">
                                עדכן יום הולדת
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
