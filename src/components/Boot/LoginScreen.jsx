import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const LoginScreen = ({ onLogin, wallpaper }) => {
    const [password, setPassword] = useState('');
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [showError, setShowError] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsAuthenticating(true);
        setShowError(false);

        // Simulate authentication delay
        setTimeout(() => {
            onLogin();
        }, 800);
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center select-none"
        >
            {/* Blurred wallpaper background */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${wallpaper})`,
                    filter: 'blur(20px) brightness(0.4)',
                    transform: 'scale(1.1)',
                }}
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Date & Time */}
            <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative z-10 text-center mb-12"
            >
                <div className="text-white text-7xl font-light tracking-wider mb-2">
                    {formatTime(currentTime)}
                </div>
                <div className="text-white/70 text-xl font-light">
                    {formatDate(currentTime)}
                </div>
            </motion.div>

            {/* Login Card */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring', duration: 0.6 }}
                className="relative z-10 flex flex-col items-center"
            >
                {/* Avatar */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: 'spring' }}
                    className="mb-4"
                >
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                        <img
                            src="/images/profile.jpg"
                            alt="Imran Pasha"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = 'https://ui-avatars.com/api/?name=Imran+Pasha&size=112&background=E95420&color=fff&bold=true';
                            }}
                        />
                    </div>
                </motion.div>

                {/* Name */}
                <motion.h2
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-white text-2xl font-medium mb-6"
                >
                    Imran Pasha
                </motion.h2>

                {/* Password Input */}
                <motion.form
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    onSubmit={handleSubmit}
                    className="flex items-center gap-2"
                >
                    <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setShowError(false);
                            }}
                            placeholder="Password"
                            autoFocus
                            className="w-64 pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-white/40 outline-none focus:border-white/40 focus:bg-white/15 transition-all"
                        />
                    </div>
                    <motion.button
                        type="submit"
                        disabled={isAuthenticating}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all disabled:opacity-50"
                    >
                        {isAuthenticating ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            />
                        ) : (
                            <span className="text-lg">→</span>
                        )}
                    </motion.button>
                </motion.form>

                {showError && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-400 text-sm mt-3"
                    >
                        Invalid password. Try again.
                    </motion.p>
                )}

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-white/30 text-xs mt-4"
                >
                    Press Enter or click → to login (any password works)
                </motion.p>
            </motion.div>
        </motion.div>
    );
};

export default LoginScreen;
