
import React, { useEffect, useRef, useState } from 'react';
import { generateLogo } from '../services/geminiService';

interface AboutProps {
  isDarkMode: boolean;
}

const RevealSection = ({ title, items, isDarkMode }: { title: string, items: any[], isDarkMode: boolean }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <span className={`block text-[8px] uppercase tracking-[0.4em] text-gray-500 mb-12 font-mono transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {title}
      </span>
      <div className="space-y-20">
        {items.map((item, idx) => (
          <div 
            key={idx} 
            className={`group relative transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
            style={{ transitionDelay: isVisible ? `${300 + (idx * 300)}ms` : '0ms' }}
          >
            <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-4">
              <span className="text-[9px] font-mono tracking-[0.3em] text-emerald-500 mb-2 md:mb-0">{item.period}</span>
              <h3 className="text-2xl md:text-3xl serif font-bold italic tracking-tight">{item.role}</h3>
            </div>
            <div className="flex items-center space-x-4 mb-6">
              <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${isDarkMode ? 'text-white/60' : 'text-black/60'}`}>{item.company}</span>
              <div className={`h-px flex-1 transition-all duration-1000 ${isDarkMode ? 'bg-white/5 group-hover:bg-white/20' : 'bg-black/5 group-hover:bg-black/20'}`}></div>
            </div>
            <p className={`text-sm font-light leading-relaxed max-w-2xl transition-colors ${isDarkMode ? 'text-zinc-500 group-hover:text-zinc-300' : 'text-zinc-400 group-hover:text-zinc-600'}`}>
              {item.description}
            </p>
            <div className={`absolute -left-8 top-0 bottom-0 w-px transition-all duration-700 ${isDarkMode ? 'bg-white/5 group-hover:bg-emerald-500/30' : 'bg-black/5 group-hover:bg-emerald-500/30'}`}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const About: React.FC<AboutProps> = ({ isDarkMode }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>('https://lh3.googleusercontent.com/d/10A5kzsYmUfFDAIrbv28CGXgwxnoVMsCz');
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
  const [isHoveringIdentity, setIsHoveringIdentity] = useState(false);
  const [identityText, setIdentityText] = useState('SUNAIN, 23');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const target = "SUNAIN, 23";
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    
    if (isHoveringIdentity) {
      let iteration = 0;
      interval = setInterval(() => {
        setIdentityText(target.split("").map((letter, index) => {
          if (index < iteration) {
            return target[index];
          }
          return letters[Math.floor(Math.random() * letters.length)];
        }).join(""));
        
        if (iteration >= target.length) {
          clearInterval(interval);
        }
        iteration += 1 / 3;
      }, 30);
    } else {
      setIdentityText(target);
    }
    
    return () => clearInterval(interval);
  }, [isHoveringIdentity]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLogoGen = async () => {
    setIsGeneratingLogo(true);
    try {
      const url = await generateLogo();
      setLogoUrl(url);
    } catch (err) {
      console.error("Logo generation failed", err);
    } finally {
      setIsGeneratingLogo(false);
    }
  };

  const experiences = [
    {
      period: '2021 — PRESENT',
      role: 'Freelancer',
      company: 'INDEPENDENT',
      description: 'An expert blend of cinematic 3D visualization and high-energy editing, focused on creating seamless, high-fidelity digital narratives.'
    },
    {
      period: '2025-2025',
      role: 'Video Editor',
      company: 'TIER2 DIGITAL',
      description: 'High-impact B2B ads and testimonial narratives designed to drive measurable growth and engagement within the health and education sectors.'
    },
    {
      period: '2025-2026',
      role: 'Lead Video Editor',
      company: 'Canvas & Co.',
      description: 'Driving high-impact narrative flow for global commercial campaigns. Specialized in multi-track non-linear workflows and seamless integration of dynamic motion graphics.'
    }
  ];

  const education = [
    {
      period: '2021-2025',
      role: 'B.Des in Animation & VFX',
      company: 'ARTEMISIA COLLEGE OF ART & DESIGN',
      description: 'Focused on cinematic storytelling, advanced editing workflows, and digital compositing. Graduated with honors.'
    }
  ];

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className={`py-32 px-6 transition-colors duration-700 relative z-20 overflow-hidden ${isDarkMode ? 'bg-black' : 'bg-white'}`}
    >
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Header Column */}
          <div className={`lg:col-span-5 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            <div className="sticky top-32">
              <div className="flex items-center space-x-3 mb-8">
                <span className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-white' : 'bg-black'}`}></span>
                <p className={`uppercase tracking-[0.6em] text-[10px] font-mono ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Professional_Profile</p>
              </div>
              <h2 className="text-4xl md:text-7xl serif font-bold mb-10 italic leading-none tracking-tighter">Sunain.</h2>
              <p className={`text-lg font-light leading-relaxed mb-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Crafting immersive visual narratives where cinematic soul meets technical exactness.
              </p>
              
              {/* Brand Identity Generator Block */}
              <div className={`mt-16 p-8 rounded-[2rem] border transition-all duration-700 ${isDarkMode ? 'glass border-white/10' : 'bg-zinc-50 border-black/5'}`}>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[9px] font-mono uppercase tracking-[0.3em] opacity-40">Identity_Synthesis</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${isGeneratingLogo ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-500'}`}></div>
                </div>
                
                <div 
                  className={`aspect-square w-full rounded-2xl overflow-hidden mb-6 relative group border cursor-pointer transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-4 ${isDarkMode ? 'border-white/5 bg-black hover:border-white/30 hover:bg-zinc-800 hover:shadow-[0_20px_40px_-10px_rgba(255,255,255,0.05)]' : 'border-black/5 bg-white hover:border-black/20 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]'}`}
                  onMouseEnter={() => setIsHoveringIdentity(true)}
                  onMouseLeave={() => setIsHoveringIdentity(false)}
                >
                  {logoUrl ? (
                    <>
                      <img 
                        src={logoUrl} 
                        alt="Ethereal Logo Concept" 
                        referrerPolicy="no-referrer"
                        className={`w-full h-full object-cover transition-all duration-[1200ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.05] ${isGeneratingLogo ? 'opacity-20 blur-sm' : 'opacity-100'}`} 
                      />
                      <div className="absolute bottom-0 left-0 w-full py-3 px-4 opacity-0 group-hover:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] bg-black/40 backdrop-blur-md border-t border-white/10 z-10 flex items-center justify-center translate-y-4 group-hover:translate-y-0">
                        <span className="text-[9px] font-mono tracking-[0.3em] text-emerald-500 uppercase">{identityText}</span>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20">
                       <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                       <p className="text-[8px] uppercase tracking-widest">Null_Identity</p>
                    </div>
                  )}
                  
                  {isGeneratingLogo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className={`w-8 h-8 border-t-2 rounded-full animate-spin ${isDarkMode ? 'border-white' : 'border-black'}`}></div>
                    </div>
                  )}
                </div>


              </div>
            </div>
          </div>

          {/* Experience Column */}
          <div className="lg:col-span-7 space-y-32">
            <RevealSection title="// EXPERIENCE_LOG" items={experiences} isDarkMode={isDarkMode} />
            <RevealSection title="// EDUCATION_LOG" items={education} isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
