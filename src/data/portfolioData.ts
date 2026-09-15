import { AIPersona, PromptTemplate, Project, ExperienceItem, ProjectStatus, DeploymentInfo } from '../types';

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
    id: 'devos',
    title: 'DevOS',
    tagline: 'Developer Workflow Concept',
    description: 'A concept project exploring how a developer workspace could combine notes, planning, code context, and project thinking into one place. It is a practical idea for organizing work and keeping development flow focused.',
    category: 'DevTools',
    tags: ['TypeScript', 'Node.js', 'Workflow', 'Project Thinking', 'Developer Tools'],
    link: undefined,
    githubUrl: undefined,
    isFeatured: true,
    stats: 'Concept Project • Learning',
    status: 'development',
    deployment: { provider: 'local', url: '' },
    architectureUrl: undefined,
    docsUrl: undefined
  },
  {
    id: 'codemaker',
    title: 'CodeMaker AI',
    tagline: 'Project Workspace Prototype',
    description: 'A prototype workspace for exploring how AI can help with project structure, code understanding, and development workflows without turning the process into a black box.',
    category: 'DevTools',
    tags: ['React', 'TypeScript', 'AI Assistants', 'Project Tools', 'Code Exploration'],
    link: 'https://codemaker-ai.vercel.app/',
    githubUrl: undefined,
    isFeatured: true,
    stats: 'Prototype • Workspace',
    status: 'live',
    deployment: { provider: 'vercel', url: 'https://codemaker-ai.vercel.app/' },
    architectureUrl: undefined,
    docsUrl: undefined
  },
  {
    id: 'talkmate-ai',
    title: 'TalkMate AI',
    tagline: 'Small AI Chat Experiment',
    description: 'A lightweight chat project built to explore AI conversations, prompt design, and how a frontend can pair with a backend API to create a smoother experience.',
    category: 'AI',
    tags: ['React 19', 'TypeScript', 'Vercel Functions', 'Streaming', 'Chat UI', 'AI Experiments'],
    link: '/talkmate',
    githubUrl: 'https://github.com/samarthsuvarna1012-tech/developer-portfolio-talkmate',
    isFeatured: true,
    stats: 'Portfolio Highlight • Learning Project',
    status: 'live',
    deployment: { provider: 'vercel', url: '/talkmate' }
  },
  {
    id: 'evolvex',
    title: 'EVOLVEX',
    tagline: 'Experimental Idea Lab',
    description: 'An experimental concept focused on systems, automation, and iterative problem solving. It is more of a research-style idea space than a finished product.',
    category: 'DevTools',
    tags: ['Research', 'Experimentation', 'Systems Thinking', 'Automation', 'Exploration'],
    link: undefined,
    githubUrl: undefined,
    isFeatured: false,
    stats: 'Experiment • Research',
    status: 'pre-release',
    deployment: { provider: 'local', url: '' },
    architectureUrl: undefined,
    docsUrl: undefined
  }
];

export const WORK_EXPERIENCE: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: 'Computer Science Student',
    company: 'Independent Projects & Coursework',
    period: '2024 — Present',
    description: 'Building portfolio projects and learning through hands-on work with React, TypeScript, and web app development.',
    technologies: ['React 19', 'TypeScript', 'Node.js', 'AI APIs', 'Vite'],
    achievements: [
      'Built a portfolio to document projects, ideas, and the decisions behind them.',
      'Created TalkMate AI to explore chat interfaces, API integration, and practical frontend/backend flow.',
      'Refined project structure and UI patterns by shipping and iterating on real work.'
    ]
  },
  {
    id: 'exp-2',
    role: 'Self-Directed Builder',
    company: 'Personal Learning Projects',
    period: '2023 — 2024',
    description: 'Focused on practical front-end work, small product ideas, and learning through building.',
    technologies: ['React', 'Vercel Functions', 'Tailwind CSS', 'REST APIs', 'GitHub'],
    achievements: [
      'Learned how to structure a simple full-stack app with a clear separation between frontend and backend logic.',
      'Improved interface design and responsiveness through repeated iteration.',
      'Used GitHub and documentation to track project progress and decisions.'
    ]
  }
];
