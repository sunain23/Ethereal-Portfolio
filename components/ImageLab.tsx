
import React, { useState, useEffect } from 'react';
import { generateImage } from '../services/geminiService';
import { ImageSize, AspectRatio } from '../types';

const ImageLab: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [size, setSize] = useState<ImageSize>(ImageSize.K1);
  const [ratio, setRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [error, setError] = useState<string | null>(null);

  const handleAuthAndGenerate = async () => {
    if (!prompt.trim()) return;
    
    setError(null);
    setIsGenerating(true);

    try {
      // Per instructions: check for selected key for Gemini 3 Pro
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
        // Proceeding after openSelectKey as instructed (assuming successful selection)
      }

      const imageUrl = await generateImage(prompt, size, ratio);
      setGeneratedImageUrl(imageUrl);
    } catch (err: any) {
      if (err.message === "KEY_RESET") {
        setError("API key selection required. Please select a valid key.");
        await window.aistudio.openSelectKey();
      } else {
        setError(err.message || "Failed to generate image.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section id="ai-lab" className="py-32 px-6 bg-[#080808]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-4xl md:text-6xl serif font-bold mb-6">Neural Synthesis</h2>
          <p className="text-gray-500 uppercase tracking-widest text-sm">Experimental AI Image Generation Lab</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="glass p-8 rounded-3xl space-y-8">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-4">Vision Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your vision (e.g., 'Ethereal monolith in a vast arctic void, brutalist architecture, cinematic lighting')"
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-white focus:outline-none focus:border-white/40 transition-all resize-none h-40"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-3">Resolution</label>
                <div className="flex space-x-2">
                  {(Object.values(ImageSize) as ImageSize[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`flex-1 py-3 text-xs border rounded-xl transition-all ${
                        size === s ? 'bg-white text-black border-white' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-3">Ratio</label>
                <select
                  value={ratio}
                  onChange={(e) => setRatio(e.target.value as AspectRatio)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-white/40"
                >
                  {(Object.values(AspectRatio) as AspectRatio[]).map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleAuthAndGenerate}
              disabled={isGenerating || !prompt}
              className={`w-full py-5 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all ${
                isGenerating ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              {isGenerating ? 'Synthesizing...' : 'Generate Art'}
            </button>
            
            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          </div>

          <div className="relative group">
            <div className={`aspect-square w-full rounded-3xl overflow-hidden glass border-white/5 flex items-center justify-center transition-all ${isGenerating ? 'animate-pulse opacity-50' : ''}`}>
              {generatedImageUrl ? (
                <img src={generatedImageUrl} alt="AI Generated Art" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-12">
                  <div className="w-24 h-24 mx-auto mb-6 opacity-20">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1"/>
                      <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1"/>
                      <path d="M21 15l-5-5L5 21" strokeWidth="1"/>
                    </svg>
                  </div>
                  <p className="text-gray-600 text-sm tracking-widest uppercase">Canvas Empty</p>
                </div>
              )}
            </div>
            {generatedImageUrl && !isGenerating && (
               <a 
                 href={generatedImageUrl} 
                 download="ethereal-art.png"
                 className="absolute bottom-6 right-6 glass p-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                 </svg>
               </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageLab;
