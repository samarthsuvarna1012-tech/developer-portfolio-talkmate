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
    <footer className="bg-[rgba(4,8,22,0.96)] border-t border-[var(--border-subtle)] text-[var(--text-muted)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[rgba(125,211,252,0.08)] border border-[rgba(125,211,252,0.18)] p-0.5">
              <div className="w-full h-full bg-[rgba(15,23,42,0.9)] rounded-[6px] flex items-center justify-center">
                <Code2 className="w-4 h-4 text-[var(--accent)]" />
              </div>
            </div>
            <span className="font-bold text-[var(--text-primary)] text-lg">Samarth Suvarna</span>
          </div>
          <p className="text-sm text-[var(--text-muted)] max-w-md leading-relaxed">
            Computer science student building React, TypeScript, and practical web projects while learning by shipping and iterating.
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
          <h4 className="font-semibold text-[var(--text-secondary)] text-sm tracking-wider uppercase mb-4">Navigation</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <button onClick={() => onNavigate('/')} className="hover:text-[var(--accent)] transition-colors">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('/about')} className="hover:text-[var(--accent)] transition-colors">
                About Me
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('/projects')} className="hover:text-[var(--accent)] transition-colors">
                Projects Showcase
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('/contact')} className="hover:text-[var(--accent)] transition-colors">
                Get in Touch
              </button>
            </li>
          </ul>
        </div>

        {/* Featured App */}
        <div>
          <h4 className="font-semibold text-[var(--text-secondary)] text-sm tracking-wider uppercase mb-4">Portfolio Highlight</h4>
          <div className="p-4 rounded-xl bg-[rgba(15,23,42,0.68)] border border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center gap-2 text-[var(--accent)] font-medium text-sm">
              <Bot className="w-4 h-4 text-[var(--accent)]" />
              <span>TalkMate AI Page</span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Interactive AI assistant with streaming responses and real-time updates.
            </p>
            <button
              onClick={() => onNavigate('/talkmate')}
              className="w-full py-1.5 px-3 rounded-lg bg-[rgba(125,211,252,0.08)] hover:bg-[rgba(125,211,252,0.12)] border border-[rgba(125,211,252,0.18)] text-[var(--text-primary)] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Open /talkmate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
        <p>© {new Date().getFullYear()} Samarth Suvarna. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            Built with React, TypeScript, and a lot of iteration
          </span>
          <button
            onClick={scrollToTop}
            className="p-2 rounded-lg bg-[rgba(15,23,42,0.8)] border border-[var(--border-subtle)] hover:bg-[rgba(15,23,42,0.95)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
