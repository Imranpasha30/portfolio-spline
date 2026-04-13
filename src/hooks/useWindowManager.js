import { useState, useCallback, useMemo } from 'react';

const WINDOW_DEFAULTS = {
    terminal:    { width: 800,  height: 500, x: 150, y: 100 },
    filemanager: { width: 900,  height: 600, x: 150, y: 80 },
    projects:    { width: 1100, height: 700, x: 200, y: 100 },
    about:       { width: 1000, height: 700, x: 180, y: 120 },
    skills:      { width: 1100, height: 700, x: 160, y: 90 },
    mail:        { width: 850,  height: 700, x: 180, y: 90 },
    vscode:      { width: 1000, height: 650, x: 200, y: 100 },
    settings:    { width: 900,  height: 600, x: 200, y: 100 },
    browser:     { width: 1200, height: 700, x: 150, y: 80 },
};

const WINDOW_NAMES = {
    terminal: 'Terminal',
    filemanager: 'Files',
    projects: 'Projects',
    about: 'About',
    skills: 'Skills',
    mail: 'Mail',
    vscode: 'VS Code',
    settings: 'Settings',
    browser: 'Firefox',
};

export default function useWindowManager() {
    const [windows, setWindows] = useState([]);
    const [maxZIndex, setMaxZIndex] = useState(40);
    const [windowOffset, setWindowOffset] = useState(0);

    const openWindow = useCallback((type) => {
        const defaults = WINDOW_DEFAULTS[type] || { width: 800, height: 500, x: 150, y: 100 };
        const offset = windowOffset % 5;
        const newZ = maxZIndex + 1;

        const newWindow = {
            id: Date.now(),
            type,
            isMinimized: false,
            isMaximized: false,
            zIndex: newZ,
            position: {
                x: defaults.x + offset * 30,
                y: defaults.y + offset * 30,
            },
            size: {
                width: defaults.width,
                height: defaults.height,
            },
            prevSize: null,
        };

        setMaxZIndex(newZ);
        setWindowOffset(prev => prev + 1);
        setWindows(prev => [...prev, newWindow]);
        return newWindow.id;
    }, [maxZIndex, windowOffset]);

    const closeWindow = useCallback((id) => {
        setWindows(prev => prev.filter(w => w.id !== id));
    }, []);

    const minimizeWindow = useCallback((id) => {
        setWindows(prev => prev.map(w =>
            w.id === id ? { ...w, isMinimized: true } : w
        ));
    }, []);

    const restoreWindow = useCallback((id) => {
        setMaxZIndex(prev => {
            const newZ = prev + 1;
            setWindows(ws => ws.map(w =>
                w.id === id ? { ...w, isMinimized: false, zIndex: newZ } : w
            ));
            return newZ;
        });
    }, []);

    const focusWindow = useCallback((id) => {
        setMaxZIndex(prev => {
            const newZ = prev + 1;
            setWindows(ws => ws.map(w =>
                w.id === id ? { ...w, zIndex: newZ } : w
            ));
            return newZ;
        });
    }, []);

    const maximizeWindow = useCallback((id) => {
        setWindows(prev => prev.map(w => {
            if (w.id !== id) return w;
            if (w.isMaximized) {
                return {
                    ...w,
                    isMaximized: false,
                    position: w.prevSize ? { x: w.prevSize.x, y: w.prevSize.y } : w.position,
                    size: w.prevSize ? { width: w.prevSize.width, height: w.prevSize.height } : w.size,
                    prevSize: null,
                };
            }
            return {
                ...w,
                isMaximized: true,
                prevSize: { ...w.position, ...w.size },
            };
        }));
    }, []);

    const updateWindowGeometry = useCallback((id, position, size) => {
        setWindows(prev => prev.map(w => {
            if (w.id !== id) return w;
            return {
                ...w,
                ...(position && { position }),
                ...(size && { size }),
            };
        }));
    }, []);

    const getWindowsByType = useCallback((type) => {
        return windows.filter(w => w.type === type);
    }, [windows]);

    const minimizedWindows = useMemo(() =>
        windows
            .filter(w => w.isMinimized)
            .map(w => ({ ...w, name: WINDOW_NAMES[w.type] || w.type })),
        [windows]
    );

    const restoreByType = useCallback((id, type) => {
        restoreWindow(id);
    }, [restoreWindow]);

    return {
        windows,
        openWindow,
        closeWindow,
        minimizeWindow,
        restoreWindow,
        focusWindow,
        maximizeWindow,
        updateWindowGeometry,
        getWindowsByType,
        minimizedWindows,
        restoreByType,
        WINDOW_DEFAULTS,
    };
}
