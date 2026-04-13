import React, { useState, useRef, useEffect } from 'react';
import { FolderOpen, ArrowLeft, ArrowRight, Home, Download, Eye, ChevronLeft, ChevronRight, X } from 'lucide-react';
import WindowShell from './WindowShell';

const FileManagerWindow = ({ id, isMinimized, onClose, onMinimize, zIndex = 40, offsetX = 150, offsetY = 80, onFocus }) => {
    const [currentPath, setCurrentPath] = useState('/home/imran');
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, file: null });
    const [localImages, setLocalImages] = useState([]);
    const [imageViewer, setImageViewer] = useState({ visible: false, currentIndex: 0, images: [] });

    const imageNames = [
        'Screenshot 2025-07-02 145149.png',
        'Screenshot 2025-07-02 154222.png',
        'Screenshot 2025-07-03 203527.png',
    ];

    useEffect(() => {
        const images = imageNames.map(name => ({
            name: name,
            type: 'image',
            icon: '\uD83D\uDDBC\uFE0F',
            url: `/images/${name}`,
            downloadUrl: `/images/${name}`
        }));
        setLocalImages(images);
    }, []);

    const [fileSystem] = useState({
        '/home/imran': {
            folders: ['Desktop', 'Documents', 'Downloads', 'Pictures'],
            files: [
                { name: 'script.py', type: 'python', icon: '\uD83D\uDC0D', url: null },
                { name: 'notes.txt', type: 'text', icon: '\uD83D\uDCC4', url: null },
                { name: 'tools.zip', type: 'archive', icon: '\uD83D\uDCE6', url: null },
                { name: 'wallpaper.jpg', type: 'image', icon: '\uD83D\uDDBC\uFE0F', url: null }
            ]
        },
        '/home/imran/Desktop': { folders: [], files: [] },
        '/home/imran/Documents': {
            folders: [],
            files: [{ name: 'resume.pdf', type: 'pdf', icon: '\uD83D\uDCC4', url: '/resume.pdf' }]
        },
        '/home/imran/Downloads': { folders: [], files: [] },
        '/home/imran/Pictures': { folders: [], files: [] }
    });

    useEffect(() => {
        const handleClick = () => setContextMenu({ visible: false, x: 0, y: 0, file: null });
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    const handleFolderClick = (folderName) => {
        setCurrentPath(`${currentPath}/${folderName}`);
    };

    const handleBackClick = () => {
        const pathParts = currentPath.split('/');
        if (pathParts.length > 2) {
            pathParts.pop();
            setCurrentPath(pathParts.join('/'));
        }
    };

    const handleHomeClick = () => setCurrentPath('/home/imran');

    const handleFileRightClick = (e, file) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ visible: true, x: e.clientX, y: e.clientY, file });
    };

    const currentDirectory = fileSystem[currentPath] || { folders: [], files: [] };
    const displayFiles = currentPath === '/home/imran/Pictures' && localImages.length > 0
        ? localImages
        : currentDirectory.files || [];

    const handleImageClick = (file) => {
        if (file.type === 'image') {
            const imageFiles = displayFiles.filter(f => f.type === 'image');
            const imageIndex = imageFiles.findIndex(f => f.name === file.name);
            setImageViewer({ visible: true, currentIndex: imageIndex, images: imageFiles });
        }
    };

    const handleOpenFile = (file) => {
        if (file.type === 'image') {
            const imageFiles = displayFiles.filter(f => f.type === 'image');
            const imageIndex = imageFiles.findIndex(f => f.name === file.name);
            setImageViewer({ visible: true, currentIndex: imageIndex, images: imageFiles });
        } else if (file.url) {
            window.open(file.url, '_blank');
        }
        setContextMenu({ visible: false, x: 0, y: 0, file: null });
    };

    const handleDownloadFile = (file) => {
        if (file.downloadUrl || file.url) {
            const link = document.createElement('a');
            link.href = file.downloadUrl || file.url;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        setContextMenu({ visible: false, x: 0, y: 0, file: null });
    };

    return (
        <>
            <WindowShell
                id={id}
                title={`File Manager - ${currentPath}`}
                icon={FolderOpen}
                isMinimized={isMinimized}
                zIndex={zIndex}
                defaultSize={{ width: 900, height: 600 }}
                defaultPosition={{ x: offsetX, y: offsetY }}
                minWidth={500}
                minHeight={400}
                onClose={onClose}
                onMinimize={onMinimize}
                onFocus={onFocus}
                className="!bg-gray-800"
            >
                {/* Toolbar */}
                <div className="flex items-center gap-2 bg-gray-900 px-4 py-2 border-b border-gray-700">
                    <button onClick={handleBackClick} className="p-2 hover:bg-gray-700 rounded transition-colors" title="Back">
                        <ArrowLeft size={18} className="text-gray-300" />
                    </button>
                    <button className="p-2 hover:bg-gray-700 rounded transition-colors" title="Forward">
                        <ArrowRight size={18} className="text-gray-400" />
                    </button>
                    <button onClick={handleHomeClick} className="p-2 hover:bg-gray-700 rounded transition-colors" title="Home">
                        <Home size={18} className="text-gray-300" />
                    </button>
                    <div className="flex-1 bg-gray-800 px-3 py-1.5 rounded text-sm text-gray-300 ml-2">
                        {currentPath}
                    </div>
                </div>

                {/* File Manager Content */}
                <div className="flex-1 overflow-auto bg-gray-800 p-6">
                    <div className="grid grid-cols-6 gap-4">
                        {currentDirectory.folders?.map((folder, index) => (
                            <button
                                key={`folder-${index}`}
                                onClick={() => handleFolderClick(folder)}
                                className="flex flex-col items-center gap-2 p-3 hover:bg-gray-700/50 rounded-lg transition-colors group"
                            >
                                <FolderOpen size={48} className="text-purple-400" />
                                <span className="text-xs text-gray-300 text-center break-all">{folder}</span>
                            </button>
                        ))}

                        {displayFiles.map((file, index) => (
                            <div
                                key={`file-${index}`}
                                onClick={() => handleImageClick(file)}
                                onContextMenu={(e) => handleFileRightClick(e, file)}
                                className="flex flex-col items-center gap-2 p-3 hover:bg-gray-700/50 rounded-lg transition-colors group cursor-pointer"
                            >
                                {file.type === 'image' && file.url ? (
                                    <img src={file.url} alt={file.name} className="w-16 h-16 object-cover rounded" loading="lazy" />
                                ) : (
                                    <div className="text-4xl">{file.icon}</div>
                                )}
                                <span className="text-xs text-gray-300 text-center break-all line-clamp-2">{file.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </WindowShell>

            {/* Context Menu */}
            {contextMenu.visible && (
                <div
                    className="fixed bg-gray-900 border border-gray-700 rounded-lg shadow-2xl py-2 z-50 min-w-[150px]"
                    style={{ left: contextMenu.x, top: contextMenu.y }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => handleOpenFile(contextMenu.file)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                    >
                        <Eye size={16} /> Open
                    </button>
                    <button
                        onClick={() => handleDownloadFile(contextMenu.file)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                    >
                        <Download size={16} /> Download
                    </button>
                </div>
            )}

            {/* Image Viewer Modal */}
            {imageViewer.visible && (
                <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
                    <button
                        onClick={() => setImageViewer({ ...imageViewer, visible: false })}
                        className="absolute top-4 right-4 p-2 bg-gray-800/80 hover:bg-gray-700 rounded-lg transition-colors z-10"
                    >
                        <X size={24} className="text-white" />
                    </button>

                    {imageViewer.currentIndex > 0 && (
                        <button
                            onClick={() => setImageViewer({ ...imageViewer, currentIndex: imageViewer.currentIndex - 1 })}
                            className="absolute left-4 p-3 bg-gray-800/80 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <ChevronLeft size={32} className="text-white" />
                        </button>
                    )}

                    <div className="max-w-6xl w-full flex flex-col items-center gap-4">
                        <img
                            src={imageViewer.images[imageViewer.currentIndex]?.url}
                            alt={imageViewer.images[imageViewer.currentIndex]?.name}
                            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                        />
                        <div className="text-white text-center bg-gray-900/80 px-6 py-3 rounded-lg">
                            <p className="text-lg font-medium">{imageViewer.images[imageViewer.currentIndex]?.name}</p>
                            <p className="text-sm text-gray-400 mt-1">
                                {imageViewer.currentIndex + 1} of {imageViewer.images.length}
                            </p>
                        </div>
                    </div>

                    {imageViewer.currentIndex < imageViewer.images.length - 1 && (
                        <button
                            onClick={() => setImageViewer({ ...imageViewer, currentIndex: imageViewer.currentIndex + 1 })}
                            className="absolute right-4 p-3 bg-gray-800/80 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <ChevronRight size={32} className="text-white" />
                        </button>
                    )}
                </div>
            )}
        </>
    );
};

export default FileManagerWindow;
