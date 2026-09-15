import React, { useState, useEffect } from 'react';
import { Bot, Code2, Menu, X, Sparkles, ArrowRight, Home, User, Briefcase, Mail, Mic } from 'lucide-react';
import { motion } from 'motion/react';
import { RoutePath } from '../types';

interface NavbarProps {
  currentPath: RoutePath;
  onNavigate: (path: RoutePath) => void;
  onOpenGlobalAgent: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, onOpenGlobalAgent }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', path: '/' as RoutePath, icon: Home },
    { label: 'About', path: '/about' as RoutePath, icon: User },
    { label: 'Projects', path: '/projects' as RoutePath, icon: Briefcase },
    { label: 'Contact', path: '/contact' as RoutePath, icon: Mail },
  ];

  const handleNavClick = (path: RoutePath, e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[rgba(4,8,22,0.82)] backdrop-blur-xl border-b border-[var(--border-subtle)] shadow-[0_12px_30px_rgba(2,6,23,0.24)] py-3'
          : 'bg-[rgba(4,8,22,0.58)] backdrop-blur-md py-4 border-b border-[var(--border-subtle)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={(e) => handleNavClick('/', e)}
          className="flex items-center gap-2 sm:gap-3 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded-xl min-w-0 max-w-[70%] sm:max-w-none"
        >
          <div className="w-10 h-10 rounded-xl bg-[rgba(125,211,252,0.08)] border border-[rgba(125,211,252,0.18)] shadow-[0_0_0_1px_rgba(125,211,252,0.08)] group-hover:scale-[1.02] transition-transform">
            <div className="w-full h-full bg-[rgba(15,23,42,0.86)] rounded-[10px] flex items-center justify-center">
              <Code2 className="w-5 h-5 text-[var(--accent)] group-hover:text-[var(--accent-strong)] transition-colors" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="font-bold text-[var(--text-primary)] text-base sm:text-lg leading-none tracking-tight flex items-center gap-1.5 truncate">
              Samarth Suvarna
            </div>
            <div className="text-[11px] sm:text-xs text-[var(--text-muted)] font-mono mt-0.5 truncate">
              Full-Stack & AI Systems
            </div>
          </div>
        </button>

        <nav className="hidden md:flex shrink-0 items-center gap-1.5 bg-[rgba(15,23,42,0.78)] p-1.5 rounded-full border border-[var(--border-subtle)] backdrop-blur-md relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.label}
                type="button"
                onClick={(e) => handleNavClick(item.path, e)}
                className={`relative px-4 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-colors flex items-center gap-2 z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                  isActive ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-[rgba(15,23,42,0.95)] border border-[rgba(125,211,252,0.25)] rounded-full shadow-[0_0_0_1px_rgba(125,211,252,0.12)] z-[-1]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Talk to AI Global Agent Button */}
        <div className="hidden md:flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenGlobalAgent}
            className="relative group shrink-0 whitespace-nowrap px-3 lg:px-4 py-2.5 rounded-xl text-sm font-semibold bg-[linear-gradient(135deg,rgba(125,211,252,0.18),rgba(148,163,184,0.08),rgba(167,139,250,0.12))] text-[var(--text-primary)] shadow-[0_14px_30px_rgba(15,23,42,0.26)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 overflow-hidden border border-[rgba(125,211,252,0.24)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <div className="relative">
              <Bot className="w-4 h-4 text-[var(--accent)] group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-ping" />
            </div>
            <span>Talk to AI</span>
            <span className="hidden lg:flex text-[10px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-[rgba(15,23,42,0.8)] text-[var(--accent)] items-center gap-1 border border-[rgba(125,211,252,0.14)]">
              <Mic className="w-2.5 h-2.5 text-[var(--accent)] animate-pulse" /> Direct
            </span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 rounded-xl bg-[rgba(15,23,42,0.9)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          aria-label="Toggle Navigation Menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <motion.div 
          id="mobile-navigation"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-[rgba(15,23,42,0.96)] border-b border-[var(--border-subtle)] px-4 py-4 space-y-2.5 backdrop-blur-xl shadow-2xl"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.label}
                type="button"
                onClick={(e) => handleNavClick(item.path, e)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full px-4 py-3 rounded-xl text-left font-semibold text-sm flex items-center gap-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                  isActive
                    ? 'bg-[rgba(125,211,252,0.08)] text-[var(--accent)] border border-[rgba(125,211,252,0.18)]'
                    : 'text-[var(--text-secondary)] hover:bg-[rgba(15,23,42,0.8)]'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenGlobalAgent();
              }}
              className="w-full px-4 py-3 rounded-xl font-semibold bg-[linear-gradient(135deg,rgba(125,211,252,0.18),rgba(167,139,250,0.1),rgba(15,23,42,0.9))] text-[var(--text-primary)] border border-[rgba(125,211,252,0.2)] flex items-center justify-between shadow-[0_12px_30px_rgba(15,23,42,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-[var(--accent)]" />
                <span>Talk to AI Agent</span>
              </div>
              <Mic className="w-4 h-4 text-[var(--accent)] animate-pulse" />
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
};
