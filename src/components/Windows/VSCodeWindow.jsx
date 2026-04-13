import React, { useState } from 'react';
import { Play, Square, FileCode, Folder, Search, GitBranch, Settings, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import WindowShell from './WindowShell';

const VSCodeWindow = ({ id, isMinimized, onClose, onMinimize, zIndex = 40, offsetX = 200, offsetY = 100, onFocus }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [selectedFile, setSelectedFile] = useState('security_scanner.py');

  const codeFiles = {
    'security_scanner.py': {
      language: 'Python',
      emoji: '\uD83D\uDC0D',
      code: `#!/usr/bin/env python3
"""
Security Vulnerability Scanner
Author: Imran Pasha
Description: Automated security assessment tool
"""

import socket
import requests
from datetime import datetime


class SecurityScanner:
    def __init__(self, target):
        self.target = target
        self.vulnerabilities = []

    def scan_ports(self, ports=[80, 443, 22, 21, 3306]):
        print(f"[*] Scanning open ports on {self.target}...")
        open_ports = []

        for port in ports:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)
            result = sock.connect_ex((self.target, port))

            if result == 0:
                open_ports.append(port)
                print(f"[+] Port {port} is OPEN")
            sock.close()

        return open_ports

    def check_ssl(self):
        print(f"\\n[*] Checking SSL/TLS configuration...")
        try:
            response = requests.get(f"https://{self.target}", timeout=5)
            if response.status_code == 200:
                print("[+] SSL/TLS is properly configured")
                return True
        except:
            print("[-] SSL/TLS not configured or invalid")
            self.vulnerabilities.append("Missing SSL/TLS")
            return False

    def scan_headers(self):
        print(f"\\n[*] Analyzing security headers...")
        try:
            response = requests.get(f"http://{self.target}", timeout=5)
            headers = response.headers

            security_headers = [
                'X-Frame-Options',
                'X-Content-Type-Options',
                'Strict-Transport-Security',
                'Content-Security-Policy'
            ]

            for header in security_headers:
                if header in headers:
                    print(f"[+] {header}: Present")
                else:
                    print(f"[-] {header}: Missing")
                    self.vulnerabilities.append(f"Missing {header}")
        except Exception as e:
            print(f"[-] Error scanning headers: {e}")

    def generate_report(self):
        print("\\n" + "="*50)
        print("SECURITY SCAN REPORT")
        print("="*50)
        print(f"Target: {self.target}")
        print(f"Scan Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"\\nVulnerabilities Found: {len(self.vulnerabilities)}")

        if self.vulnerabilities:
            print("\\n[!] Issues Detected:")
            for i, vuln in enumerate(self.vulnerabilities, 1):
                print(f"  {i}. {vuln}")
        else:
            print("\\n[✓] No critical vulnerabilities detected!")

        print("="*50)


if __name__ == "__main__":
    print("Security Vulnerability Scanner")
    print("=" * 50)

    scanner = SecurityScanner("example.com")
    scanner.scan_ports()
    scanner.check_ssl()
    scanner.scan_headers()
    scanner.generate_report()

    print("\\n[✓] Scan completed successfully!")`,
      output: `Security Vulnerability Scanner
==================================================
[*] Scanning open ports on example.com...
[+] Port 80 is OPEN
[+] Port 443 is OPEN

[*] Checking SSL/TLS configuration...
[+] SSL/TLS is properly configured

[*] Analyzing security headers...
[+] X-Frame-Options: Present
[+] X-Content-Type-Options: Present
[-] Strict-Transport-Security: Missing
[-] Content-Security-Policy: Missing

==================================================
SECURITY SCAN REPORT
==================================================
Target: example.com
Scan Time: 2025-12-09 14:48:32

Vulnerabilities Found: 2

[!] Issues Detected:
  1. Missing Strict-Transport-Security
  2. Missing Content-Security-Policy
==================================================

[✓] Scan completed successfully!

[Finished in 2.45s]`
    },
    'api_framework.js': {
      language: 'JavaScript',
      emoji: '\u26A1',
      code: `/**
 * RESTful API Framework
 * Built with Express.js & MongoDB
 * Author: Imran Pasha
 */

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

class APIFramework {
    constructor() {
        this.app = express();
        this.setupMiddleware();
        this.setupRoutes();
    }

    setupMiddleware() {
        this.app.use(helmet());

        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100
        });
        this.app.use('/api/', limiter);
        this.app.use(express.json());

        console.log('✓ Security middleware configured');
    }

    setupRoutes() {
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            });
        });

        this.app.post('/api/auth/login', async (req, res) => {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    error: 'Email and password required'
                });
            }

            const token = this.generateToken(email);

            res.json({
                success: true,
                token: token,
                user: { email }
            });
        });

        this.app.get('/api/user/profile',
            this.authenticateToken,
            (req, res) => {
                res.json({
                    user: req.user,
                    profile: {
                        name: 'Imran Pasha',
                        role: 'Full Stack Developer',
                        skills: ['Node.js', 'React', 'MongoDB']
                    }
                });
            }
        );

        console.log('✓ API routes configured');
    }

    generateToken(email) {
        return Buffer.from(email + Date.now()).toString('base64');
    }

    authenticateToken(req, res, next) {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ error: 'Access denied' });
        }
        next();
    }

    async connectDatabase() {
        try {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('✓ Database connected successfully');
        } catch (error) {
            console.error('✗ Database connection failed:', error);
        }
    }

    start(port = 3000) {
        this.app.listen(port, () => {
            console.log(\`API Server running on port \${port}\`);
            console.log(\`Health check: http://localhost:\${port}/health\`);
        });
    }
}

const api = new APIFramework();
api.connectDatabase();
api.start(3000);`,
      output: `✓ Security middleware configured
✓ API routes configured
✓ Database connected successfully
API Server running on port 3000
Health check: http://localhost:3000/health

Server logs:
[INFO] Rate limiter active: 100 requests/15min
[INFO] Helmet security headers enabled
[INFO] JWT authentication ready
[INFO] MongoDB connection pool: 10 connections
[SUCCESS] All systems operational

[Server running - Press Ctrl+C to stop]`
    },
    'react_component.jsx': {
      language: 'React',
      emoji: '\u269B\uFE0F',
      code: `/**
 * Advanced React Component with Hooks
 * Author: Imran Pasha
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PortfolioShowcase = () => {
    const [projects, setProjects] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/projects');
                const data = await response.json();
                setProjects(data);
            } catch (error) {
                console.error('Failed to load projects:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const filteredProjects = useCallback(() => {
        if (filter === 'all') return projects;
        return projects.filter(p => p.category === filter);
    }, [projects, filter]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0, opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-16 h-16 border-4 border-blue-500
                               border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">My Projects</h1>
            <div className="flex gap-4 mb-8">
                {['all', 'web', 'mobile', 'security'].map(cat => (
                    <motion.button
                        key={cat}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setFilter(cat)}
                        className={\`px-6 py-2 rounded-full \${
                            filter === cat
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700'
                        }\`}
                    >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </motion.button>
                ))}
            </div>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <AnimatePresence>
                    {filteredProjects().map(project => (
                        <motion.div
                            key={project.id}
                            variants={itemVariants}
                            layout
                            className="bg-white rounded-lg shadow-lg
                                       overflow-hidden hover:shadow-xl
                                       transition-shadow"
                        >
                            <img src={project.image} alt={project.title}
                                className="w-full h-48 object-cover" />
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">
                                    {project.title}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map(tag => (
                                        <span key={tag}
                                            className="px-3 py-1 bg-blue-100
                                                     text-blue-700 rounded-full text-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default PortfolioShowcase;`,
      output: `✓ Component rendered successfully
✓ React hooks initialized
✓ Animation library loaded
✓ State management active

Component tree:
├─ PortfolioShowcase
│  ├─ FilterButtons (4 items)
│  └─ ProjectGrid
│     ├─ ProjectCard (Web App)
│     ├─ ProjectCard (Mobile App)
│     └─ ProjectCard (Security Tool)

Performance metrics:
- Initial render: 45ms
- Re-render time: 12ms
- Memory usage: 2.4 MB
- Bundle size: 145 KB

[Development server running on http://localhost:5173]`
    }
  };

  const runCode = () => {
    setIsRunning(true);
    setOutput('');
    setTimeout(() => {
      setOutput(codeFiles[selectedFile].output);
      setIsRunning(false);
    }, 1500);
  };

  const stopCode = () => {
    setIsRunning(false);
    setOutput(prev => prev + '\n\n[Process terminated by user]');
  };

  const currentFile = codeFiles[selectedFile];

  return (
    <WindowShell
      id={id}
      title={`${selectedFile} - Portfolio`}
      icon={FileCode}
      isMinimized={isMinimized}
      zIndex={zIndex}
      defaultSize={{ width: 1000, height: 650 }}
      defaultPosition={{ x: offsetX, y: offsetY }}
      minWidth={800}
      minHeight={500}
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      className="!bg-[#1e1e1e] !border-gray-800"
    >
      <div className="flex flex-1 overflow-hidden h-full">
        {/* Sidebar */}
        <div className="w-12 bg-[#333333] border-r border-gray-800 flex flex-col items-center py-3 gap-4">
          <button className="p-2 bg-gray-700 rounded transition-colors" title="Explorer">
            <Folder size={20} className="text-white" />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded transition-colors" title="Search">
            <Search size={20} className="text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded transition-colors" title="Source Control">
            <GitBranch size={20} className="text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded transition-colors" title="Run">
            <Play size={20} className="text-green-400" />
          </button>
          <div className="flex-1" />
          <button className="p-2 hover:bg-gray-700 rounded transition-colors" title="Settings">
            <Settings size={20} className="text-gray-400" />
          </button>
        </div>

        {/* File Explorer */}
        <div className="w-56 bg-[#252526] border-r border-gray-800 overflow-auto">
          <div className="p-2">
            <div className="text-xs text-gray-400 uppercase font-semibold mb-2 px-2">Explorer</div>
            <div className="space-y-1">
              <div className="text-xs font-semibold text-gray-300 px-2 py-1">Portfolio Projects</div>
              <div className="pl-4 space-y-1">
                {Object.keys(codeFiles).map(fileName => (
                  <div key={fileName} onClick={() => setSelectedFile(fileName)}
                    className={`flex items-center gap-2 px-2 py-1 rounded text-xs cursor-pointer ${
                      selectedFile === fileName ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e] text-gray-400'
                    }`}>
                    <span>{codeFiles[fileName].emoji}</span>
                    <span>{fileName}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#2a2d2e] text-gray-400 rounded text-xs cursor-pointer">
                  <span>README.md</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#2a2d2e] text-gray-400 rounded text-xs cursor-pointer">
                  <span>package.json</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Editor and Terminal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 bg-[#1e1e1e] overflow-auto">
            <div className="p-4 font-mono text-sm">
              <pre className="text-gray-300 leading-relaxed">
                <code>
                  {currentFile.code.split('\n').map((line, i) => (
                    <div key={i} className="flex">
                      <span className="text-gray-600 mr-4 select-none w-8 text-right">{i + 1}</span>
                      <span className="syntax-highlight">{highlightSyntax(line, currentFile.language)}</span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>

          <div className="h-64 bg-[#1e1e1e] border-t border-gray-800 flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 bg-[#252526] border-b border-gray-800">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 font-semibold">OUTPUT</span>
                <button onClick={runCode} disabled={isRunning}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                    isRunning ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}>
                  <Play size={12} /> Run
                </button>
                {isRunning && (
                  <button onClick={stopCode}
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white transition-colors">
                    <Square size={12} /> Stop
                  </button>
                )}
              </div>
              <div className="text-xs text-gray-500">{currentFile.language}</div>
            </div>

            <div className="flex-1 overflow-auto p-3 font-mono text-xs">
              {isRunning ? (
                <div className="flex items-center gap-2 text-yellow-400">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full" />
                  Executing {selectedFile}...
                </div>
              ) : output ? (
                <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
              ) : (
                <div className="text-gray-500">Click "Run" to execute the script</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-[#007acc] flex items-center justify-between px-3 text-xs text-white">
        <div className="flex items-center gap-4">
          <span>{currentFile.emoji} {currentFile.language}</span>
          <span>UTF-8</span>
          <span>LF</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Ln {currentFile.code.split('\n').length}, Col 1</span>
          <span>Spaces: 4</span>
        </div>
      </div>
    </WindowShell>
  );
};

const highlightSyntax = (line, language) => {
  if (line.trim().startsWith('#') || line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
    return <span className="text-gray-500">{line}</span>;
  }

  const keywords = {
    Python: ['def', 'class', 'if', 'elif', 'else', 'return', 'for', 'in', 'print', 'import', 'from', 'try', 'except', 'async', 'await'],
    JavaScript: ['const', 'let', 'var', 'function', 'class', 'if', 'else', 'return', 'async', 'await', 'import', 'export', 'require'],
    React: ['const', 'let', 'import', 'export', 'return', 'useState', 'useEffect', 'useCallback', 'from']
  };

  const currentKeywords = keywords[language] || keywords.JavaScript;

  return (
    <span>
      {line.split(/(\s+)/).map((part, i) => {
        if (currentKeywords.includes(part)) {
          return <span key={i} className="text-purple-400">{part}</span>;
        } else if (part.match(/^["'].*["']$/) || part.match(/^`.*`$/)) {
          return <span key={i} className="text-orange-400">{part}</span>;
        } else if (part.match(/^\d+$/)) {
          return <span key={i} className="text-green-400">{part}</span>;
        } else if (part.match(/^[A-Z][a-zA-Z]*$/)) {
          return <span key={i} className="text-yellow-300">{part}</span>;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};

export default VSCodeWindow;
