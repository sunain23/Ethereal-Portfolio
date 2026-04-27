
import React from 'react';

interface FooterProps {
  isDarkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ isDarkMode }) => {
  return (
    <footer className={`py-20 px-6 border-t transition-colors duration-700 ${isDarkMode ? 'bg-black border-white/5' : 'bg-white border-black/5'}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="text-center md:text-left">
          <p className={`text-[10px] uppercase tracking-[0.4em] font-mono ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>Visual Intelligence & Digital Post Archive</p>
        </div>
        
        <div className="text-center md:text-right font-mono">
          <p className={`text-[10px] uppercase tracking-widest font-light ${isDarkMode ? 'text-gray-800' : 'text-gray-500'}`}>DIGITAL_ARCHIVE_SECURE</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
