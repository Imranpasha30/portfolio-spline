import React, { useState, useRef, useMemo } from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Maximize2, Code, Database, Wrench, Shield, Cloud, Home as HomeIcon, Server, HardDrive, FileCode, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  SiPython,
  SiFlutter,
  SiAngular,
  SiC,
  SiMysql,
  SiRedis,
  SiFastapi,
  SiDjango,
  SiGooglecloud,
} from 'react-icons/si';

// Move ArcOrbitSkills OUTSIDE as a separate memoized component
const ArcOrbitSkills = React.memo(() => {
  const orbitSkills = {
    orbit1: [
      { name: 'React', icon: <SiReact />, color: '#61DAFB' },
      { name: 'Next.js', icon: <SiNextdotjs />, color: '#FFFFFF' },
      { name: 'JavaScript', icon: <SiJavascript />, color: '#F7DF1E' },
      { name: 'TypeScript', icon: <SiTypescript />, color: '#3178C6' },
      { name: 'HTML5', icon: <SiHtml5 />, color: '#E34F26' },
      { name: 'CSS3', icon: <SiCss3 />, color: '#1572B6' },
      { name: 'Tailwind', icon: <SiTailwindcss />, color: '#06B6D4' },
      { name: 'Angular', icon: <SiAngular />, color: '#DD0031' },
    ],
    orbit2: [
      { name: 'Node.js', icon: <SiNodedotjs />, color: '#339933' },
      { name: 'Python', icon: <SiPython />, color: '#3776AB' },
      { name: 'MongoDB', icon: <SiMongodb />, color: '#47A248' },
      { name: 'PostgreSQL', icon: <SiPostgresql />, color: '#4169E1' },
      { name: 'FastAPI', icon: <SiFastapi />, color: '#009688' },
      { name: 'Rust', icon: <SiRust />, color: '#FFFFFF' },
      { name: 'Django', icon: <SiDjango />, color: '#092E20' },
    ],
    orbit3: [
      { name: 'Docker', icon: <SiDocker />, color: '#2496ED' },
      { name: 'Git', icon: <SiGit />, color: '#F05032' },
      { name: 'AWS', icon: <SiAmazon />, color: '#FF9900' },
      { name: 'Linux', icon: <SiLinux />, color: '#FCC624' },
      { name: 'Firebase', icon: <SiFirebase />, color: '#FFCA28' },
      { name: 'Redis', icon: <SiRedis />, color: '#DC382D' },
      { name: 'MySQL', icon: <SiMysql />, color: '#4479A1' },
      { name: 'NPM', icon: <SiNpm />, color: '#CB3837' },
    ],
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-96 overflow-hidden pointer-events-none">
      {/* Orbit 1 */}
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
          transition={{ repeat: Infinity, duration: 50, ease: 'linear' }}
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

      {/* Orbit 2 */}
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
          transition={{ repeat: Infinity, duration: 70, ease: 'linear' }}
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

      {/* Orbit 3 */}
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
          transition={{ repeat: Infinity, duration: 90, ease: 'linear' }}
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
});

ArcOrbitSkills.displayName = 'ArcOrbitSkills';

const SkillsWindow = ({ id, isMinimized, onClose, onMinimize, zIndex = 40, offsetX = 160, offsetY = 90, onFocus }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [previousSize, setPreviousSize] = useState({ width: 1100, height: 700, x: 160, y: 90 });
  const [size, setSize] = useState({ width: 1100, height: 700 });
  const [position, setPosition] = useState({ x: offsetX, y: offsetY });
  const [selectedCategory, setSelectedCategory] = useState('home');
  const rndRef = useRef(null);

  // Memoize skills data so it doesn't recreate on every render
  const skillsData = useMemo(() => ({
    languages: {
      icon: FileCode,
      color: 'blue',
      title: 'Programming Languages',
      skills: [
        { name: 'JavaScript', level: 90, icon: <SiJavascript style={{ color: '#F7DF1E' }} /> },
        { name: 'TypeScript', level: 85, icon: <SiTypescript style={{ color: '#3178C6' }} /> },
        { name: 'Python', level: 88, icon: <SiPython style={{ color: '#3776AB' }} /> },
        { name: 'Rust', level: 75, icon: <SiRust style={{ color: '#FFFFFF' }} /> },
        { name: 'C', level: 70, icon: <SiC style={{ color: '#A8B9CC' }} /> },
      ]
    },
    frontend: {
      icon: Layout,
      color: 'cyan',
      title: 'Frontend Development',
      skills: [
        { name: 'React.js', level: 92, icon: <SiReact style={{ color: '#61DAFB' }} /> },
        { name: 'Next.js', level: 85, icon: <SiNextdotjs style={{ color: '#FFFFFF' }} /> },
        { name: 'Angular', level: 78, icon: <SiAngular style={{ color: '#DD0031' }} /> },
        { name: 'Flutter', level: 80, icon: <SiFlutter style={{ color: '#02569B' }} /> },
        { name: 'Tailwind CSS', level: 90, icon: <SiTailwindcss style={{ color: '#06B6D4' }} /> },
        { name: 'HTML5/CSS3', level: 95, icon: <SiHtml5 style={{ color: '#E34F26' }} /> },
      ]
    },
    backend: {
      icon: Server,
      color: 'green',
      title: 'Backend & APIs',
      skills: [
        { name: 'Node.js', level: 90, icon: <SiNodedotjs style={{ color: '#339933' }} /> },
        { name: 'Express.js', level: 88, icon: '⚡' },
        { name: 'FastAPI', level: 85, icon: <SiFastapi style={{ color: '#009688' }} /> },
        { name: 'Django', level: 80, icon: <SiDjango style={{ color: '#092E20' }} /> },
        { name: 'REST APIs', level: 92, icon: '🔌' },
        { name: 'GraphQL', level: 75, icon: <SiGraphql style={{ color: '#E10098' }} /> },
      ]
    },
    database: {
      icon: HardDrive,
      color: 'purple',
      title: 'Databases',
      skills: [
        { name: 'MongoDB', level: 85, icon: <SiMongodb style={{ color: '#47A248' }} /> },
        { name: 'PostgreSQL', level: 82, icon: <SiPostgresql style={{ color: '#4169E1' }} /> },
        { name: 'MySQL', level: 80, icon: <SiMysql style={{ color: '#4479A1' }} /> },
        { name: 'Redis', level: 75, icon: <SiRedis style={{ color: '#DC382D' }} /> },
      ]
    },
    devops: {
      icon: Wrench,
      color: 'orange',
      title: 'DevOps & Tools',
      skills: [
        { name: 'Docker', level: 85, icon: <SiDocker style={{ color: '#2496ED' }} /> },
        { name: 'Git & GitHub', level: 95, icon: <SiGithub style={{ color: '#FFFFFF' }} /> },
        { name: 'NPM', level: 90, icon: <SiNpm style={{ color: '#CB3837' }} /> },
        { name: 'Webpack', level: 75, icon: <SiWebpack style={{ color: '#8DD6F9' }} /> },
        { name: 'VS Code', level: 95, icon: '💻' },
        { name: 'Linux', level: 88, icon: <SiLinux style={{ color: '#FCC624' }} /> },
      ]
    },
    cloud: {
      icon: Cloud,
      color: 'yellow',
      title: 'Cloud & Infrastructure',
      skills: [
        { name: 'AWS EC2', level: 80, icon: <SiAmazon style={{ color: '#FF9900' }} /> },
        { name: 'AWS Lambda', level: 75, icon: <SiAmazon style={{ color: '#FF9900' }} /> },
        { name: 'AWS RDS', level: 78, icon: <SiAmazon style={{ color: '#FF9900' }} /> },
        { name: 'AWS S3', level: 85, icon: <SiAmazon style={{ color: '#FF9900' }} /> },
        { name: 'Route 53', level: 70, icon: <SiAmazon style={{ color: '#FF9900' }} /> },
        { name: 'Firebase', level: 80, icon: <SiFirebase style={{ color: '#FFCA28' }} /> },
        { name: 'Google Cloud', level: 75, icon: <SiGooglecloud style={{ color: '#4285F4' }} /> },
        { name: 'Google Maps API', level: 82, icon: '🗺️' },
        { name: 'Google Auth', level: 85, icon: '🔐' },
        { name: 'Cloud Functions', level: 78, icon: '⚡' },
        { name: 'Cloud Storage', level: 80, icon: '☁️' },
        { name: 'Google APIs', level: 83, icon: '🔌' },
      ]
    },
    security: {
      icon: Shield,
      color: 'red',
      title: 'Cybersecurity & Pentesting',
      skills: [
        { name: 'Burp Suite', level: 85, icon: '🔒' },
        { name: 'OWASP ZAP', level: 80, icon: '🛡️' },
        { name: 'Metasploit', level: 78, icon: '💣' },
        { name: 'Nmap', level: 90, icon: '🗺️' },
        { name: 'Wireshark', level: 82, icon: '🦈' },
        { name: 'SQLMap', level: 80, icon: '💉' },
        { name: 'Nikto', level: 75, icon: '🔍' },
        { name: 'Hydra', level: 78, icon: '🔐' },
        { name: 'John the Ripper', level: 75, icon: '🔓' },
        { name: 'Gobuster', level: 80, icon: '📂' },
        { name: 'FFUF', level: 78, icon: '⚡' },
        { name: 'Netcat', level: 85, icon: '🐱' },
      ]
    },
    ai: {
      icon: Code,
      color: 'pink',
      title: 'AI & ML Tools',
      skills: [
        { name: 'ChatGPT API', level: 85, icon: '🤖' },
        { name: 'OpenAI Models', level: 80, icon: '🧠' },
        { name: 'Hugging Face', level: 75, icon: '🤗' },
        { name: 'LangChain', level: 78, icon: '⛓️' },
        { name: 'TensorFlow', level: 20, icon: '🔥' },
        { name: 'PyTorch', level: 20, icon: '🔦' },
      ]
    }
  }), []);

  const categories = useMemo(() => [
    { id: 'home', name: 'Home', icon: HomeIcon },
    { id: 'languages', name: 'Languages', icon: FileCode },
    { id: 'frontend', name: 'Frontend', icon: Layout },
    { id: 'backend', name: 'Backend', icon: Server },
    { id: 'database', name: 'Databases', icon: HardDrive },
    { id: 'devops', name: 'DevOps', icon: Wrench },
    { id: 'cloud', name: 'Cloud/AWS/GCP', icon: Cloud },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'ai', name: 'AI/ML', icon: Code },
  ], []);

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
      languages: 'blue',
      frontend: 'cyan',
      backend: 'green',
      database: 'purple',
      devops: 'orange',
      cloud: 'yellow',
      security: 'red',
      ai: 'pink'
    };
    return colors[category] || 'blue';
  };

  const getGradient = (color) => {
    const gradients = {
      blue: 'from-blue-500 to-blue-600',
      cyan: 'from-cyan-500 to-cyan-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      yellow: 'from-yellow-500 to-yellow-600',
      red: 'from-red-500 to-red-600',
      pink: 'from-pink-500 to-pink-600',
    };
    return gradients[color] || gradients.blue;
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
          <div className="w-56 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
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
                <div className="pt-10 px-8 pb-8 flex flex-col items-start text-left z-10">
                  <h1 className="text-5xl font-bold text-white mb-4">My Skills</h1>
                  <p className="text-gray-200 text-lg max-w-3xl leading-relaxed mb-6">
                    I'm a Full Stack Developer with a strong foundation in building scalable web applications and mobile backends. With a solid grasp of cybersecurity principles and secure coding practices, I focus on writing clean, reliable code while designing systems that are resilient to real‑world threats. My experience across frontend, backend, and security allows me to build and protect robust applications end‑to‑end.
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
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategory}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 overflow-auto h-full"
                >
                  {/* Category Header */}
                  <div className={`mb-6 p-4 rounded-xl bg-gradient-to-r ${getGradient(getColorClass(selectedCategory))}`}>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      {React.createElement(skillsData[selectedCategory]?.icon, { size: 28 })}
                      {skillsData[selectedCategory]?.title}
                    </h2>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {skillsData[selectedCategory]?.skills.map((skill, index) => {
                      const color = getColorClass(selectedCategory);
                      const barColors = {
                        blue: '#3b82f6',
                        cyan: '#06b6d4',
                        green: '#10b981',
                        purple: '#a855f7',
                        orange: '#f97316',
                        yellow: '#eab308',
                        red: '#ef4444',
                        pink: '#ec4899',
                      };

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all hover:shadow-lg hover:shadow-gray-700/50"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{skill.icon}</span>
                              <h3 className="text-white font-medium text-sm">{skill.name}</h3>
                            </div>
                            <span className="text-xs font-semibold text-gray-400">
                              {skill.level}%
                            </span>
                          </div>

                          <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ duration: 1, delay: index * 0.05, ease: 'easeOut' }}
                              className="absolute top-0 left-0 h-full rounded-full"
                              style={{ background: barColors[color] }}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </Rnd>
  );
};

export default SkillsWindow;
