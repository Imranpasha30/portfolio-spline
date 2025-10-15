import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Maximize2 } from 'lucide-react';

const ProjectsWindow = ({ id, isMinimized, onClose, onMinimize, zIndex = 40, offsetX = 200, offsetY = 100, onFocus }) => {
    const [isMaximized, setIsMaximized] = useState(false);
    const [previousSize, setPreviousSize] = useState({ width: 1000, height: 700, x: 200, y: 100 });
    const [size, setSize] = useState({ width: 1000, height: 700 });
    const [position, setPosition] = useState({ x: offsetX, y: offsetY });
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
            minWidth={600}
            minHeight={400}
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
            <div className="w-full h-full flex flex-col bg-gray-900 rounded-lg shadow-2xl border border-gray-700 overflow-hidden"  onMouseDown={onFocus}>
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
                <div className="flex-1 overflow-auto bg-gray-900 p-8">
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-white mb-4">Projects</h1>
                            <p className="text-gray-400 text-lg">Coming Soon...</p>
                            <p className="text-gray-500 text-sm mt-2">This window is ready for your amazing projects showcase!</p>
                        </div>
                    </div>
                </div>
            </div>
        </Rnd>
    );
};

export default ProjectsWindow;
