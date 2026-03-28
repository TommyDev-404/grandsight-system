import { useContext, createContext, useState, useEffect } from 'react';

const DarkModeContext = createContext();

export const useDarkMode = () => useContext(DarkModeContext);

export default function DarkModeProvider({ children }) {
      // Default to system preference if nothing in localStorage
      const getInitialMode = () => {
            const stored = localStorage.getItem('mode');
            if (stored) return stored;
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            return prefersDark ? 'dark' : 'light';
      };

      const [currentMode, setCurrentMode] = useState(getInitialMode);

      // Update HTML class and localStorage whenever mode changes
      useEffect(() => {
            localStorage.setItem('mode', currentMode);
            document.documentElement.classList.toggle('dark', currentMode === 'dark');
      }, [currentMode]);

      // Toggle between light and dark
      const toggleDarkMode = () => {
            setCurrentMode(prev => (prev === 'light' ? 'dark' : 'light'));
      };

      return (
            <DarkModeContext.Provider value={{ currentMode, toggleDarkMode }}>
                  {children}
            </DarkModeContext.Provider>
      );
}
