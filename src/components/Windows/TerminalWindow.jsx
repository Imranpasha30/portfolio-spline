import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Maximize2, Minimize2 } from 'lucide-react';

const TerminalWindow = ({ id, isMinimized, onClose, onMinimize, onProjectsOpen,onSkillsOpen, zIndex = 40, offsetX = 100, offsetY = 100, onFocus }) => {
    const [isMaximized, setIsMaximized] = useState(false);
    const [previousSize, setPreviousSize] = useState({ width: 800, height: 500, x: 100, y: 100 });
    const [size, setSize] = useState({ width: 800, height: 500 });

    const rndRef = useRef(null);
    const [position, setPosition] = useState({ x: offsetX, y: offsetY });

    // File system structure
    const fileSystemStructure = {
        '/home/imran': {
            type: 'directory',
            contents: ['Desktop', 'Documents', 'Downloads', 'Pictures', 'script.py', 'notes.txt', 'tools.zip', 'wallpaper.jpg']
        },
        '/home/imran/Desktop': {
            type: 'directory',
            contents: []
        },
        '/home/imran/Documents': {
            type: 'directory',
            contents: ['resume.pdf', 'cover-letter.txt']
        },
        '/home/imran/Downloads': {
            type: 'directory',
            contents: ['installer.exe', 'archive.zip']
        },
        '/home/imran/Pictures': {
            type: 'directory',
            contents: ['photo1.jpg', 'photo2.png', 'screenshot.png']
        }
    };

    // Terminal state
    const [history, setHistory] = useState([
        { type: 'output', content: 'Welcome to Imran Portfolio Terminal v1.0.0' },
        { type: 'output', content: "Type 'help' for available commands" }
    ]);
    const [input, setInput] = useState('');
    const [currentPath, setCurrentPath] = useState('/home/imran');
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
        const trimmedCmd = cmd.trim();
        const parts = trimmedCmd.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        // Add command to history
        setHistory(prev => [...prev, { type: 'command', content: cmd }]);

        // Process commands
        switch (command) {
            case 'help':
                setHistory(prev => [...prev,
                { type: 'output', content: 'Available commands:' },
                { type: 'output', content: '  help     - Show this help message' },
                { type: 'output', content: '  about    - About me' },
                { type: 'output', content: '  skills    - View skills (opens Skills window)' },
                { type: 'output', content: '  projects - View projects' },
                { type: 'output', content: '  contact  - Contact information' },
                { type: 'output', content: '  ls       - List directory contents' },
                { type: 'output', content: '  cd       - Change directory' },
                { type: 'output', content: '  pwd      - Print working directory' },
                { type: 'output', content: '  cat      - Display file contents' },
                { type: 'output', content: '  clear    - Clear terminal' }
                ]);
                break;

            case 'pwd':
                setHistory(prev => [...prev,
                { type: 'output', content: currentPath }
                ]);
                break;

            case 'ls':
                const currentDir = fileSystemStructure[currentPath];
                if (currentDir && currentDir.contents.length > 0) {
                    const items = currentDir.contents.join('  ');
                    setHistory(prev => [...prev,
                    { type: 'output', content: items }
                    ]);
                } else {
                    setHistory(prev => [...prev,
                    { type: 'output', content: '' }
                    ]);
                }
                break;

            case 'cd':
                if (args.length === 0) {
                    setCurrentPath('/home/imran');
                    break;
                }

                const targetPath = args[0];

                if (targetPath === '..') {
                    // Go to parent directory
                    const pathParts = currentPath.split('/').filter(p => p);
                    if (pathParts.length > 2) {
                        pathParts.pop();
                        setCurrentPath('/' + pathParts.join('/'));
                    }
                } else if (targetPath === '~' || targetPath === '/home/imran') {
                    // Go to home directory
                    setCurrentPath('/home/imran');
                } else if (targetPath.startsWith('/')) {
                    // Absolute path
                    if (fileSystemStructure[targetPath]) {
                        setCurrentPath(targetPath);
                    } else {
                        setHistory(prev => [...prev,
                        { type: 'error', content: `cd: ${targetPath}: No such file or directory` }
                        ]);
                    }
                } else {
                    // Relative path
                    const newPath = `${currentPath}/${targetPath}`;
                    if (fileSystemStructure[newPath]) {
                        setCurrentPath(newPath);
                    } else {
                        setHistory(prev => [...prev,
                        { type: 'error', content: `cd: ${targetPath}: No such file or directory` }
                        ]);
                    }
                }
                break;

            case 'cat':
                if (args.length === 0) {
                    setHistory(prev => [...prev,
                    { type: 'error', content: 'cat: missing file operand' }
                    ]);
                } else {
                    const fileName = args[0];
                    // Simulate file contents
                    if (fileName === 'script.py') {
                        setHistory(prev => [...prev,
                        { type: 'output', content: '# Simple Python Script' },
                        { type: 'output', content: 'print("Hello, World!")' },
                        { type: 'output', content: 'print("Welcome to my portfolio!")' }
                        ]);
                    } else if (fileName === 'notes.txt') {
                        setHistory(prev => [...prev,
                        { type: 'output', content: 'Portfolio Ideas:' },
                        { type: 'output', content: '- Add terminal functionality' },
                        { type: 'output', content: '- Create file manager' },
                        { type: 'output', content: '- Add interactive elements' }
                        ]);
                    } else if (fileName === 'resume.pdf') {
                        setHistory(prev => [...prev,
                        { type: 'output', content: 'Resume.pdf - Full Stack Developer' },
                        { type: 'output', content: 'Experience: 3+ years in web development' },
                        { type: 'output', content: 'Skills: React, Node.js, JavaScript, TypeScript' }
                        ]);
                    } else {
                        setHistory(prev => [...prev,
                        { type: 'error', content: `cat: ${fileName}: No such file or directory` }
                        ]);
                    }
                }
                break;

            case 'about':
                setHistory(prev => [...prev,
                { type: 'output', content: 'Hello! I am a Full Stack Developer' },
                { type: 'output', content: 'Passionate about building amazing web experiences' }
                ]);
                break;

            case 'skills':
               onSkillsOpen(); // This will open the Skills window
    setHistory(prev => [...prev,
        { type: 'output', content: 'Opening Skills window...' }
    ]);
    break;

            case 'projects':
                onProjectsOpen();
                setHistory(prev => [...prev,
                { type: 'output', content: 'Opening Projects window...' }
                ]);
                break;

            case 'contact':
                setHistory(prev => [...prev,
                { type: 'output', content: 'Contact Information:' },
                { type: 'output', content: '  Email: imranpasha.ahmed@gmail.com' },
                { type: 'output', content: '  GitHub: github.com/Imranpasha30' },
               
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
                { type: 'error', content: `Command not found: ${command}. Type 'help' for available commands.` }
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
                x: offsetX,
                y: offsetY,
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
            style={{ zIndex: zIndex }}
        >
            <div className="w-full h-full flex flex-col bg-gray-900 rounded-lg shadow-2xl border border-gray-700 overflow-hidden" onMouseDown={onFocus}>
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
                                        <span className="text-blue-400">imran@portfolio</span>
                                        <span className="text-gray-400">:</span>
                                        <span className="text-purple-400">{currentPath === '/home/imran' ? '~' : currentPath.replace('/home/imran', '~')}</span>
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
                            <span className="text-blue-400">imran@portfolio</span>
                            <span className="text-gray-400">:</span>
                            <span className="text-purple-400">{currentPath === '/home/imran' ? '~' : currentPath.replace('/home/imran', '~')}</span>
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
