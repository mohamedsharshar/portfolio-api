// ─────────────────────────────────────────────────────────
//  World Landmark Data
//  Each entry represents one zone/landmark in the 3D world.
//  Special zones: 'about', 'skills', 'contact'
//  Project zones: every actual project
// ─────────────────────────────────────────────────────────

export const specialLandmarks = [
  {
    id: 'about',
    name: 'Mohamed SharShar',
    subtitle: 'Full-Stack Developer · AI Enthusiast',
    description:
      'A passionate developer from Egypt, building human-centered digital experiences that blend elegant engineering with creative thinking. Computer Science & AI graduate — always exploring the space between technology and people.',
    position: [0, 0, 0],
    landmarkType: 'camp',
    color: '#d4a96a',
    cinematicCamera: { position: [3, 4, 6], target: [0, 1, 0] },
    theme: 'warm',
  },
  {
    id: 'skills',
    name: 'The Training Grounds',
    subtitle: 'Skills & Mastery',
    description:
      'Languages & Frameworks: JavaScript, TypeScript, Python, React, Next.js, Node.js, Express · Databases: MongoDB, PostgreSQL, MySQL · Tools: Git, Docker, Vite, Tailwind CSS · AI/ML: LangChain, OpenAI API, Hugging Face',
    position: [20, 0, 15],
    landmarkType: 'training_ground',
    color: '#6aaa8e',
    cinematicCamera: { position: [24, 5, 22], target: [20, 0, 15] },
    theme: 'cool',
    skills: [
      { name: 'React', icon: '⚛️' },
      { name: 'Node.js', icon: '🟢' },
      { name: 'Python', icon: '🐍' },
      { name: 'TypeScript', icon: '🔷' },
      { name: 'MongoDB', icon: '🍃' },
      { name: 'Docker', icon: '🐳' },
      { name: 'Next.js', icon: '▲' },
      { name: 'Tailwind', icon: '🌊' },
    ],
  },
  {
    id: 'contact',
    name: 'The Lighthouse Gate',
    subtitle: 'Reach Out',
    description:
      'Open to collaboration, freelance work, and full-time opportunities. Whether you have a project in mind or just want to talk — the gate is always open.',
    position: [-30, 0, -30],
    landmarkType: 'lighthouse',
    color: '#7ab0e0',
    cinematicCamera: { position: [-26, 7, -24], target: [-30, 2, -30] },
    theme: 'mystical',
    contact: {
      email: 'mohammedsharshaar@gmail.com',
      github: 'https://github.com/mohamedsharshaar',
      linkedin: 'https://linkedin.com/in/mohamedsharshaar',
    },
  },
];

export const projects = [
  {
    id: 'masarat',
    name: 'Masarat',
    subtitle: 'The Waypost Shrine',
    description:
      'A comprehensive educational platform guiding students through structured learning paths with curated resources, progress tracking, and mentorship connections. Built to bridge the gap between self-learners and structured guidance.',
    tech: ['React', 'Node.js', 'MongoDB', 'Express', 'JWT'],
    link: 'https://github.com/mohamedsharshaar/masarat',
    position: [15, 0, -10],
    landmarkType: 'shrine',
    color: '#c9a86a',
    cinematicCamera: { position: [18, 6, -6], target: [15, 1, -10] },
    theme: 'warm',
  },
  {
    id: 'hr-genie',
    name: 'HR Genie',
    subtitle: 'The Lantern Hall',
    description:
      'An AI-powered HR management platform streamlining recruitment, onboarding, and employee management. Features intelligent resume screening, automated workflows, and analytics dashboards to help teams focus on people, not paperwork.',
    tech: ['React', 'Express', 'OpenAI API', 'PostgreSQL', 'Tailwind CSS'],
    link: 'https://github.com/mohamedsharshaar/hr-genie',
    position: [-15, 0, -8],
    landmarkType: 'hearth',
    color: '#e8a06a',
    cinematicCamera: { position: [-18, 5, -4], target: [-15, 1, -8] },
    theme: 'warm',
  },
  {
    id: 'portfolio-api',
    name: 'Portfolio API',
    subtitle: 'The Crystal Obelisk',
    description:
      'A RESTful API powering this very world — serving project data, contact form submissions, and analytics. Built with scalability and clean architecture in mind, following SOLID principles and MVC patterns.',
    tech: ['Node.js', 'Express', 'MongoDB', 'JWT', 'REST API'],
    link: 'https://github.com/mohamedsharshaar/portfolio-api',
    position: [0, 0, -25],
    landmarkType: 'obelisk',
    color: '#9b8ee8',
    cinematicCamera: { position: [4, 7, -20], target: [0, 2, -25] },
    theme: 'mystical',
  },
  {
    id: 'quest-four',
    name: 'Coming Soon…',
    subtitle: 'The Ancient Ruin',
    description:
      'A new project taking shape in the forge. Return soon — this landmark will be fully restored when the work is unveiled.',
    tech: ['???'],
    link: '#',
    position: [25, 0, -20],
    landmarkType: 'tower',
    color: '#8a9b6e',
    cinematicCamera: { position: [29, 6, -15], target: [25, 1, -20] },
    theme: 'ancient',
  },
];

export const allLandmarks = [...specialLandmarks, ...projects];