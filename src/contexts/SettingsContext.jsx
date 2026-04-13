import React, { createContext, useContext, useState, useEffect } from 'react';
import ubuntuWallpaper from '/wallpaper/fa993d401b720ad6599ff38a9cc62851fefaff17.jpeg';

const SettingsContext = createContext(null);

const STORAGE_KEY = 'portfolio-os-settings';

function loadSettings() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
    } catch {}
    return null;
}

function saveSettings(settings) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
}

const DEFAULT_COLOR = { name: 'Dark', value: '#1a1a1a', opacity: 90 };

export function SettingsProvider({ children }) {
    const saved = loadSettings();

    const [wallpaper, setWallpaper] = useState(saved?.wallpaper || ubuntuWallpaper);
    const [panelColor, setPanelColor] = useState(saved?.panelColor || DEFAULT_COLOR);
    const [launcherColor, setLauncherColor] = useState(saved?.launcherColor || DEFAULT_COLOR);
    const [skipBoot, setSkipBoot] = useState(saved?.skipBoot ?? false);

    // Persist on change
    useEffect(() => {
        saveSettings({ wallpaper, panelColor, launcherColor, skipBoot });
    }, [wallpaper, panelColor, launcherColor, skipBoot]);

    const value = {
        wallpaper,
        setWallpaper,
        panelColor,
        setPanelColor,
        launcherColor,
        setLauncherColor,
        skipBoot,
        setSkipBoot,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const ctx = useContext(SettingsContext);
    if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
    return ctx;
}
