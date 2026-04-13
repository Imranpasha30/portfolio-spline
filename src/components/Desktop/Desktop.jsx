import React, { useState, useEffect, useCallback } from 'react';
import TerminalWindow from '../Windows/TerminalWindow';
import FileManagerWindow from '../Windows/FileManagerWindow';
import ProjectsWindow from '../Windows/ProjectsWindow';
import AboutWindow from '../Windows/AboutWindow';
import SkillsWindow from '../Windows/SkillsWindow';
import MailWindow from '../Windows/MailWindow';
import VSCodeWindow from '../Windows/VSCodeWindow';
import SettingsWindow from '../Windows/SettingsWindow';
import BrowserWindow from '../Windows/BrowserWindow';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Terminal, FolderOpen, Rocket, User, Lightbulb, Grid3x3,
    Mail, Settings, Power, Volume2, Wifi, Battery, Search,
    Lock, RotateCw, PowerOff, Monitor, Image as ImageIcon
} from 'lucide-react';
import useWindowManager from '../../hooks/useWindowManager';
import { useSettings } from '../../contexts/SettingsContext';

// Import images
import firefoxLogo from '/images/pngegg.png';
import trashIcon from '/images/trash.png';
import folder from '/images/folder.png';
import vs from '/images/vs.png';
import mail from '/images/mail.png';

const WINDOW_COMPONENTS = {
    terminal: TerminalWindow,
    browser: BrowserWindow,
    filemanager: FileManagerWindow,
    skills: SkillsWindow,
    projects: ProjectsWindow,
    about: AboutWindow,
    mail: MailWindow,
    vscode: VSCodeWindow,
    settings: SettingsWindow,
};

const Desktop = ({ onLock, onShutdown }) => {
    const wm = useWindowManager();
    const { wallpaper, setWallpaper, panelColor, setPanelColor, launcherColor, setLauncherColor } = useSettings();
    const [showApplications, setShowApplications] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
    const [powerMenu, setPowerMenu] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl+Alt+T → Terminal
            if (e.ctrlKey && e.altKey && e.key === 't') {
                e.preventDefault();
                openApp('terminal');
            }
            // Ctrl+Alt+F → File Manager
            if (e.ctrlKey && e.altKey && e.key === 'f') {
                e.preventDefault();
                openApp('filemanager');
            }
            // Super+L → Lock
            if (e.metaKey && e.key === 'l') {
                e.preventDefault();
                onLock?.();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onLock]);

    // Close context menu on click
    useEffect(() => {
        const close = () => setContextMenu(prev => prev.visible ? { ...prev, visible: false } : prev);
        window.addEventListener('click', close);
        return () => window.removeEventListener('click', close);
    }, []);

    const handleDesktopRightClick = (e) => {
        // Only show on desktop background, not on windows
        if (e.target.closest('[data-window]') || e.target.closest('button')) return;
        e.preventDefault();
        setContextMenu({ visible: true, x: e.clientX, y: e.clientY });
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const openApp = (type) => {
        wm.openWindow(type);
        setShowApplications(false);
    };

    const renderWindow = (win) => {
        const Component = WINDOW_COMPONENTS[win.type];
        if (!Component) return null;

        const baseProps = {
            key: win.id,
            id: win.id,
            isMinimized: win.isMinimized,
            zIndex: win.zIndex,
            offsetX: win.position.x,
            offsetY: win.position.y,
            onClose: () => wm.closeWindow(win.id),
            onMinimize: () => wm.minimizeWindow(win.id),
            onFocus: () => wm.focusWindow(win.id),
        };

        // Extra props for specific window types
        if (win.type === 'terminal') {
            baseProps.onProjectsOpen = () => openApp('projects');
            baseProps.onSkillsOpen = () => openApp('skills');
            baseProps.onAboutOpen = () => openApp('about');
            baseProps.onMailOpen = () => openApp('mail');
            baseProps.onFileManagerOpen = () => openApp('filemanager');
            baseProps.onVSCodeOpen = () => openApp('vscode');
            baseProps.onSettingsOpen = () => openApp('settings');
            baseProps.onBrowserOpen = () => openApp('browser');
        }

        if (win.type === 'skills') {
            baseProps.onOpenMail = () => openApp('mail');
        }

        if (win.type === 'settings') {
            baseProps.currentWallpaper = wallpaper;
            baseProps.onWallpaperChange = setWallpaper;
            baseProps.currentPanelColor = panelColor;
            baseProps.onPanelColorChange = setPanelColor;
            baseProps.currentLauncherColor = launcherColor;
            baseProps.onLauncherColorChange = setLauncherColor;
        }

        return <Component {...baseProps} />;
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden" onContextMenu={handleDesktopRightClick}>
            {/* Ubuntu Wallpaper */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
                style={{ backgroundImage: `url(${wallpaper})` }}
            />

            {/* Top Bar */}
            <div
                className="absolute top-0 left-0 right-0 h-7 backdrop-blur-sm flex items-center justify-between px-2 z-50 text-white text-xs transition-all duration-300"
                style={{
                    backgroundColor: `${panelColor.value}${Math.round((panelColor.opacity / 100) * 255).toString(16).padStart(2, '0')}`
                }}
            >
                <div className="flex items-center gap-4">
                    <div className="px-3 py-0.5 font-medium text-white/90">Activities</div>
                    {wm.minimizedWindows.length > 0 && (
                        <span className="text-white/90">{wm.minimizedWindows[wm.minimizedWindows.length - 1].name}</span>
                    )}
                </div>
                <button className="hover:bg-white/10 px-3 py-0.5 rounded transition-colors">
                    {formatTime(currentTime)}
                </button>
                <div className="flex items-center gap-1 relative">
                    <button className="hover:bg-white/10 p-1 rounded"><Volume2 size={14} /></button>
                    <button className="hover:bg-white/10 p-1 rounded"><Wifi size={14} /></button>
                    <button className="hover:bg-white/10 p-1 rounded"><Battery size={14} /></button>
                    <button
                        className="hover:bg-white/10 p-1 rounded"
                        onClick={() => setPowerMenu(!powerMenu)}
                    >
                        <Power size={12} />
                    </button>

                    {/* Power Menu Dropdown */}
                    <AnimatePresence>
                        {powerMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="absolute top-full right-0 mt-1 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl py-2 min-w-[180px] z-[60]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => { setPowerMenu(false); openApp('settings'); }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/10 flex items-center gap-3"
                                >
                                    <Settings size={14} /> Settings
                                </button>
                                <div className="border-t border-gray-700 my-1" />
                                <button
                                    onClick={() => { setPowerMenu(false); onLock?.(); }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/10 flex items-center gap-3"
                                >
                                    <Lock size={14} /> Lock Screen
                                </button>
                                <button
                                    onClick={() => { setPowerMenu(false); onShutdown?.('restart'); }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/10 flex items-center gap-3"
                                >
                                    <RotateCw size={14} /> Restart
                                </button>
                                <button
                                    onClick={() => { setPowerMenu(false); onShutdown?.('shutdown'); }}
                                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-white/10 flex items-center gap-3"
                                >
                                    <PowerOff size={14} /> Power Off
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Left Launcher */}
            <UbuntuLauncher
                onAppClick={openApp}
                minimizedWindows={wm.minimizedWindows}
                onShowApplications={() => setShowApplications(!showApplications)}
                launcherColor={launcherColor}
            />

            {/* Desktop Area */}
            <div className="absolute inset-0 pt-7 pl-16">
                <div className="relative w-full h-full">
                    {wm.windows.map(renderWindow)}
                </div>
            </div>

            {/* Show Applications Grid */}
            <AnimatePresence>
                {showApplications && (
                    <ApplicationsGrid
                        onClose={() => setShowApplications(false)}
                        onAppClick={openApp}
                    />
                )}
            </AnimatePresence>

            {/* Right-Click Context Menu */}
            {contextMenu.visible && (
                <div
                    className="fixed bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl py-2 min-w-[200px] z-[60]"
                    style={{ left: contextMenu.x, top: contextMenu.y }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => { setContextMenu({ ...contextMenu, visible: false }); openApp('terminal'); }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/10 flex items-center gap-3"
                    >
                        <Terminal size={14} /> Open Terminal
                    </button>
                    <button
                        onClick={() => { setContextMenu({ ...contextMenu, visible: false }); openApp('filemanager'); }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/10 flex items-center gap-3"
                    >
                        <FolderOpen size={14} /> Open File Manager
                    </button>
                    <div className="border-t border-gray-700 my-1" />
                    <button
                        onClick={() => { setContextMenu({ ...contextMenu, visible: false }); openApp('settings'); }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/10 flex items-center gap-3"
                    >
                        <ImageIcon size={14} /> Change Wallpaper
                    </button>
                    <button
                        onClick={() => { setContextMenu({ ...contextMenu, visible: false }); openApp('settings'); }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/10 flex items-center gap-3"
                    >
                        <Monitor size={14} /> Display Settings
                    </button>
                    <div className="border-t border-gray-700 my-1" />
                    <button
                        onClick={() => { setContextMenu({ ...contextMenu, visible: false }); openApp('about'); }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/10 flex items-center gap-3"
                    >
                        <User size={14} /> About This Computer
                    </button>
                </div>
            )}
        </div>
    );
};

// Ubuntu Launcher (Left Sidebar)
const UbuntuLauncher = ({ onAppClick, minimizedWindows, onShowApplications, launcherColor }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const launcherItems = [
        { id: 'grid', name: 'Show Applications', icon: Grid3x3, onClick: onShowApplications, special: true },
        { id: 'firefox', name: 'Firefox', isImage: true, imageSrc: firefoxLogo, type: 'browser' },
        { id: 'files', name: 'Files', isImage: true, imageSrc: folder, type: 'filemanager' },
        { id: 'skills', name: 'Skills', icon: Lightbulb, type: 'skills', color: 'bg-yellow-500' },
        { id: 'projects', name: 'Projects', icon: Rocket, type: 'projects', color: 'bg-purple-500' },
        { id: 'about', name: 'About', icon: User, type: 'about', color: 'bg-green-500' },
        { id: 'terminal', name: 'Terminal', icon: Terminal, type: 'terminal', color: 'bg-gray-700' },
        { id: 'mail', name: 'Mail', isImage: true, imageSrc: mail, type: 'mail' },
        { id: 'code', name: 'VS Code', isImage: true, imageSrc: vs, type: 'vscode' },
        { id: 'settings', name: 'Settings', icon: Settings, type: 'settings', color: 'bg-gray-600' },
        { id: 'trash', name: 'Trash', isImage: true, imageSrc: trashIcon, bottom: true },
    ];

    const normalIcons = launcherItems.filter(item => !item.bottom);
    const bottomIcons = launcherItems.filter(item => item.bottom);

    const isAppRunning = (type) => {
        return minimizedWindows.some(w => w.type === type);
    };

    const LauncherIcon = ({ item, index }) => {
        const IconComponent = item.icon;
        const running = isAppRunning(item.type);

        const handleClick = () => {
            if (item.special) {
                item.onClick();
            } else if (item.type) {
                onAppClick(item.type);
            }
        };

        return (
            <motion.div
                initial={mounted ? false : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: mounted ? 0 : index * 0.03 }}
                className="relative group"
            >
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900/95 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap pointer-events-none z-50 shadow-lg">
                    {item.name}
                </div>

                <button
                    onClick={handleClick}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-150 ${
                        item.special
                            ? 'bg-transparent border border-white/20 hover:bg-white/10'
                            : 'hover:bg-white/10'
                    }`}
                >
                    {item.special ? (
                        <Grid3x3 className="text-white" size={18} />
                    ) : item.isImage ? (
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                            <img
                                src={item.imageSrc}
                                alt={item.name}
                                className="w-9 h-9 object-contain"
                            />
                        </div>
                    ) : (
                        <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center shadow-lg`}>
                            <IconComponent className="text-white" size={20} />
                        </div>
                    )}
                </button>

                {running && !item.special && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-500 rounded-r shadow-lg"
                    />
                )}
            </motion.div>
        );
    };

    return (
        <div
            className="absolute left-0 top-7 bottom-0 w-16 backdrop-blur-sm flex flex-col items-center pt-2 z-40 transition-all duration-300"
            style={{
                backgroundColor: `${launcherColor.value}${Math.round((launcherColor.opacity / 100) * 255).toString(16).padStart(2, '0')}`
            }}
        >
            <div className="flex flex-col items-center gap-1">
                {normalIcons.map((item, index) => (
                    <LauncherIcon key={item.id} item={item} index={index} />
                ))}
            </div>
            <div className="flex-1" />
            <div className="flex flex-col items-center gap-1 pb-2">
                {bottomIcons.map((item, index) => (
                    <LauncherIcon key={item.id} item={item} index={index} />
                ))}
            </div>
        </div>
    );
};

// Applications Grid
const ApplicationsGrid = ({ onClose, onAppClick }) => {
    const apps = [
        { name: 'Firefox', isImage: true, imageSrc: firefoxLogo, type: 'browser' },
        { name: 'Files', isImage: true, imageSrc: folder, type: 'filemanager' },
        { name: 'Terminal', icon: Terminal, type: 'terminal', color: 'bg-gray-700' },
        { name: 'Skills', icon: Lightbulb, type: 'skills', color: 'bg-yellow-500' },
        { name: 'Projects', icon: Rocket, type: 'projects', color: 'bg-purple-500' },
        { name: 'About', icon: User, type: 'about', color: 'bg-green-500' },
        { name: 'Mail', isImage: true, imageSrc: mail, type: 'mail' },
        { name: 'VS Code', isImage: true, imageSrc: vs, type: 'vscode' },
        { name: 'Settings', icon: Settings, type: 'settings', color: 'bg-gray-600' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#2d2d2d]/95 backdrop-blur-xl z-[100]"
            onClick={onClose}
        >
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px]">
                <div className="bg-[#3c3c3c] rounded-lg px-4 py-3 flex items-center gap-3 shadow-2xl">
                    <Search className="text-white/50" size={20} />
                    <input
                        type="text"
                        placeholder="Type to search..."
                        className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-lg"
                        autoFocus
                    />
                </div>
            </div>

            <div className="absolute top-60 left-1/2 -translate-x-1/2 w-[800px]">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="grid grid-cols-5 gap-8"
                    onClick={(e) => e.stopPropagation()}
                >
                    {apps.map((app, index) => {
                        const IconComponent = app.icon;
                        return (
                            <motion.button
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onAppClick(app.type)}
                                className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-colors"
                            >
                                {app.isImage ? (
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl bg-white/5 overflow-hidden">
                                        <img
                                            src={app.imageSrc}
                                            alt={app.name}
                                            className="w-14 h-14 object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className={`w-16 h-16 ${app.color} rounded-2xl flex items-center justify-center shadow-xl`}>
                                        <IconComponent className="text-white" size={32} />
                                    </div>
                                )}
                                <span className="text-white text-sm text-center">{app.name}</span>
                            </motion.button>
                        );
                    })}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Desktop;
