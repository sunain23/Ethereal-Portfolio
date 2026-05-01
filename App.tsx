
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import PortfolioGrid from './components/PortfolioGrid';
import Contact from './components/Contact';
import ChatBot from './components/ChatBot';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [isMouseAtBottom, setIsMouseAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      if (scrolled > 300) {
        setShowStickyCTA(true);
      } else {
        setShowStickyCTA(false);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const threshold = window.innerHeight * 0.85;
      setIsMouseAtBottom(e.clientY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const shouldShowCTA = showStickyCTA && isMouseAtBottom;

  return (
    <div className={`relative min-h-screen transition-colors duration-700 ease-in-out selection:bg-gray-500 selection:text-white ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Precision Noise Overlay */}
      <div className={`fixed inset-0 pointer-events-none z-[100] transition-opacity duration-700 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] ${isDarkMode ? 'opacity-[0.04]' : 'opacity-[0.08]'}`}></div>
      
      {/* Background radial spotlight */}
      <div 
        className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-700 bg-radial-vignette ${isDarkMode ? 'opacity-70' : 'opacity-10'}`}
      ></div>

      {/* Floating Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
        <div 
          className={`absolute top-[20%] right-[10%] text-[8px] font-mono tracking-[1em] opacity-10 transition-colors duration-700 rotate-90 ${isDarkMode ? 'text-white' : 'text-black'}`}
        >
          COORDS: 40.7128° N, 74.0060° W
        </div>

      </div>

      <Navigation isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <main className="relative z-10">
        <Hero isDarkMode={isDarkMode} />
        
        <div className="w-full px-6 relative z-20">
          <div className={`h-px w-full transition-colors duration-700 ${isDarkMode ? 'bg-gradient-to-r from-transparent via-white/5 to-transparent' : 'bg-gradient-to-r from-transparent via-black/5 to-transparent'}`}></div>
        </div>

        <About isDarkMode={isDarkMode} />

        <PortfolioGrid isDarkMode={isDarkMode} />

        <Contact isDarkMode={isDarkMode} />
      </main>

      {/* Sticky Call to Action */}
      <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          shouldShowCTA ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'
        }`}
      >
        <button 
          onClick={scrollToContact}
          className={`px-12 py-4 rounded-full font-mono text-[10px] uppercase tracking-[0.4em] font-bold border shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group ${
            isDarkMode 
              ? 'glass-dark border-white/20 text-white hover:bg-white hover:text-black' 
              : 'bg-white/80 backdrop-blur-xl border-black/10 text-black hover:bg-black hover:text-white'
          }`}
        >
          <span className="relative z-10 flex items-center space-x-3">
            <span>Contact Me</span>
            <div className={`w-1 h-1 rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-white group-hover:bg-black' : 'bg-black group-hover:bg-white'}`}></div>
          </span>
        </button>
      </div>

      <Footer isDarkMode={isDarkMode} />
      
      <ChatBot isDarkMode={isDarkMode} />
      
      <CustomCursor isDarkMode={isDarkMode} />

      <style>{`
        html {
          scroll-behavior: smooth;
        }
        .bg-radial-vignette {
          background: radial-gradient(circle at 50% 50%, rgba(20, 20, 20, 0) 0%, rgba(0, 0, 0, 1) 100%);
        }
        
        /* Entrance Animations */
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes grid-reveal {
          0% { clip-path: circle(0% at 50% 50%); }
          100% { clip-path: circle(150% at 50% 50%); }
        }

        .animate-grid {
          animation: grid-reveal 3s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        
        .animate-enter {
          animation: fade-in-up 1.4s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }

        /* Reveal on Scroll Utilities */
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: transform 1.2s cubic-bezier(0.23, 1, 0.32, 1), opacity 1.2s cubic-bezier(0.23, 1, 0.32, 1);
          will-change: transform, opacity;
        }

        .reveal-on-scroll.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        input::placeholder, textarea::placeholder {
          color: ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
          font-family: monospace;
          text-transform: uppercase;
          font-size: 10px;
        }
        
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? '#222' : '#ddd'};
        }
        * {
          transition: background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1), color 0.8s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default App;
