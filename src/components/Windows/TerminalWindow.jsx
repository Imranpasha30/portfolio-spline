import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Maximize2, Minimize2 } from 'lucide-react';

const TerminalWindow = ({ id, isMinimized, onClose, onMinimize }) => {
    const [isMaximized, setIsMaximized] = useState(false);
    const [previousSize, setPreviousSize] = useState({ width: 800, height: 500, x: 100, y: 100 });
    const [size, setSize] = useState({ width: 800, height: 500 });
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const rndRef = useRef(null);

    // Terminal state
    const [history, setHistory] = useState([
        { type: 'output', content: 'Welcome to Portfolio Terminal v1.0.0' },
        { type: 'output', content: "Type 'help' for available commands" }
    ]);
    const [input, setInput] = useState('');
    const inputRef = useRef(null);

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

    const handleMinimize = () => {
        onMinimize();
    };

    const handleCommand = (cmd) => {
        const trimmedCmd = cmd.trim().toLowerCase();

        // Add command to history
        setHistory(prev => [...prev, { type: 'command', content: cmd }]);

        // Process commands
        switch (trimmedCmd) {
            case 'help':
                setHistory(prev => [...prev,
                { type: 'output', content: 'Available commands:' },
                { type: 'output', content: '  help     - Show this help message' },
                { type: 'output', content: '  about    - About me' },
                { type: 'output', content: '  skills   - My skills' },
                { type: 'output', content: '  projects - View projects' },
                { type: 'output', content: '  contact  - Contact information' },
                { type: 'output', content: '  clear    - Clear terminal' }
                ]);
                break;
            case 'about':
                setHistory(prev => [...prev,
                { type: 'output', content: 'Hello! I am a Full Stack Developer' },
                { type: 'output', content: 'Passionate about building amazing web experiences' }
                ]);
                break;
            case 'skills':
                setHistory(prev => [...prev,
                { type: 'output', content: 'Technical Skills:' },
                { type: 'output', content: '  • React.js & Next.js' },
                { type: 'output', content: '  • Node.js & Express' },
                { type: 'output', content: '  • JavaScript/TypeScript' },
                { type: 'output', content: '  • Tailwind CSS' },
                { type: 'output', content: '  • MongoDB & PostgreSQL' }
                ]);
                break;
            case 'projects':
                setHistory(prev => [...prev,
                { type: 'output', content: 'Featured Projects:' },
                { type: 'output', content: '  1. Portfolio Website - Interactive terminal-based portfolio' },
                { type: 'output', content: '  2. E-commerce Platform - Full-stack shopping application' },
                { type: 'output', content: '  3. Task Manager - Real-time collaboration tool' }
                ]);
                break;
            case 'contact':
                setHistory(prev => [...prev,
                { type: 'output', content: 'Contact Information:' },
                { type: 'output', content: '  Email: your.email@example.com' },
                { type: 'output', content: '  GitHub: github.com/yourusername' },
                { type: 'output', content: '  LinkedIn: linkedin.com/in/yourusername' }
                ]);
                break;
            case 'clear':
                setHistory([]);
                break;
            case '':
                // Just add empty line
                break;
            default:
                setHistory(prev => [...prev,
                { type: 'error', content: `Command not found: ${cmd}. Type 'help' for available commands.` }
                ]);
        }

        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleCommand(input);
        }
    };

    if (isMinimized) {
        return null;
    }

    return (
        <Rnd
            ref={rndRef}
            dragHandleClassName="drag-handle"
            default={{
                x: position.x,
                y: position.y,
                width: size.width,
                height: size.height,
            }}
            position={isMaximized ? { x: 0, y: 32 } : position}
            size={isMaximized ? { width: '100vw', height: 'calc(100vh - 32px)' } : size}
            minWidth={400}
            minHeight={300}
            disableDragging={isMaximized}
            enableResizing={!isMaximized}
            onDragStop={(e, d) => {
                setPosition({ x: d.x, y: d.y });
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
                setSize({
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                });
                setPosition(position);
            }}
            bounds="parent"
            style={{ zIndex: 40 }}
        >
            <div className="w-full h-full flex flex-col bg-gray-900 rounded-lg shadow-2xl border border-gray-700 overflow-hidden">
                {/* Window Title Bar - Kali Linux Style */}
                <div className="drag-handle flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700 cursor-grab active:cursor-grabbing">
                    <div className="flex items-center gap-3">
                        {/* Window Control Buttons - Left Side Only */}
                        <div className="flex gap-2">
                            <button
                                onClick={onClose}
                                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors group relative flex items-center justify-center"
                                title="Close"
                            >
                                <X size={10} className="text-black opacity-0 group-hover:opacity-100 transition-opacity absolute" />
                            </button>
                            <button
                                onClick={handleMinimize}
                                className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors group relative flex items-center justify-center"
                                title="Minimize"
                            >
                                <Minus size={10} className="text-black opacity-0 group-hover:opacity-100 transition-opacity absolute" />
                            </button>
                            <button
                                onClick={handleMaximize}
                                className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors group relative flex items-center justify-center"
                                title="Maximize"
                            >
                                <Maximize2 size={10} className="text-black font-bold opacity-0 group-hover:opacity-100 transition-opacity absolute" />
                            </button>
                        </div>
                        <span className="text-sm text-gray-300 font-medium">Terminal</span>
                    </div>
                </div>

                {/* Terminal Content Area */}
                <div
                    className="flex-1 p-4 overflow-y-auto bg-gray-900 text-green-400 font-mono text-sm"
                    onClick={() => inputRef.current?.focus()}
                >
                    <div className="space-y-1">
                        {/* History */}
                        {history.map((item, index) => (
                            <div key={index}>
                                {item.type === 'command' ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-blue-400">guest@portfolio</span>
                                        <span className="text-gray-400">:</span>
                                        <span className="text-purple-400">~</span>
                                        <span className="text-gray-400">$</span>
                                        <span className="text-green-400">{item.content}</span>
                                    </div>
                                ) : item.type === 'error' ? (
                                    <div className="text-red-400">{item.content}</div>
                                ) : (
                                    <div className="text-gray-400">{item.content}</div>
                                )}
                            </div>
                        ))}

                        {/* Current Input Line */}
                        <div className="flex items-center gap-2">
                            <span className="text-blue-400">guest@portfolio</span>
                            <span className="text-gray-400">:</span>
                            <span className="text-purple-400">~</span>
                            <span className="text-gray-400">$</span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1 bg-transparent outline-none text-green-400 caret-green-400"
                                autoFocus
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Rnd>
    );
};

export default TerminalWindow;
