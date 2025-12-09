import React, { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Maximize2, MapPin, Mail, Briefcase, GraduationCap, Award, Download, Github, Linkedin, Twitter, Coffee, Code, Zap, Heart, School, BookOpen, Shield, Instagram, Check } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';

const AboutWindow = ({ id, isMinimized, onClose, onMinimize, zIndex = 40, offsetX = 180, offsetY = 120, onFocus }) => {
    const [isMaximized, setIsMaximized] = useState(false);
    const [previousSize, setPreviousSize] = useState({ width: 1000, height: 700, x: 180, y: 120 });
    const [size, setSize] = useState({ width: 1000, height: 700 });
    const [position, setPosition] = useState({ x: offsetX, y: offsetY });
    const [activeTab, setActiveTab] = useState('overview');
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadComplete, setDownloadComplete] = useState(false);
    const rndRef = useRef(null);

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

    // Download Resume Function with Progress Animation
    const handleDownloadResume = async () => {
        if (isDownloading) return;

        setIsDownloading(true);
        setDownloadProgress(0);
        setDownloadComplete(false);

        try {
            // Simulate download progress
            const interval = setInterval(() => {
                setDownloadProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 100);

            // Wait for progress to complete
            await new Promise(resolve => setTimeout(resolve, 1100));

            // Create download link
            const link = document.createElement('a');
            link.href = '/documents/imranpasha_resume.pdf';
            link.download = 'Imran_Pasha_Resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Show success state
            setDownloadComplete(true);

            // Reset after 2 seconds
            setTimeout(() => {
                setIsDownloading(false);
                setDownloadProgress(0);
                setDownloadComplete(false);
            }, 2000);

        } catch (error) {
            console.error('Download failed:', error);
            setIsDownloading(false);
            setDownloadProgress(0);
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
            minWidth={800}
            minHeight={600}
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
            <div
                className="w-full h-full flex flex-col bg-gray-900 rounded-lg shadow-2xl border border-gray-700 overflow-hidden"
                onMouseDown={onFocus}
            >
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
                        <span className="text-sm text-gray-300 font-medium">About Me</span>
                    </div>
                </div>

                {/* About Content Area */}
                <div className="flex-1 overflow-auto bg-gray-900">
                    {/* Hero Section with Network Animation */}
                    <div className="relative bg-black p-8 overflow-hidden">
                        {/* Network Animation Background */}
                        <NetworkBackground />

                        <div className="relative z-10 flex flex-col items-center justify-center text-center">
                            {/* Intro Text */}
                            <div className="max-w-3xl">
                                <motion.h1
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="text-5xl font-bold text-white mb-3"
                                >
                                    Hi, I'm Imran pasha
                                </motion.h1>
                                <motion.p
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-2xl mb-6"
                                >
                                    <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                                        Full Stack Developer & Cybersecurity Specialist
                                    </span>
                                </motion.p>
                                <motion.div
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex flex-wrap gap-6 justify-center mb-6"
                                >
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <MapPin size={18} className="text-cyan-400" />
                                        <span>India</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Briefcase size={18} className="text-green-400" />
                                        <span>Tech Leader at Sharkify Technology</span>
                                    </div>
                                </motion.div>

                                {/* Social Links */}
                                <motion.div
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex gap-3 justify-center mb-6"
                                >
                                    <SocialButton icon={<Github size={20} />} href="https://github.com/Imranpasha30" />
                                    <SocialButton icon={<Linkedin size={20} />} href="https://www.linkedin.com/in/imran-pasha-019b2b213" />
                                    <SocialButton icon={<Instagram size={20} />} href="https://www.instagram.com/beast_forge_x?utm_source=qr&igsh=c2hzbWMxYTR3Y2R2" />
                                </motion.div>

                                {/* TryHackMe Badge */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.35, type: 'spring' }}
                                    className="flex justify-center mb-6"
                                >
                                    <TryHackMeBadge />
                                </motion.div>

                                {/* Download Resume Button with Progress */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.4, type: 'spring' }}
                                    className="mx-auto"
                                >
                                    <DownloadButton
                                        onClick={handleDownloadResume}
                                        isDownloading={isDownloading}
                                        downloadProgress={downloadProgress}
                                        downloadComplete={downloadComplete}
                                    />
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-4 gap-4 p-6 bg-gray-800/50">
                        <StatCard number="15+" label="Projects" icon={<Code />} delay={0} />
                        <StatCard number="1+" label="Year Experience" icon={<Briefcase />} delay={0.1} />
                        <StatCard number="500+" label="Commits" icon={<Github />} delay={0.2} />
                        <StatCard number="3" label="Degrees Pursuing" icon={<GraduationCap />} delay={0.3} />
                    </div>

                    {/* Main Content */}
                    <div className="p-6">
                        {/* Tab Navigation */}
                        <div className="flex gap-2 mb-6 border-b border-gray-700">
                            <TabButton 
                                active={activeTab === 'overview'} 
                                onClick={() => setActiveTab('overview')}
                                icon={<Heart size={16} />}
                            >
                                Overview
                            </TabButton>
                            <TabButton 
                                active={activeTab === 'journey'} 
                                onClick={() => setActiveTab('journey')}
                                icon={<GraduationCap size={16} />}
                            >
                                My Journey
                            </TabButton>
                            <TabButton 
                                active={activeTab === 'achievements'} 
                                onClick={() => setActiveTab('achievements')}
                                icon={<Award size={16} />}
                            >
                                Achievements
                            </TabButton>
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'overview' && <OverviewTab />}
                        {activeTab === 'journey' && <JourneyTab />}
                        {activeTab === 'achievements' && <AchievementsTab />}
                    </div>
                </div>
            </div>
        </Rnd>
    );
};

// Download Button Component with Progress Animation
const DownloadButton = ({ onClick, isDownloading, downloadProgress, downloadComplete }) => {
    return (
        <motion.button
            onClick={onClick}
            disabled={isDownloading}
            whileHover={!isDownloading ? { scale: 1.05 } : {}}
            whileTap={!isDownloading ? { scale: 0.95 } : {}}
            className={`relative px-8 py-4 font-bold rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto overflow-hidden ${
                downloadComplete
                    ? 'bg-green-500 hover:shadow-green-500/50'
                    : isDownloading
                    ? 'bg-blue-600 cursor-wait'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-cyan-500/50'
            }`}
            style={{ minWidth: '220px' }}
        >
            {/* Progress Bar Background */}
            {isDownloading && (
                <motion.div
                    className="absolute inset-0 bg-cyan-400 opacity-30"
                    initial={{ width: '0%' }}
                    animate={{ width: `${downloadProgress}%` }}
                    transition={{ duration: 0.1 }}
                />
            )}

            {/* Button Content */}
            <div className="relative z-10 flex items-center gap-2 text-white">
                {downloadComplete ? (
                    <>
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring' }}
                        >
                            <Check size={20} />
                        </motion.div>
                        <span>Downloaded!</span>
                    </>
                ) : isDownloading ? (
                    <>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        >
                            <Download size={20} />
                        </motion.div>
                        <span>Downloading {downloadProgress}%</span>
                    </>
                ) : (
                    <>
                        <Download size={20} />
                        <span>Download Resume</span>
                    </>
                )}
            </div>
        </motion.button>
    );
};

// TryHackMe Badge Component
const TryHackMeBadge = () => {
    const handleClick = () => {
        window.open('https://tryhackme.com/p/devilhost666', '_blank');
    };

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className="cursor-pointer"
            style={{
                width: '329px',
                height: '88px',
                backgroundImage: "url('https://tryhackme.com/img/thm_public_badge_bg.svg')",
                backgroundSize: 'cover',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                userSelect: 'none',
                borderRadius: '12px',
                padding: '10px'
            }}
        >
            {/* Avatar */}
            <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(to bottom left, #a3ea2a, #2e4463)',
                padding: '2px'
            }}>
                <div style={{
                    backgroundImage: 'url(https://tryhackme-images.s3.amazonaws.com/user-avatars/6238a9fb2f7dfd0051da9557-1757759603692)',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: '#121212'
                }} />
            </div>

            {/* User Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Name and Rank */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                        fontFamily: 'Ubuntu, sans-serif',
                        fontWeight: 500,
                        fontSize: '14px',
                        color: '#f9f9fb'
                    }}>
                        devilhost666
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ color: '#ffbb45', fontSize: '10px' }}>⚡</span>
                        <span style={{
                            fontFamily: 'Ubuntu, sans-serif',
                            fontWeight: 500,
                            fontSize: '12px',
                            color: '#ffffff'
                        }}>
                            [0x8]
                        </span>
                    </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ color: '#9ca4b4', fontSize: '11px' }}>🏆</span>
                        <span style={{
                            fontFamily: 'Ubuntu, sans-serif',
                            fontSize: '11px',
                            color: '#ffffff'
                        }}>
                            206381
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ color: '#a3ea2a', fontSize: '11px' }}>🔥</span>
                        <span style={{
                            fontFamily: 'Ubuntu, sans-serif',
                            fontSize: '11px',
                            color: '#ffffff'
                        }}>
                            0 days
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ color: '#d752ff', fontSize: '11px' }}>🏅</span>
                        <span style={{
                            fontFamily: 'Ubuntu, sans-serif',
                            fontSize: '11px',
                            color: '#ffffff'
                        }}>
                            9
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ color: '#719cf9', fontSize: '11px' }}>🚪</span>
                        <span style={{
                            fontFamily: 'Ubuntu, sans-serif',
                            fontSize: '11px',
                            color: '#ffffff'
                        }}>
                            49
                        </span>
                    </div>
                </div>

                {/* Link */}
                <a 
                    href="https://tryhackme.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        fontFamily: 'Ubuntu, sans-serif',
                        fontSize: '11px',
                        color: '#f9f9fb',
                        textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                >
                    tryhackme.com
                </a>
            </div>
        </motion.div>
    );
};

// Network Animation Component
const NetworkBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const particles = [];
        const particleCount = 50;
        const maxDistance = 150;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle, i) => {
                particle.update();
                particle.draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particle.x - particles[j].x;
                    const dy = particle.y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(59, 130, 246, ${1 - distance / maxDistance})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(animate);
        }

        animate();

        const handleResize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ opacity: 0.3 }}
        />
    );
};

// Social Button Component
const SocialButton = ({ icon, href }) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-400 transition-colors"
    >
        {icon}
    </motion.a>
);

// Stat Card Component with Counter Animation
const StatCard = ({ number, label, icon, delay }) => {
    const [count, setCount] = useState(0);
    const targetNumber = parseInt(number);

    useEffect(() => {
        let start = 0;
        const duration = 2000;
        const increment = targetNumber / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= targetNumber) {
                setCount(targetNumber);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [targetNumber]);

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay }}
            className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-center hover:border-cyan-500 transition-colors group"
        >
            <div className="text-cyan-400 mb-2 flex justify-center group-hover:scale-110 transition-transform">{icon}</div>
            <div className="text-3xl font-bold text-white mb-1">{count}{number.includes('+') ? '+' : ''}</div>
            <div className="text-sm text-gray-400">{label}</div>
        </motion.div>
    );
};

// Tab Button
const TabButton = ({ active, onClick, children, icon }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 font-medium transition-all flex items-center gap-2 ${
            active
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-gray-300'
        }`}
    >
        {icon}
        {children}
    </button>
);

// Overview Tab
const OverviewTab = () => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
    >
        <div>
            <h2 className="text-2xl font-bold text-white mb-4">About Me</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
                I'm a passionate Full Stack Developer and Cybersecurity Specialist currently serving as a Tech Leader at Sharkify Technology. 
                My journey in tech combines strong educational foundations with hands-on experience in building secure, scalable applications.
            </p>
            <p className="text-gray-300 leading-relaxed">
                With a B.Tech in Engineering and currently pursuing PG Diploma in Cybersecurity from IIT Roorkee (i-HUB), alongside an MBA 
                from SSBM, I bring a unique blend of technical expertise and business acumen. I'm preparing for my CEH certification and 
                constantly expanding my skills in full-stack development and security.
            </p>
        </div>

        <div>
            <h3 className="text-xl font-bold text-white mb-4">What I Do Best</h3>
            <div className="grid grid-cols-2 gap-4">
                <SkillHighlight
                    title="Full Stack Development"
                    description="Building end-to-end web applications with modern frameworks"
                    gradient="from-blue-500 to-cyan-500"
                />
                <SkillHighlight
                    title="Cybersecurity"
                    description="Securing applications and preparing for CEH certification"
                    gradient="from-red-500 to-orange-500"
                />
                <SkillHighlight
                    title="Technical Leadership"
                    description="Leading projects and mentoring development teams"
                    gradient="from-green-500 to-teal-500"
                />
                <SkillHighlight
                    title="Cloud & DevOps"
                    description="Deploying scalable solutions on AWS and GCP"
                    gradient="from-purple-500 to-pink-500"
                />
            </div>
        </div>
    </motion.div>
);

// Journey Tab with Timeline
const JourneyTab = () => {
    const timeline = [
        {
            year: '2025 - Present',
            title: 'Tech Leader',
            company: 'Sharkify Technology',
            description: 'Promoted from Developer to Tech Leader, leading project development and team management',
            icon: <Briefcase size={20} />,
            color: 'blue'
        },
        {
            year: '2025 - 2026',
            title: 'MBA in Progress',
            company: 'SSBM School of Business Management',
            description: 'Pursuing MBA to complement technical skills with business strategy',
            icon: <BookOpen size={20} />,
            color: 'purple'
        },
        {
            year: '2025',
            title: 'PG Diploma - Cybersecurity',
            company: 'IIT Roorkee (i-HUB)',
            description: 'Specializing in cybersecurity and preparing for CEH certification',
            icon: <Shield size={20} />,
            color: 'red'
        },
        {
            year: '2024',
            title: 'B.Tech in Engineering',
            company: 'Shridevi Institute of Engineering & Technology',
            description: 'Completed Bachelor of Technology in Engineering',
            icon: <GraduationCap size={20} />,
            color: 'green'
        },
        {
            year: '2019',
            title: 'Pre-University Education',
            company: 'Hassan Public PU College',
            description: 'Completed secondary education',
            icon: <School size={20} />,
            color: 'orange'
        },
        {
            year: '2016',
            title: 'High School',
            company: 'Rotary English School',
            description: 'Completed 10th grade education',
            icon: <School size={20} />,
            color: 'cyan'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
        >
            <h2 className="text-2xl font-bold text-white mb-6">My Journey</h2>
            <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 to-blue-500" />

                {timeline.map((item, index) => (
                    <TimelineItem key={index} item={item} index={index} />
                ))}
            </div>
        </motion.div>
    );
};

// Timeline Item
const TimelineItem = ({ item, index }) => {
    const colors = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        purple: 'bg-purple-500',
        orange: 'bg-orange-500',
        red: 'bg-red-500',
        cyan: 'bg-cyan-500'
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="relative pl-20 pb-8 group"
        >
            {/* Timeline Icon */}
            <div className={`absolute left-0 w-16 h-16 ${colors[item.color]} rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                {item.icon}
            </div>

            {/* Content Card */}
            <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 hover:border-cyan-500 transition-colors">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-xl font-bold text-white">{item.title}</h3>
                        <p className="text-cyan-400 text-sm">{item.company}</p>
                    </div>
                    <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm font-semibold">
                        {item.year}
                    </span>
                </div>
                <p className="text-gray-400">{item.description}</p>
            </div>
        </motion.div>
    );
};

// Achievements Tab
const AchievementsTab = () => {
    const achievements = [
        { title: 'Promoted to Tech Leader', icon: '🚀', color: 'from-blue-500 to-cyan-500' },
        { title: 'IIT Roorkee(i-HUB) - Cybersecurity', icon: '🔒', color: 'from-red-500 to-orange-500' },
        { title: 'Leading Development Projects', icon: '💻', color: 'from-green-500 to-teal-500' },
        { title: 'CEH Preparation', icon: '🛡️', color: 'from-purple-500 to-pink-500' },
        { title: 'Pursuing MBA', icon: '🎓', color: 'from-yellow-500 to-orange-500' },
        { title: 'Built 15+ Projects', icon: '⚡', color: 'from-indigo-500 to-purple-500' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
        >
            <h2 className="text-2xl font-bold text-white mb-6">Achievements & Milestones</h2>
            <div className="grid grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                    <motion.div
                        key={index}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: index * 0.1, type: 'spring' }}
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        className={`bg-gradient-to-br ${achievement.color} p-6 rounded-xl text-center cursor-pointer`}
                    >
                        <div className="text-4xl mb-2">{achievement.icon}</div>
                        <h3 className="text-white font-bold">{achievement.title}</h3>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

// Skill Highlight Component
const SkillHighlight = ({ title, description, gradient }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        className={`bg-gradient-to-br ${gradient} p-4 rounded-xl text-white`}
    >
        <h4 className="font-bold mb-1">{title}</h4>
        <p className="text-sm text-white/80">{description}</p>
    </motion.div>
);

export default AboutWindow;
