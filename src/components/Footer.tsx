import React from 'react';
import { Code2, Github, Linkedin, Twitter, Bot, Heart, ArrowUp } from 'lucide-react';
import { RoutePath } from '../types';

interface FooterProps {
  onNavigate: (path: RoutePath) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <Code2 className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <span className="font-bold text-slate-100 text-lg">Samarth Suvarna</span>
          </div>
          <p className="text-sm text-slate-400 max-w-md leading-relaxed">
            Computer science student building React, TypeScript, Vercel Functions, and AI-powered projects while learning by shipping practical web experiences.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://github.com/samarthsuvarna1012-tech"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/samarth-suvarna-09b1001b7/"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-slate-200 text-sm tracking-wider uppercase mb-4">Navigation</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <button onClick={() => onNavigate('/')} className="hover:text-cyan-400 transition-colors">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('/about')} className="hover:text-cyan-400 transition-colors">
                About Me
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('/projects')} className="hover:text-cyan-400 transition-colors">
                Projects Showcase
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('/contact')} className="hover:text-cyan-400 transition-colors">
                Get in Touch
              </button>
            </li>
          </ul>
        </div>

        {/* Featured App */}
        <div>
          <h4 className="font-semibold text-slate-200 text-sm tracking-wider uppercase mb-4">Portfolio Highlight</h4>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-medium text-sm">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>TalkMate AI Page</span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive AI assistant with streaming responses and real-time updates.
            </p>
            <button
              onClick={() => onNavigate('/talkmate')}
              className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Open /talkmate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Samarth Suvarna. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            Built with React & intelligent AI streaming
          </span>
          <button
            onClick={scrollToTop}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
