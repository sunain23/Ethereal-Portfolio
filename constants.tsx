import { PortfolioItem } from './types';

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'PROC-08',
    title: 'Long Form',
    category: 'Editorial',
    thumbnail: '/india-data-fortress.png',
    videoPreview: 'https://drive.google.com/file/d/1oNi_qgf71Sr5iWIcdg6ZYX06bR2FCzR9/view?usp=sharing',
    videos: [
      'https://drive.google.com/file/d/1oNi_qgf71Sr5iWIcdg6ZYX06bR2FCzR9/view?usp=sharing',
      'https://drive.google.com/file/d/1bMJoKvsts9oqtgOUHiCerwsNmiaQM7Xc/view?usp=sharing'
    ],
    videoTitles: [
      'India is building a fortress for Indian data',
      'Loop Engineering'
    ],
    videoDescriptions: [
      'a story and a chart for the day shaping Indian and global markets',
      'The real skill is loop engineering — getting AI to keep working on its own, checking and watching until something actually matters, no code required.'
    ],
    description: 'A curated showcase of comprehensive long form edits, breakdowns, and rhythmic storytelling.',
    tools: ['Davinci Resolve', 'After Effects', 'Premiere Pro']
  },
  {
    id: 'EDIT-09',
    title: 'Short Form',
    category: 'Editorial',
    thumbnail: 'https://lh3.googleusercontent.com/d/1NmK25CczXO4jnVYGXIqgHw8BFKkfuR8Y',
    motionDesign: [
      'https://drive.google.com/file/d/1O_Dn49p325hQ_d-dZbDU713ro85Te3nQ/view?usp=sharing',
      'https://drive.google.com/file/d/1dj2R1IaSxgvgiYz8z9d5hoHTVTl71svl/view?usp=sharing',
      'https://drive.google.com/file/d/1ymCC5_d8ehjU5hb9vn71ZsUS2Hc6u7Jc/view?usp=sharing'
    ],
    motionDesignTitles: [
      'Podcast Intro Draft #1',
      'Podcast Intro Draft #2',
      'Podcast Intro Draft #3'
    ],
    motionDesignDescriptions: [
      'Minimal with an Indian touch, smooth and each scene flows seamlessly to the other.',
      'More illustratative and very stylized art style.',
      'Very element heavy and infromative style witha a lot of visual elements.'
    ],
    edits: [
      'https://drive.google.com/file/d/1Q0nvXpp8VcC6omSayX3PLaEdT7gDDbWE/view?usp=sharing',
      'https://drive.google.com/file/d/1HIlr7yHc03iLWxf8uEn6gVDa2L2Uc9ny/view?usp=sharing',
      'https://drive.google.com/file/d/1KtQnUmcB6QxxhJoLlJrYJ8Raq3EXDcqL/view?usp=sharing',
      'https://drive.google.com/file/d/1qiEuo7P9FWM7XXJ_j65ZX5esfPfA_56H/view?usp=sharing',
      'https://drive.google.com/file/d/1iEY3NyCbEkbqattEwbpZvMppqYgCjEyG/view?usp=sharing'
    ],
    editsTitles: [
      'Creative Edits',
      'Creative Edits',
      'Creative Edits',
      'Creative Edits',
      'Creative Edits'
    ],
    editsDescriptions: [
      'A 125th anniversary tribute for FC Bayern Munchen.',
      'A 20 year anniversary celebration tribute for Naruto.',
      'A showcase of blending tech and art as a tribute for Serial Experiments of Lain.',
      'An NYC Ad featuring Miles Morales.',
      'A tribute to 2022 WC ft. Nike: The Last Game.'
    ],
    description: 'A high-impact fusion of rhythmic editing, motion design, and bold graphic identity.',
    tools: ['Premiere Pro', 'DaVinci Resolve', 'After Effects', 'Photoshop', 'Blender']
  },
  {
    id: 'CG-042',
    title: 'CGI and 3D',
    category: 'CGI',
    thumbnail: 'https://lh3.googleusercontent.com/d/1cTsVGeQpYbH3rncqT_2fbz3IRuVyGMW2',
    images: [
      'https://drive.google.com/file/d/1cTsVGeQpYbH3rncqT_2fbz3IRuVyGMW2/view?usp=sharing',
      'https://drive.google.com/file/d/1vbbiVezV0xrRUZQcbWe8y0g9KxHOnLcl/view?usp=sharing'
    ],
    imageDescriptions: [
      'A high quality Avatar created in Daz 3D and rendered in Blender',
      'A high quality real life representation of Rei Ayanami from Evangelion, made and rendered in Unreal Engine',
      'Simulated moss growth and organic decay over the architectural surfaces.'
    ],
    imageTitles: [
      'Avatar #1',
      'Avatar #2',
      'Moss Growth Simulation'
    ],
    videoPreview: 'https://drive.google.com/file/d/1W-7iEdajjPZ9FfYfw5Cj8BS38EJ-twfI/view?usp=sharing',
    videos: [
      'https://drive.google.com/file/d/1W-7iEdajjPZ9FfYfw5Cj8BS38EJ-twfI/view?usp=sharing',
      'https://drive.google.com/file/d/16EGMLyVFpDD1MpsCZSw5o_TrunncMbnY/view?usp=sharing',
      'https://drive.google.com/file/d/1CDxRLF1SCbnaYc-S8-6F_1-V1miMgULT/view?usp=sharing',
      'https://drive.google.com/file/d/1R3Rec4Ef2cL57SbDkh4JOEt7Mxk4Ho_B/view?usp=sharing',
      'https://drive.google.com/file/d/1gL6iiGb25qnaUGBv8oKptwY-B-PoVRz_/view?usp=sharing'
    ],
    videoDescriptions: [
      'Visualizer of a cat, at the park.',
      'An errie Sci Fi Lab Walkthrough.',
      'Drone flying through the park.',
      'Simulating growth of flowers.',
      'Collaboration Announcement.'
    ],
    videoTitles: [
      'Cat at the Park',
      'Sci-Fi Lab',
      'Flying the Drone',
      'Growth',
      'Broadway Collaboration'
    ],
    description: 'A high-fidelity showcase of photorealistic environments and cinematic product visualizations that bridge the gap between digital imagination and commercial reality.',
    tools: ['Blender', 'After Effects']
  },
  {
    id: 'VFX-001',
    title: 'Short Films',
    category: 'VFX Compositing',
    thumbnail: 'https://lh3.googleusercontent.com/d/1CNDl6ekY7dUwzU_UluIeuMIuvucS3Q1L',
    images: [
      'https://lh3.googleusercontent.com/d/1CNDl6ekY7dUwzU_UluIeuMIuvucS3Q1L',
      'https://drive.google.com/file/d/11tCvcMFEkd30NRMBMy-a5DygZ-XvF0RP/view?usp=sharing',
      'https://drive.google.com/file/d/1cJW3AtSba0h41v8vqHHUSIfF_RwLyXp7/view?usp=sharing'
    ],
    imageDescriptions: [
      'A test render short from Then there were ten.',
      'An important shot from Mekuri',
      'An emotional shot from Behind the Mask'
    ],
    imageTitles: [
      'Shot #09',
      'Shot #37',
      'Shot #29'
    ],
    videoPreview: 'https://drive.google.com/file/d/1UnqO6pO8xFPtXKUowfiL8pqcmcdPCpQF/view?usp=sharing',
    videos: [
      'https://drive.google.com/file/d/1UnqO6pO8xFPtXKUowfiL8pqcmcdPCpQF/view?usp=sharing',
      'https://drive.google.com/file/d/1vhSbuDA_3B5qXMtlfe2h1M8_TbAycIRN/view?usp=sharing'
    ],
    videoDescriptions: [
      'A poignant exploration of isolation and desperation, centering on a young boy yearning for the attention of his overworked father, whose attempts to provide carry a heavy, unseen toll.',
      'After a bizarre encounter with a stray cat, an overworked man’s reality begins to unravel as he succumbs to increasingly strange, feral impulses.'
    ],
    videoTitles: [
      'Behind the Mask',
      'Mekuri'
    ],
    description: 'A curated selection of narrative projects where I served as Director, Cinematographer, and Editor, ensuring a unified vision from initial concept to final grade.',
    tools: ['Davinci Resolve', 'After Effects', 'Blender']
  }
];
