
import React, { useState, useEffect } from 'react';

interface NavigationProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isDarkMode, toggleTheme }) => {
  const [isMouseAtTop, setIsMouseAtTop] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Show if mouse is in the top 80px of the screen
      setIsMouseAtTop(e.clientY < 80);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 px-6 py-8 flex justify-between items-center transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
      isMouseAtTop 
        ? 'translate-y-0 opacity-100' 
        : '-translate-y-full opacity-0 pointer-events-none'
    } ${isDarkMode ? 'glass-dark border-b border-white/10' : 'bg-white/80 backdrop-blur-md border-b border-black/10'}`}>
      <div />
      
      <div className="flex items-center space-x-12">
        <div className="hidden md:flex space-x-12 text-[10px] uppercase tracking-widest font-light">
          <a href="#about" className={`transition-colors ${isDarkMode ? 'hover:text-gray-400 text-white' : 'hover:text-gray-500 text-black'}`}>About</a>
          <a href="#work" className={`transition-colors ${isDarkMode ? 'hover:text-gray-400 text-white' : 'hover:text-gray-500 text-black'}`}>Work</a>
          <a href="#contact" className={`transition-colors ${isDarkMode ? 'hover:text-gray-400 text-white' : 'hover:text-gray-500 text-black'}`}>Contact</a>
        </div>

        {/* Minimalist Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className={`flex items-center space-x-4 px-4 py-2 rounded-full border transition-all duration-500 hover:scale-105 active:scale-95 ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}
        >
          <span className={`text-[8px] font-mono tracking-[0.3em] uppercase ${isDarkMode ? 'text-white' : 'text-black/40'}`}>NOX</span>
          <div className={`w-8 h-3 rounded-full relative transition-colors ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`}>
            <div className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-500 ${isDarkMode ? 'left-1 bg-white' : 'left-5 bg-black'}`}></div>
          </div>
          <span className={`text-[8px] font-mono tracking-[0.3em] uppercase ${!isDarkMode ? 'text-black font-bold' : 'text-white/40'}`}>LUX</span>
        </button>
      </div>

      <div className="md:hidden">
        <span className={`text-[8px] uppercase tracking-widest border px-3 py-1 rounded-full ${isDarkMode ? 'border-white/20' : 'border-black/20'}`}>Menu</span>
      </div>
    </nav>
  );
};

export default Navigation;
