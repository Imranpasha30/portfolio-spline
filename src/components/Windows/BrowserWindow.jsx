import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Maximize2, ChevronLeft, ChevronRight, RotateCw, Home, Lock, Star, MoreVertical, Plus, Search, ExternalLink, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    const [activeTab, setActiveTab] = useState(0);
    const [url, setUrl] = useState('about:home');
    const [inputUrl, setInputUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState(null);
    const iframeRef = useRef(null);

    const [tabs, setTabs] = useState([
        { 
            id: 1, 
            title: 'New Tab', 
            url: 'about:home',
            favicon: '🏠'
        }
    ]);

    // Sites that allow iframe embedding
    const embeddableQuickLinks = [
        { name: 'GitHub', url: 'https://github.com/Imranpasha30', icon: '🐙', embeddable: true },
        { name: 'Google', url: 'https://www.google.com', icon: '🔍', embeddable: true },
        { name: 'YouTube', url: 'https://www.youtube.com', icon: '📺', embeddable: true },
        { name: 'Stack Overflow', url: 'https://stackoverflow.com', icon: '📚', embeddable: true },
        { name: 'Wikipedia', url: 'https://www.wikipedia.org', icon: '📖', embeddable: true },
        { name: 'Reddit', url: 'https://www.reddit.com', icon: '🤖', embeddable: true },
    ];

    // Sites that block iframe (will open in new tab)
    const externalLinks = [
        { name: 'LinkedIn', url: 'https://www.linkedin.com/in/imran-pasha-019b2b213', icon: '💼', embeddable: false },
        { name: 'TryHackMe', url: 'https://tryhackme.com/p/devilhost666', icon: '🔒', embeddable: false },
        { name: 'Instagram', url: 'https://www.instagram.com/beast_forge_x', icon: '📸', embeddable: false },
        { name: 'Facebook', url: 'https://www.facebook.com', icon: '👥', embeddable: false },
        { name: 'Twitter/X', url: 'https://twitter.com', icon: '🐦', embeddable: false },
    ];

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

    const handleNavigate = (newUrl, canEmbed = true) => {
        if (!canEmbed) {
            // Open in new browser tab
            window.open(newUrl, '_blank', 'noopener,noreferrer');
            return;
        }

        setIsLoading(true);
        setLoadError(null);
        setUrl(newUrl);
        setInputUrl(newUrl);
        
        // Update current tab
        const updatedTabs = [...tabs];
        updatedTabs[activeTab].url = newUrl;
        
        // Try to get page title
        const urlObj = new URL(newUrl);
        updatedTabs[activeTab].title = urlObj.hostname.replace('www.', '');
        
        setTabs(updatedTabs);

        setTimeout(() => setIsLoading(false), 1000);
    };

    const handleUrlSubmit = (e) => {
        e.preventDefault();
        let finalUrl = inputUrl.trim();
        
        if (!finalUrl) return;
        
        // Check if it's a search query
        if (!finalUrl.includes('.') && !finalUrl.startsWith('http')) {
            finalUrl = `https://www.google.com/search?q=${encodeURIComponent(finalUrl)}`;
        } else if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
            finalUrl = 'https://' + finalUrl;
        }
        
        handleNavigate(finalUrl, true);
    };

    const handleTabChange = (index) => {
        setActiveTab(index);
        setUrl(tabs[index].url);
        setInputUrl(tabs[index].url === 'about:home' ? '' : tabs[index].url);
    };

    const handleAddTab = () => {
        const newTab = {
            id: Date.now(),
            title: 'New Tab',
            url: 'about:home',
            favicon: '🏠'
        };
        setTabs([...tabs, newTab]);
        setActiveTab(tabs.length);
        setUrl('about:home');
        setInputUrl('');
    };

    const handleCloseTab = (index, e) => {
        e.stopPropagation();
        if (tabs.length === 1) return;
        
        const newTabs = tabs.filter((_, i) => i !== index);
        setTabs(newTabs);
        
        if (activeTab >= newTabs.length) {
            setActiveTab(newTabs.length - 1);
        }
        
        const newActiveTab = activeTab >= newTabs.length ? newTabs.length - 1 : activeTab;
        setUrl(newTabs[newActiveTab].url);
        setInputUrl(newTabs[newActiveTab].url === 'about:home' ? '' : newTabs[newActiveTab].url);
    };

    const handleIframeError = () => {
        setLoadError('This website cannot be displayed in the browser. It will open in a new tab.');
        setTimeout(() => {
            if (url !== 'about:home') {
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        }, 2000);
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
                className="w-full h-full flex flex-col bg-white rounded-lg shadow-2xl border border-gray-300 overflow-hidden"
                onMouseDown={onFocus}
            >
                {/* Title Bar */}
                <div className="drag-handle flex items-center justify-between bg-gray-100 px-3 py-1.5 border-b border-gray-300 cursor-grab active:cursor-grabbing">
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
                        <span className="text-xs text-gray-600 font-medium ml-2">Firefox Web Browser</span>
                    </div>
                </div>

                {/* Tabs Bar */}
                <div className="flex items-center bg-gray-200 px-2 py-1 border-b border-gray-300">
                    <div className="flex flex-1 overflow-x-auto scrollbar-hide">
                        {tabs.map((tab, index) => (
                            <motion.div
                                key={tab.id}
                                whileHover={{ y: -2 }}
                                onClick={() => handleTabChange(index)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg cursor-pointer min-w-[180px] max-w-[220px] group ${
                                    activeTab === index
                                        ? 'bg-white border-t-2 border-blue-500'
                                        : 'bg-gray-100 hover:bg-gray-50'
                                }`}
                            >
                                <span className="text-sm">{tab.favicon}</span>
                                <span className="text-xs text-gray-700 truncate flex-1">{tab.title}</span>
                                {tabs.length > 1 && (
                                    <button
                                        onClick={(e) => handleCloseTab(index, e)}
                                        className="opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded p-0.5"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </div>
                    <button
                        onClick={handleAddTab}
                        className="ml-2 p-1 hover:bg-gray-300 rounded"
                        title="New Tab"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                {/* Navigation Bar */}
                <div className="flex items-center gap-2 bg-white px-3 py-2 border-b border-gray-300">
                    <button
                        onClick={() => window.history.back()}
                        className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                        title="Back"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        onClick={() => window.history.forward()}
                        className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                        title="Forward"
                    >
                        <ChevronRight size={18} />
                    </button>
                    <button
                        onClick={() => handleNavigate(url, true)}
                        className={`p-1.5 hover:bg-gray-100 rounded-full transition-colors ${isLoading ? 'animate-spin' : ''}`}
                        title="Reload"
                    >
                        <RotateCw size={18} />
                    </button>
                    <button
                        onClick={() => {
                            setUrl('about:home');
                            setInputUrl('');
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                        title="Home"
                    >
                        <Home size={18} />
                    </button>

                    {/* Address Bar */}
                    <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-1.5">
                        <Lock size={14} className="text-green-600 mr-2" />
                        <input
                            type="text"
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-sm text-gray-700"
                            placeholder="Search or enter address"
                        />
                        <Search size={14} className="text-gray-400 ml-2" />
                    </form>

                    <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors" title="Bookmark">
                        <Star size={18} />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors" title="Menu">
                        <MoreVertical size={18} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden bg-white relative">
                    {url === 'about:home' || !url ? (
                        <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-8">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center max-w-5xl"
                            >
                                <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Imran's Browser</h1>
                                <p className="text-gray-600 mb-8">Quick access to my profiles and favorite sites</p>

                                {/* Embeddable Sites */}
                                <div className="mb-8">
                                    <h2 className="text-lg font-semibold text-gray-700 mb-4">📂 Browse in Window</h2>
                                    <div className="grid grid-cols-3 gap-4">
                                        {embeddableQuickLinks.map((link, index) => (
                                            <motion.button
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleNavigate(link.url, link.embeddable)}
                                                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-200"
                                            >
                                                <div className="text-4xl mb-2">{link.icon}</div>
                                                <div className="text-sm font-medium text-gray-700">{link.name}</div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* External Links */}
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-700 mb-4">🔗 Open in New Tab</h2>
                                    <div className="grid grid-cols-5 gap-3">
                                        {externalLinks.map((link, index) => (
                                            <motion.button
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: (embeddableQuickLinks.length + index) * 0.1 }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleNavigate(link.url, link.embeddable)}
                                                className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all border border-gray-200 relative group"
                                            >
                                                <ExternalLink size={12} className="absolute top-2 right-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <div className="text-3xl mb-2">{link.icon}</div>
                                                <div className="text-xs font-medium text-gray-700">{link.name}</div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                <p className="text-xs text-gray-500 mt-6">
                                    💡 Some sites (LinkedIn, Instagram) will open in a new browser tab due to security restrictions
                                </p>
                            </motion.div>
                        </div>
                    ) : (
                        <>
                            {isLoading && (
                                <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 animate-pulse z-10" />
                            )}
                            
                            {loadError ? (
                                <div className="h-full flex flex-col items-center justify-center bg-gray-50 p-8">
                                    <AlertCircle size={64} className="text-orange-500 mb-4" />
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Cannot Display Page</h2>
                                    <p className="text-gray-600 text-center max-w-md mb-4">{loadError}</p>
                                    <button
                                        onClick={() => {
                                            setUrl('about:home');
                                            setInputUrl('');
                                            setLoadError(null);
                                        }}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        Go Back to Home
                                    </button>
                                </div>
                            ) : (
                                <iframe
                                    ref={iframeRef}
                                    src={url}
                                    className="w-full h-full border-0"
                                    title="Browser Content"
                                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox"
                                    onError={handleIframeError}
                                />
                            )}
                        </>
                    )}
                </div>

                {/* Status Bar */}
                <div className="flex items-center justify-between bg-gray-100 px-3 py-1 border-t border-gray-300 text-xs text-gray-600">
                    <span>{loadError ? '⚠️ Error' : 'Ready'}</span>
                    <span className="truncate max-w-md">{url === 'about:home' ? 'Home Page' : url}</span>
                </div>
            </div>
        </Rnd>
    );
};

export default BrowserWindow;
