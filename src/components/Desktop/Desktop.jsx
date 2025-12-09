import React, { useState, useEffect } from 'react';
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
    Mail, Settings, Power, Volume2, Wifi, Battery, Search
} from 'lucide-react';

// Import images
import firefoxLogo from '/images/pngegg.png';
import trashIcon from '/images/trash.png';
import folder from '/images/folder.png';
import vs from '/images/vs.png';
import mail from '/images/mail.png';
import ubuntuWallpaper from '/images/ubuntu-22-04-5-lts-3840x2160-23443.png';

const Desktop = () => {
    const [terminals, setTerminals] = useState([]);
    const [fileManagers, setFileManagers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [abouts, setAbouts] = useState([]);
    const [skills, setSkills] = useState([]);
    const [mails, setMails] = useState([]);
    const [vscodes, setVSCodes] = useState([]);
    const [settings, setSettings] = useState([]);
    const [browsers, setBrowsers] = useState([]);
    const [maxZIndex, setMaxZIndex] = useState(40);
    const [windowOffset, setWindowOffset] = useState(0);
    const [showApplications, setShowApplications] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    
    // Customization states
    const [wallpaper, setWallpaper] = useState(ubuntuWallpaper);
    const [panelColor, setPanelColor] = useState({ name: 'Dark', value: '#1a1a1a', opacity: 90 });
    const [launcherColor, setLauncherColor] = useState({ name: 'Dark', value: '#1a1a1a', opacity: 90 });

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const bringToFront = (windowId, windowType) => {
        const newZIndex = maxZIndex + 1;
        setMaxZIndex(newZIndex);

        if (windowType === 'terminal') {
            setTerminals(prev => prev.map(t =>
                t.id === windowId ? { ...t, zIndex: newZIndex } : t
            ));
        } else if (windowType === 'filemanager') {
            setFileManagers(prev => prev.map(fm =>
                fm.id === windowId ? { ...fm, zIndex: newZIndex } : fm
            ));
        } else if (windowType === 'skills') {
            setSkills(prev => prev.map(s =>
                s.id === windowId ? { ...s, zIndex: newZIndex } : s
            ));
        } else if (windowType === 'projects') {
            setProjects(prev => prev.map(p =>
                p.id === windowId ? { ...p, zIndex: newZIndex } : p
            ));
        } else if (windowType === 'about') {
            setAbouts(prev => prev.map(a =>
                a.id === windowId ? { ...a, zIndex: newZIndex } : a
            ));
        } else if (windowType === 'mail') {
            setMails(prev => prev.map(m =>
                m.id === windowId ? { ...m, zIndex: newZIndex } : m
            ));
        } else if (windowType === 'vscode') {
            setVSCodes(prev => prev.map(v =>
                v.id === windowId ? { ...v, zIndex: newZIndex } : v
            ));
        } else if (windowType === 'settings') {
            setSettings(prev => prev.map(s =>
                s.id === windowId ? { ...s, zIndex: newZIndex } : s
            ));
        } else if (windowType === 'browser') {
            setBrowsers(prev => prev.map(b =>
                b.id === windowId ? { ...b, zIndex: newZIndex } : b
            ));
        }
    };

    // Browser handlers
    const handleBrowserOpen = () => {
        const offset = windowOffset % 5;
        const newBrowser = {
            id: Date.now(),
            isMinimized: false,
            zIndex: maxZIndex + 1,
            offsetX: 150 + (offset * 30),
            offsetY: 80 + (offset * 30)
        };
        setMaxZIndex(maxZIndex + 1);
        setWindowOffset(windowOffset + 1);
        setBrowsers(prev => [...prev, newBrowser]);
    };

    const handleBrowserClose = (id) => {
        setBrowsers(prev => prev.filter(b => b.id !== id));
    };

    const handleBrowserMinimize = (id) => {
        setBrowsers(prev => prev.map(b =>
            b.id === id ? { ...b, isMinimized: true } : b
        ));
    };

    const handleBrowserRestore = (id) => {
        const newZIndex = maxZIndex + 1;
        setMaxZIndex(newZIndex);
        setBrowsers(prev => prev.map(b =>
            b.id === id ? { ...b, isMinimized: false, zIndex: newZIndex } : b
        ));
    };

    // Terminal handlers
    const handleTerminalOpen = () => {
        const offset = windowOffset % 5;
        const newTerminal = {
            id: Date.now(),
            isMinimized: false,
            zIndex: maxZIndex + 1,
            offsetX: 150 + (offset * 30),
            offsetY: 100 + (offset * 30)
        };
        setMaxZIndex(maxZIndex + 1);
        setWindowOffset(windowOffset + 1);
        setTerminals(prev => [...prev, newTerminal]);
    };

    const handleTerminalClose = (id) => {
        setTerminals(prev => prev.filter(t => t.id !== id));
    };

    const handleTerminalMinimize = (id) => {
        setTerminals(prev => prev.map(t =>
            t.id === id ? { ...t, isMinimized: true } : t
        ));
    };

    const handleTerminalRestore = (id) => {
        const newZIndex = maxZIndex + 1;
        setMaxZIndex(newZIndex);
        setTerminals(prev => prev.map(t =>
            t.id === id ? { ...t, isMinimized: false, zIndex: newZIndex } : t
        ));
    };

    // File Manager handlers
    const handleFileManagerOpen = () => {
        const offset = windowOffset % 5;
        const newFileManager = {
            id: Date.now(),
            isMinimized: false,
            zIndex: maxZIndex + 1,
            offsetX: 150 + (offset * 30),
            offsetY: 80 + (offset * 30)
        };
        setMaxZIndex(maxZIndex + 1);
        setWindowOffset(windowOffset + 1);
        setFileManagers(prev => [...prev, newFileManager]);
    };

    const handleFileManagerClose = (id) => {
        setFileManagers(prev => prev.filter(fm => fm.id !== id));
    };

    const handleFileManagerMinimize = (id) => {
        setFileManagers(prev => prev.map(fm =>
            fm.id === id ? { ...fm, isMinimized: true } : fm
        ));
    };

    const handleFileManagerRestore = (id) => {
        const newZIndex = maxZIndex + 1;
        setMaxZIndex(newZIndex);
        setFileManagers(prev => prev.map(fm =>
            fm.id === id ? { ...fm, isMinimized: false, zIndex: newZIndex } : fm
        ));
    };

    // Skills handlers
    const handleSkillsOpen = () => {
        const offset = windowOffset % 5;
        const newSkill = {
            id: Date.now(),
            isMinimized: false,
            zIndex: maxZIndex + 1,
            offsetX: 160 + (offset * 30),
            offsetY: 90 + (offset * 30)
        };
        setMaxZIndex(maxZIndex + 1);
        setWindowOffset(windowOffset + 1);
        setSkills(prev => [...prev, newSkill]);
    };

    const handleSkillsClose = (id) => {
        setSkills(prev => prev.filter(s => s.id !== id));
    };

    const handleSkillsMinimize = (id) => {
        setSkills(prev => prev.map(s =>
            s.id === id ? { ...s, isMinimized: true } : s
        ));
    };

    const handleSkillsRestore = (id) => {
        const newZIndex = maxZIndex + 1;
        setMaxZIndex(newZIndex);
        setSkills(prev => prev.map(s =>
            s.id === id ? { ...s, isMinimized: false, zIndex: newZIndex } : s
        ));
    };

    // Projects handlers
    const handleProjectsOpen = () => {
        const offset = windowOffset % 5;
        const newProject = {
            id: Date.now(),
            isMinimized: false,
            zIndex: maxZIndex + 1,
            offsetX: 200 + (offset * 30),
            offsetY: 100 + (offset * 30)
        };
        setMaxZIndex(maxZIndex + 1);
        setWindowOffset(windowOffset + 1);
        setProjects(prev => [...prev, newProject]);
    };

    const handleProjectsClose = (id) => {
        setProjects(prev => prev.filter(p => p.id !== id));
    };

    const handleProjectsMinimize = (id) => {
        setProjects(prev => prev.map(p =>
            p.id === id ? { ...p, isMinimized: true } : p
        ));
    };

    const handleProjectsRestore = (id) => {
        const newZIndex = maxZIndex + 1;
        setMaxZIndex(newZIndex);
        setProjects(prev => prev.map(p =>
            p.id === id ? { ...p, isMinimized: false, zIndex: newZIndex } : p
        ));
    };

    // About handlers
    const handleAboutOpen = () => {
        const offset = windowOffset % 5;
        const newAbout = {
            id: Date.now(),
            isMinimized: false,
            zIndex: maxZIndex + 1,
            offsetX: 180 + (offset * 30),
            offsetY: 120 + (offset * 30)
        };
        setMaxZIndex(maxZIndex + 1);
        setWindowOffset(windowOffset + 1);
        setAbouts(prev => [...prev, newAbout]);
    };

    const handleAboutClose = (id) => {
        setAbouts(prev => prev.filter(a => a.id !== id));
    };

    const handleAboutMinimize = (id) => {
        setAbouts(prev => prev.map(a =>
            a.id === id ? { ...a, isMinimized: true } : a
        ));
    };

    const handleAboutRestore = (id) => {
        const newZIndex = maxZIndex + 1;
        setMaxZIndex(newZIndex);
        setAbouts(prev => prev.map(a =>
            a.id === id ? { ...a, isMinimized: false, zIndex: newZIndex } : a
        ));
    };

    // Mail handlers
    const handleMailOpen = () => {
        const offset = windowOffset % 5;
        const newMail = {
            id: Date.now(),
            isMinimized: false,
            zIndex: maxZIndex + 1,
            offsetX: 180 + (offset * 30),
            offsetY: 90 + (offset * 30)
        };
        setMaxZIndex(maxZIndex + 1);
        setWindowOffset(windowOffset + 1);
        setMails(prev => [...prev, newMail]);
    };

    const handleMailClose = (id) => {
        setMails(prev => prev.filter(m => m.id !== id));
    };

    const handleMailMinimize = (id) => {
        setMails(prev => prev.map(m =>
            m.id === id ? { ...m, isMinimized: true } : m
        ));
    };

    const handleMailRestore = (id) => {
        const newZIndex = maxZIndex + 1;
        setMaxZIndex(newZIndex);
        setMails(prev => prev.map(m =>
            m.id === id ? { ...m, isMinimized: false, zIndex: newZIndex } : m
        ));
    };

    // VS Code handlers
    const handleVSCodeOpen = () => {
        const offset = windowOffset % 5;
        const newVSCode = {
            id: Date.now(),
            isMinimized: false,
            zIndex: maxZIndex + 1,
            offsetX: 200 + (offset * 30),
            offsetY: 100 + (offset * 30)
        };
        setMaxZIndex(maxZIndex + 1);
        setWindowOffset(windowOffset + 1);
        setVSCodes(prev => [...prev, newVSCode]);
    };

    const handleVSCodeClose = (id) => {
        setVSCodes(prev => prev.filter(v => v.id !== id));
    };

    const handleVSCodeMinimize = (id) => {
        setVSCodes(prev => prev.map(v =>
            v.id === id ? { ...v, isMinimized: true } : v
        ));
    };

    const handleVSCodeRestore = (id) => {
        const newZIndex = maxZIndex + 1;
        setMaxZIndex(newZIndex);
        setVSCodes(prev => prev.map(v =>
            v.id === id ? { ...v, isMinimized: false, zIndex: newZIndex } : v
        ));
    };

    // Settings handlers
    const handleSettingsOpen = () => {
        const offset = windowOffset % 5;
        const newSettings = {
            id: Date.now(),
            isMinimized: false,
            zIndex: maxZIndex + 1,
            offsetX: 200 + (offset * 30),
            offsetY: 100 + (offset * 30)
        };
        setMaxZIndex(maxZIndex + 1);
        setWindowOffset(windowOffset + 1);
        setSettings(prev => [...prev, newSettings]);
    };

    const handleSettingsClose = (id) => {
        setSettings(prev => prev.filter(s => s.id !== id));
    };

    const handleSettingsMinimize = (id) => {
        setSettings(prev => prev.map(s =>
            s.id === id ? { ...s, isMinimized: true } : s
        ));
    };

    const handleSettingsRestore = (id) => {
        const newZIndex = maxZIndex + 1;
        setMaxZIndex(newZIndex);
        setSettings(prev => prev.map(s =>
            s.id === id ? { ...s, isMinimized: false, zIndex: newZIndex } : s
        ));
    };

    const handleWallpaperChange = (newWallpaper) => {
        setWallpaper(newWallpaper);
    };

    const handlePanelColorChange = (color) => {
        setPanelColor(color);
    };

    const handleLauncherColorChange = (color) => {
        setLauncherColor(color);
    };

    const allMinimizedWindows = [
        ...terminals.filter(t => t.isMinimized).map(t => ({ ...t, type: 'terminal', name: 'Terminal' })),
        ...fileManagers.filter(fm => fm.isMinimized).map(fm => ({ ...fm, type: 'filemanager', name: 'Files' })),
        ...skills.filter(s => s.isMinimized).map(s => ({ ...s, type: 'skills', name: 'Skills' })),
        ...projects.filter(p => p.isMinimized).map(p => ({ ...p, type: 'projects', name: 'Projects' })),
        ...abouts.filter(a => a.isMinimized).map(a => ({ ...a, type: 'about', name: 'About' })),
        ...mails.filter(m => m.isMinimized).map(m => ({ ...m, type: 'mail', name: 'Mail' })),
        ...vscodes.filter(v => v.isMinimized).map(v => ({ ...v, type: 'vscode', name: 'VS Code' })),
        ...settings.filter(s => s.isMinimized).map(s => ({ ...s, type: 'settings', name: 'Settings' })),
        ...browsers.filter(b => b.isMinimized).map(b => ({ ...b, type: 'browser', name: 'Firefox' }))
    ];

    const handleRestoreWindow = (id, type) => {
        if (type === 'terminal') handleTerminalRestore(id);
        else if (type === 'filemanager') handleFileManagerRestore(id);
        else if (type === 'skills') handleSkillsRestore(id);
        else if (type === 'projects') handleProjectsRestore(id);
        else if (type === 'about') handleAboutRestore(id);
        else if (type === 'mail') handleMailRestore(id);
        else if (type === 'vscode') handleVSCodeRestore(id);
        else if (type === 'settings') handleSettingsRestore(id);
        else if (type === 'browser') handleBrowserRestore(id);
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

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            {/* Ubuntu Wallpaper */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
                style={{
                    backgroundImage: `url(${wallpaper})`
                }}
            />

            {/* Top Bar */}
            <div 
                className="absolute top-0 left-0 right-0 h-7 backdrop-blur-sm flex items-center justify-between px-2 z-50 text-white text-xs transition-all duration-300"
                style={{
                    backgroundColor: `${panelColor.value}${Math.round((panelColor.opacity / 100) * 255).toString(16).padStart(2, '0')}`
                }}
            >
                {/* Left: Activities */}
                <div className="flex items-center gap-4">
                    <div className="px-3 py-0.5 font-medium text-white/90">
                        Activities
                    </div>
                    {allMinimizedWindows.length > 0 && (
                        <span className="text-white/90">{allMinimizedWindows[allMinimizedWindows.length - 1].name}</span>
                    )}
                </div>

                {/* Center: Date & Time */}
                <button className="hover:bg-white/10 px-3 py-0.5 rounded transition-colors">
                    {formatTime(currentTime)}
                </button>

                {/* Right: System Tray */}
                <div className="flex items-center gap-1">
                    <button className="hover:bg-white/10 p-1 rounded"><Volume2 size={14} /></button>
                    <button className="hover:bg-white/10 p-1 rounded"><Wifi size={14} /></button>
                    <button className="hover:bg-white/10 p-1 rounded"><Battery size={14} /></button>
                    <button className="hover:bg-white/10 p-1 rounded"><Power size={12} /></button>
                </div>
            </div>

            {/* Left Launcher */}
            <UbuntuLauncher
                onTerminalClick={handleTerminalOpen}
                onFileManagerClick={handleFileManagerOpen}
                onSkillsClick={handleSkillsOpen}
                onProjectsClick={handleProjectsOpen}
                onAboutClick={handleAboutOpen}
                onMailClick={handleMailOpen}
                onVSCodeClick={handleVSCodeOpen}
                onSettingsClick={handleSettingsOpen}
                onBrowserClick={handleBrowserOpen}
                minimizedWindows={allMinimizedWindows}
                onShowApplications={() => setShowApplications(!showApplications)}
                launcherColor={launcherColor}
            />

            {/* Desktop Area */}
            <div className="absolute inset-0 pt-7 pl-16">
                <div className="relative w-full h-full">
                    {terminals.map(terminal => (
                        <TerminalWindow
                            key={terminal.id}
                            id={terminal.id}
                            isMinimized={terminal.isMinimized}
                            zIndex={terminal.zIndex}
                            offsetX={terminal.offsetX}
                            offsetY={terminal.offsetY}
                            onClose={() => handleTerminalClose(terminal.id)}
                            onMinimize={() => handleTerminalMinimize(terminal.id)}
                            onProjectsOpen={handleProjectsOpen}
                            onSkillsOpen={handleSkillsOpen}
                            onAboutOpen={handleAboutOpen}
                            onMailOpen={handleMailOpen}
                            onFileManagerOpen={handleFileManagerOpen}
                            onVSCodeOpen={handleVSCodeOpen}
                            onSettingsOpen={handleSettingsOpen}
                            onBrowserOpen={handleBrowserOpen}
                            onFocus={() => bringToFront(terminal.id, 'terminal')}
                        />
                    ))}

                    {browsers.map(browser => (
                        <BrowserWindow
                            key={browser.id}
                            id={browser.id}
                            isMinimized={browser.isMinimized}
                            zIndex={browser.zIndex}
                            offsetX={browser.offsetX}
                            offsetY={browser.offsetY}
                            onClose={() => handleBrowserClose(browser.id)}
                            onMinimize={() => handleBrowserMinimize(browser.id)}
                            onFocus={() => bringToFront(browser.id, 'browser')}
                        />
                    ))}

                    {fileManagers.map(fm => (
                        <FileManagerWindow
                            key={fm.id}
                            id={fm.id}
                            isMinimized={fm.isMinimized}
                            zIndex={fm.zIndex}
                            offsetX={fm.offsetX}
                            offsetY={fm.offsetY}
                            onClose={() => handleFileManagerClose(fm.id)}
                            onMinimize={() => handleFileManagerMinimize(fm.id)}
                            onFocus={() => bringToFront(fm.id, 'filemanager')}
                        />
                    ))}

                    {skills.map(skill => (
                        <SkillsWindow
                            key={skill.id}
                            id={skill.id}
                            isMinimized={skill.isMinimized}
                            zIndex={skill.zIndex}
                            offsetX={skill.offsetX}
                            offsetY={skill.offsetY}
                            onOpenMail={handleMailOpen}
                            onClose={() => handleSkillsClose(skill.id)}
                            onMinimize={() => handleSkillsMinimize(skill.id)}
                            onFocus={() => bringToFront(skill.id, 'skills')}
                        />
                    ))}

                    {projects.map(project => (
                        <ProjectsWindow
                            key={project.id}
                            id={project.id}
                            isMinimized={project.isMinimized}
                            zIndex={project.zIndex}
                            offsetX={project.offsetX}
                            offsetY={project.offsetY}
                            onClose={() => handleProjectsClose(project.id)}
                            onMinimize={() => handleProjectsMinimize(project.id)}
                            onFocus={() => bringToFront(project.id, 'projects')}
                        />
                    ))}

                    {abouts.map(about => (
                        <AboutWindow
                            key={about.id}
                            id={about.id}
                            isMinimized={about.isMinimized}
                            zIndex={about.zIndex}
                            offsetX={about.offsetX}
                            offsetY={about.offsetY}
                            onClose={() => handleAboutClose(about.id)}
                            onMinimize={() => handleAboutMinimize(about.id)}
                            onFocus={() => bringToFront(about.id, 'about')}
                        />
                    ))}

                    {mails.map(mailWindow => (
                        <MailWindow
                            key={mailWindow.id}
                            id={mailWindow.id}
                            isMinimized={mailWindow.isMinimized}
                            zIndex={mailWindow.zIndex}
                            offsetX={mailWindow.offsetX}
                            offsetY={mailWindow.offsetY}
                            onClose={() => handleMailClose(mailWindow.id)}
                            onMinimize={() => handleMailMinimize(mailWindow.id)}
                            onFocus={() => bringToFront(mailWindow.id, 'mail')}
                        />
                    ))}

                    {vscodes.map(vscode => (
                        <VSCodeWindow
                            key={vscode.id}
                            id={vscode.id}
                            isMinimized={vscode.isMinimized}
                            zIndex={vscode.zIndex}
                            offsetX={vscode.offsetX}
                            offsetY={vscode.offsetY}
                            onClose={() => handleVSCodeClose(vscode.id)}
                            onMinimize={() => handleVSCodeMinimize(vscode.id)}
                            onFocus={() => bringToFront(vscode.id, 'vscode')}
                        />
                    ))}

                    {settings.map(setting => (
                        <SettingsWindow
                            key={setting.id}
                            id={setting.id}
                            isMinimized={setting.isMinimized}
                            zIndex={setting.zIndex}
                            offsetX={setting.offsetX}
                            offsetY={setting.offsetY}
                            onClose={() => handleSettingsClose(setting.id)}
                            onMinimize={() => handleSettingsMinimize(setting.id)}
                            onFocus={() => bringToFront(setting.id, 'settings')}
                            currentWallpaper={wallpaper}
                            onWallpaperChange={handleWallpaperChange}
                            currentPanelColor={panelColor}
                            onPanelColorChange={handlePanelColorChange}
                            currentLauncherColor={launcherColor}
                            onLauncherColorChange={handleLauncherColorChange}
                        />
                    ))}
                </div>
            </div>

            {/* Show Applications Grid */}
            <AnimatePresence>
                {showApplications && (
                    <ApplicationsGrid
                        onClose={() => setShowApplications(false)}
                        onTerminalClick={() => { handleTerminalOpen(); setShowApplications(false); }}
                        onFileManagerClick={() => { handleFileManagerOpen(); setShowApplications(false); }}
                        onSkillsClick={() => { handleSkillsOpen(); setShowApplications(false); }}
                        onProjectsClick={() => { handleProjectsOpen(); setShowApplications(false); }}
                        onAboutClick={() => { handleAboutOpen(); setShowApplications(false); }}
                        onMailClick={() => { handleMailOpen(); setShowApplications(false); }}
                        onVSCodeClick={() => { handleVSCodeOpen(); setShowApplications(false); }}
                        onSettingsClick={() => { handleSettingsOpen(); setShowApplications(false); }}
                        onBrowserClick={() => { handleBrowserOpen(); setShowApplications(false); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// Ubuntu Launcher (Left Sidebar)
const UbuntuLauncher = ({ 
    onTerminalClick, 
    onFileManagerClick, 
    onSkillsClick, 
    onProjectsClick, 
    onAboutClick,
    onMailClick,
    onVSCodeClick,
    onSettingsClick,
    onBrowserClick,
    minimizedWindows,
    onShowApplications,
    launcherColor
}) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const launcherItems = [
        { id: 'grid', name: 'Show Applications', icon: Grid3x3, onClick: onShowApplications, special: true },
        { id: 'firefox', name: 'Firefox', isImage: true, imageSrc: firefoxLogo, onClick: onBrowserClick, type: 'browser' },
        { id: 'files', name: 'Files', isImage: true, onClick: onFileManagerClick, imageSrc: folder, type: 'filemanager' },
        { id: 'skills', name: 'Skills', icon: Lightbulb, onClick: onSkillsClick, type: 'skills', color: 'bg-yellow-500' },
        { id: 'projects', name: 'Projects', icon: Rocket, onClick: onProjectsClick, type: 'projects', color: 'bg-purple-500' },
        { id: 'about', name: 'About', icon: User, onClick: onAboutClick, type: 'about', color: 'bg-green-500' },
        { id: 'terminal', name: 'Terminal', icon: Terminal, onClick: onTerminalClick, type: 'terminal', color: 'bg-gray-700' },
        { id: 'mail', name: 'Mail', isImage: true, imageSrc: mail, onClick: onMailClick, type: 'mail' },
        { id: 'code', name: 'VS Code', isImage: true, imageSrc: vs, onClick: onVSCodeClick, type: 'vscode' },
        { id: 'settings', name: 'Settings', icon: Settings, onClick: onSettingsClick, type: 'settings', color: 'bg-gray-600' },
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

        return (
            <motion.div
                initial={mounted ? false : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: mounted ? 0 : index * 0.03 }}
                className="relative group"
            >
                {/* Tooltip */}
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900/95 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap pointer-events-none z-50 shadow-lg">
                    {item.name}
                </div>

                {/* Icon Button */}
                <button
                    onClick={item.onClick}
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

                {/* Running Indicator */}
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
            {/* Top Icons */}
            <div className="flex flex-col items-center gap-1">
                {normalIcons.map((item, index) => (
                    <LauncherIcon key={item.id} item={item} index={index} />
                ))}
            </div>

            {/* Bottom Icons */}
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
const ApplicationsGrid = ({ 
    onClose, 
    onTerminalClick, 
    onFileManagerClick, 
    onSkillsClick, 
    onProjectsClick, 
    onAboutClick,
    onMailClick,
    onVSCodeClick,
    onSettingsClick,
    onBrowserClick
}) => {
    const apps = [
        { name: 'Firefox', isImage: true, imageSrc: firefoxLogo, onClick: onBrowserClick },
        { name: 'Files', isImage: true, imageSrc: folder, onClick: onFileManagerClick },
        { name: 'Terminal', icon: Terminal, onClick: onTerminalClick, color: 'bg-gray-700' },
        { name: 'Skills', icon: Lightbulb, onClick: onSkillsClick, color: 'bg-yellow-500' },
        { name: 'Projects', icon: Rocket, onClick: onProjectsClick, color: 'bg-purple-500' },
        { name: 'About', icon: User, onClick: onAboutClick, color: 'bg-green-500' },
        { name: 'Mail', isImage: true, imageSrc: mail, onClick: onMailClick },
        { name: 'VS Code', isImage: true, imageSrc: vs, onClick: onVSCodeClick },
        { name: 'Settings', icon: Settings, onClick: onSettingsClick, color: 'bg-gray-600' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#2d2d2d]/95 backdrop-blur-xl z-[100]"
            onClick={onClose}
        >
            {/* Search Bar */}
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

            {/* App Grid */}
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
                                onClick={app.onClick || onClose}
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
