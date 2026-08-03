import { AIPersona, PromptTemplate, Project, ExperienceItem } from '../types';

export const AI_PERSONAS: AIPersona[] = [
  {
    id: 'tech-mentor',
    name: 'Tech Mentor',
    title: 'Senior Software Architect',
    description: 'Provides in-depth technical explanations, system design guidance, and best practices.',
    iconName: 'Code2',
    badge: 'Architecture & Engineering',
    color: 'from-blue-500 to-indigo-600',
    systemPrompt: `You are TalkMate AI acting as a Senior Software Architect and Tech Mentor.
Your goal is to explain complex technical concepts cleanly, provide idiomatic code examples in TypeScript/Python/React, discuss system architecture trade-offs, and recommend production-grade engineering patterns.
Keep explanations clear, structured, and practical.`,
  },
  {
    id: 'code-reviewer',
    name: 'Code Reviewer',
    title: 'Precise Code Auditor',
    description: 'Reviews code snippets for performance, security vulnerabilities, edge cases, and cleanliness.',
    iconName: 'CheckSquare',
    badge: 'Code Quality & Security',
    color: 'from-emerald-500 to-teal-600',
    systemPrompt: `You are TalkMate AI acting as an expert Code Reviewer and Security Auditor.
Focus on identifying potential bugs, performance bottlenecks, edge cases, and security vulnerabilities in provided code snippets.
Format feedback using clear bullet points with concise fixed code examples.`,
  },
  {
    id: 'career-mentor',
    name: 'Career Mentor',
    title: 'Tech Career & Leadership Coach',
    description: 'Offers guidance on technical interviews, resume structuring, engineering growth, and leadership.',
    iconName: 'Briefcase',
    badge: 'Career & Growth',
    color: 'from-cyan-500 to-blue-600',
    systemPrompt: `You are TalkMate AI acting as a Tech Career Coach and Senior Engineering Lead.
Help users prepare for system design and behavioral interviews, optimize technical resumes, map out career growth paths, and build high-impact portfolios.`,
  },
  {
    id: 'tech-interviewer',
    name: 'Technical Interviewer',
    title: 'Mock Interview Simulator',
    description: 'Conducts interactive coding, algorithm, and system design mock interviews with detailed feedback.',
    iconName: 'Cpu',
    badge: 'Interview Prep',
    color: 'from-violet-500 to-purple-600',
    systemPrompt: `You are TalkMate AI acting as a Technical Interviewer for senior software roles.
Ask rigorous interview questions (algorithms, React state management, distributed systems, REST/GraphQL design), evaluate candidate answers constructively, and provide detailed rubrics.`,
  },
  {
    id: 'ui-designer',
    name: 'UI/UX Architect',
    title: 'Design Systems & UX Specialist',
    description: 'Advises on modern visual design, accessibility, micro-interactions, Tailwind styling, and layout math.',
    iconName: 'Layers',
    badge: 'Design & UX',
    color: 'from-pink-500 to-rose-600',
    systemPrompt: `You are TalkMate AI acting as a Senior UI/UX Architect and Design System Lead.
Focus on accessibility (WCAG AA), responsive design math, typographic hierarchy, glassmorphism aesthetics, Tailwind CSS utilities, and micro-interaction patterns.`,
  },
  {
    id: 'ai-researcher',
    name: 'AI Researcher',
    title: 'LLM & Multimodal AI Specialist',
    description: 'Explains frontier AI models, prompt engineering strategies, RAG pipelines, and agentic workflows.',
    iconName: 'Sparkles',
    badge: 'AI & Machine Learning',
    color: 'from-amber-500 to-orange-600',
    systemPrompt: `You are TalkMate AI acting as a Lead AI Researcher and LLM Applications Engineer.
Explain state-of-the-art AI architectures, function calling, vector database embeddings, Retrieval-Augmented Generation (RAG), and fine-tuning strategies.`,
  },
  {
    id: 'friendly-companion',
    name: 'Friendly Assistant',
    title: 'Conversational Companion',
    description: 'Engaging, cheerful, and versatile for everyday queries, learning, and productivity.',
    iconName: 'Sparkles',
    badge: 'General & Learning',
    color: 'from-purple-500 to-pink-600',
    systemPrompt: `You are TalkMate AI, a friendly, empathetic, and knowledgeable AI assistant.
Respond warmly, explain ideas simply, and encourage interactive learning and curiosity. Use clear formatting and bullet points where helpful.`,
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
    prompt: 'Explain the high-level system architecture for a high-concurrency real-time notification engine using WebSockets and message queues.',
    icon: 'Server'
  },
  {
    id: 'p3',
    category: 'Portfolio',
    title: 'Explain TalkMate AI',
    prompt: 'Explain how TalkMate AI was constructed as part of this developer portfolio, including its server-side Gemini 3.6 Flash integration and React architecture.',
    icon: 'Bot'
  },
  {
    id: 'p4',
    category: 'Productivity',
    title: 'Code Refactoring Review',
    prompt: 'Give me 5 essential principles for refactoring legacy React components into modern, functional, highly readable TypeScript code.',
    icon: 'Zap'
  },
  {
    id: 'p5',
    category: 'Learning',
    title: 'AI Engineering Concepts',
    prompt: 'Explain how Retrieval-Augmented Generation (RAG) and function calling work in modern LLM applications in plain, easy-to-understand terms.',
    icon: 'BookOpen'
  }
];

export const PORTFOLIO_PROJECTS: Project[] = [
  {
    id: 'talkmate-ai',
    title: 'TalkMate AI',
    tagline: 'Intelligent Conversational Voice & Text AI Assistant',
    description: 'A feature-rich AI conversational workspace embedded into this developer portfolio. Powered by Gemini 3.6 Flash server-side integration, supporting real-time streaming, voice interaction, file analysis, custom AI personas, prompt templates, and chat export.',
    category: 'AI',
    tags: ['Gemini 3.6 Flash', 'React 19', 'TypeScript', 'Express', 'Speech Synth'],
    link: '/talkmate',
    githubUrl: 'https://github.com/example/talkmate-ai',
    isFeatured: true,
    stats: 'Full-Stack • Server-side AI'
  },
  {
    id: 'devpulse-dashboard',
    title: 'DevPulse Dashboard',
    tagline: 'Developer Velocity & Repository Analytics Engine',
    description: 'An interactive analytical dashboard visualizing GitHub commit velocity, pull request cycles, code review turnaround times, and automated build metrics.',
    category: 'Full-Stack',
    tags: ['React', 'Tailwind CSS', 'Recharts', 'REST API'],
    link: '#projects',
    githubUrl: 'https://github.com/example/devpulse-dashboard',
    isFeatured: false,
    stats: 'Analytics • Real-time Data'
  },
  {
    id: 'cloudscale-monitor',
    title: 'CloudScale Infra Monitor',
    tagline: 'Distributed Infrastructure Health Visualizer',
    description: 'Real-time telemetry and health monitoring platform for cloud microservices with instant latency heatmaps and automated alert thresholds.',
    category: 'Cloud',
    tags: ['TypeScript', 'Express', 'Metrics Engine', 'WebSockets'],
    link: '#projects',
    githubUrl: 'https://github.com/example/cloudscale-monitor',
    isFeatured: false,
    stats: 'Cloud Ops • Monitoring'
  },
  {
    id: 'neural-vision-studio',
    title: 'Neural Vision Toolkit',
    tagline: 'Multimodal AI Prompting & Computer Vision Explorer',
    description: 'An interactive playground for exploring visual prompt engineering, image classification, object detection overlays, and multimodal prompt testing.',
    category: 'AI',
    tags: ['Gemini AI', 'Canvas API', 'TypeScript', 'Tailwind'],
    link: '#projects',
    githubUrl: 'https://github.com/example/neural-vision-toolkit',
    isFeatured: false,
    stats: 'Multimodal • AI Studio'
  }
];

export const WORK_EXPERIENCE: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: 'Senior Full-Stack & AI Engineer',
    company: 'Apex AI Solutions',
    period: '2023 — Present',
    description: 'Architecting scalable web platforms and server-side LLM microservices. Directing frontend design systems and real-time streaming integrations.',
    technologies: ['React 19', 'TypeScript', 'Node.js', 'Gemini AI', 'Tailwind CSS'],
    achievements: [
      'Engineered server-side streaming AI proxies processing 50k+ daily prompts with sub-200ms TTFB.',
      'Designed high-performance canvas visualizers rendering 60 FPS orbital animations without layout thrashing.',
      'Mentored junior software developers in functional React, state optimization, and TypeScript safety.'
    ]
  },
  {
    id: 'exp-2',
    role: 'Full-Stack Software Engineer',
    company: 'Nexus Digital Systems',
    period: '2021 — 2023',
    description: 'Built high-throughput analytical dashboards and cloud telemetry platforms for enterprise client networks.',
    technologies: ['React', 'Express', 'PostgreSQL', 'Docker', 'Recharts'],
    achievements: [
      'Optimized React web applications, reducing client bundle size by 35% and improving lighthouse scores to 98+.',
      'Implemented real-time WebSocket telemetry engines monitoring thousands of active microservice instances.'
    ]
  },
  {
    id: 'exp-3',
    role: 'Frontend Software Developer',
    company: 'Innovate Labs',
    period: '2019 — 2021',
    description: 'Crafted responsive, accessible client-facing interfaces with Tailwind CSS and modern JavaScript.',
    technologies: ['JavaScript', 'React', 'Tailwind CSS', 'REST APIs', 'Jest'],
    achievements: [
      'Developed accessible, component-driven design systems used across 12 product lines.',
      'Increased user retention by 22% through micro-interaction polishes and fluid layout transitions.'
    ]
  }
];

