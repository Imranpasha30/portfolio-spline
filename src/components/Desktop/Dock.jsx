import React, { useState } from 'react';
import { Terminal, FolderOpen, Rocket, User, Mail ,Lightbulb } from 'lucide-react';

const Dock = ({ onTerminalClick, onFileManagerClick, onProjectsClick,onSkillsClick, onAboutClick }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const dockItems = [
        { id: 1, name: 'Terminal', icon: Terminal, color: 'bg-black', onClick: onTerminalClick },
        { id: 2, name: 'Files', icon: FolderOpen, color: 'bg-black', onClick: onFileManagerClick },
         { id: 6, name: 'Skills', icon: Lightbulb, color: 'bg-black' , onClick: onSkillsClick },
        { id: 3, name: 'Projects', icon: Rocket, color: 'bg-black', onClick: onProjectsClick },
        { id: 4, name: 'About', icon: User, color: 'bg-black', onClick: onAboutClick },
        { id: 5, name: 'Contact', icon: Mail, color: 'bg-black' },
        
    ];

    const getScale = (index) => {
        if (hoveredIndex === null) return 'scale-100';
        const distance = Math.abs(hoveredIndex - index);
        if (distance === 0) return 'scale-135';
        if (distance === 1) return 'scale-115';
        return 'scale-100';
    };

    return (
        <div className="flex justify-center items-end pb-2">
            <div className="absolute bottom-4 bg-black p-2 border-2 border-gray-700/50 rounded-2xl bg-black/30 backdrop-blur-md shadow-lg">
                <div className="absolute bottom-0 left-0 right-0 h-16" />

                <ul className="flex justify-between gap-4 px-6 py-3 relative z-10">
                    {dockItems.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                            <li
                                key={item.id}
                                className="group relative"
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900/95 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg">
                                    {item.name}
                                </span>

                                <button
                                    onClick={item.onClick}
                                    className={`${item.color} w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ease-out shadow-lg border border-gray-700/50 ${getScale(index)} group-hover:-translate-y-2 active:scale-95`}
                                >
                                    <IconComponent className="text-white" size={24} strokeWidth={2} />
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default Dock;
