import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Maximize2, ExternalLink, Github, Sparkles, Star, ArrowUpRight } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const ProjectsWindow = ({ id, isMinimized, onClose, onMinimize, zIndex = 40, offsetX = 200, offsetY = 100, onFocus }) => {
    const [isMaximized, setIsMaximized] = useState(false);
    const [previousSize, setPreviousSize] = useState({ width: 1100, height: 700, x: 200, y: 100 });
    const [size, setSize] = useState({ width: 1100, height: 700 });
    const [position, setPosition] = useState({ x: offsetX, y: offsetY });
    const [selectedFilter, setSelectedFilter] = useState('all');
    const rndRef = useRef(null);

    // Real project data with size variations
    const projects = [
        {
            id: 1,
            title: 'Sharkify.ai',
            description: 'A comprehensive digital marketing automation platform with a full-featured dashboard. Product-based solution offering automated marketing workflows, analytics, and campaign management for businesses.',
            category: 'fullstack',
            tags: ['Node.js', 'Express', 'Angular', 'PostgreSQL', 'Google Cloud', 'Firebase', 'Meta API', 'PayU'],
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
            demo: 'https://sharkify.ai/',
            gradient: 'from-blue-600 via-cyan-500 to-teal-400',
            accentColor: '#06b6d4',
            size: 'large',
            featured: true,
            hasDemo: true
        },
        {
            id: 2,
            title: 'Bose American Academy',
            description: 'Online educational platform enabling instructors to create, sell, and manage courses. Complete e-learning solution with payment integration, course management, and student tracking. Hosted on AWS with S3, RDS, EC2, and Route 53.',
            category: 'fullstack',
            tags: ['Node.js', 'Express', 'Angular', 'PostgreSQL', 'AWS S3', 'AWS RDS', 'AWS EC2', 'Route 53', 'PayU'],
            image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80',
            demo: 'https://boseamerican.academy/',
            gradient: 'from-emerald-600 via-green-500 to-teal-400',
            accentColor: '#10b981',
            size: 'large',
            featured: true,
            hasDemo: true
        },
        {
            id: 3,
            title: 'Kaizer Fit',
            description: 'AI-powered fitness tracking mobile app published on Google Play Store. Features workout tracking, nutrition planning, and progress analytics. AI integration in development for personalized workout recommendations.',
            category: 'mobile',
            tags: ['Flutter', 'FastAPI', 'PostgreSQL', 'Google Cloud', 'Google Maps API', 'AI/ML'],
            image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
            demo: 'https://play.google.com/store/apps/details?id=com.Kaizerfit.gymapp',
            gradient: 'from-orange-600 via-amber-500 to-yellow-400',
            accentColor: '#f59e0b',
            size: 'small',
            hasDemo: true
        },
        {
            id: 4,
            title: 'Editors Dashboard',
            description: 'Advanced content management system with Telegram integration. Extracts videos via Telegram MTP protocol, stores in API video service. Features three portals: Manager (assigns videos), Editor (completes tasks), and Admin (full system overview).',
            category: 'fullstack',
            tags: ['Node.js', 'Express', 'Angular', 'PostgreSQL', 'Telegram API', 'Railway'],
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
            demo: 'https://editorsdashboard-production.up.railway.app/',
            gradient: 'from-purple-600 via-fuchsia-500 to-pink-400',
            accentColor: '#a855f7',
            size: 'medium',
            hasDemo: true
        },
        {
            id: 5,
            title: 'Live Violence Detection',
            description: 'Real-time violence detection system for live streams using machine learning and computer vision. Automatically alerts nearby police stations when violence is detected. Trained model using PyTorch with Telegram integration.',
            category: 'ai',
            tags: ['Python', 'PyTorch', 'Computer Vision', 'Machine Learning', 'Telegram API', 'Real-time Processing'],
            image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
            github: 'https://github.com/Imranpasha30/project.git',
            gradient: 'from-red-600 via-rose-500 to-orange-400',
            accentColor: '#ef4444',
            size: 'large',
            featured: true,
            hasGithub: true
        },
        {
            id: 6,
            title: 'Shyra - AI SEO',
            description: 'AI-powered SEO content wrapper using ChatGPT and Gemini LLM models. Generates SEO-rich metadata, tags, and descriptions for video scripts to optimize search performance.',
            category: 'ai',
            tags: ['Django', 'OpenAI', 'Gemini', 'PostgreSQL', 'Uvicorn', 'Gunicorn'],
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
            github: 'https://github.com/SharkifyTech/Shyra.git',
            gradient: 'from-indigo-600 via-purple-500 to-pink-400',
            accentColor: '#6366f1',
            size: 'small',
            hasGithub: true
        }
    ];

    const categories = [
        { id: 'all', name: 'All Projects', count: projects.length },
        { id: 'fullstack', name: 'Full Stack', count: projects.filter(p => p.category === 'fullstack').length },
        { id: 'ai', name: 'AI/ML', count: projects.filter(p => p.category === 'ai').length },
        { id: 'mobile', name: 'Mobile', count: projects.filter(p => p.category === 'mobile').length },
    ];

    const filteredProjects = selectedFilter === 'all' 
        ? projects 
        : projects.filter(p => p.category === selectedFilter);

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
            minWidth={700}
            minHeight={500}
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
                        <span className="text-sm text-gray-300 font-medium">Projects</span>
                    </div>
                </div>

                {/* Projects Content Area */}
                <div className="flex-1 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex flex-col">
                    {/* Header Section */}
                    <div className="p-6 border-b border-gray-800/50 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 mb-2"
                        >
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                My Projects
                            </h1>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            >
                                <Sparkles className="text-yellow-400" size={28} />
                            </motion.div>
                        </motion.div>
                        <p className="text-gray-400 mb-4">Interactive showcase of innovative solutions</p>
                        
                        {/* Filter Pills */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat, idx) => (
                                <motion.button
                                    key={cat.id}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    onClick={() => setSelectedFilter(cat.id)}
                                    className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all overflow-hidden ${
                                        selectedFilter === cat.id
                                            ? 'text-white'
                                            : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800'
                                    }`}
                                >
                                    {selectedFilter === cat.id && (
                                        <motion.div
                                            layoutId="activeFilter"
                                            className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500"
                                            transition={{ type: "spring", duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        {cat.name}
                                        <span className="text-xs opacity-70">({cat.count})</span>
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Projects Masonry Grid */}
                    <div className="flex-1 overflow-auto p-6">
                        <div className="columns-1 md:columns-2 gap-6 space-y-6">
                            {filteredProjects.map((project, index) => (
                                <ProjectCard key={project.id} project={project} index={index} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Rnd>
    );
};

// Enhanced Project Card with varying heights
const ProjectCard = ({ project, index }) => {
    const cardRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7.5, -7.5]), { stiffness: 300, damping: 30 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7.5, 7.5]), { stiffness: 300, damping: 30 });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXPos = e.clientX - rect.left;
        const mouseYPos = e.clientY - rect.top;
        const xPct = mouseXPos / width - 0.5;
        const yPct = mouseYPos / height - 0.5;
        mouseX.set(xPct);
        mouseY.set(yPct);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
        setIsHovering(false);
    };

    // Dynamic image heights based on size
    const imageHeight = {
        small: 'h-40',
        medium: 'h-52',
        large: 'h-64'
    }[project.size];

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 260,
                damping: 20
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className="relative group cursor-pointer break-inside-avoid mb-6"
        >
            {/* Card Container */}
            <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl hover:shadow-cyan-500/20 transition-shadow duration-500">
                {/* Featured Badge */}
                {project.featured && (
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                        className="absolute top-4 right-4 z-20"
                    >
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                            <Star size={12} fill="currentColor" />
                            Featured
                        </div>
                    </motion.div>
                )}

                {/* Image Container with Parallax */}
                <div className={`relative ${imageHeight} overflow-hidden`}>
                    {/* Gradient Overlay */}
                    <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${project.gradient} mix-blend-overlay z-10`}
                        animate={{
                            opacity: isHovering ? 0.6 : 0.3
                        }}
                        transition={{ duration: 0.3 }}
                    />
                    
                    {/* Image */}
                    <motion.img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        style={{
                            scale: isHovering ? 1.1 : 1,
                            transition: "scale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
                        }}
                    />

                    {/* Animated Glow Effect */}
                    <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                            background: `radial-gradient(circle at ${mouseX.get() * 100 + 50}% ${mouseY.get() * 100 + 50}%, ${project.accentColor}40 0%, transparent 50%)`
                        }}
                    />

                    {/* Hover Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: isHovering ? 1 : 0, y: isHovering ? 0 : 20 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex items-center justify-center gap-4 bg-black/60 backdrop-blur-sm z-20"
                    >
                        {project.hasGithub && (
                            <motion.a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-4 bg-white rounded-full text-gray-900 shadow-xl hover:shadow-2xl transition-shadow"
                            >
                                <Github size={24} />
                            </motion.a>
                        )}
                        {project.hasDemo && (
                            <motion.a
                                href={project.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.1, rotate: -5 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white shadow-xl hover:shadow-2xl transition-shadow"
                            >
                                <ExternalLink size={24} />
                            </motion.a>
                        )}
                    </motion.div>
                </div>

                {/* Content */}
                <div className="p-6" style={{ transform: "translateZ(50px)" }}>
                    <motion.h3 
                        className="text-2xl font-bold text-white mb-3 flex items-center gap-2"
                        animate={{
                            color: isHovering ? project.accentColor : "#ffffff"
                        }}
                    >
                        {project.title}
                        {isHovering && (
                            <motion.span
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                            >
                                <ArrowUpRight size={20} />
                            </motion.span>
                        )}
                    </motion.h3>
                    
                    <p className={`text-gray-400 text-sm mb-4 ${project.size === 'small' ? 'line-clamp-2' : project.size === 'medium' ? 'line-clamp-3' : ''}`}>
                        {project.description}
                    </p>

                    {/* All Tags Visible */}
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ 
                                    delay: index * 0.1 + i * 0.05,
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 15
                                }}
                                whileHover={{ scale: 1.1, y: -2 }}
                                className="px-3 py-1 bg-gray-700/50 backdrop-blur-sm text-gray-300 text-xs rounded-full border border-gray-600/50 hover:border-cyan-500/50 transition-colors"
                            >
                                {tag}
                            </motion.span>
                        ))}
                    </div>
                </div>

                {/* Bottom Glow Bar */}
                <motion.div
                    className={`h-1 bg-gradient-to-r ${project.gradient}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isHovering ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            {/* Floating Shadow Effect */}
            <motion.div
                className={`absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r ${project.gradient} blur-2xl`}
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovering ? 0.3 : 0 }}
                transition={{ duration: 0.5 }}
            />
        </motion.div>
    );
};

export default ProjectsWindow;
