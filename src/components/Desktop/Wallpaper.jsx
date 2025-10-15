import React from 'react';

const Wallpaper = () => {
    return (
        <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black/30"></div>

            {/* You can add your content here - images, text, animations etc */}
            <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-6xl font-bold text-white/100">Hi I'm Imran</h1>
            </div>

            {/* Animated Background Shapes (optional) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
        </div>
    );
};

export default Wallpaper;
