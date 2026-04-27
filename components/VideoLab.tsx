
import React, { useState } from 'react';
import { generateVideo } from '../services/geminiService';

interface VideoLabProps {
  isDarkMode: boolean;
}

const VideoLab: React.FC<VideoLabProps> = ({ isDarkMode }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [ratio, setRatio] = useState<'16:9' | '9:16'>('16:9');
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState('');

  const loadingSteps = [
    "Allocating GPU kernels...",
    "Solving fluid equations...",
    "Rasterizing neural textures...",
    "Compositing sub-surface layers...",
    "Final pass denoising..."
  ];

  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    
    if (!videoId) return url;
    // Using youtube-nocookie and minimal params to avoid Error 153
    return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;
  };

  const handleAction = async () => {
    if (!prompt.trim()) return;
    
    // Check if input is a direct YouTube link to skip generation
    if (isYouTubeUrl(prompt)) {
      setVideoUrl(prompt);
      setError(null);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);
    
    let stepIndex = 0;
    const interval = setInterval(() => {
      setLoadingStep(loadingSteps[stepIndex % loadingSteps.length]);
      stepIndex++;
    }, 4000);

    try {
      if (!(await window.aistudio.hasSelectedApiKey())) {
        await window.aistudio.openSelectKey();
      }
      
      const url = await generateVideo(prompt, ratio);
      setVideoUrl(url);
    } catch (err: any) {
      setError(err.message || "Synthesis cluster unreachable. Check system status.");
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
      setLoadingStep('');
    }
  };

  const isInputUrl = isYouTubeUrl(prompt);

  return (
    <section id="ai-lab" className={`py-40 px-6 transition-colors duration-700 border-y relative overflow-hidden ${isDarkMode ? 'bg-[#030303] border-white/5' : 'bg-zinc-50 border-black/5'}`}>
      <div 
        className={`absolute inset-0 pointer-events-none opacity-5 transition-colors duration-700 z-0`}
        style={{ 
          backgroundImage: `radial-gradient(${isDarkMode ? 'white' : 'black'} 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-20">
          <div className="flex items-center space-x-6 mb-4">
             <div className={`w-12 h-px ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`}></div>
             <p className={`uppercase tracking-[0.6em] text-[10px] font-mono ${isDarkMode ? 'text-zinc-600' : 'text-zinc-400'}`}>NEURAL SIMULATION ENGINE</p>
          </div>
          <h2 className="text-4xl md:text-8xl serif font-bold mb-6 italic">Synthesis Lab</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className={`lg:col-span-5 space-y-10 p-10 rounded-[2rem] border transition-all duration-700 ${isDarkMode ? 'glass border-white/5' : 'bg-white shadow-xl border-black/5'}`}>
            <div className="space-y-4">
              <label className={`block text-[10px] uppercase tracking-[0.3em] font-bold font-mono ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                {isInputUrl ? 'EXTERNAL_LINK_DETECTED' : 'Simulation Parameters'}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="PROMPT: Massive black hole... OR paste a YouTube link to preview."
                className={`w-full rounded-2xl p-6 transition-all resize-none h-48 text-xs leading-relaxed font-mono focus:outline-none ${isDarkMode ? 'bg-black/60 border border-white/5 text-white focus:border-white/20' : 'bg-zinc-100 border border-black/5 text-black focus:border-black/20'}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 font-mono">
              <button 
                onClick={() => setRatio('16:9')}
                className={`py-4 text-[10px] uppercase tracking-widest border rounded-xl transition-all duration-500 ${ratio === '16:9' ? 'bg-black text-white border-black' : isDarkMode ? 'border-white/5 hover:border-white/10' : 'border-black/5 hover:border-black/10'}`}
              >
                PLATFORM: 16:9
              </button>
              <button 
                onClick={() => setRatio('9:16')}
                className={`py-4 text-[10px] uppercase tracking-widest border rounded-xl transition-all duration-500 ${ratio === '9:16' ? 'bg-black text-white border-black' : isDarkMode ? 'border-white/5 hover:border-white/10' : 'border-black/5 hover:border-black/10'}`}
              >
                PLATFORM: 9:16
              </button>
            </div>

            <button
              onClick={handleAction}
              disabled={isGenerating || !prompt}
              className={`w-full py-6 rounded-2xl font-bold text-[10px] tracking-[0.5em] uppercase transition-all font-mono ${
                isGenerating ? 'bg-zinc-900 text-zinc-600' : 'bg-black text-white hover:bg-zinc-800'
              }`}
            >
              {isGenerating ? 'Computing...' : isInputUrl ? 'PREVIEW_EXTERNAL_STREAM' : 'EXECUTE_SIMULATION'}
            </button>
            
            {error && <p className="text-red-500 text-[10px] text-center tracking-widest uppercase font-mono">{error}</p>}
          </div>

          <div className="lg:col-span-7">
            <div className={`relative w-full rounded-[2rem] overflow-hidden flex items-center justify-center transition-all duration-700 min-h-[500px] border ${ratio === '9:16' ? 'aspect-[9/16] max-w-sm mx-auto' : 'aspect-video'} ${isDarkMode ? 'glass border-white/5' : 'bg-white border-black/5 shadow-2xl'}`}>
              <div className={`absolute inset-0 pointer-events-none opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]`}></div>
              
              {isGenerating ? (
                <div className="text-center p-12 space-y-6">
                  <div className="flex justify-center items-end space-x-1 h-12">
                     <div className={`w-1 animate-[bounce_1s_infinite_0.1s] ${isDarkMode ? 'bg-white' : 'bg-black'}`}></div>
                     <div className={`w-1 animate-[bounce_1s_infinite_0.2s] ${isDarkMode ? 'bg-white' : 'bg-black'}`}></div>
                     <div className={`w-1 animate-[bounce_1s_infinite_0.3s] ${isDarkMode ? 'bg-white' : 'bg-black'}`}></div>
                  </div>
                  <p className={`text-[10px] tracking-[0.4em] font-mono animate-pulse ${isDarkMode ? 'text-white' : 'text-black'}`}>{loadingStep}</p>
                </div>
              ) : videoUrl ? (
                isYouTubeUrl(videoUrl) ? (
                  <iframe 
                    src={getYouTubeEmbedUrl(videoUrl)}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
                )
              ) : (
                <div className={`text-center p-12 opacity-20 font-mono ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  <div className="mb-4 text-4xl">0%</div>
                  <p className="text-[9px] uppercase tracking-[0.6em]">STANDBY: WAITING_FOR_INPUT</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoLab;
