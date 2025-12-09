// src/components/Windows/SettingsWindow.jsx
import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Maximize2, Monitor, Palette, Image as ImageIcon, Check, Pipette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';

// Import wallpapers
import wallpaper1 from '/wallpaper/0921cb27d5604b464218a64ae88a3f43c7b7371a.png';
import wallpaper2 from '/wallpaper/ubuntucircuitry-logotip-metal-logo-linux-style-linuks-ubuntu.jpg';
import wallpaper3 from '/wallpaper/fa993d401b720ad6599ff38a9cc62851fefaff17.jpeg';
import wallpaper4 from '/wallpaper/19a97b1db5709c9a0cdaf408adfcc1b3325c74c6_2_690x388.jpeg';
import wallpaper5 from '/wallpaper/ubuntu-24-04-noble-numbat-jpg.webp';

const SettingsWindow = ({ 
  id, 
  isMinimized, 
  onClose, 
  onMinimize, 
  zIndex = 40, 
  offsetX = 200, 
  offsetY = 100, 
  onFocus,
  currentWallpaper,
  onWallpaperChange,
  currentPanelColor,
  onPanelColorChange,
  currentLauncherColor,
  onLauncherColorChange
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [previousSize, setPreviousSize] = useState({ width: 900, height: 600, x: 200, y: 100 });
  const [size, setSize] = useState({ width: 900, height: 600 });
  const [position, setPosition] = useState({ x: offsetX, y: offsetY });
  const [selectedTab, setSelectedTab] = useState('appearance');
  const [showPanelPicker, setShowPanelPicker] = useState(false);
  const [showLauncherPicker, setShowLauncherPicker] = useState(false);
  const [customPanelColor, setCustomPanelColor] = useState('#1a1a1a');
  const [customLauncherColor, setCustomLauncherColor] = useState('#1a1a1a');
  const [panelOpacity, setPanelOpacity] = useState(90);
  const [launcherOpacity, setLauncherOpacity] = useState(90);

  // Available wallpapers
  const wallpapers = [
    { id: 1, src: wallpaper1, name: 'Ubuntu Jellyfish' },
    { id: 2, src: wallpaper2, name: 'Mountain Sunset' },
    { id: 3, src: wallpaper3, name: 'Ocean Wave' },
    { id: 4, src: wallpaper4, name: 'Purple Galaxy' },
    { id: 5, src: wallpaper5, name: 'Forest Green' },
  ];

  // Panel color presets
  const panelColors = [
    { name: 'Dark', value: '#1a1a1a', opacity: 90 },
    { name: 'Black', value: '#000000', opacity: 95 },
    { name: 'Gray', value: '#2d2d2d', opacity: 85 },
    { name: 'Blue', value: '#1e3a8a', opacity: 90 },
    { name: 'Purple', value: '#581c87', opacity: 90 },
    { name: 'Green', value: '#14532d', opacity: 90 },
    { name: 'Red', value: '#7f1d1d', opacity: 90 },
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

  const handlePanelCustomColor = () => {
    onPanelColorChange({ 
      name: 'Custom', 
      value: customPanelColor, 
      opacity: panelOpacity 
    });
    setShowPanelPicker(false);
  };

  const handleLauncherCustomColor = () => {
    onLauncherColorChange({ 
      name: 'Custom', 
      value: customLauncherColor, 
      opacity: launcherOpacity 
    });
    setShowLauncherPicker(false);
  };

  if (isMinimized) return null;

  return (
    <Rnd
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
            <Monitor className="text-blue-400" size={18} />
            <span className="text-sm text-gray-300 font-medium">Settings</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-56 bg-gray-800 border-r border-gray-700 p-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">Settings</h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedTab('appearance')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  selectedTab === 'appearance'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Palette size={18} />
                <span className="text-sm">Appearance</span>
              </button>
              <button
                onClick={() => setSelectedTab('wallpaper')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  selectedTab === 'wallpaper'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <ImageIcon size={18} />
                <span className="text-sm">Wallpaper</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto bg-gray-900 p-6">
            {selectedTab === 'wallpaper' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Background</h2>
                <p className="text-gray-400 mb-6">Choose your desktop wallpaper</p>

                {/* Wallpaper Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {wallpapers.map((wallpaper) => (
                    <motion.div
                      key={wallpaper.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onWallpaperChange(wallpaper.src)}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        currentWallpaper === wallpaper.src
                          ? 'border-blue-500 shadow-lg shadow-blue-500/50'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div
                        className="h-32 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${wallpaper.src})`
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
                        <span className="text-white text-sm font-medium">{wallpaper.name}</span>
                        {currentWallpaper === wallpaper.src && (
                          <Check className="text-blue-400" size={20} />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'appearance' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Appearance</h2>
                <p className="text-gray-400 mb-6">Customize your desktop colors</p>

                {/* Top Panel Color */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <div className="w-1 h-6 bg-blue-500 rounded" />
                    Top Panel Color
                  </h3>
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {panelColors.map((color) => (
                      <motion.button
                        key={color.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onPanelColorChange(color)}
                        className={`relative p-4 rounded-lg border-2 transition-all ${
                          currentPanelColor?.value === color.value
                            ? 'border-blue-500 shadow-lg'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                        style={{
                          backgroundColor: color.value,
                          opacity: color.opacity / 100
                        }}
                      >
                        <div className="text-white text-sm font-medium">{color.name}</div>
                        {currentPanelColor?.value === color.value && (
                          <Check className="absolute top-2 right-2 text-blue-400" size={16} />
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Custom Color Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowPanelPicker(!showPanelPicker)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg transition-colors"
                  >
                    <Pipette className="text-blue-400" size={18} />
                    <span className="text-white text-sm font-medium">Custom Color</span>
                  </motion.button>

                  {/* Custom Color Picker */}
                  <AnimatePresence>
                    {showPanelPicker && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 bg-gray-800 p-4 rounded-lg border border-gray-700"
                      >
                        <HexColorPicker 
                          color={customPanelColor} 
                          onChange={setCustomPanelColor}
                          style={{ width: '100%', height: '180px' }}
                        />
                        <div className="mt-4">
                          <label className="text-gray-400 text-xs mb-2 block">Opacity: {panelOpacity}%</label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={panelOpacity}
                            onChange={(e) => setPanelOpacity(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          <input
                            type="text"
                            value={customPanelColor}
                            onChange={(e) => setCustomPanelColor(e.target.value)}
                            className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg text-sm outline-none border border-gray-600 focus:border-blue-500"
                            placeholder="#1a1a1a"
                          />
                          <button
                            onClick={handlePanelCustomColor}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Launcher Panel Color */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <div className="w-1 h-6 bg-green-500 rounded" />
                    Launcher Panel Color
                  </h3>
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {panelColors.map((color) => (
                      <motion.button
                        key={color.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onLauncherColorChange(color)}
                        className={`relative p-4 rounded-lg border-2 transition-all ${
                          currentLauncherColor?.value === color.value
                            ? 'border-green-500 shadow-lg'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                        style={{
                          backgroundColor: color.value,
                          opacity: color.opacity / 100
                        }}
                      >
                        <div className="text-white text-sm font-medium">{color.name}</div>
                        {currentLauncherColor?.value === color.value && (
                          <Check className="absolute top-2 right-2 text-green-400" size={16} />
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Custom Color Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowLauncherPicker(!showLauncherPicker)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg transition-colors"
                  >
                    <Pipette className="text-green-400" size={18} />
                    <span className="text-white text-sm font-medium">Custom Color</span>
                  </motion.button>

                  {/* Custom Color Picker */}
                  <AnimatePresence>
                    {showLauncherPicker && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 bg-gray-800 p-4 rounded-lg border border-gray-700"
                      >
                        <HexColorPicker 
                          color={customLauncherColor} 
                          onChange={setCustomLauncherColor}
                          style={{ width: '100%', height: '180px' }}
                        />
                        <div className="mt-4">
                          <label className="text-gray-400 text-xs mb-2 block">Opacity: {launcherOpacity}%</label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={launcherOpacity}
                            onChange={(e) => setLauncherOpacity(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          <input
                            type="text"
                            value={customLauncherColor}
                            onChange={(e) => setCustomLauncherColor(e.target.value)}
                            className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg text-sm outline-none border border-gray-600 focus:border-green-500"
                            placeholder="#1a1a1a"
                          />
                          <button
                            onClick={handleLauncherCustomColor}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Preview */}
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">Preview</h3>
                  <div className="relative h-40 bg-gray-700 rounded-lg overflow-hidden">
                    {/* Mini Top Panel */}
                    <div
                      className="absolute top-0 left-0 right-0 h-6 backdrop-blur-sm flex items-center px-2"
                      style={{
                        backgroundColor: `${currentPanelColor?.value}${Math.round((currentPanelColor?.opacity / 100) * 255).toString(16).padStart(2, '0')}`
                      }}
                    >
                      <div className="text-white text-xs">Activities</div>
                    </div>
                    {/* Mini Launcher */}
                    <div
                      className="absolute left-0 top-6 bottom-0 w-12 backdrop-blur-sm"
                      style={{
                        backgroundColor: `${currentLauncherColor?.value}${Math.round((currentLauncherColor?.opacity / 100) * 255).toString(16).padStart(2, '0')}`
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Rnd>
  );
};

export default SettingsWindow;
