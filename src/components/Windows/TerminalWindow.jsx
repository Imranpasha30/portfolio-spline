import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Maximize2 } from 'lucide-react';

const TerminalWindow = ({ 
    id, 
    isMinimized, 
    onClose, 
    onMinimize, 
    onProjectsOpen,
    onSkillsOpen,
    onAboutOpen,
    onMailOpen,
    onFileManagerOpen,
    onVSCodeOpen,
    onSettingsOpen,
    zIndex = 40, 
    offsetX = 100, 
    offsetY = 100, 
    onFocus 
}) => {
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
        { type: 'output', content: '╔════════════════════════════════════════════════════════╗' },
        { type: 'output', content: '║   Welcome to Imran Portfolio Terminal v1.0.0          ║' },
        { type: 'output', content: '║   Full Stack Developer & Cybersecurity Specialist      ║' },
        { type: 'output', content: '╚════════════════════════════════════════════════════════╝' },
        { type: 'output', content: '' },
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
                    { type: 'output', content: '╔══════════════════════ AVAILABLE COMMANDS ═══════════════════════╗' },
                    { type: 'output', content: '║                                                                  ║' },
                    { type: 'output', content: '║  📝 INFORMATION COMMANDS                                         ║' },
                    { type: 'output', content: '║    help       - Show this help message                          ║' },
                    { type: 'output', content: '║    about      - About me and my background                      ║' },
                    { type: 'output', content: '║    contact    - Contact information (email, GitHub)             ║' },
                    { type: 'output', content: '║                                                                  ║' },
                    { type: 'output', content: '║  🪟 WINDOW COMMANDS (Open Portfolio Sections)                    ║' },
                    { type: 'output', content: '║    skills     - Open Skills & Technologies window               ║' },
                    { type: 'output', content: '║    projects   - Open Projects showcase window                   ║' },
                    { type: 'output', content: '║    about-me   - Open detailed About Me window                   ║' },
                    { type: 'output', content: '║    mail       - Open Mail/Contact window                        ║' },
                    { type: 'output', content: '║    files      - Open File Manager window                        ║' },
                    { type: 'output', content: '║    code       - Open VS Code editor window                      ║' },
                    { type: 'output', content: '║    settings   - Open Settings & Customization window            ║' },
                    { type: 'output', content: '║                                                                  ║' },
                    { type: 'output', content: '║  📂 FILE SYSTEM COMMANDS                                         ║' },
                    { type: 'output', content: '║    ls         - List directory contents                         ║' },
                    { type: 'output', content: '║    cd [dir]   - Change directory                                ║' },
                    { type: 'output', content: '║    pwd        - Print working directory                         ║' },
                    { type: 'output', content: '║    cat [file] - Display file contents                           ║' },
                    { type: 'output', content: '║    clear      - Clear terminal screen                           ║' },
                    { type: 'output', content: '║                                                                  ║' },
                    { type: 'output', content: '╚══════════════════════════════════════════════════════════════════╝' }
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
                    const pathParts = currentPath.split('/').filter(p => p);
                    if (pathParts.length > 2) {
                        pathParts.pop();
                        setCurrentPath('/' + pathParts.join('/'));
                    }
                } else if (targetPath === '~' || targetPath === '/home/imran') {
                    setCurrentPath('/home/imran');
                } else if (targetPath.startsWith('/')) {
                    if (fileSystemStructure[targetPath]) {
                        setCurrentPath(targetPath);
                    } else {
                        setHistory(prev => [...prev,
                            { type: 'error', content: `cd: ${targetPath}: No such file or directory` }
                        ]);
                    }
                } else {
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
                    if (fileName === 'script.py') {
                        setHistory(prev => [...prev,
                            { type: 'output', content: '#!/usr/bin/env python3' },
                            { type: 'output', content: '# Portfolio Automation Script' },
                            { type: 'output', content: '' },
                            { type: 'output', content: 'print("🚀 Deploying portfolio...")' },
                            { type: 'output', content: 'print("✅ Portfolio deployed successfully!")' }
                        ]);
                    } else if (fileName === 'notes.txt') {
                        setHistory(prev => [...prev,
                            { type: 'output', content: '📝 Portfolio Development Notes' },
                            { type: 'output', content: '━━━━━━━━━━━━━━━━━━━━━━━━━━' },
                            { type: 'output', content: '• Add terminal functionality ✅' },
                            { type: 'output', content: '• Create interactive file manager ✅' },
                            { type: 'output', content: '• Build skills visualization ✅' },
                            { type: 'output', content: '• Design projects showcase ✅' }
                        ]);
                    } else if (fileName === 'resume.pdf') {
                        setHistory(prev => [...prev,
                            { type: 'output', content: '╔═══════════════ RESUME ══════════════════╗' },
                            { type: 'output', content: '║  Imran Pasha                            ║' },
                            { type: 'output', content: '║  Full Stack Developer & Cybersecurity   ║' },
                            { type: 'output', content: '║                                         ║' },
                            { type: 'output', content: '║  🎓 Education:                          ║' },
                            { type: 'output', content: '║    • B.Tech Engineering (2024)          ║' },
                            { type: 'output', content: '║    • PG Cyber Security - IIT Roorkee    ║' },
                            { type: 'output', content: '║    • MBA - SSBM (In Progress)           ║' },
                            { type: 'output', content: '║                                         ║' },
                            { type: 'output', content: '║  💼 Experience:                         ║' },
                            { type: 'output', content: '║    Tech Leader @ Sharkify Technology    ║' },
                            { type: 'output', content: '║                                         ║' },
                            { type: 'output', content: '║  🛠️ Skills:                             ║' },
                            { type: 'output', content: '║    React, Node.js, Python, TypeScript   ║' },
                            { type: 'output', content: '║    AWS, Docker, MongoDB, PostgreSQL     ║' },
                            { type: 'output', content: '╚═════════════════════════════════════════╝' }
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
                    { type: 'output', content: '╔══════════════════════════════════════════════════════╗' },
                    { type: 'output', content: '║                    ABOUT ME                          ║' },
                    { type: 'output', content: '╠══════════════════════════════════════════════════════╣' },
                    { type: 'output', content: '║                                                      ║' },
                    { type: 'output', content: '║  👋 Hi! I\'m Imran Pasha                             ║' },
                    { type: 'output', content: '║                                                      ║' },
                    { type: 'output', content: '║  💻 Full Stack Developer                            ║' },
                    { type: 'output', content: '║  🔒 Cybersecurity Specialist                        ║' },
                    { type: 'output', content: '║  🚀 Tech Leader @ Sharkify Technology               ║' },
                    { type: 'output', content: '║                                                      ║' },
                    { type: 'output', content: '║  Passionate about building secure, scalable         ║' },
                    { type: 'output', content: '║  web applications and exploring cybersecurity       ║' },
                    { type: 'output', content: '║                                                      ║' },
                    { type: 'output', content: '║  📚 Currently pursuing:                             ║' },
                    { type: 'output', content: '║    • PG Diploma Cybersecurity (IIT Roorkee)         ║' },
                    { type: 'output', content: '║    • MBA (SSBM)                                     ║' },
                    { type: 'output', content: '║    • CEH Certification Prep                         ║' },
                    { type: 'output', content: '║                                                      ║' },
                    { type: 'output', content: '╚══════════════════════════════════════════════════════╝' }
                ]);
                break;

            // Window Commands
            case 'skills':
                if (onSkillsOpen) {
                    onSkillsOpen();
                    setHistory(prev => [...prev,
                        { type: 'output', content: '🚀 Opening Skills & Technologies window...' }
                    ]);
                }
                break;

            case 'projects':
                if (onProjectsOpen) {
                    onProjectsOpen();
                    setHistory(prev => [...prev,
                        { type: 'output', content: '🚀 Opening Projects window...' }
                    ]);
                }
                break;

            case 'about-me':
                if (onAboutOpen) {
                    onAboutOpen();
                    setHistory(prev => [...prev,
                        { type: 'output', content: '🚀 Opening About Me window...' }
                    ]);
                }
                break;

            case 'mail':
                if (onMailOpen) {
                    onMailOpen();
                    setHistory(prev => [...prev,
                        { type: 'output', content: '📧 Opening Mail window...' }
                    ]);
                }
                break;

            case 'files':
            case 'file-manager':
                if (onFileManagerOpen) {
                    onFileManagerOpen();
                    setHistory(prev => [...prev,
                        { type: 'output', content: '📁 Opening File Manager...' }
                    ]);
                }
                break;

            case 'code':
            case 'vscode':
                if (onVSCodeOpen) {
                    onVSCodeOpen();
                    setHistory(prev => [...prev,
                        { type: 'output', content: '💻 Opening VS Code editor...' }
                    ]);
                }
                break;

            case 'settings':
                if (onSettingsOpen) {
                    onSettingsOpen();
                    setHistory(prev => [...prev,
                        { type: 'output', content: '⚙️ Opening Settings window...' }
                    ]);
                }
                break;

            case 'contact':
                setHistory(prev => [...prev,
                    { type: 'output', content: '╔═══════════════════ CONTACT INFO ═══════════════════╗' },
                    { type: 'output', content: '║                                                     ║' },
                    { type: 'output', content: '║  📧 Email:                                          ║' },
                    { type: 'output', content: '║     imranpasha.ahmed@gmail.com                      ║' },
                    { type: 'output', content: '║                                                     ║' },
                    { type: 'output', content: '║  🐙 GitHub:                                         ║' },
                    { type: 'output', content: '║     github.com/Imranpasha30                         ║' },
                    { type: 'output', content: '║                                                     ║' },
                    { type: 'output', content: '║  💼 LinkedIn:                                       ║' },
                    { type: 'output', content: '║     linkedin.com/in/imran-pasha-019b2b213           ║' },
                    { type: 'output', content: '║                                                     ║' },
                    { type: 'output', content: '║  📸 Instagram:                                      ║' },
                    { type: 'output', content: '║     @beast_forge_x                                  ║' },
                    { type: 'output', content: '║                                                     ║' },
                    { type: 'output', content: '║  💬 TryHackMe:                                      ║' },
                    { type: 'output', content: '║     tryhackme.com/p/devilhost666                    ║' },
                    { type: 'output', content: '║                                                     ║' },
                    { type: 'output', content: '║  💡 Tip: Type "mail" to open the contact window    ║' },
                    { type: 'output', content: '║                                                     ║' },
                    { type: 'output', content: '╚═════════════════════════════════════════════════════╝' }
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
                    { type: 'error', content: `❌ Command not found: ${command}` },
                    { type: 'output', content: "💡 Type 'help' for available commands." }
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
                {/* Window Title Bar */}
                <div className="drag-handle flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700 cursor-grab active:cursor-grabbing">
                    <div className="flex items-center gap-3">
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
                        <span className="text-sm text-gray-300 font-medium">Terminal - imran@portfolio</span>
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
                                    <div className="text-gray-300">{item.content}</div>
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
