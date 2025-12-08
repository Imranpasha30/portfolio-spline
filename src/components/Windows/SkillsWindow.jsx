import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Maximize2, Code, Database, Wrench, Globe, Cloud, Home as HomeIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiHtml5,
  SiCss3,
  SiMongodb,
  SiPostgresql,
  SiRust,
  SiGraphql,
  SiDocker,
  SiGit,
  SiGithub,
  SiAmazon,
  SiLinux,
  SiFirebase,
  SiFigma,
  SiWebpack,
  SiNpm,
} from 'react-icons/si';

const SkillsWindow = ({ id, isMinimized, onClose, onMinimize, zIndex = 40, offsetX = 160, offsetY = 90, onFocus }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [previousSize, setPreviousSize] = useState({ width: 1100, height: 700, x: 160, y: 90 });
  const [size, setSize] = useState({ width: 1100, height: 700 });
  const [position, setPosition] = useState({ x: offsetX, y: offsetY });
  const [selectedCategory, setSelectedCategory] = useState('home');
  const rndRef = useRef(null);

  // Skills Data for Orbiting Animation with brand colors
  const orbitSkills = {
    orbit1: [
      { name: 'React', icon: <SiReact />, color: '#61DAFB' },
      { name: 'Next.js', icon: <SiNextdotjs />, color: '#000000' },
      { name: 'JavaScript', icon: <SiJavascript />, color: '#F7DF1E' },
      { name: 'TypeScript', icon: <SiTypescript />, color: '#3178C6' },
      { name: 'HTML5', icon: <SiHtml5 />, color: '#E34F26' },
      { name: 'CSS3', icon: <SiCss3 />, color: '#1572B6' },
      { name: 'Tailwind', icon: <SiTailwindcss />, color: '#06B6D4' },
    ],
    orbit2: [
      { name: 'Node.js', icon: <SiNodedotjs />, color: '#339933' },
      { name: 'MongoDB', icon: <SiMongodb />, color: '#47A248' },
      { name: 'PostgreSQL', icon: <SiPostgresql />, color: '#4169E1' },
      { name: 'GraphQL', icon: <SiGraphql />, color: '#E10098' },
      { name: 'Rust', icon: <SiRust />, color: '#000000' },
    ],
    orbit3: [
      { name: 'Docker', icon: <SiDocker />, color: '#2496ED' },
      { name: 'Git', icon: <SiGit />, color: '#F05032' },
      { name: 'GitHub', icon: <SiGithub />, color: '#181717' },
      { name: 'AWS', icon: <SiAmazon />, color: '#FF9900' },
      { name: 'Linux', icon: <SiLinux />, color: '#FCC624' },
      { name: 'Firebase', icon: <SiFirebase />, color: '#FFCA28' },
      { name: 'VS Code', icon: '💻', color: '#007ACC' },
      { name: 'Webpack', icon: <SiWebpack />, color: '#8DD6F9' },
      { name: 'NPM', icon: <SiNpm />, color: '#CB3837' },
      { name: 'Figma', icon: <SiFigma />, color: '#F24E1E' },
    ],
  };

  // Skills Data for Detail Tabs
  const skillsData = {
    frontend: {
      icon: Code,
      color: 'blue',
      skills: [
        { name: 'React.js', level: 90, icon: <SiReact style={{ color: '#61DAFB' }} /> },
        { name: 'JavaScript', level: 85, icon: <SiJavascript style={{ color: '#F7DF1E' }} /> },
        { name: 'TypeScript', level: 80, icon: <SiTypescript style={{ color: '#3178C6' }} /> },
        { name: 'Tailwind CSS', level: 90, icon: <SiTailwindcss style={{ color: '#06B6D4' }} /> },
        { name: 'Next.js', level: 75, icon: <SiNextdotjs style={{ color: '#000000' }} /> },
        { name: 'HTML5/CSS3', level: 95, icon: <SiHtml5 style={{ color: '#E34F26' }} /> },
      ]
    },
    backend: {
      icon: Database,
      color: 'green',
      skills: [
        { name: 'Node.js', level: 85, icon: <SiNodedotjs style={{ color: '#339933' }} /> },
        { name: 'Express.js', level: 80, icon: '🚂' },
        { name: 'MongoDB', level: 75, icon: <SiMongodb style={{ color: '#47A248' }} /> },
        { name: 'PostgreSQL', level: 70, icon: <SiPostgresql style={{ color: '#4169E1' }} /> },
        { name: 'REST APIs', level: 85, icon: '🔌' },
        { name: 'GraphQL', level: 65, icon: <SiGraphql style={{ color: '#E10098' }} /> },
      ]
    },
    tools: {
      icon: Wrench,
      color: 'purple',
      skills: [
        { name: 'Git & GitHub', level: 90, icon: <SiGithub style={{ color: '#181717' }} /> },
        { name: 'VS Code', level: 95, icon: '💻' },
        { name: 'Docker', level: 60, icon: <SiDocker style={{ color: '#2496ED' }} /> },
        { name: 'Webpack', level: 70, icon: <SiWebpack style={{ color: '#8DD6F9' }} /> },
        { name: 'NPM/Yarn', level: 85, icon: <SiNpm style={{ color: '#CB3837' }} /> },
        { name: 'Figma', level: 75, icon: <SiFigma style={{ color: '#F24E1E' }} /> },
      ]
    },
    other: {
      icon: Cloud,
      color: 'orange',
      skills: [
        { name: 'AWS', level: 65, icon: <SiAmazon style={{ color: '#FF9900' }} /> },
        { name: 'Firebase', level: 70, icon: <SiFirebase style={{ color: '#FFCA28' }} /> },
        { name: 'Linux', level: 75, icon: <SiLinux style={{ color: '#FCC624' }} /> },
        { name: 'CI/CD', level: 60, icon: '🔄' },
        { name: 'Responsive Design', level: 90, icon: '📱' },
        { name: 'Performance Optimization', level: 80, icon: '⚡' },
      ]
    }
  };

  const categories = [
    { id: 'home', name: 'Home', icon: HomeIcon },
    { id: 'frontend', name: 'Frontend', icon: Code },
    { id: 'backend', name: 'Backend', icon: Database },
    { id: 'tools', name: 'Tools & DevOps', icon: Wrench },
    { id: 'other', name: 'Other', icon: Cloud },
  ];

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

  const getColorClass = (category) => {
    const colors = {
      frontend: 'blue',
      backend: 'green',
      tools: 'purple',
      other: 'orange'
    };
    return colors[category] || 'blue';
  };

  // Arc Orbiting Skills Component
  const ArcOrbitSkills = () => {
    return (
      <div className="absolute bottom-0 left-0 right-0 h-96 overflow-hidden pointer-events-none">
        {/* Orbit 1 - Inner Arc (Frontend) */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ width: '500px', height: '500px', bottom: '-380px' }}
        >
          <svg className="absolute inset-0 w-full h-full">
            <circle
              cx="250"
              cy="250"
              r="248"
              fill="none"
              stroke="rgba(59, 130, 246, 0.3)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          </svg>

          <motion.div
            className="absolute inset-0"
            style={{ transformOrigin: '50% 50%' }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 350, ease: 'linear' }}
          >
            {orbitSkills.orbit1.map((skill, i) => {
              const angle = (i / (orbitSkills.orbit1.length - 1)) * 180;
              const radius = 248;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;

              return (
                <div
                  key={skill.name}
                  className="absolute"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% - ${y}px)`,
                  }}
                >
                  <motion.div
                    className="w-14 h-14 bg-gray-800 border-2 border-blue-500 rounded-xl flex flex-col items-center justify-center shadow-lg -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    whileHover={{ scale: 1.15 }}
                  >
                    <span className="text-xl" style={{ color: skill.color }}>{skill.icon}</span>
                    <span className="text-[8px] font-semibold text-white mt-0.5">
                      {skill.name}
                    </span>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Orbit 2 - Middle Arc (Backend) */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ width: '700px', height: '700px', bottom: '-460px' }}
        >
          <svg className="absolute inset-0 w-full h-full">
            <circle
              cx="350"
              cy="350"
              r="348"
              fill="none"
              stroke="rgba(16, 185, 129, 0.3)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          </svg>

          <motion.div
            className="absolute inset-0"
            style={{ transformOrigin: '50% 50%' }}
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 480, ease: 'linear' }}
          >
            {orbitSkills.orbit2.map((skill, i) => {
              const angle = (i / (orbitSkills.orbit2.length - 1)) * 180;
              const radius = 348;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;

              return (
                <div
                  key={skill.name}
                  className="absolute"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% - ${y}px)`,
                  }}
                >
                  <motion.div
                    className="w-13 h-13 bg-gray-800 border-2 border-green-500 rounded-xl flex flex-col items-center justify-center shadow-lg -translate-x-1/2 -translate-y-1/2 cursor-pointer px-2 py-2"
                    whileHover={{ scale: 1.15 }}
                  >
                    <span className="text-lg" style={{ color: skill.color }}>{skill.icon}</span>
                    <span className="text-[7px] font-semibold text-white">
                      {skill.name}
                    </span>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Orbit 3 - Outer Arc (Tools) */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ width: '900px', height: '900px', bottom: '-540px' }}
        >
          <svg className="absolute inset-0 w-full h-full">
            <circle
              cx="450"
              cy="450"
              r="448"
              fill="none"
              stroke="rgba(168, 85, 247, 0.3)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          </svg>

          <motion.div
            className="absolute inset-0"
            style={{ transformOrigin: '50% 50%' }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 790, ease: 'linear' }}
          >
            {orbitSkills.orbit3.map((skill, i) => {
              const angle = (i / (orbitSkills.orbit3.length - 1)) * 180;
              const radius = 448;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;

              return (
                <div
                  key={skill.name}
                  className="absolute"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% - ${y}px)`,
                  }}
                >
                  <motion.div
                    className="w-12 h-12 bg-gray-800 border-2 border-purple-500 rounded-xl flex flex-col items-center justify-center shadow-lg -translate-x-1/2 -translate-y-1/2 cursor-pointer px-1"
                    whileHover={{ scale: 1.15 }}
                  >
                    <span className="text-base" style={{ color: skill.color }}>{skill.icon}</span>
                    <span className="text-[6px] font-semibold text-white text-center">
                      {skill.name}
                    </span>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    );
  };

  if (isMinimized) return null;

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
      onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
      onResizeStop={(e, direction, ref, delta, pos) => {
        setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
        setPosition(pos);
      }}
      bounds="parent"
      style={{ zIndex }}
    >
      <div
        className="w-full h-full flex flex-col bg-gray-900 rounded-lg shadow-2xl border border-gray-700 overflow-hidden"
        onMouseDown={onFocus}
      >
        {/* Title bar */}
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
                onClick={onMinimize}
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
            <span className="text-sm text-gray-300 font-medium">Skills & Technologies</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-56 bg-gray-800 border-r border-gray-700 p-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">Categories</h3>
            <div className="space-y-1">
              {categories.map(category => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main area */}
          <div className="flex-1 overflow-hidden bg-gray-900 relative">
            {selectedCategory === 'home' ? (
              <div className="h-full flex flex-col relative">
                {/* Text block */}
                <div className="pt-10 px-8 pb-8 flex flex-col items-start text-left z-10">
                  <h1 className="text-5xl font-bold text-white mb-4">My Skills</h1>
                  <p className="text-gray-200 text-lg max-w-3xl leading-relaxed mb-6">
                    I'm a Full Stack Developer with a strong foundation in building scalable web applications. 
                    Currently making an exciting career transformation into Cybersecurity, combining my development 
                    expertise with security principles. My unique blend of skills allows me to build secure, 
                    robust applications while understanding both the developer and security perspectives.
                  </p>
                  <motion.button
                    className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold rounded-full shadow-lg hover:shadow-yellow-500/50 transition-shadow"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Contact Me
                  </motion.button>
                </div>

                <div className="flex-1" />
                <ArcOrbitSkills />
              </div>
            ) : (
              <div className="p-6 overflow-auto h-full">
                <div className="grid grid-cols-2 gap-6">
                  {skillsData[selectedCategory]?.skills.map((skill, index) => {
                    const color = getColorClass(selectedCategory);
                    const barColor =
                      color === 'blue' ? '#3b82f6'
                        : color === 'green' ? '#10b981'
                        : color === 'purple' ? '#a855f7'
                        : '#f97316';

                    return (
                      <div
                        key={index}
                        className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-all hover:shadow-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{skill.icon}</span>
                            <h3 className="text-white font-medium">{skill.name}</h3>
                          </div>
                          <span className="text-sm font-semibold text-gray-400">
                            {skill.level}%
                          </span>
                        </div>

                        <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${skill.level}%`, background: barColor }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Rnd>
  );
};

export default SkillsWindow;
