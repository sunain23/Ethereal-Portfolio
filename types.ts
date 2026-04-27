
export enum ImageSize {
  K1 = '1K',
  K2 = '2K',
  K4 = '4K'
}

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT = '3:4',
  LANDSCAPE = '4:3',
  ULTRA_PORTRAIT = '9:16',
  ULTRA_LANDSCAPE = '16:9'
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'CGI' | 'VFX Compositing' | 'Technical Direction' | 'Editorial';
  thumbnail: string;
  videoPreview?: string;
  videos?: string[];
  videoDescriptions?: string[];
  videoTitles?: string[];
  images?: string[];
  imageDescriptions?: string[];
  imageTitles?: string[];
  secondaryImages?: string[];
  secondaryImageDescriptions?: string[];
  secondaryImageTitles?: string[];
  edits?: string[];
  editsDescriptions?: string[];
  editsTitles?: string[];
  motionDesign?: string[];
  motionDesignDescriptions?: string[];
  motionDesignTitles?: string[];
  reels?: string[];
  reelsDescriptions?: string[];
  reelsTitles?: string[];
  gfx?: string[];
  gfxDescriptions?: string[];
  gfxTitles?: string[];
  description: string;
  tools: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
