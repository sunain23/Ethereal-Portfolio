
import React, { useState, useEffect, useRef } from 'react';

interface HeroProps {
  isDarkMode: boolean;
}

const CountUp: React.FC<{ 
  end: number; 
  duration: number; 
  decimals?: number; 
  suffix?: string;
  delay?: number;
}> = ({ end, duration, decimals = 0, suffix = '', delay = 0 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);
      
      // Sophisticated ease-out-expo
      const easeOutExpo = (x: number): number => {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
      };
      
      const currentCount = easeOutExpo(percentage) * end;
      countRef.current = currentCount;
      setCount(currentCount);

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    const timer = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate);
    }, delay);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(timer);
    };
  }, [end, duration, delay, isVisible]);

  return <span ref={elementRef}>{count.toFixed(decimals)}{suffix}</span>;
};

const Hero: React.FC<HeroProps> = ({ isDarkMode }) => {
  const gridColor = isDarkMode ? '#fff' : '#000';
  
  useEffect(() => {
    const handleScroll = () => {
      document.documentElement.style.setProperty('--scroll', window.scrollY.toString());
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial set
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="min-h-screen flex flex-col justify-center px-6 pt-32 pb-20 relative overflow-hidden">
      {/* Background Video Layer - High-end Minimalist Aesthetic */}
      <div 
        className="absolute -inset-20 z-0 pointer-events-none overflow-hidden"
        style={{ transform: 'translateY(calc(var(--scroll) * 0.15px))' }}
      >
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className={`w-full h-full object-cover transition-all duration-1000 ${
            isDarkMode 
              ? 'opacity-40 grayscale brightness-75' 
              : 'opacity-10 grayscale invert'
          }`}
        >
          {/* A sophisticated dark liquid/smoke abstract video for a high-end feel */}
          <source src="https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-a-black-abstract-form-background-41225-large.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Background Grid Overlay */}
      <div 
        className="absolute -inset-20 z-[2] pointer-events-none opacity-[0.03] transition-colors duration-700 animate-grid" 
        style={{ 
          backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`, 
          backgroundSize: '100px 100px',
          transform: 'translateY(calc(var(--scroll) * -0.05px))'
        }}
      ></div>
      
      <div className="relative z-10 w-full">
        <div 
          className="flex items-center space-x-4 mb-8 animate-enter" 
          style={{ 
            animationDelay: '100ms',
            transform: 'translateY(calc(var(--scroll) * 0.1px))'
          }}
        >
          <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-white' : 'bg-black'}`}></div>
          <h2 className={`text-xs uppercase tracking-[0.6em] font-light font-mono ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            VFX Artist // CG Generalist // Editor
          </h2>
          <div className={`h-px w-24 ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`}></div>
          <span className={`text-[10px] font-mono ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>RENDER_NODE_01 // 2025</span>
        </div>
        
        <h1 
          className="text-6xl md:text-[9rem] leading-[0.8] serif font-bold mb-12 w-full tracking-tighter animate-enter"
          style={{ 
            animationDelay: '300ms',
            transform: 'translateY(calc(var(--scroll) * 0.4px))'
          }}
        >
          <span className="font-['Instrument_Serif'] italic font-normal tracking-normal text-[1.15em] leading-[0.7] inline-block mb-2">Digital</span> <br /> 
          <span className={`transition-colors cursor-default ${isDarkMode ? 'text-white' : 'text-black'}`}>archive</span>.
        </h1>
        
        {/* Full-width statement spanning left to right in two lines */}
        <div 
          className="w-full mb-12 animate-enter"
          style={{ 
            animationDelay: '400ms',
            transform: 'translateY(calc(var(--scroll) * 0.15px))'
          }}
        >
          <p className={`text-sm sm:text-base md:text-lg lg:text-[1.15rem] font-light leading-relaxed tracking-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <span className="block">
              Blending CGI, VFX, and cinematic editing to craft compelling stories and elevate visual storytelling.
            </span>
            <span className="block mt-1">
              Turning ideas into immersive visual experiences that captivate, communicate, and inspire.
            </span>
          </p>
        </div>

        <div 
          className="flex flex-col md:flex-row md:items-center justify-between gap-8 w-full animate-enter"
          style={{ 
            animationDelay: '500ms',
            transform: 'translateY(calc(var(--scroll) * 0.25px))'
          }}
        >
          <div className="flex space-x-4">
            <button 
              onClick={() => document.getElementById('work')?.scrollIntoView({behavior: 'smooth'})}
              className={`group relative overflow-hidden px-10 py-5 rounded-full text-[10px] uppercase tracking-[0.4em] transition-all duration-500 animate-[breathe_4s_ease-in-out_infinite] hover:animate-none hover:scale-105 active:scale-95 border ${isDarkMode ? 'glass border-white/10 hover:border-white/40' : 'bg-black text-white border-black hover:bg-zinc-800'}`}>
              <span className="relative z-10 flex items-center space-x-3">
                <span>Explore The Archives</span>
                <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-white' : 'bg-white'}`}></div>
              </span>
            </button>
          </div>
          
          <div className="flex space-x-12 font-mono">
             <div className="text-left">
               <span className="block text-2xl serif italic mb-1 min-w-[80px]">
                 <CountUp end={0.02} duration={2500} decimals={2} suffix="ms" delay={800} />
               </span>
               <span className={`block text-[10px] uppercase tracking-widest ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>Avg Frame Latency</span>
             </div>
             <div className={`text-left border-l pl-8 ${isDarkMode ? 'border-white/10' : 'border-black/10'}`}>
               <span className="block text-2xl serif italic mb-1">
                 <CountUp end={4} duration={2000} suffix="K+" delay={1000} />
               </span>
               <span className={`block text-[10px] uppercase tracking-widest ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>Master Output</span>
             </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
