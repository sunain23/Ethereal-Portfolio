
import React, { useState, useEffect, useRef } from 'react';
import { createChatSession } from '../services/geminiService';
import { ChatMessage } from '../types';

interface ChatBotProps {
  isDarkMode: boolean;
}

const ChatBot: React.FC<ChatBotProps> = ({ isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMouseAtBottom, setIsMouseAtBottom] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Show bubble if mouse is in the bottom 15% of the screen
      const threshold = window.innerHeight * 0.85;
      if (e.clientY > threshold) {
        setIsMouseAtBottom(true);
      } else {
        setIsMouseAtBottom(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        chatRef.current = createChatSession(
          "You are 'Ethereal Assistant', a digital architect. You help users navigate this VFX and CG portfolio. Keep your responses technical, intellectual, and helpful. Use terminology like 'rasterization', 'nodes', 'compositions', and 'frame rendering'. Maintain a refined, minimal tone."
        );
      }

      const response = await chatRef.current.sendMessage({ message: input });
      const modelMessage: ChatMessage = { role: 'model', text: response.text || "Compiling response..." };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Signal loss. Attempting reconnection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const shouldShow = isOpen || isMouseAtBottom;

  return (
    <>
      <div 
        className={`fixed bottom-8 right-8 z-[100] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          shouldShow ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-6 rounded-full border transition-all duration-500 hover:scale-110 shadow-2xl ${isDarkMode ? 'glass-dark border-white/20 text-white' : 'bg-white border-black/10 text-black'}`}
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <div className="flex items-center space-x-2">
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDarkMode ? 'bg-white' : 'bg-black'}`}></div>
              <span className="text-[10px] font-mono tracking-widest uppercase">UP_LINK</span>
            </div>
          )}
        </button>
      </div>

      {isOpen && (
        <div className={`fixed bottom-28 right-8 z-[100] w-[90vw] md:w-96 rounded-3xl border shadow-2xl overflow-hidden flex flex-col h-[550px] transition-all duration-700 ${isDarkMode ? 'glass-dark border-white/10' : 'bg-white border-black/10'}`}>
          <div className={`p-6 border-b flex justify-between items-center transition-colors duration-700 ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-black/5 bg-black/5'}`}>
            <span className="text-[10px] uppercase tracking-widest font-mono font-bold">ETH_ASSISTANT v2.5</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 && (
              <p className={`text-[10px] font-mono uppercase tracking-widest opacity-40 leading-relaxed ${isDarkMode ? 'text-white' : 'text-black'}`}>
                SYSTEM STANDBY. AWAITING QUERY RELEVANT TO DIGITAL PRODUCTION PIPELINE...
              </p>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-[12px] font-light leading-relaxed transition-all duration-700 ${
                  msg.role === 'user' 
                    ? (isDarkMode ? 'bg-white text-black' : 'bg-black text-white') 
                    : (isDarkMode ? 'bg-white/5 border border-white/10 text-gray-300' : 'bg-zinc-100 border border-black/5 text-gray-700')
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`p-4 rounded-2xl border transition-colors duration-700 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-zinc-100 border-black/5'}`}>
                  <div className="flex space-x-2">
                    <div className={`w-1 h-1 rounded-full animate-bounce ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`} />
                    <div className={`w-1 h-1 rounded-full animate-bounce delay-100 ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`} />
                    <div className={`w-1 h-1 rounded-full animate-bounce delay-200 ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={`p-4 border-t transition-colors duration-700 ${isDarkMode ? 'border-white/5 bg-black/40' : 'border-black/5 bg-white'}`}>
            <div className={`flex items-center rounded-2xl px-4 py-1 border transition-all duration-700 ${isDarkMode ? 'glass border-white/10 focus-within:border-white/30' : 'bg-zinc-100 border-black/5 focus-within:border-black/20'}`}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="INPUT_COMMAND"
                className="flex-1 bg-transparent text-[10px] font-mono py-4 focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                className={`ml-2 transition-colors ${isDarkMode ? 'text-white hover:text-gray-400' : 'text-black hover:text-gray-500'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
