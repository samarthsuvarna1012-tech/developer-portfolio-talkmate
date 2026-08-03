import { AIPersona, PromptTemplate, Project, ExperienceItem } from '../types';

export const AI_PERSONAS: AIPersona[] = [
  {
    id: 'tech-mentor',
    name: 'Tech Mentor',
    title: 'Student Developer & AI Mentor',
    description: 'Explains web development concepts, architecture choices, and practical implementation tips in a beginner-friendly way.',
    iconName: 'Code2',
    badge: 'Architecture & Learning',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'code-reviewer',
    name: 'Code Reviewer',
    title: 'Code Review Partner',
    description: 'Reviews snippets for clarity, robustness, and common issues while keeping feedback constructive.',
    iconName: 'CheckSquare',
    badge: 'Code Quality',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'career-mentor',
    name: 'Career Mentor',
    title: 'Learning Coach',
    description: 'Offers guidance on building projects, learning in public, and growing as a developer through hands-on work.',
    iconName: 'Briefcase',
    badge: 'Growth & Learning',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'tech-interviewer',
    name: 'Technical Interviewer',
    title: 'Practice Interviewer',
    description: 'Runs mock questions about web development, APIs, debugging, and frontend fundamentals.',
    iconName: 'Cpu',
    badge: 'Interview Prep',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'ui-designer',
    name: 'UI/UX Architect',
    title: 'Design Partner',
    description: 'Advises on accessible layouts, simple visual polish, and thoughtful interface decisions for student projects.',
    iconName: 'Layers',
    badge: 'Design & UX',
    color: 'from-pink-500 to-rose-600',
  },
  {
    id: 'ai-researcher',
    name: 'AI Researcher',
    title: 'AI Explorer',
    description: 'Explains prompt ideas, streaming AI interactions, multimodal features, and beginner-friendly AI concepts.',
    iconName: 'Sparkles',
    badge: 'AI & Machine Learning',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'friendly-companion',
    name: 'Friendly Assistant',
    title: 'Study Companion',
    description: 'Cheerful and flexible for everyday questions, learning support, and project discussions.',
    iconName: 'Sparkles',
    badge: 'General & Learning',
    color: 'from-purple-500 to-pink-600',
  }
];

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'p1',
    category: 'Coding',
    title: 'React Custom Hook',
    prompt: 'Create a reusable React custom hook in TypeScript for managing async data fetching with retry logic, loading states, and cancellation support.',
    icon: 'Code'
  },
  {
    id: 'p2',
    category: 'Architecture',
    title: 'System Design Diagram',
    prompt: 'Explain the high-level architecture for a simple chat app that uses a React client, a serverless backend, and a streaming AI response.',
    icon: 'Server'
  },
  {
    id: 'p3',
    category: 'Portfolio',
    title: 'Explain TalkMate AI',
    prompt: 'Explain how TalkMate AI was built into this portfolio, including the React frontend, server-side AI integration, and the chat experience.',
    icon: 'Bot'
  },
  {
    id: 'p4',
    category: 'Productivity',
    title: 'Code Refactoring Review',
    prompt: 'Give me 5 practical principles for refactoring React components into cleaner, easier-to-maintain TypeScript code.',
    icon: 'Zap'
  },
  {
    id: 'p5',
    category: 'Learning',
    title: 'AI Engineering Concepts',
    prompt: 'Explain how streaming AI responses and multimodal inputs work in a simple, beginner-friendly way.',
    icon: 'BookOpen'
  }
];

export const PORTFOLIO_PROJECTS: Project[] = [
  {
    id: 'talkmate-ai',
    title: 'TalkMate AI',
    tagline: 'A voice-friendly AI assistant built into this portfolio',
    description: 'TalkMate brings together a React chat interface, Vercel serverless functions, and Gemini-powered streaming responses. The project helped me explore secure AI requests, conversational UI, file handling, and accessible interaction design.',
    category: 'AI',
    tags: ['React 19', 'TypeScript', 'Vercel Functions', 'Streaming AI', 'Voice UI'],
    link: '/talkmate',
    githubUrl: 'https://github.com/samarthsuvarna1012-tech/developer-portfolio-talkmate',
    isFeatured: true,
    stats: 'Portfolio Highlight • AI Assistant'
  },
  {
    id: 'developer-portfolio',
    title: 'Developer Portfolio',
    tagline: 'A student portfolio site focused on clarity and learning',
    description: 'This portfolio is a place to share projects, explain engineering choices, and present work in a way that feels honest, practical, and student-focused. It also includes a TalkMate experience and a real contact form handled by serverless functions.',
    category: 'Full-Stack',
    tags: ['React', 'TypeScript', 'Vite', 'Vercel Functions', 'Portfolio UX'],
    link: '/projects',
    githubUrl: 'https://github.com/samarthsuvarna1012-tech/developer-portfolio-talkmate',
    isFeatured: false,
    stats: 'Portfolio • Web Experience'
  }
];

export const WORK_EXPERIENCE: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: 'Computer Science Student',
    company: 'Independent Projects & Coursework',
    period: '2024 — Present',
    description: 'Building portfolio projects and learning through hands-on experimentation with React, TypeScript, Vercel Functions, and AI integrations.',
    technologies: ['React 19', 'TypeScript', 'Node.js', 'AI APIs', 'Vite'],
    achievements: [
      'Built a portfolio site that explains projects, engineering decisions, and learning outcomes clearly.',
      'Created TalkMate AI to explore streaming AI conversations, voice interaction, and file-aware chat experiences.',
      'Improved frontend and backend communication by moving API calls to typed serverless functions.'
    ]
  },
  {
    id: 'exp-2',
    role: 'Self-Directed Builder',
    company: 'Personal Learning Projects',
    period: '2023 — 2024',
    description: 'Focused on practical web development skills through small apps, API integration, and iterative UI improvements.',
    technologies: ['React', 'Vercel Functions', 'Tailwind CSS', 'REST APIs', 'GitHub'],
    achievements: [
      'Learned how to structure a simple full-stack application with a clear separation between frontend and serverless API logic.',
      'Practiced accessibility, responsive design, and user feedback patterns while improving interface quality.',
      'Used GitHub and project documentation to communicate progress and decisions clearly.'
    ]
  }
];
