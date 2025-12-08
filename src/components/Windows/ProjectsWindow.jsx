import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Maximize2, ExternalLink, Github, Code2, Sparkles, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectsWindow = ({ id, isMinimized, onClose, onMinimize, zIndex = 40, offsetX = 200, offsetY = 100, onFocus }) => {
    const [isMaximized, setIsMaximized] = useState(false);
    const [previousSize, setPreviousSize] = useState({ width: 1100, height: 700, x: 200, y: 100 });
    const [size, setSize] = useState({ width: 1100, height: 700 });
    const [position, setPosition] = useState({ x: offsetX, y: offsetY });
    const [selectedFilter, setSelectedFilter] = useState('all');
    const rndRef = useRef(null);

    // Dummy project data with varying heights
    const projects = [
        {
            id: 1,
            title: 'E-Commerce Platform',
            description: 'Full-stack e-commerce solution with payment integration, real-time inventory, and admin dashboard. Built with microservices architecture.',
            category: 'fullstack',
            tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
            image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80',
            github: 'https://github.com',
            demo: 'https://demo.com',
            color: 'from-blue-500 to-cyan-500',
            size: 'large', // large card
            featured: true
        },
        {
            id: 2,
            title: 'AI Chatbot',
            description: 'Intelligent chatbot using OpenAI GPT-4 with custom training.',
            category: 'ai',
            tags: ['Python', 'OpenAI', 'LangChain'],
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
            github: 'https://github.com',
            demo: 'https://demo.com',
            color: 'from-purple-500 to-pink-500',
            size: 'small'
        },
        {
            id: 3,
            title: 'Security Scanner Tool',
            description: 'Automated vulnerability scanner for web applications with detailed reporting.',
            category: 'security',
            tags: ['Python', 'Nmap', 'OWASP'],
            image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
            github: 'https://github.com',
            demo: 'https://demo.com',
            color: 'from-red-500 to-orange-500',
            size: 'medium'
        },
        {
            id: 4,
            title: 'Real-Time Analytics',
            description: 'Live data visualization dashboard with WebSocket integration and customizable widgets for business intelligence.',
            category: 'fullstack',
            tags: ['Next.js', 'TypeScript', 'D3.js'],
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
            github: 'https://github.com',
            demo: 'https://demo.com',
            color: 'from-green-500 to-teal-500',
            size: 'large',
            featured: true
        },
        {
            id: 5,
            title: 'Fitness Tracker',
            description: 'Cross-platform mobile app for workout tracking and nutrition.',
            category: 'mobile',
            tags: ['Flutter', 'Firebase'],
            image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
            github: 'https://github.com',
            demo: 'https://demo.com',
            color: 'from-yellow-500 to-orange-500',
            size: 'small'
        },
        {
            id: 6,
            title: 'Cloud Infrastructure Manager',
            description: 'DevOps tool for managing multi-cloud infrastructure with automated deployment.',
            category: 'devops',
            tags: ['AWS', 'Docker', 'Terraform'],
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
            github: 'https://github.com',
            demo: 'https://demo.com',
            color: 'from-indigo-500 to-purple-500',
            size: 'medium'
        },
        {
            id: 7,
            title: 'Social Media Dashboard',
            description: 'Analytics platform for managing multiple social media accounts.',
            category: 'fullstack',
            tags: ['React', 'Express', 'PostgreSQL'],
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
            github: 'https://github.com',
            demo: 'https://demo.com',
            color: 'from-pink-500 to-rose-500',
            size: 'small'
        },
        {
            id: 8,
            title: 'Blockchain Explorer',
            description: 'Web3 application for exploring blockchain transactions and smart contracts with real-time updates.',
            category: 'fullstack',
            tags: ['React', 'Web3.js', 'Ethers.js'],
            image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
            github: 'https://github.com',
            demo: 'https://demo.com',
            color: 'from-cyan-500 to-blue-500',
            size: 'large'
        }
    ];

    const categories = [
        { id: 'all', name: 'All Projects', icon: Sparkles },
        { id: 'fullstack', name: 'Full Stack', icon: Code2 },
        { id: 'ai', name: 'AI/ML', icon: Sparkles },
        { id: 'security', name: 'Security', icon: Code2 },
        { id: 'mobile', name: 'Mobile', icon: Code2 },
        { id: 'devops', name: 'DevOps', icon: Code2 },
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
                <div className="flex-1 overflow-hidden bg-gray-900 flex flex-col">
                    {/* Header Section */}
                    <div className="p-6 border-b border-gray-800">
                        <div className="flex items-center gap-2 mb-2">
                            <h1 className="text-3xl font-bold text-white">My Projects</h1>
                            <Sparkles className="text-yellow-400" size={24} />
                        </div>
                        <p className="text-gray-400">Explore my portfolio of innovative solutions</p>
                        
                        {/* Filter Buttons */}
                        <div className="flex flex-wrap gap-2 mt-4">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedFilter(cat.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        selectedFilter === cat.id
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    {cat.name}
                                </button>
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

// Project Card Component with 3D hover effect and varying sizes
const ProjectCard = ({ project, index }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
    };

    const cardStyle = {
        transform: isHovering
            ? `perspective(1000px) rotateX(${(mousePosition.y - 0.5) * -5}deg) rotateY(${(mousePosition.x - 0.5) * 5}deg) scale3d(1.02, 1.02, 1.02)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    };

    // Dynamic heights based on size
    const heightClass = {
        small: 'h-auto',
        medium: 'h-auto',
        large: 'h-auto'
    }[project.size];

    const imageHeight = {
        small: 'h-32',
        medium: 'h-48',
        large: 'h-64'
    }[project.size];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={cardStyle}
            className={`relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 transition-all duration-300 ease-out group break-inside-avoid mb-6 ${heightClass}`}
        >
            {/* Featured Badge */}
            {project.featured && (
                <div className="absolute top-4 right-4 z-10">
                    <div className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Star size={12} fill="currentColor" />
                        Featured
                    </div>
                </div>
            )}

            {/* Image Section with Reveal Effect */}
            <div className={`relative ${imageHeight} overflow-hidden`}>
                <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-40`}
                    animate={{
                        scale: isHovering ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.4 }}
                />
                <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    animate={{
                        scale: isHovering ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.4 }}
                />
                
                {/* Overlay on hover */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovering ? 1 : 0 }}
                    className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center gap-4"
                >
                    <motion.a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: isHovering ? 0 : 20, opacity: isHovering ? 1 : 0 }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-3 bg-white rounded-full text-gray-900 hover:bg-gray-200 transition-colors"
                    >
                        <Github size={20} />
                    </motion.a>
                    <motion.a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: isHovering ? 0 : 20, opacity: isHovering ? 1 : 0 }}
                        transition={{ delay: 0.15 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-3 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors"
                    >
                        <ExternalLink size={20} />
                    </motion.a>
                </motion.div>

                {/* Animated gradient border on hover */}
                <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none`}
                />
            </div>

            {/* Content Section */}
            <div className={`p-5 ${project.size === 'large' ? 'pb-6' : 'pb-5'}`}>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {project.title}
                </h3>
                <p className={`text-gray-400 text-sm mb-4 ${project.size === 'small' ? 'line-clamp-2' : ''}`}>
                    {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                        <motion.span
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 + i * 0.05 }}
                            className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full hover:bg-gray-600 transition-colors cursor-default"
                        >
                            {tag}
                        </motion.span>
                    ))}
                </div>
            </div>

            {/* Animated shine effect */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                    background: isHovering
                        ? `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255,255,255,0.1) 0%, transparent 50%)`
                        : 'transparent'
                }}
                transition={{ duration: 0.2 }}
            />
        </motion.div>
    );
};

export default ProjectsWindow;
