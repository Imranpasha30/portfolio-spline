import React, { useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, RotateCw, Home, Search, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import WindowShell from './WindowShell';

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
    const [activeTab, setActiveTab] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const iframeRef = useRef(null);

    const [tabs, setTabs] = useState([
         {
            id: 1,
            name: 'Shodan',
            url: 'https://www.shodan.io',
            icon: '\uD83D\uDD0D',
            searchPlaceholder: 'Search Shodan...',
            searchUrl: 'https://www.shodan.io/search?query='
        },
        {
            id: 2,
            name: 'Wikipedia',
            url: 'about:home',
            icon: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png',
            searchPlaceholder: 'Search Wikipedia...',
            searchUrl: 'https://en.wikipedia.org/wiki/Special:Search?search='
        },
    ]);

    const [inputUrl, setInputUrl] = useState('');
    const currentTab = tabs[activeTab];

    const handleSearch = (query) => {
        if (!query.trim()) return;
        setIsLoading(true);
        const searchUrl = currentTab.searchUrl + encodeURIComponent(query);
        const updatedTabs = [...tabs];
        updatedTabs[activeTab].url = searchUrl;
        setTabs(updatedTabs);
        setTimeout(() => setIsLoading(false), 800);
    };

    const handleUrlSubmit = (e) => {
        e.preventDefault();
        handleSearch(inputUrl);
    };

    const handleTabChange = (index) => {
        setActiveTab(index);
        setInputUrl('');
        setIsLoading(false);
    };

    const handleAddTab = () => {
        const newTab = {
            id: Date.now(),
            name: 'Wikipedia',
            url: 'about:home',
            icon: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png',
            searchPlaceholder: 'Search Wikipedia...',
            searchUrl: 'https://en.wikipedia.org/wiki/Special:Search?search='
        };
        setTabs([...tabs, newTab]);
        setActiveTab(tabs.length);
    };

    const handleCloseTab = (index, e) => {
        e.stopPropagation();
        if (tabs.length === 1) return;
        const newTabs = tabs.filter((_, i) => i !== index);
        setTabs(newTabs);
        if (activeTab >= newTabs.length) {
            setActiveTab(newTabs.length - 1);
        }
    };

    const handleHome = () => {
        const updatedTabs = [...tabs];
        updatedTabs[activeTab].url = activeTab === 0 ? 'about:home' : 'https://www.shodan.io';
        setTabs(updatedTabs);
        setInputUrl('');
        setIsLoading(false);
    };

    const handleReload = () => {
        if (currentTab.url !== 'about:home') {
            setIsLoading(true);
            if (iframeRef.current) {
                iframeRef.current.src = currentTab.url;
            }
            setTimeout(() => setIsLoading(false), 800);
        }
    };

    return (
        <WindowShell
            id={id}
            title={`${currentTab.name} Browser`}
            isMinimized={isMinimized}
            zIndex={zIndex}
            defaultSize={{ width: 1200, height: 700 }}
            defaultPosition={{ x: offsetX, y: offsetY }}
            minWidth={800}
            minHeight={600}
            onClose={onClose}
            onMinimize={onMinimize}
            onFocus={onFocus}
        >
            {/* Tabs Bar */}
            <div className="flex items-center bg-gray-800 px-2 py-1 border-b border-gray-700">
                <div className="flex flex-1 overflow-x-auto scrollbar-hide gap-1">
                    {tabs.map((tab, index) => (
                        <motion.div
                            key={tab.id}
                            whileHover={{ y: -2 }}
                            onClick={() => handleTabChange(index)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg cursor-pointer min-w-[140px] max-w-[180px] group transition-colors ${
                                activeTab === index
                                    ? 'bg-gray-700 border-t-2 border-blue-500'
                                    : 'bg-gray-750 hover:bg-gray-700'
                            }`}
                        >
                            {tab.icon.startsWith('http') ? (
                                <img src={tab.icon} alt={tab.name} className="w-4 h-4" />
                            ) : (
                                <span className="text-sm">{tab.icon}</span>
                            )}
                            <span className="text-xs text-gray-200 truncate flex-1">{tab.name}</span>
                            {tabs.length > 1 && (
                                <button
                                    onClick={(e) => handleCloseTab(index, e)}
                                    className="opacity-0 group-hover:opacity-100 hover:bg-gray-600 rounded p-0.5"
                                >
                                    <X size={12} className="text-gray-300" />
                                </button>
                            )}
                        </motion.div>
                    ))}
                </div>
                <button
                    onClick={handleAddTab}
                    className="ml-2 p-1 hover:bg-gray-700 rounded text-gray-300"
                    title="New Tab"
                >
                    <Plus size={16} />
                </button>
            </div>

            {/* Navigation Bar */}
            <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 border-b border-gray-700">
                <button
                    onClick={handleHome}
                    className="p-1.5 hover:bg-gray-700 rounded-full transition-colors text-gray-300"
                    title="Home"
                >
                    <Home size={18} />
                </button>
                <button
                    onClick={handleReload}
                    className={`p-1.5 hover:bg-gray-700 rounded-full transition-colors text-gray-300 ${isLoading ? 'animate-spin' : ''}`}
                    title="Reload"
                >
                    <RotateCw size={18} />
                </button>

                <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center bg-gray-700 rounded-full px-4 py-1.5 border border-gray-600">
                    <Search size={16} className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm text-gray-200 placeholder-gray-400"
                        placeholder={currentTab.searchPlaceholder}
                        autoFocus={currentTab.url === 'about:home'}
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
            <div className="flex-1 overflow-hidden bg-gray-900 relative p-2">
                {currentTab.url === 'about:home' ? (
                    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center max-w-2xl"
                        >
                            <motion.div
                                initial={{ rotate: -10, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="mb-8"
                            >
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png"
                                    alt="Wikipedia Logo"
                                    className="w-32 h-32 mx-auto drop-shadow-2xl"
                                />
                            </motion.div>

                            <h1 className="text-5xl font-bold text-white mb-4">Wikipedia</h1>
                            <p className="text-xl text-gray-400 mb-8">The Free Encyclopedia</p>

                            <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
                                <form onSubmit={handleUrlSubmit} className="mb-6">
                                    <div className="flex items-center bg-gray-700 rounded-full px-6 py-4 border-2 border-gray-600 focus-within:border-blue-500 transition-colors shadow-lg">
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
                                Browse millions of articles from Wikipedia's vast knowledge base
                            </p>
                        </motion.div>
                    </div>
                ) : (
                    <>
                        {isLoading && (
                            <div className="absolute top-2 left-2 right-2 h-1 bg-blue-500 z-10 rounded-t-lg">
                                <motion.div
                                    className="h-full bg-blue-400 rounded-t-lg"
                                    initial={{ width: '0%' }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 0.8 }}
                                />
                            </div>
                        )}

                        <div className="w-full h-full rounded-lg overflow-hidden shadow-2xl border-2 border-gray-700 ring-4 ring-gray-800/50">
                            <iframe
                                ref={iframeRef}
                                src={currentTab.url}
                                className="w-full h-full border-0"
                                title={`${currentTab.name} Content`}
                                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                                onLoad={() => setIsLoading(false)}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Status Bar */}
            <div className="flex items-center justify-between bg-gray-800 px-3 py-1 border-t border-gray-700 text-xs text-gray-400">
                <span className="truncate max-w-md">
                    {currentTab.url === 'about:home' ? `${currentTab.name} Home` : currentTab.name}
                </span>
            </div>
        </WindowShell>
    );
};

export default BrowserWindow;
