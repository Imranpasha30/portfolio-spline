import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_LINES = [
    '[    0.000000] Linux version 6.8.0-45-generic (buildd@lcy02-amd64-115)',
    '[    0.000000] Command line: BOOT_IMAGE=/vmlinuz-6.8.0-45-generic root=/dev/sda1',
    '[    0.000012] BIOS-provided physical RAM map:',
    '[    0.000015] BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff] usable',
    '[    0.000128] NX (Execute Disable) protection: active',
    '[    0.000256] SMBIOS 3.0 present.',
    '[    0.000384] DMI: Portfolio/Desktop, BIOS 1.0.0 04/13/2026',
    '[    0.000512] tsc: Detected 3600.000 MHz processor',
    '[    0.001024] Calibrating delay loop (skipped), value calculated using timer frequency',
    '[    0.002048] pid_max: default: 32768 minimum: 301',
    '[    0.004096] Memory: 16384000K/16777216K available',
    '[    0.008192] CPU: Intel(R) Core(TM) i7-13700K @ 3.60GHz',
    '[    0.016384] ACPI: Core revision 20231215',
    '[    0.032768] PCI: Using configuration type 1 for base access',
    '[    0.065536] clocksource: tsc: mask: 0xffffffffffffffff max_cycles: 0x33e452fcc78',
    '[    0.131072] systemd[1]: systemd 255 running in system mode',
    '[    0.262144] systemd[1]: Detected architecture x86-64.',
    '[    0.524288] systemd[1]: Hostname set to <imran-desktop>.',
    '[    1.000000] systemd[1]: Starting Network Manager...',
    '[    1.200000] systemd[1]: Started GPU Driver (NVIDIA 550.78)...',
    '[    1.400000] systemd[1]: Reached target Graphical Interface.',
];

const BootSequence = ({ onComplete }) => {
    const [phase, setPhase] = useState('grub'); // grub → boot → loading
    const [visibleLines, setVisibleLines] = useState(0);
    const [dotIndex, setDotIndex] = useState(0);

    // Skip on click/keypress
    useEffect(() => {
        const skip = () => onComplete();
        window.addEventListener('click', skip);
        window.addEventListener('keydown', skip);
        return () => {
            window.removeEventListener('click', skip);
            window.removeEventListener('keydown', skip);
        };
    }, [onComplete]);

    // GRUB phase (1.5s)
    useEffect(() => {
        if (phase === 'grub') {
            const timer = setTimeout(() => setPhase('boot'), 1500);
            return () => clearTimeout(timer);
        }
    }, [phase]);

    // Boot text scroll
    useEffect(() => {
        if (phase === 'boot') {
            if (visibleLines < BOOT_LINES.length) {
                const timer = setTimeout(() => setVisibleLines(prev => prev + 1), 60);
                return () => clearTimeout(timer);
            } else {
                const timer = setTimeout(() => setPhase('loading'), 300);
                return () => clearTimeout(timer);
            }
        }
    }, [phase, visibleLines]);

    // Loading dots animation
    useEffect(() => {
        if (phase === 'loading') {
            const dotTimer = setInterval(() => setDotIndex(prev => (prev + 1) % 5), 400);
            const endTimer = setTimeout(() => onComplete(), 2500);
            return () => {
                clearInterval(dotTimer);
                clearTimeout(endTimer);
            };
        }
    }, [phase, onComplete]);

    return (
        <div className="fixed inset-0 bg-black z-[200] flex items-center justify-center select-none">
            <AnimatePresence mode="wait">
                {phase === 'grub' && (
                    <motion.div
                        key="grub"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full flex flex-col items-center justify-center font-mono"
                    >
                        <div className="border border-gray-600 rounded p-1 w-[500px]">
                            <div className="text-gray-400 text-sm mb-2 px-2 pt-1">GNU GRUB version 2.12</div>
                            <div className="bg-white text-black px-3 py-1.5 text-sm font-bold">
                                *Ubuntu 24.04 LTS
                            </div>
                            <div className="text-gray-500 px-3 py-1.5 text-sm">
                                Ubuntu 24.04 LTS (recovery mode)
                            </div>
                            <div className="text-gray-500 px-3 py-1.5 text-sm">
                                Memory test (memtest86+x64.efi)
                            </div>
                        </div>
                        <div className="text-gray-600 text-xs mt-4">
                            Use ↑ and ↓ to select, Enter to boot
                        </div>
                    </motion.div>
                )}

                {phase === 'boot' && (
                    <motion.div
                        key="boot"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full p-4 overflow-hidden font-mono text-xs"
                    >
                        {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
                            <div key={i} className="text-green-400/80 leading-5">{line}</div>
                        ))}
                        <span className="inline-block w-2 h-4 bg-green-400 animate-pulse" />
                    </motion.div>
                )}

                {phase === 'loading' && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-8"
                    >
                        {/* Ubuntu Logo */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', duration: 0.6 }}
                        >
                            <svg width="100" height="100" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="#E95420" strokeWidth="4" />
                                <circle cx="50" cy="10" r="8" fill="#E95420" />
                                <circle cx="15" cy="70" r="8" fill="#E95420" />
                                <circle cx="85" cy="70" r="8" fill="#E95420" />
                                <circle cx="50" cy="50" r="12" fill="#E95420" />
                            </svg>
                        </motion.div>

                        <div className="text-white text-2xl font-light tracking-widest">ubuntu</div>

                        {/* 5-dot loading indicator */}
                        <div className="flex gap-2">
                            {[0, 1, 2, 3, 4].map(i => (
                                <div
                                    key={i}
                                    className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
                                        i === dotIndex ? 'bg-white' : 'bg-gray-700'
                                    }`}
                                />
                            ))}
                        </div>

                        <p className="text-gray-600 text-xs absolute bottom-8">Click or press any key to skip</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BootSequence;
