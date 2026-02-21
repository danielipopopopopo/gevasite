import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Calendar } from 'lucide-react';

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

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
    console.log('AuthModal render check. isOpen:', isOpen);
    const [isLogin, setIsLogin] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        birthMonth: new Date().getMonth() + 1
    });

    const MONTHS_HE = [
        'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
        'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple localStorage mock auth
        if (isLogin) {
            const saved = localStorage.getItem(`user_${formData.email}`);
            if (saved) {
                onSuccess(JSON.parse(saved));
            } else {
                alert('משתמש לא נמצא');
            }
        } else {
            const newUser = {
                name: formData.name,
                email: formData.email,
                birthMonth: formData.birthMonth
            };
            localStorage.setItem(`user_${formData.email}`, JSON.stringify(newUser));
            onSuccess(newUser);
        }
    };

    console.log('AuthModal render status:', isOpen ? 'VISIBLE' : 'HIDDEN');
    if (isOpen) {
        window.alert('AUTH MODAL IS NOW ATTEMPTING TO SHOW (isOpen=true)');
    }
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/90 z-[5000] backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-md z-[5001] bg-color-bg-elevated border border-color-border p-8 shadow-2xl"
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 text-color-text-tertiary hover:text-white">
                            <X size={20} />
                        </button>

                        <div className="text-center space-y-2 mb-8">
                            <h2 className="text-2xl font-display italic text-color-gold">
                                {isLogin ? 'התחברות' : 'הרשמה לסיינדיקט'}
                            </h2>
                            <p className="text-[10px] uppercase tracking-widest text-color-text-tertiary">
                                Devil Streetwear Premium Access
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-color-gold/40" size={16} />
                                    <input
                                        required
                                        type="text"
                                        placeholder="שם מלא"
                                        className="w-full bg-black/40 border border-color-border p-4 pl-12 outline-none focus:border-color-gold transition-colors text-sm"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            )}

                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-color-gold/40" size={16} />
                                <input
                                    required
                                    type="email"
                                    placeholder="אימייל"
                                    className="w-full bg-black/40 border border-color-border p-4 pl-12 outline-none focus:border-color-gold transition-colors text-sm"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-color-gold/40" size={16} />
                                <input
                                    required
                                    type="password"
                                    placeholder="סיסמה"
                                    className="w-full bg-black/40 border border-color-border p-4 pl-12 outline-none focus:border-color-gold transition-colors text-sm"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            {!isLogin && (
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-color-text-tertiary flex items-center gap-2">
                                        <Calendar size={12} /> חודש יום הולדת (להנחה בלעדית)
                                    </label>
                                    <select
                                        className="w-full bg-black/40 border border-color-border p-4 outline-none focus:border-color-gold transition-colors text-sm appearance-none cursor-pointer"
                                        value={formData.birthMonth}
                                        onChange={e => setFormData({ ...formData, birthMonth: parseInt(e.target.value) })}
                                    >
                                        {MONTHS_HE.map((month, idx) => (
                                            <option key={idx} value={idx + 1}>{month}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <button type="submit" className="btn-luxury w-full py-4 mt-4 text-sm tracking-[0.3em]">
                                {isLogin ? 'התחבר' : 'צור חשבון'}
                            </button>
                        </form>

                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="w-full text-center mt-6 text-[10px] uppercase tracking-widest text-color-text-tertiary hover:text-color-gold transition-colors"
                        >
                            {isLogin ? 'עדיין לא חבר? הירשם כאן' : 'כבר חבר? התחבר כאן'}
                        </button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
