
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PORTFOLIO_ITEMS } from '../constants';
import { PortfolioItem } from '../types';

interface PortfolioGridProps { obstruction?: boolean; isDarkMode: boolean; }

const PortfolioGrid: React.FC<PortfolioGridProps> = ({ isDarkMode }) => {
  const [items, setItems] = useState<PortfolioItem[]>(PORTFOLIO_ITEMS);
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [currentAssetIndex, setCurrentAssetIndex] = useState(0);
  const [activeMediaType, setActiveMediaType] = useState<'images' | 'secondaryImages' | 'videos' | 'edits' | 'motionDesign'>('videos');

  const getActiveMediaArray = (project: PortfolioItem | null, type: string) => {
    if (!project) return undefined;
    switch (type) {
      case 'images': return project.images;
      case 'secondaryImages': return project.secondaryImages;
      case 'videos': return project.videos;
      case 'edits': return project.edits;
      case 'motionDesign': return project.motionDesign;
      default: return undefined;
    }
  };

  const nextAsset = () => {
    const activeArray = getActiveMediaArray(selectedProject, activeMediaType);
    if (activeArray && activeArray.length > 0) {
      setCurrentAssetIndex((prev) => (prev + 1) % activeArray.length);
    }
  };

  const prevAsset = () => {
    const activeArray = getActiveMediaArray(selectedProject, activeMediaType);
    if (activeArray && activeArray.length > 0) {
      setCurrentAssetIndex((prev) => (prev - 1 + activeArray.length) % activeArray.length);
    }
  };

  useEffect(() => {
    setCurrentAssetIndex(0);
    if (selectedProject) {
      if (selectedProject.title === 'Short Form') {
        if (selectedProject.motionDesign && selectedProject.motionDesign.length > 0) {
          setActiveMediaType('motionDesign');
        } else if (selectedProject.edits && selectedProject.edits.length > 0) {
          setActiveMediaType('edits');
        } else if (selectedProject.videos && selectedProject.videos.length > 0) {
          setActiveMediaType('videos');
        } else if (selectedProject.images && selectedProject.images.length > 0) {
          setActiveMediaType('images');
        } else if (selectedProject.secondaryImages && selectedProject.secondaryImages.length > 0) {
          setActiveMediaType('secondaryImages');
        }
      } else if (selectedProject.videos && selectedProject.videos.length > 0) {
        setActiveMediaType('videos');
      } else if (selectedProject.motionDesign && selectedProject.motionDesign.length > 0) {
        setActiveMediaType('motionDesign');
      } else if (selectedProject.edits && selectedProject.edits.length > 0) {
        setActiveMediaType('edits');
      } else if (selectedProject.images && selectedProject.images.length > 0) {
        setActiveMediaType('images');
      } else if (selectedProject.secondaryImages && selectedProject.secondaryImages.length > 0) {
        setActiveMediaType('secondaryImages');
      }
    }
  }, [selectedProject]);

  const generateThumbnailFromUrl = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      
      video.onloadedmetadata = () => {
        const duration = video.duration && !isNaN(video.duration) && video.duration !== Infinity ? video.duration : 1;
        const randomTime = duration * (0.1 + Math.random() * 0.8);
        video.currentTime = randomTime;
      };
      
      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          resolve(dataUrl);
        } else {
          reject('Could not get canvas context');
        }
      };
      
      video.onerror = (e) => {
        reject('Video error: ' + e);
      };
      
      video.src = url;
    });
  };

  useEffect(() => {
    let isMounted = true;

    const processItems = async () => {
      let hasChanges = false;
      const updatedItems = await Promise.all(items.map(async (item) => {
        let newItem = { ...item };
        
        if (isYouTubeUrl(item.videoPreview) && (!item.thumbnail || item.thumbnail.includes('unsplash.com'))) {
          const ytThumb = getYouTubeThumbnailUrl(item.videoPreview!);
          if (ytThumb && newItem.thumbnail !== ytThumb) {
            newItem.thumbnail = ytThumb;
            hasChanges = true;
          }
        } else if (item.videoPreview && !isYouTubeUrl(item.videoPreview) && !isGoogleDriveUrl(item.videoPreview) && (!item.thumbnail || item.thumbnail.includes('unsplash.com'))) {
          try {
            const localThumb = await generateThumbnailFromUrl(item.videoPreview);
            if (localThumb && newItem.thumbnail !== localThumb) {
              newItem.thumbnail = localThumb;
              hasChanges = true;
            }
          } catch (err) {
            console.error('Failed to generate thumbnail for', item.videoPreview, err);
          }
        }
        
        return newItem;
      }));
      
      if (isMounted && hasChanges) {
        setItems(updatedItems);
      }
    };

    processItems();

    return () => {
      isMounted = false;
    };
  }, [items]);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const [newProject, setNewProject] = useState<Partial<PortfolioItem>>({
    title: '',
    category: 'VFX Compositing',
    description: '',
    tools: [],
    thumbnail: '',
    videoPreview: ''
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const categories = [
    { label: 'All', value: 'All' },
    { label: 'Edit', value: 'Editorial' },
    { label: 'CGI', value: 'CGI' },
    { label: 'VFX', value: 'VFX Compositing' },
  ];

  const filteredItems = useMemo(() => {
    if (activeFilter === 'All') return items;
    return items.filter(item => item.category === activeFilter);
  }, [activeFilter, items]);

  const handleFilterChange = (value: string) => {
    if (value === activeFilter) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveFilter(value);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 400);
  };

  const isYouTubeUrl = (url: string | undefined) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const isGoogleDriveUrl = (url: string | undefined) => {
    if (!url) return false;
    return url.includes('drive.google.com');
  };
  
  const getYouTubeEmbedUrl = (url: string) => {
    // Robust regex to extract YouTube ID from almost any URL format
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    
    if (!videoId) return url;

    // We use youtube-nocookie.com for better privacy and to avoid some configuration errors
    // Removed enablejsapi and autoplay as defaults which often cause "Error 153"
    return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&controls=1`;
  };

  const getGoogleDriveEmbedUrl = (url: string) => {
    // Extract ID from drive URL
    const regExp = /\/file\/d\/([^\/]+)\//;
    const match = url.match(regExp);
    const fileId = match ? match[1] : null;
    
    // If it's already a direct link with ID parameter
    if (!fileId && url.includes('id=')) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const id = urlParams.get('id');
      if (id) return `https://drive.google.com/file/d/${id}/preview`;
    }

    if (!fileId) return url;
    return `https://drive.google.com/file/d/${fileId}/preview`;
  };

  const getYouTubeThumbnailUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  };

  const generateVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      
      const url = URL.createObjectURL(file);
      
      video.onloadedmetadata = () => {
        const duration = video.duration && !isNaN(video.duration) && video.duration !== Infinity ? video.duration : 1;
        const randomTime = duration * (0.1 + Math.random() * 0.8);
        video.currentTime = randomTime;
      };
      
      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          URL.revokeObjectURL(url);
          resolve(dataUrl);
        } else {
          URL.revokeObjectURL(url);
          reject('Could not get canvas context');
        }
      };
      
      video.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject('Video error: ' + e);
      };
      
      video.src = url;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'thumbnail' | 'videoPreview') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      
      if (field === 'videoPreview') {
        setNewProject(prev => {
          const updated = { ...prev, videoPreview: url };
          // Only generate thumbnail if one doesn't already exist
          if (!prev.thumbnail) {
            generateVideoThumbnail(file).then(thumbUrl => {
              setNewProject(current => ({ ...current, thumbnail: thumbUrl }));
            }).catch(err => console.error('Thumbnail generation failed:', err));
          }
          return updated;
        });
      } else {
        setNewProject(prev => ({ ...prev, [field]: url }));
      }
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const project: PortfolioItem = {
      ...newProject as PortfolioItem,
      id: `USR-${Date.now()}`,
      tools: (newProject.tools as string[]).length > 0 ? newProject.tools as string[] : ['Custom']
    };
    setItems(prev => [project, ...prev]);
    setShowUpload(false);
    setNewProject({
      title: '',
      category: 'VFX Compositing',
      description: '',
      tools: [],
      thumbnail: '',
      videoPreview: ''
    });
  };

  useEffect(() => {
    if (selectedProject || showUpload) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [selectedProject, showUpload]);

  return (
    <section 
      id="work" 
      ref={sectionRef} 
      className={`py-20 md:py-24 px-6 transition-colors duration-700 relative z-20 ${isDarkMode ? 'bg-black' : 'bg-white'}`}
    >
      <div className="w-full">
        <div 
          className={`mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b pb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}
        >
          <div className="max-w-xl">
            <div className="flex items-center space-x-3 mb-6">
              <span className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-white' : 'bg-black'}`}></span>
              <p className={`uppercase tracking-[0.6em] text-[10px] font-mono ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Workspace Log_v2.5</p>
            </div>
            <h2 className="text-4xl md:text-7xl serif font-bold mb-4 italic leading-none">The Archives</h2>
          </div>

          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            {categories.map((cat) => (
              <button 
                key={cat.value}
                onClick={() => handleFilterChange(cat.value)}
                className={`group flex items-center pb-2 px-1 border-b transition-all duration-700 ${
                  activeFilter === cat.value 
                    ? (isDarkMode ? 'text-white border-white' : 'text-black border-black') 
                    : (isDarkMode ? 'text-zinc-600 border-transparent hover:text-white' : 'text-zinc-400 border-transparent hover:text-black')
                }`}
              >
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                  {cat.label}
                </span>
              </button>
            ))}
            

          </div>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-12 md:gap-y-16 transition-all duration-500`}>
          {filteredItems.map((item, idx) => {
            const isLastOdd = filteredItems.length % 2 !== 0 && idx === filteredItems.length - 1;
            const totalAssets = 
              (item.images?.length || 0) + 
              (item.secondaryImages?.length || 0) + 
              (item.videos?.length || 0) + 
              (item.edits?.length || 0) + 
              (item.motionDesign?.length || 0);
              
            return (
            <div 
              key={item.id} 
              className={`group relative transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] ${isVisible && !isTransitioning ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.98]'} hover:-translate-y-4 ${isLastOdd ? 'lg:col-span-2 lg:w-[calc(50%-1.5rem)] lg:mx-auto' : ''}`}
              style={{ transitionDelay: `${!isTransitioning ? 100 + (idx * 150) : 0}ms` }}
            >
              <div 
                onClick={() => setSelectedProject(item)}
                className={`relative aspect-[16/9] overflow-hidden rounded-[2.5rem] mb-5 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] border cursor-pointer ${isDarkMode ? 'bg-zinc-900 border-white/5 hover:border-white/30 hover:bg-zinc-800 shadow-[0_0_0_rgba(255,255,255,0)] hover:shadow-[0_20px_40px_-10px_rgba(255,255,255,0.05)]' : 'bg-zinc-100 border-black/5 hover:border-black/20 hover:bg-white hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]'}`}
              >
                <div className={`absolute top-0 left-0 px-4 py-2 z-10 text-[9px] font-mono border-b border-r opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-tl-[2.5rem] ${isDarkMode ? 'glass border-white/10' : 'bg-white/80 border-black/10 backdrop-blur-md'}`}>
                  ID: {item.id} // SOURCE: {item.images && item.images.length > 0 ? 'GALLERY' : (isYouTubeUrl(item.videoPreview) ? 'YOUTUBE' : (isGoogleDriveUrl(item.videoPreview) ? 'DRIVE' : 'LOCAL'))}
                </div>

                {totalAssets > 0 && (
                  <div className="absolute top-4 right-4 z-10 flex items-center space-x-2 px-3 py-1.5 rounded-full glass border border-white/10 text-[9px] font-mono text-white/80 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="flex space-x-0.5">
                      {[...Array(Math.min(3, Math.max(1, totalAssets)))].map((_, i) => (
                        <div key={i} className={`w-1 h-1 rounded-full bg-white`} />
                      ))}
                    </div>
                    <span>{totalAssets} ASSET{totalAssets !== 1 ? 'S' : ''}</span>
                  </div>
                )}

                <img 
                  src={item.thumbnail} 
                  alt={item.title} 
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[1500ms] ease-[cubic-bezier(0.25,1,0.5,1)] scale-100 group-hover:scale-[1.03] ${isDarkMode ? 'opacity-80 group-hover:opacity-100' : 'opacity-100'}`}
                  style={{ willChange: 'transform, filter' }}
                />
                
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-[800ms] ease-out">
                   <div className={`absolute inset-10 border rounded-[1rem] transition-transform duration-[1200ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105 ${isDarkMode ? 'border-white/10' : 'border-black/10'}`}></div>
                </div>

                <div className={`absolute inset-0 transition-opacity duration-[800ms] pointer-events-none ${isDarkMode ? 'bg-black/20 opacity-40 group-hover:opacity-0' : 'bg-white/10 opacity-20 group-hover:opacity-0'}`}></div>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 px-4">
                <div className="max-w-md">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className={`text-[10px] uppercase tracking-widest font-mono transition-colors duration-500 ${isDarkMode ? 'text-white/40 group-hover:text-white/80' : 'text-black/40 group-hover:text-black/80'}`}>
                      // {item.category}
                    </span>
                    <div className={`h-px flex-1 transition-all duration-1000 ${isDarkMode ? 'bg-white/5 group-hover:bg-white/20' : 'bg-black/5 group-hover:bg-black/20'}`}></div>
                  </div>
                  <h3 
                    onClick={() => setSelectedProject(item)} 
                    className="text-2xl md:text-3xl serif font-bold mb-4 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-2 cursor-pointer"
                  >
                    {item.title}
                  </h3>
                  <p className={`text-sm font-light leading-relaxed transition-colors duration-500 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{item.description}</p>
                </div>
                

              </div>
            </div>
            );
          })}
        </div>
      </div>

      {showUpload && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowUpload(false)}></div>
          <div className={`relative w-full max-w-[96vw] rounded-[2.5rem] border p-10 md:p-14 overflow-hidden ${isDarkMode ? 'glass border-white/10' : 'bg-white border-black/5'}`}>
            <h3 className="text-3xl serif italic font-bold mb-10">Inject New Asset</h3>
            <form onSubmit={handleAddProject} className="space-y-6 font-mono text-[10px]">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="uppercase tracking-widest text-zinc-500">Title_Stub</label>
                  <input required value={newProject.title} onChange={e => setNewProject(p => ({...p, title: e.target.value}))} className={`w-full bg-transparent border-b py-2 focus:outline-none ${isDarkMode ? 'border-white/10 focus:border-white' : 'border-black/10 focus:border-black'}`} placeholder="PROJECT_NAME" />
                </div>
                <div className="space-y-2">
                  <label className="uppercase tracking-widest text-zinc-500">Category_Enum</label>
                  <select value={newProject.category} onChange={e => setNewProject(p => ({...p, category: e.target.value as any}))} className={`w-full bg-transparent border-b py-2 focus:outline-none ${isDarkMode ? 'border-white/10 focus:border-white text-white' : 'border-black/10 focus:border-black text-black'}`}>
                    {categories.filter(c => c.value !== 'All').map(c => <option key={c.value} value={c.value} className="bg-zinc-900">{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="uppercase tracking-widest text-zinc-500">Description_Payload</label>
                <textarea required value={newProject.description} onChange={e => setNewProject(p => ({...p, description: e.target.value}))} rows={3} className={`w-full bg-transparent border-b py-2 focus:outline-none resize-none ${isDarkMode ? 'border-white/10 focus:border-white' : 'border-black/10 focus:border-black'}`} placeholder="METADATA_DESCRIPTION" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="uppercase tracking-widest text-zinc-500 block">Thumbnail_Raster</label>
                  <div className="flex flex-col space-y-4">
                    {newProject.thumbnail && (
                      <div className={`aspect-video w-full rounded-xl overflow-hidden border ${isDarkMode ? 'border-white/10' : 'border-black/10'}`}>
                        <img src={newProject.thumbnail} className="w-full h-full object-contain" alt="Preview" />
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'thumbnail')} className="hidden" id="thumb-up" />
                    <label htmlFor="thumb-up" className={`block w-full py-4 text-center border border-dashed rounded-xl cursor-pointer hover:bg-white/5 transition-colors ${isDarkMode ? 'border-white/10' : 'border-black/10'}`}>
                      {newProject.thumbnail ? 'CHANGE_IMAGE' : 'UPLOAD_IMAGE'}
                    </label>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="uppercase tracking-widest text-zinc-500 block">Video_Stream (File or URL)</label>
                  <div className="flex flex-col space-y-4">
                    <input 
                      type="text" 
                      value={newProject.videoPreview} 
                      onChange={e => {
                        const val = e.target.value;
                        setNewProject(p => ({...p, videoPreview: val}));
                        if (isYouTubeUrl(val) && !newProject.thumbnail) {
                          const ytThumb = getYouTubeThumbnailUrl(val);
                          if (ytThumb) setNewProject(p => ({...p, thumbnail: ytThumb}));
                        }
                      }} 
                      className={`w-full bg-transparent border-b py-2 focus:outline-none ${isDarkMode ? 'border-white/10 focus:border-white' : 'border-black/10 focus:border-black'}`} 
                      placeholder="YOUTUBE_URL_OR_DRIVE_URL" 
                    />
                    <div className="flex items-center space-x-4">
                      <input type="file" accept="video/*" onChange={e => handleFileUpload(e, 'videoPreview')} className="hidden" id="vid-up" />
                      <label htmlFor="vid-up" className={`flex-1 py-4 text-center border border-dashed rounded-xl cursor-pointer hover:bg-white/5 transition-colors ${isDarkMode ? 'border-white/10' : 'border-black/10'}`}>
                        {newProject.videoPreview && !isYouTubeUrl(newProject.videoPreview) && !isGoogleDriveUrl(newProject.videoPreview) ? 'FILE_LOADED' : 'UPLOAD_LOCAL_VIDEO'}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <button type="submit" className={`w-full py-6 rounded-xl font-bold tracking-[0.5em] uppercase transition-all ${isDarkMode ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'}`}>
                  COMMIT_TO_ARCHIVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedProject && (
        <div 
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in-95 duration-700 cubic-bezier(0.23, 1, 0.32, 1)"
          onKeyDown={(e) => e.key === 'Escape' && setSelectedProject(null)}
        >
          <div 
            className="absolute inset-0 bg-black/95 backdrop-blur-3xl" 
            onClick={() => setSelectedProject(null)}
          ></div>
          
          <div className={`relative w-full max-w-[98vw] max-h-[95vh] overflow-hidden rounded-[2.5rem] border shadow-2xl transition-all duration-[800ms] cubic-bezier(0.23, 1, 0.32, 1) flex flex-col lg:flex-row ${isDarkMode ? 'glass border-white/10 text-white' : 'bg-white border-black/5 text-black'}`}>
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-8 right-8 z-30 p-3 rounded-full glass hover:scale-110 transition-transform duration-500"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="lg:w-2/3 bg-black flex flex-col items-center justify-center overflow-hidden h-[40vh] lg:h-auto relative group/carousel">
              {(
                (selectedProject.images && selectedProject.images.length > 0 ? 1 : 0) +
                (selectedProject.secondaryImages && selectedProject.secondaryImages.length > 0 ? 1 : 0) +
                (selectedProject.videos && selectedProject.videos.length > 0 ? 1 : 0) +
                (selectedProject.edits && selectedProject.edits.length > 0 ? 1 : 0) +
                (selectedProject.motionDesign && selectedProject.motionDesign.length > 0 ? 1 : 0)
              ) > 1 && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 flex space-x-2 glass rounded-full p-1">
                  {selectedProject.videos && selectedProject.videos.length > 0 && (
                    <button 
                      onClick={() => { setActiveMediaType('videos'); setCurrentAssetIndex(0); }}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest transition-all ${activeMediaType === 'videos' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
                    >
                      {selectedProject.title === 'Short Films' ? 'Films' : 'Videos'}
                    </button>
                  )}
                  {selectedProject.motionDesign && selectedProject.motionDesign.length > 0 && (
                    <button 
                      onClick={() => { setActiveMediaType('motionDesign'); setCurrentAssetIndex(0); }}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest transition-all ${activeMediaType === 'motionDesign' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
                    >
                      Motion Design
                    </button>
                  )}
                  {selectedProject.edits && selectedProject.edits.length > 0 && (
                    <button 
                      onClick={() => { setActiveMediaType('edits'); setCurrentAssetIndex(0); }}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest transition-all ${activeMediaType === 'edits' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
                    >
                      Edits
                    </button>
                  )}
                  {selectedProject.images && selectedProject.images.length > 0 && (
                    <button 
                      onClick={() => { setActiveMediaType('images'); setCurrentAssetIndex(0); }}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest transition-all ${activeMediaType === 'images' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
                    >
                      {selectedProject.title === 'Short Films' ? 'Frames' : 'Images'}
                    </button>
                  )}
                  {selectedProject.secondaryImages && selectedProject.secondaryImages.length > 0 && (
                    <button 
                      onClick={() => { setActiveMediaType('secondaryImages'); setCurrentAssetIndex(0); }}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest transition-all ${activeMediaType === 'secondaryImages' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
                    >
                      Secondary
                    </button>
                  )}
                </div>
              )}

              {['images', 'secondaryImages'].includes(activeMediaType) && getActiveMediaArray(selectedProject, activeMediaType) && getActiveMediaArray(selectedProject, activeMediaType)!.length > 0 ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {isGoogleDriveUrl(getActiveMediaArray(selectedProject, activeMediaType)![currentAssetIndex]) ? (
                      <motion.div
                        key={currentAssetIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        className="w-full h-full"
                      >
                        <iframe 
                          src={getGoogleDriveEmbedUrl(getActiveMediaArray(selectedProject, activeMediaType)![currentAssetIndex])}
                          className="w-full h-full lg:rounded-l-[2.5rem] border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                          title={selectedProject.title}
                        />
                      </motion.div>
                    ) : (
                      <motion.img
                        key={currentAssetIndex}
                        src={getActiveMediaArray(selectedProject, activeMediaType)![currentAssetIndex]}
                        alt={`${selectedProject.title} ${activeMediaType} - ${currentAssetIndex + 1}`}
                        referrerPolicy="no-referrer"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={(_, info) => {
                          if (info.offset.x > 100) prevAsset();
                          else if (info.offset.x < -100) nextAsset();
                        }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        className="w-full h-full object-cover lg:rounded-l-[2.5rem] cursor-grab active:cursor-grabbing"
                      />
                    )}
                  </AnimatePresence>
                  
                  {getActiveMediaArray(selectedProject, activeMediaType)!.length > 1 && (
                    <>
                      <button 
                        onClick={(e) => { e.stopPropagation(); prevAsset(); }}
                        className="absolute left-6 p-3 rounded-full glass text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-500 hover:scale-110 z-10"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); nextAsset(); }}
                        className="absolute right-6 p-3 rounded-full glass text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-500 hover:scale-110 z-10"
                      >
                        <ChevronRight size={20} />
                      </button>
                      
                      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
                        {getActiveMediaArray(selectedProject, activeMediaType)!.map((_, i) => (
                          <button
                            key={i}
                            onClick={(e) => { e.stopPropagation(); setCurrentAssetIndex(i); }}
                            className={`h-1 rounded-full transition-all duration-500 ${i === currentAssetIndex ? 'bg-white w-8' : 'bg-white/20 w-2 hover:bg-white/40'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : ['videos', 'edits', 'motionDesign'].includes(activeMediaType) && getActiveMediaArray(selectedProject, activeMediaType) && getActiveMediaArray(selectedProject, activeMediaType)!.length > 0 ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentAssetIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                      className="w-full h-full"
                    >
                      {isYouTubeUrl(getActiveMediaArray(selectedProject, activeMediaType)![currentAssetIndex]) ? (
                        <iframe 
                          src={getYouTubeEmbedUrl(getActiveMediaArray(selectedProject, activeMediaType)![currentAssetIndex])}
                          className="w-full h-full lg:rounded-l-[2.5rem] border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                          title={selectedProject.title}
                        />
                      ) : isGoogleDriveUrl(getActiveMediaArray(selectedProject, activeMediaType)![currentAssetIndex]) ? (
                        <iframe 
                          src={getGoogleDriveEmbedUrl(getActiveMediaArray(selectedProject, activeMediaType)![currentAssetIndex])}
                          className="w-full h-full lg:rounded-l-[2.5rem] border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                          title={selectedProject.title}
                        />
                      ) : (
                        <video 
                          src={getActiveMediaArray(selectedProject, activeMediaType)![currentAssetIndex]} 
                          controls 
                          autoPlay 
                          loop 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover lg:rounded-l-[2.5rem]"
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {getActiveMediaArray(selectedProject, activeMediaType)!.length > 1 && (
                    <>
                      <button 
                        onClick={(e) => { e.stopPropagation(); prevAsset(); }}
                        className="absolute left-6 p-3 rounded-full glass text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-500 hover:scale-110 z-10"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); nextAsset(); }}
                        className="absolute right-6 p-3 rounded-full glass text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-500 hover:scale-110 z-10"
                      >
                        <ChevronRight size={20} />
                      </button>
                      
                      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
                        {getActiveMediaArray(selectedProject, activeMediaType)!.map((_, i) => (
                          <button
                            key={i}
                            onClick={(e) => { e.stopPropagation(); setCurrentAssetIndex(i); }}
                            className={`h-1 rounded-full transition-all duration-500 ${i === currentAssetIndex ? 'bg-white w-8' : 'bg-white/20 w-2 hover:bg-white/40'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : selectedProject.videoPreview ? (
                isYouTubeUrl(selectedProject.videoPreview) ? (
                  <iframe 
                    src={getYouTubeEmbedUrl(selectedProject.videoPreview)}
                    className="w-full h-full lg:rounded-l-[2.5rem] border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    title={selectedProject.title}
                  />
                ) : isGoogleDriveUrl(selectedProject.videoPreview) ? (
                  <iframe 
                    src={getGoogleDriveEmbedUrl(selectedProject.videoPreview)}
                    className="w-full h-full lg:rounded-l-[2.5rem] border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    title={selectedProject.title}
                  />
                ) : (
                  <video 
                    src={selectedProject.videoPreview} 
                    controls 
                    autoPlay 
                    loop 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover lg:rounded-l-[2.5rem]"
                  />
                )
              ) : (
                <img 
                  src={selectedProject.thumbnail} 
                  alt={selectedProject.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-90 lg:rounded-l-[2.5rem]"
                />
              )}
            </div>

            <div className="lg:w-1/3 p-10 md:p-14 overflow-y-auto flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-8">
                  <span className={`text-[9px] font-mono tracking-widest uppercase border px-3 py-1 rounded-full ${isDarkMode ? 'border-white/20 text-white/60' : 'border-black/10 text-black/60'}`}>
                    LOG_SEQ: {selectedProject.id}
                  </span>
                </div>
                <h3 className="text-4xl md:text-5xl serif font-bold mb-8 italic tracking-tight">
                  {(activeMediaType === 'videos' && selectedProject.videoTitles?.[currentAssetIndex]) ||
                   (activeMediaType === 'images' && selectedProject.imageTitles?.[currentAssetIndex]) ||
                   (activeMediaType === 'secondaryImages' && selectedProject.secondaryImageTitles?.[currentAssetIndex]) ||
                   (activeMediaType === 'edits' && selectedProject.editsTitles?.[currentAssetIndex]) ||
                   (activeMediaType === 'motionDesign' && selectedProject.motionDesignTitles?.[currentAssetIndex]) ||
                   selectedProject.title}
                </h3>
                <div className="space-y-10">
                  <div className="relative">
                    <div className={`absolute -left-6 top-0 bottom-0 w-px ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`}></div>
                    <p className={`text-base font-light leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {(activeMediaType === 'videos' && selectedProject.videoDescriptions?.[currentAssetIndex]) ||
                       (activeMediaType === 'images' && selectedProject.imageDescriptions?.[currentAssetIndex]) ||
                       (activeMediaType === 'secondaryImages' && selectedProject.secondaryImageDescriptions?.[currentAssetIndex]) ||
                       (activeMediaType === 'edits' && selectedProject.editsDescriptions?.[currentAssetIndex]) ||
                       (activeMediaType === 'motionDesign' && selectedProject.motionDesignDescriptions?.[currentAssetIndex]) ||
                       selectedProject.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-10 pt-4">
                    <div>
                      <span className="block text-[8px] uppercase tracking-[0.4em] text-gray-500 mb-3 font-mono">// DISCIPLINE</span>
                      <p className="text-[11px] uppercase tracking-widest font-medium">{selectedProject.category}</p>
                    </div>
                    <div>
                      <span className="block text-[8px] uppercase tracking-[0.4em] text-gray-500 mb-3 font-mono">// SOURCE_TYPE</span>
                      <p className={`text-[11px] uppercase tracking-widest font-bold ${
                        isYouTubeUrl(selectedProject.videoPreview) 
                          ? 'text-red-500' 
                          : isGoogleDriveUrl(selectedProject.videoPreview) 
                            ? 'text-sky-400' 
                            : 'text-emerald-500'
                      }`}>
                        {isYouTubeUrl(selectedProject.videoPreview) 
                          ? 'EXTERNAL_YOUTUBE' 
                          : isGoogleDriveUrl(selectedProject.videoPreview) 
                            ? 'GOOGLE_DRIVE' 
                            : 'INTERNAL_NATIVE'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase tracking-[0.4em] text-gray-500 mb-5 font-mono">// COMPONENT_STACK</span>
                    <div className="flex flex-wrap gap-3">
                      {selectedProject.tools.map((tool, idx) => (
                        <span 
                          key={idx} 
                          className={`px-4 py-1.5 text-[9px] font-mono border rounded-full transition-colors hover:bg-white hover:text-black ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-black/5 bg-black/5'}`}
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-16 pt-10 border-t border-current opacity-10 flex justify-between items-center">
                 <div className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${isDarkMode ? 'bg-white' : 'bg-black'}`}></div>
                    <span className="text-[8px] font-mono tracking-[0.3em] text-gray-500 uppercase">Archive_Secured</span>
                 </div>
                 <button 
                   onClick={() => setSelectedProject(null)}
                   className={`text-[9px] uppercase tracking-[0.5em] font-bold border-b pb-1 transition-all ${isDarkMode ? 'border-white hover:border-transparent' : 'border-black hover:border-transparent'}`}
                 >
                   EXIT_VIEW
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PortfolioGrid;
