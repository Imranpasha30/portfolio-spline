import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Volume2, Battery, Power, Grid3x3, Settings, Moon, Monitor, Signal, Terminal } from 'lucide-react';

const TopBar = ({ minimizedWindows = [], onRestoreWindow }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showAppsMenu, setShowAppsMenu] = useState(false);
    const [showSystemMenu, setShowSystemMenu] = useState(false);
    const [volume, setVolume] = useState(50);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [connectionType, setConnectionType] = useState('wifi');
    const [ipAddress, setIpAddress] = useState('Fetching...');

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Monitor network status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Detect connection type (WiFi or Cellular)
    useEffect(() => {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

        if (connection) {
            const updateConnectionType = () => {
                // Check if it's cellular (4g, 3g, 2g, slow-2g)
                if (connection.type === 'cellular' ||
                    ['slow-2g', '2g', '3g'].includes(connection.effectiveType)) {
                    setConnectionType('cellular');
                } else if (connection.type === 'wifi') {
                    setConnectionType('wifi');
                } else {
                    // Default to wifi for ethernet or unknown fast connections
                    setConnectionType('wifi');
                }
            };

            updateConnectionType();
            connection.addEventListener('change', updateConnectionType);

            return () => {
                connection.removeEventListener('change', updateConnectionType);
            };
        }
    }, []);

    // Fetch IP Address
    useEffect(() => {
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => setIpAddress(data.ip))
            .catch(() => setIpAddress('Unavailable'));
    }, []);

    const formatTime = (date) => {
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        const dayNum = date.getDate();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}, ${month} ${dayNum} ${hours}:${minutes}`;
    };

    return (
        <>
            <div className="fixed top-0 left-0 right-0 h-8 bg-black/90 backdrop-blur-sm border-b border-gray-800/50 flex items-center justify-between px-4 z-50 text-white text-sm">
                {/* Left Side - Applications Menu and Minimized Windows */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            setShowAppsMenu(!showAppsMenu);
                            setShowSystemMenu(false);
                        }}
                        className="flex items-center gap-2 hover:bg-white/10 px-3 py-1 rounded transition-colors"
                    >
                        <Grid3x3 size={14} />
                        <span className="font-medium">Applications</span>
                    </button>

                    {/* Minimized Windows */}
                    {minimizedWindows.length > 0 && (
                        <div className="flex items-center gap-2 ml-2">
                            {minimizedWindows.map(window => (
                                <button
                                    key={window.id}
                                    onClick={() => onRestoreWindow(window.id)}
                                    className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-600/50 px-3 py-1 rounded transition-colors"
                                    title="Click to restore"
                                >
                                    <Terminal size={14} />
                                    <span className="text-xs">Terminal</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Center - Date & Time */}
                <div className="absolute left-1/2 -translate-x-1/2 font-medium">
                    {formatTime(currentTime)}
                </div>

                {/* Right Side - System Icons */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => {
                            setShowSystemMenu(!showSystemMenu);
                            setShowAppsMenu(false);
                        }}
                        className="flex items-center gap-2 hover:bg-white/10 px-2 py-1 rounded transition-colors"
                    >
                        {isOnline ? (
                            connectionType === 'wifi' ? (
                                <Wifi size={16} className="text-blue-400" />
                            ) : (
                                <Signal size={16} className="text-blue-400" />
                            )
                        ) : (
                            <WifiOff size={16} className="text-red-400" />
                        )}
                        <Volume2 size={16} />
                        <Battery size={16} />
                        <Power size={16} />
                    </button>
                </div>
            </div>

            {/* Applications Dropdown Menu */}
            {showAppsMenu && (
                <div className="fixed top-8 left-4 w-64 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-4 z-40 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-3 gap-4">
                        <button className="flex flex-col items-center gap-2 p-3 hover:bg-white/10 rounded-xl transition-colors">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                                <Settings size={24} className="text-white" />
                            </div>
                            <span className="text-xs text-white">Settings</span>
                        </button>
                        <button className="flex flex-col items-center gap-2 p-3 hover:bg-white/10 rounded-xl transition-colors">
                            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                                <Grid3x3 size={24} className="text-white" />
                            </div>
                            <span className="text-xs text-white">Apps</span>
                        </button>
                        <button className="flex flex-col items-center gap-2 p-3 hover:bg-white/10 rounded-xl transition-colors">
                            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                                <Monitor size={24} className="text-white" />
                            </div>
                            <span className="text-xs text-white">Display</span>
                        </button>
                    </div>
                </div>
            )}

            {/* System Settings Panel */}
            {showSystemMenu && (
                <div className="fixed top-8 right-4 w-96 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-4 z-40 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Top Icons Row */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <Settings size={20} className="text-white" />
                            </button>
                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <Grid3x3 size={20} className="text-white" />
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <Monitor size={20} className="text-white" />
                            </button>
                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <Power size={20} className="text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Volume Slider */}
                    <div className="mb-4">
                        <div className="flex items-center gap-3">
                            <Volume2 size={20} className="text-white" />
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={volume}
                                onChange={(e) => setVolume(e.target.value)}
                                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                                style={{
                                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume}%, #374151 ${volume}%, #374151 100%)`
                                }}
                            />
                        </div>
                    </div>

                    {/* Quick Settings Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {/* WiFi */}
                        <button className={`${isOnline && connectionType === 'wifi' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-700'} p-4 rounded-xl transition-colors text-left`}>
                            <div className="flex items-start justify-between mb-2">
                                <Wifi size={20} className="text-white" />
                            </div>
                            <div className="text-white font-medium text-sm">Wi-Fi</div>
                            <div className="text-white/70 text-xs">
                                {isOnline && connectionType === 'wifi' ? 'Connected' : 'Off'}
                            </div>
                        </button>

                        {/* Cellular Data with IP */}
                        <button className={`${isOnline && connectionType === 'cellular' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-700'} p-4 rounded-xl transition-colors text-left`}>
                            <div className="flex items-start justify-between mb-2">
                                <Signal size={20} className="text-white" />
                            </div>
                            <div className="text-white font-medium text-sm">Cellular</div>
                            <div className="text-white/70 text-xs">
                                {isOnline && connectionType === 'cellular' ? ipAddress : 'Off'}
                            </div>
                        </button>

                        {/* Power Mode */}
                        <button className="bg-gray-800 hover:bg-gray-700 p-4 rounded-xl transition-colors text-left">
                            <div className="flex items-start justify-between mb-2">
                                <Battery size={20} className="text-white" />
                            </div>
                            <div className="text-white font-medium text-sm">Power Mode</div>
                            <div className="text-white/70 text-xs">Balanced</div>
                        </button>

                        {/* Night Light */}
                        <button className="bg-gray-800 hover:bg-gray-700 p-4 rounded-xl transition-colors text-left">
                            <div className="flex items-start justify-between mb-2">
                                <Moon size={20} className="text-white" />
                            </div>
                            <div className="text-white font-medium text-sm">Night Light</div>
                        </button>
                    </div>

                    {/* IP Address Display */}
                    {isOnline && (
                        <div className="mb-4 p-3 bg-gray-800 rounded-xl">
                            <div className="text-white/70 text-xs mb-1">IP Address</div>
                            <div className="text-white font-mono text-sm">{ipAddress}</div>
                        </div>
                    )}

                    {/* Dark Style Button */}
                    <button className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-xl transition-colors text-left">
                        <div className="flex items-center gap-3">
                            <Moon size={20} className="text-white" />
                            <span className="text-white font-medium">Dark Style</span>
                        </div>
                    </button>
                </div>
            )}

            {/* Overlay to close menus */}
            {(showAppsMenu || showSystemMenu) && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => {
                        setShowAppsMenu(false);
                        setShowSystemMenu(false);
                    }}
                />
            )}
        </>
    );
};

export default TopBar;
