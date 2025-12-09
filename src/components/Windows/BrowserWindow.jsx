import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Maximize2, ChevronLeft, ChevronRight, RotateCw, Home, Lock, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const BrowserWindow = ({ 
    id, 
    isMinimized, 
    onClose, 
    onMinimize, 
    zIndex = 40, 
    offsetX = 150, 
    offsetY = 80, 
    onFocus 
}) => {
    const [isMaximized, setIsMaximized] = useState(false);
    const [previousSize, setPreviousSize] = useState({ width: 1200, height: 700, x: 150, y: 80 });
    const [size, setSize] = useState({ width: 1200, height: 700 });
    const [position, setPosition] = useState({ x: offsetX, y: offsetY });
    const [url, setUrl] = useState('about:home');
    const [inputUrl, setInputUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState(['about:home']);
    const [historyIndex, setHistoryIndex] = useState(0);
    const iframeRef = useRef(null);

    const handleMaximize = () => {
        if (!isMaximized) {
            setPreviousSize({
                width: size.width,
                height: size.height,
                x: position.x,
                y: position.y
            });
            setIsMaximized(true);
        } else {
            setIsMaximized(false);
        }
    };

    const addToHistory = (newUrl) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newUrl);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const handleWikipediaSearch = (query) => {
        if (!query.trim()) return;
        
        setIsLoading(true);
        const searchUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`;
        setUrl(searchUrl);
        setInputUrl(query);
        addToHistory(searchUrl);
        
        setTimeout(() => setIsLoading(false), 800);
    };

    const handleUrlSubmit = (e) => {
        e.preventDefault();
        handleWikipediaSearch(inputUrl);
    };

    const handleBack = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            const newUrl = history[newIndex];
            setUrl(newUrl);
            setInputUrl(newUrl === 'about:home' ? '' : newUrl);
            setIsLoading(false);
        }
    };

    const handleForward = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            const newUrl = history[newIndex];
            setUrl(newUrl);
            setInputUrl(newUrl === 'about:home' ? '' : newUrl);
            setIsLoading(false);
        }
    };

    const handleHome = () => {
        setUrl('about:home');
        setInputUrl('');
        addToHistory('about:home');
        setIsLoading(false);
    };

    const handleReload = () => {
        if (url !== 'about:home') {
            setIsLoading(true);
            if (iframeRef.current) {
                iframeRef.current.src = url;
            }
            setTimeout(() => setIsLoading(false), 800);
        }
    };

    if (isMinimized) return null;

    return (
        <Rnd
            dragHandleClassName="drag-handle"
            default={{
                x: offsetX,
                y: offsetY,
                width: size.width,
                height: size.height,
            }}
            position={isMaximized ? { x: 0, y: 32 } : position}
            size={isMaximized ? { width: '100vw', height: 'calc(100vh - 32px)' } : size}
            minWidth={800}
            minHeight={600}
            disableDragging={isMaximized}
            enableResizing={!isMaximized}
            onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
            onResizeStop={(e, direction, ref, delta, pos) => {
                setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
                setPosition(pos);
            }}
            bounds="parent"
            style={{ zIndex }}
        >
            <div
                className="w-full h-full flex flex-col bg-gray-900 rounded-lg shadow-2xl border border-gray-700 overflow-hidden"
                onMouseDown={onFocus}
            >
                {/* Title Bar - Dark */}
                <div className="drag-handle flex items-center justify-between bg-gray-800 px-3 py-1.5 border-b border-gray-700 cursor-grab active:cursor-grabbing">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <button
                                onClick={onClose}
                                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors group relative"
                                title="Close"
                            >
                                <X size={8} className="text-red-900 opacity-0 group-hover:opacity-100 absolute inset-0 m-auto" />
                            </button>
                            <button
                                onClick={onMinimize}
                                className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors group relative"
                                title="Minimize"
                            >
                                <Minus size={8} className="text-yellow-900 opacity-0 group-hover:opacity-100 absolute inset-0 m-auto" />
                            </button>
                            <button
                                onClick={handleMaximize}
                                className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors group relative"
                                title="Maximize"
                            >
                                <Maximize2 size={8} className="text-green-900 opacity-0 group-hover:opacity-100 absolute inset-0 m-auto" />
                            </button>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                            <img 
                                src="https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png" 
                                alt="Wikipedia" 
                                className="w-4 h-4"
                            />
                            <span className="text-xs text-gray-300 font-medium">Wikipedia Browser</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Bar - Dark */}
                <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 border-b border-gray-700">
                    <button
                        onClick={handleBack}
                        disabled={historyIndex === 0}
                        className={`p-1.5 hover:bg-gray-700 rounded-full transition-colors text-gray-300 ${
                            historyIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                        title="Back"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        onClick={handleForward}
                        disabled={historyIndex === history.length - 1}
                        className={`p-1.5 hover:bg-gray-700 rounded-full transition-colors text-gray-300 ${
                            historyIndex === history.length - 1 ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                        title="Forward"
                    >
                        <ChevronRight size={18} />
                    </button>
                    <button
                        onClick={handleReload}
                        className={`p-1.5 hover:bg-gray-700 rounded-full transition-colors text-gray-300 ${isLoading ? 'animate-spin' : ''}`}
                        title="Reload"
                    >
                        <RotateCw size={18} />
                    </button>
                    <button
                        onClick={handleHome}
                        className="p-1.5 hover:bg-gray-700 rounded-full transition-colors text-gray-300"
                        title="Home"
                    >
                        <Home size={18} />
                    </button>

                    {/* Search Bar - Dark */}
                    <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center bg-gray-700 rounded-full px-4 py-1.5 border border-gray-600">
                        <Search size={16} className="text-gray-400 mr-2" />
                        <input
                            type="text"
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-sm text-gray-200 placeholder-gray-400"
                            placeholder="Search Wikipedia..."
                            autoFocus={url === 'about:home'}
                        />
                        {inputUrl && (
                            <button
                                type="button"
                                onClick={() => setInputUrl('')}
                                className="ml-2 hover:bg-gray-600 rounded-full p-1 text-gray-400"
                            >
                                <X size={12} />
                            </button>
                        )}
                    </form>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden bg-gray-900 relative">
                    {url === 'about:home' ? (
                        <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center max-w-2xl"
                            >
                                {/* Wikipedia Logo */}
                                <motion.div
                                    initial={{ rotate: -10, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="mb-8"
                                >
                                    <img 
                                        src="https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png"
                                        alt="Wikipedia Logo"
                                        className="w-32 h-32 mx-auto"
                                    />
                                </motion.div>
                                
                                <h1 className="text-5xl font-bold text-white mb-4">Wikipedia</h1>
                                <p className="text-xl text-gray-400 mb-8">The Free Encyclopedia</p>
                                
                                <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
                                    <form onSubmit={handleUrlSubmit} className="mb-6">
                                        <div className="flex items-center bg-gray-700 rounded-full px-6 py-4 border-2 border-gray-600 focus-within:border-blue-500 transition-colors">
                                            <Search size={24} className="text-gray-400 mr-3" />
                                            <input
                                                type="text"
                                                value={inputUrl}
                                                onChange={(e) => setInputUrl(e.target.value)}
                                                className="flex-1 bg-transparent outline-none text-lg text-gray-200 placeholder-gray-400"
                                                placeholder="Search Wikipedia..."
                                                autoFocus
                                            />
                                        </div>
                                    </form>
                                    
                                    <div className="text-sm text-gray-400 mb-2">
                                        Search for articles, topics, people, places, and more...
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500 mt-6">
                                    💡 Browse millions of articles from Wikipedia's vast knowledge base
                                </p>
                            </motion.div>
                        </div>
                    ) : (
                        <>
                            {isLoading && (
                                <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 z-10">
                                    <motion.div
                                        className="h-full bg-blue-400"
                                        initial={{ width: '0%' }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 0.8 }}
                                    />
                                </div>
                            )}
                            
                            <iframe
                                ref={iframeRef}
                                src={url}
                                className="w-full h-full border-0"
                                title="Wikipedia Content"
                                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                                onLoad={() => setIsLoading(false)}
                            />
                        </>
                    )}
                </div>

                {/* Status Bar - Dark */}
                <div className="flex items-center justify-between bg-gray-800 px-3 py-1 border-t border-gray-700 text-xs text-gray-400">
                  
                    <span className="truncate max-w-md">
                        {url === 'about:home' ? 'Wikipedia Home' : 'Wikipedia'}
                    </span>
                </div>
            </div>
        </Rnd>
    );
};

export default BrowserWindow;
