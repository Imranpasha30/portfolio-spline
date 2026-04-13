import React, { useState, useCallback, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Desktop from "./components/Desktop/Desktop"
import BootSequence from "./components/Boot/BootSequence"
import LoginScreen from "./components/Boot/LoginScreen"
import { SettingsProvider, useSettings } from "./contexts/SettingsContext"

function AppContent() {
  // States: boot → login → desktop → lock (back to login)
  //         desktop → shutdown (black screen → boot)
  const { wallpaper, skipBoot, setSkipBoot } = useSettings();
  const [appState, setAppState] = useState(skipBoot ? 'login' : 'boot');
  const [shutdownType, setShutdownType] = useState(null); // 'shutdown' | 'restart'

  const handleBootComplete = useCallback(() => {
    setSkipBoot(true); // Skip boot on future visits
    setAppState('login');
  }, [setSkipBoot]);

  const handleLogin = useCallback(() => {
    setAppState('desktop');
  }, []);

  const handleLock = useCallback(() => {
    setAppState('lock');
  }, []);

  const handleShutdown = useCallback((type) => {
    setShutdownType(type);
    setAppState('shutdown');
  }, []);

  // Auto-restart after 2s when restarting
  useEffect(() => {
    if (appState === 'shutdown' && shutdownType === 'restart') {
      const timer = setTimeout(() => setAppState('boot'), 2000);
      return () => clearTimeout(timer);
    }
  }, [appState, shutdownType]);

  const handleWakeFromShutdown = useCallback(() => {
    setAppState('boot');
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {appState === 'boot' && (
          <BootSequence key="boot" onComplete={handleBootComplete} />
        )}

        {(appState === 'login' || appState === 'lock') && (
          <LoginScreen key="login" onLogin={handleLogin} wallpaper={wallpaper} />
        )}

        {appState === 'shutdown' && (
          <motion.div
            key="shutdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center"
            >
              {shutdownType === 'shutdown' ? (
                <button
                  onClick={handleWakeFromShutdown}
                  onKeyDown={handleWakeFromShutdown}
                  className="text-gray-600 text-sm hover:text-gray-400 transition-colors focus:outline-none"
                  autoFocus
                >
                  Press any key to start...
                </button>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full"
                  />
                  <p className="text-white/50 text-sm">Restarting...</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {(appState === 'desktop' || appState === 'login' || appState === 'lock') && (
        <div style={{ visibility: appState === 'desktop' ? 'visible' : 'hidden' }}>
          <Desktop onLock={handleLock} onShutdown={handleShutdown} />
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  )
}

export default App
