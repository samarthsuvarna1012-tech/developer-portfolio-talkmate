export type RoutePath = '/' | '/about' | '/projects' | '/contact' | '/talkmate';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  fileData?: {
    name: string;
    mimeType: string;
    data: string; // base64
  };
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  personaId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIPersona {
  id: string;
  name: string;
  title: string;
  description: string;
  iconName: string;
  systemPrompt: string;
  badge: string;
  color: string;
}

export interface PromptTemplate {
  id: string;
  category: string;
  title: string;
  prompt: string;
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'AI' | 'Full-Stack' | 'Cloud' | 'DevTools';
  tags: string[];
  link: string;
  githubUrl?: string;
  isFeatured?: boolean;
  image?: string;
  stats?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
  achievements: string[];
}

