import React, { useState } from 'react';
import Dock from './Dock';
import TopBar from './TopBar';
import TerminalWindow from '../Windows/TerminalWindow';
import FileManagerWindow from '../Windows/FileManagerWindow';
import ProjectsWindow from '../Windows/ProjectsWindow';
import AboutWindow from '../Windows/AboutWindow';
import Wallpaper from './Wallpaper';

const Desktop = () => {
    const [terminals, setTerminals] = useState([]);
    const [fileManagers, setFileManagers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [abouts, setAbouts] = useState([]);
    const [maxZIndex, setMaxZIndex] = useState(40);
    const [windowOffset, setWindowOffset] = useState(0);

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
        } else if (windowType === 'projects') {
            setProjects(prev => prev.map(p =>
                p.id === windowId ? { ...p, zIndex: newZIndex } : p
            ));
        } else if (windowType === 'about') {
            setAbouts(prev => prev.map(a =>
                a.id === windowId ? { ...a, zIndex: newZIndex } : a
            ));
        }
    };

    const handleTerminalOpen = () => {
        const offset = windowOffset % 5;
        const newTerminal = {
            id: Date.now(),
            isMinimized: false,
            zIndex: maxZIndex + 1,
            offsetX: 100 + (offset * 30),
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

    // About window logic
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

    const allMinimizedWindows = [
        ...terminals.filter(t => t.isMinimized).map(t => ({ ...t, type: 'terminal' })),
        ...fileManagers.filter(fm => fm.isMinimized).map(fm => ({ ...fm, type: 'filemanager' })),
        ...projects.filter(p => p.isMinimized).map(p => ({ ...p, type: 'projects' })),
        ...abouts.filter(a => a.isMinimized).map(a => ({ ...a, type: 'about' }))
    ];

    const handleRestoreWindow = (id, type) => {
        if (type === 'terminal') {
            handleTerminalRestore(id);
        } else if (type === 'filemanager') {
            handleFileManagerRestore(id);
        } else if (type === 'projects') {
            handleProjectsRestore(id);
        } else if (type === 'about') {
            handleAboutRestore(id);
        }
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-black">
            <Wallpaper />

            <TopBar
                minimizedWindows={allMinimizedWindows}
                onRestoreWindow={handleRestoreWindow}
            />

            <div className="absolute inset-0 pt-8">
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
                        onFocus={() => bringToFront(terminal.id, 'terminal')}
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

                <Dock
                    onTerminalClick={handleTerminalOpen}
                    onFileManagerClick={handleFileManagerOpen}
                    onProjectsClick={handleProjectsOpen}
                    onAboutClick={handleAboutOpen}
                />
            </div>
        </div>
    );
};

export default Desktop;
