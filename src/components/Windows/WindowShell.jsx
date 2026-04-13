import React, { useRef, useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Maximize2 } from 'lucide-react';

const WindowShell = ({
    id,
    title,
    icon: Icon,
    isMinimized,
    zIndex = 40,
    defaultSize = { width: 800, height: 500 },
    defaultPosition = { x: 100, y: 100 },
    minWidth = 400,
    minHeight = 300,
    onClose,
    onMinimize,
    onFocus,
    onMaximizeChange,
    children,
    className = '',
    titleBarExtra,
}) => {
    const rndRef = useRef(null);
    const shellRef = useRef(null);
    const [isMaximized, setIsMaximized] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [size, setSize] = useState(defaultSize);
    const [position, setPosition] = useState(defaultPosition);
    const [previousSize, setPreviousSize] = useState({ ...defaultSize, ...defaultPosition });

    // Track focus by watching zIndex changes relative to siblings
    useEffect(() => {
        const el = shellRef.current;
        if (!el) return;
        const parent = el.closest('[data-desktop]') || el.parentElement;
        if (!parent) return;

        const checkFocus = () => {
            const siblings = parent.querySelectorAll('[data-window]');
            let maxZ = 0;
            siblings.forEach(s => {
                const z = parseInt(s.style.zIndex || '0', 10);
                if (z > maxZ) maxZ = z;
            });
            setIsFocused(zIndex >= maxZ);
        };

        checkFocus();
        const observer = new MutationObserver(checkFocus);
        observer.observe(parent, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
        return () => observer.disconnect();
    }, [zIndex]);

    const handleMaximize = () => {
        if (!isMaximized) {
            setPreviousSize({
                width: size.width,
                height: size.height,
                x: position.x,
                y: position.y,
            });
            setIsMaximized(true);
            onMaximizeChange?.(true);
        } else {
            setIsMaximized(false);
            setSize({ width: previousSize.width, height: previousSize.height });
            setPosition({ x: previousSize.x, y: previousSize.y });
            onMaximizeChange?.(false);
        }
    };

    if (isMinimized) return null;

    return (
        <Rnd
            ref={rndRef}
            dragHandleClassName="drag-handle"
            default={{
                x: defaultPosition.x,
                y: defaultPosition.y,
                width: defaultSize.width,
                height: defaultSize.height,
            }}
            position={isMaximized ? { x: 0, y: 0 } : position}
            size={isMaximized ? { width: '100%', height: '100%' } : size}
            minWidth={minWidth}
            minHeight={minHeight}
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
                ref={shellRef}
                data-window={id}
                className={`w-full h-full flex flex-col bg-gray-900 rounded-lg shadow-2xl border overflow-hidden transition-all duration-200 ${
                    isFocused ? 'border-gray-600 shadow-2xl' : 'border-gray-700/50 shadow-lg opacity-95'
                } ${className}`}
                onMouseDown={onFocus}
            >
                {/* Title Bar */}
                <div
                    className={`drag-handle flex items-center justify-between px-4 py-2 border-b border-gray-700 cursor-grab active:cursor-grabbing transition-colors duration-200 ${
                        isFocused ? 'bg-gray-800' : 'bg-gray-800/70'
                    }`}
                    onDoubleClick={handleMaximize}
                >
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
                        <div className="flex items-center gap-2">
                            {Icon && <Icon size={14} className="text-gray-400" />}
                            <span className="text-sm text-gray-300 font-medium">{title}</span>
                        </div>
                    </div>
                    {titleBarExtra && <div className="flex items-center">{titleBarExtra}</div>}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                    {typeof children === 'function'
                        ? children({ isMaximized, size, position })
                        : children}
                </div>
            </div>
        </Rnd>
    );
};

export default WindowShell;
