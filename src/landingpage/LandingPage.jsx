import { useState, useEffect } from 'react';
import Hero from './Hero';

function LandingPage() {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const duration = 10;
        const interval = 50;
        const increment = (interval / duration) * 100;

        const timer = setInterval(() => {
            setProgress((prevProgress) => {
                const newProgress = prevProgress + increment;
                if (newProgress >= 100) {
                    clearInterval(timer);
                    setTimeout(() => setLoading(false), 300);
                    return 100;
                }
                return newProgress;
            });
        }, interval);

        return () => clearInterval(timer);
    }, []);

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
                <div className="mb-8">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full border-4 border-gray-800 border-t-blue-500 animate-spin"></div>
                        <div className="absolute inset-0 w-24 h-24 rounded-full bg-blue-500 opacity-20 blur-xl animate-pulse"></div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">
                    Loading Experience
                </h2>
                <p className="text-gray-400 mb-8">
                    Preparing your portfolio...
                </p>

                <div className="w-80 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <p className="text-blue-400 font-mono text-sm mt-4">
                    {Math.round(progress)}%
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Hero />
        </div>
    );
}

export default LandingPage;
