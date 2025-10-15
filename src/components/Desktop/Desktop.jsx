import React, { useState } from 'react';
import Dock from './Dock';
import TopBar from './TopBar';
import TerminalWindow from '../Windows/TerminalWindow';

const Desktop = () => {
    const [terminals, setTerminals] = useState([]);

    const handleTerminalOpen = () => {
        // Create new terminal with unique ID
        const newTerminal = {
            id: Date.now(),
            isMinimized: false
        };
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
        setTerminals(prev => prev.map(t =>
            t.id === id ? { ...t, isMinimized: false } : t
        ));
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-black">
            <TopBar
                minimizedWindows={terminals.filter(t => t.isMinimized)}
                onRestoreWindow={handleTerminalRestore}
            />

            <div className="absolute inset-0 p-8">
                {/* Render all terminals */}
                {terminals.map(terminal => (
                    <TerminalWindow
                        key={terminal.id}
                        id={terminal.id}
                        isMinimized={terminal.isMinimized}
                        onClose={() => handleTerminalClose(terminal.id)}
                        onMinimize={() => handleTerminalMinimize(terminal.id)}
                    />
                ))}

                <Dock onTerminalClick={handleTerminalOpen} />
            </div>
        </div>
    );
};

export default Desktop;
