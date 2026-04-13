import React, { useState, useRef } from 'react';
import { Terminal } from 'lucide-react';
import WindowShell from './WindowShell';

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
    onBrowserOpen,
    zIndex = 40,
    offsetX = 100,
    offsetY = 100,
    onFocus
}) => {
    // File system structure
    const fileSystemStructure = {
        '/home/imran': {
            type: 'directory',
            contents: ['Desktop', 'Documents', 'Downloads', 'Pictures', 'script.py', 'notes.txt', 'tools.zip', 'wallpaper.jpg']
        },
        '/home/imran/Desktop': { type: 'directory', contents: [] },
        '/home/imran/Documents': { type: 'directory', contents: ['resume.pdf', 'cover-letter.txt'] },
        '/home/imran/Downloads': { type: 'directory', contents: ['installer.exe', 'archive.zip'] },
        '/home/imran/Pictures': { type: 'directory', contents: ['photo1.jpg', 'photo2.png', 'screenshot.png'] }
    };

    const [history, setHistory] = useState([
        { type: 'output', content: '\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557' },
        { type: 'output', content: '\u2551   Welcome to Imran Portfolio Terminal v1.0.0          \u2551' },
        { type: 'output', content: '\u2551   Full Stack Developer & Cybersecurity Specialist      \u2551' },
        { type: 'output', content: '\u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d' },
        { type: 'output', content: '' },
        { type: 'output', content: "Type 'help' for available commands" }
    ]);
    const [input, setInput] = useState('');
    const [currentPath, setCurrentPath] = useState('/home/imran');
    const inputRef = useRef(null);

    const handleCommand = (cmd) => {
        const trimmedCmd = cmd.trim();
        const parts = trimmedCmd.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        setHistory(prev => [...prev, { type: 'command', content: cmd }]);

        switch (command) {
            case 'help':
                setHistory(prev => [...prev,
                    { type: 'output', content: '\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 AVAILABLE COMMANDS \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557' },
                    { type: 'output', content: '\u2551                                                                  \u2551' },
                    { type: 'output', content: '\u2551  INFORMATION COMMANDS                                         \u2551' },
                    { type: 'output', content: '\u2551    help       - Show this help message                          \u2551' },
                    { type: 'output', content: '\u2551    about      - About me and my background                      \u2551' },
                    { type: 'output', content: '\u2551    contact    - Contact information (email, GitHub)             \u2551' },
                    { type: 'output', content: '\u2551    neofetch   - System information                              \u2551' },
                    { type: 'output', content: '\u2551                                                                  \u2551' },
                    { type: 'output', content: '\u2551  WINDOW COMMANDS (Open Portfolio Sections)                    \u2551' },
                    { type: 'output', content: '\u2551    skills     - Open Skills & Technologies window               \u2551' },
                    { type: 'output', content: '\u2551    projects   - Open Projects showcase window                   \u2551' },
                    { type: 'output', content: '\u2551    about-me   - Open detailed About Me window                   \u2551' },
                    { type: 'output', content: '\u2551    mail       - Open Mail/Contact window                        \u2551' },
                    { type: 'output', content: '\u2551    files      - Open File Manager window                        \u2551' },
                    { type: 'output', content: '\u2551    code       - Open VS Code editor window                      \u2551' },
                    { type: 'output', content: '\u2551    settings   - Open Settings & Customization window            \u2551' },
                    { type: 'output', content: '\u2551                                                                  \u2551' },
                    { type: 'output', content: '\u2551  FILE SYSTEM COMMANDS                                         \u2551' },
                    { type: 'output', content: '\u2551    ls         - List directory contents                         \u2551' },
                    { type: 'output', content: '\u2551    cd [dir]   - Change directory                                \u2551' },
                    { type: 'output', content: '\u2551    pwd        - Print working directory                         \u2551' },
                    { type: 'output', content: '\u2551    cat [file] - Display file contents                           \u2551' },
                    { type: 'output', content: '\u2551    clear      - Clear terminal screen                           \u2551' },
                    { type: 'output', content: '\u2551    history    - Show command history                            \u2551' },
                    { type: 'output', content: '\u2551                                                                  \u2551' },
                    { type: 'output', content: '\u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d' }
                ]);
                break;

            case 'pwd':
                setHistory(prev => [...prev, { type: 'output', content: currentPath }]);
                break;

            case 'ls':
                const currentDir = fileSystemStructure[currentPath];
                if (currentDir && currentDir.contents.length > 0) {
                    setHistory(prev => [...prev, { type: 'output', content: currentDir.contents.join('  ') }]);
                } else {
                    setHistory(prev => [...prev, { type: 'output', content: '' }]);
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
                        setHistory(prev => [...prev, { type: 'error', content: `cd: ${targetPath}: No such file or directory` }]);
                    }
                } else {
                    const newPath = `${currentPath}/${targetPath}`;
                    if (fileSystemStructure[newPath]) {
                        setCurrentPath(newPath);
                    } else {
                        setHistory(prev => [...prev, { type: 'error', content: `cd: ${targetPath}: No such file or directory` }]);
                    }
                }
                break;

            case 'cat':
                if (args.length === 0) {
                    setHistory(prev => [...prev, { type: 'error', content: 'cat: missing file operand' }]);
                } else {
                    const fileName = args[0];
                    if (fileName === 'script.py') {
                        setHistory(prev => [...prev,
                            { type: 'output', content: '#!/usr/bin/env python3' },
                            { type: 'output', content: '# Portfolio Automation Script' },
                            { type: 'output', content: '' },
                            { type: 'output', content: 'print("Deploying portfolio...")' },
                            { type: 'output', content: 'print("Portfolio deployed successfully!")' }
                        ]);
                    } else if (fileName === 'notes.txt') {
                        setHistory(prev => [...prev,
                            { type: 'output', content: 'Portfolio Development Notes' },
                            { type: 'output', content: '\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501' },
                            { type: 'output', content: '- Add terminal functionality' },
                            { type: 'output', content: '- Create interactive file manager' },
                            { type: 'output', content: '- Build skills visualization' },
                            { type: 'output', content: '- Design projects showcase' }
                        ]);
                    } else if (fileName === 'resume.pdf') {
                        setHistory(prev => [...prev,
                            { type: 'output', content: '\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 RESUME \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557' },
                            { type: 'output', content: '\u2551  Imran Pasha                            \u2551' },
                            { type: 'output', content: '\u2551  Full Stack Developer & Cybersecurity   \u2551' },
                            { type: 'output', content: '\u2551                                         \u2551' },
                            { type: 'output', content: '\u2551  Education:                             \u2551' },
                            { type: 'output', content: '\u2551    - B.Tech Engineering (2024)          \u2551' },
                            { type: 'output', content: '\u2551    - PG Cyber Security - IIT Roorkee    \u2551' },
                            { type: 'output', content: '\u2551    - MBA - SSBM (In Progress)           \u2551' },
                            { type: 'output', content: '\u2551                                         \u2551' },
                            { type: 'output', content: '\u2551  Experience:                            \u2551' },
                            { type: 'output', content: '\u2551    Tech Leader @ Sharkify Technology    \u2551' },
                            { type: 'output', content: '\u2551                                         \u2551' },
                            { type: 'output', content: '\u2551  Skills:                                \u2551' },
                            { type: 'output', content: '\u2551    React, Node.js, Python, TypeScript   \u2551' },
                            { type: 'output', content: '\u2551    AWS, Docker, MongoDB, PostgreSQL     \u2551' },
                            { type: 'output', content: '\u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d' }
                        ]);
                    } else {
                        setHistory(prev => [...prev, { type: 'error', content: `cat: ${fileName}: No such file or directory` }]);
                    }
                }
                break;

            case 'about':
                setHistory(prev => [...prev,
                    { type: 'output', content: '\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557' },
                    { type: 'output', content: '\u2551                    ABOUT ME                          \u2551' },
                    { type: 'output', content: '\u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563' },
                    { type: 'output', content: '\u2551                                                      \u2551' },
                    { type: 'output', content: '\u2551  Hi! I\'m Imran Pasha                              \u2551' },
                    { type: 'output', content: '\u2551                                                      \u2551' },
                    { type: 'output', content: '\u2551  Full Stack Developer                             \u2551' },
                    { type: 'output', content: '\u2551  Cybersecurity Specialist                         \u2551' },
                    { type: 'output', content: '\u2551  Tech Leader @ Sharkify Technology                \u2551' },
                    { type: 'output', content: '\u2551                                                      \u2551' },
                    { type: 'output', content: '\u2551  Passionate about building secure, scalable         \u2551' },
                    { type: 'output', content: '\u2551  web applications and exploring cybersecurity       \u2551' },
                    { type: 'output', content: '\u2551                                                      \u2551' },
                    { type: 'output', content: '\u2551  Currently pursuing:                                \u2551' },
                    { type: 'output', content: '\u2551    - PG Diploma Cybersecurity (IIT Roorkee)         \u2551' },
                    { type: 'output', content: '\u2551    - MBA (SSBM)                                     \u2551' },
                    { type: 'output', content: '\u2551    - CEH Certification Prep                         \u2551' },
                    { type: 'output', content: '\u2551                                                      \u2551' },
                    { type: 'output', content: '\u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d' }
                ]);
                break;

            case 'skills':
                if (onSkillsOpen) {
                    onSkillsOpen();
                    setHistory(prev => [...prev, { type: 'output', content: 'Opening Skills & Technologies window...' }]);
                }
                break;

            case 'projects':
                if (onProjectsOpen) {
                    onProjectsOpen();
                    setHistory(prev => [...prev, { type: 'output', content: 'Opening Projects window...' }]);
                }
                break;

            case 'about-me':
                if (onAboutOpen) {
                    onAboutOpen();
                    setHistory(prev => [...prev, { type: 'output', content: 'Opening About Me window...' }]);
                }
                break;

            case 'mail':
                if (onMailOpen) {
                    onMailOpen();
                    setHistory(prev => [...prev, { type: 'output', content: 'Opening Mail window...' }]);
                }
                break;

            case 'files':
            case 'file-manager':
                if (onFileManagerOpen) {
                    onFileManagerOpen();
                    setHistory(prev => [...prev, { type: 'output', content: 'Opening File Manager...' }]);
                }
                break;

            case 'code':
            case 'vscode':
                if (onVSCodeOpen) {
                    onVSCodeOpen();
                    setHistory(prev => [...prev, { type: 'output', content: 'Opening VS Code editor...' }]);
                }
                break;

            case 'settings':
                if (onSettingsOpen) {
                    onSettingsOpen();
                    setHistory(prev => [...prev, { type: 'output', content: 'Opening Settings window...' }]);
                }
                break;

            case 'firefox':
            case 'browser':
                if (onBrowserOpen) {
                    onBrowserOpen();
                    setHistory(prev => [...prev, { type: 'output', content: 'Opening Firefox browser...' }]);
                }
                break;

            case 'neofetch': {
                const uptime = Math.floor(performance.now() / 1000);
                const mins = Math.floor(uptime / 60);
                const secs = uptime % 60;
                setHistory(prev => [...prev,
                    { type: 'output', content: '' },
                    { type: 'output', content: '        .-/+oossssoo+/-.        imran@portfolio' },
                    { type: 'output', content: '    `:+ssssssssssssssssss+:`    ---------------' },
                    { type: 'output', content: '  -+ssssssssssssssssssyyssss+-  OS: Ubuntu Portfolio 24.04 LTS' },
                    { type: 'output', content: ' .ossssssssssssssssss  dMMMNy  sso. Host: React 19.1.1' },
                    { type: 'output', content: '/sssssssssss  hdmmNNmmyNMMMMh  ssss\\ Kernel: Vite 7.1.7' },
                    { type: 'output', content: '+sssss  hNMMMyhhyyyyhmNMMMNo  ssss+ Uptime: ' + mins + ' min ' + secs + ' sec' },
                    { type: 'output', content: ' ossyNMMMNyMMhsssssshmmmho  sssso  Packages: React, Framer Motion, Tailwind' },
                    { type: 'output', content: '  osss  dmMMMMMMNyyyyt  ssssss+    Shell: bash 5.1' },
                    { type: 'output', content: '   /ossssssyyyyyss  o  sssssso     Resolution: ' + window.innerWidth + 'x' + window.innerHeight },
                    { type: 'output', content: '    /osssssss  MMMMMy  sssssso     DE: Ubuntu Desktop (Web)' },
                    { type: 'output', content: '     `+sssss  oo---.yMMMo  +++     Theme: Dark Glassmorphism' },
                    { type: 'output', content: '      .ssssssssssMMMNh  +++       Icons: Lucide React' },
                    { type: 'output', content: '       -oyyyysss./444-            Terminal: Portfolio Terminal v1.0' },
                    { type: 'output', content: '         `++  /.                  CPU: Your Brain @ Max GHz' },
                    { type: 'output', content: '                                  Memory: Unlimited Potential' },
                    { type: 'output', content: '' },
                ]);
                break;
            }

            case 'history':
                setHistory(prev => {
                    const cmds = prev.filter(h => h.type === 'command');
                    return [...prev,
                        ...cmds.map((c, i) => ({ type: 'output', content: `  ${i + 1}  ${c.content}` }))
                    ];
                });
                break;

            case 'contact':
                setHistory(prev => [...prev,
                    { type: 'output', content: '\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 CONTACT INFO \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557' },
                    { type: 'output', content: '\u2551                                                     \u2551' },
                    { type: 'output', content: '\u2551  Email:                                             \u2551' },
                    { type: 'output', content: '\u2551     imranpasha.ahmed@gmail.com                      \u2551' },
                    { type: 'output', content: '\u2551                                                     \u2551' },
                    { type: 'output', content: '\u2551  GitHub:                                            \u2551' },
                    { type: 'output', content: '\u2551     github.com/Imranpasha30                         \u2551' },
                    { type: 'output', content: '\u2551                                                     \u2551' },
                    { type: 'output', content: '\u2551  LinkedIn:                                          \u2551' },
                    { type: 'output', content: '\u2551     linkedin.com/in/imran-pasha-019b2b213           \u2551' },
                    { type: 'output', content: '\u2551                                                     \u2551' },
                    { type: 'output', content: '\u2551  Instagram:                                         \u2551' },
                    { type: 'output', content: '\u2551     @beast_forge_x                                  \u2551' },
                    { type: 'output', content: '\u2551                                                     \u2551' },
                    { type: 'output', content: '\u2551  TryHackMe:                                         \u2551' },
                    { type: 'output', content: '\u2551     tryhackme.com/p/devilhost666                    \u2551' },
                    { type: 'output', content: '\u2551                                                     \u2551' },
                    { type: 'output', content: '\u2551  Tip: Type "mail" to open the contact window       \u2551' },
                    { type: 'output', content: '\u2551                                                     \u2551' },
                    { type: 'output', content: '\u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d' }
                ]);
                break;

            case 'clear':
                setHistory([]);
                break;

            case '':
                break;

            default:
                setHistory(prev => [...prev,
                    { type: 'error', content: `Command not found: ${command}` },
                    { type: 'output', content: "Type 'help' for available commands." }
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

    return (
        <WindowShell
            id={id}
            title="Terminal - imran@portfolio"
            icon={Terminal}
            isMinimized={isMinimized}
            zIndex={zIndex}
            defaultSize={{ width: 800, height: 500 }}
            defaultPosition={{ x: offsetX, y: offsetY }}
            onClose={onClose}
            onMinimize={onMinimize}
            onFocus={onFocus}
        >
            <div
                className="w-full h-full p-4 overflow-y-auto bg-gray-900 text-green-400 font-mono text-sm"
                onClick={() => inputRef.current?.focus()}
            >
                <div className="space-y-1">
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
        </WindowShell>
    );
};

export default TerminalWindow;
