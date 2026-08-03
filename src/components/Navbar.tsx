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
          ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-xl shadow-slate-950/40 py-3'
          : 'bg-slate-950/60 backdrop-blur-md py-4 border-b border-slate-900/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={(e) => handleNavClick('/', e)}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 p-0.5 shadow-md group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Code2 className="w-5 h-5 text-indigo-400 group-hover:text-cyan-300 transition-colors" />
            </div>
          </div>
          <div>
            <div className="font-bold text-slate-100 text-lg leading-none tracking-tight flex items-center gap-1.5">
              Samarth Suvarna
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              Full-Stack & AI Systems
            </div>
          </div>
        </button>

        {/* Desktop Nav Items with Motion Active Indicator */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-full border border-slate-800/80 backdrop-blur-md relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.label}
                onClick={(e) => handleNavClick(item.path, e)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 z-10 ${
                  isActive ? 'text-cyan-300' : 'text-slate-300 hover:text-slate-100'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-slate-800 border border-indigo-500/40 rounded-full shadow-sm z-[-1]"
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
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenGlobalAgent}
            className="relative group px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-lg shadow-indigo-600/25 hover:shadow-cyan-500/30 hover:scale-[1.03] transition-all duration-300 flex items-center gap-2 overflow-hidden ring-1 ring-cyan-400/40"
          >
            <div className="relative">
              <Bot className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping" />
            </div>
            <span>Talk to AI</span>
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-white/20 text-cyan-100 flex items-center gap-1">
              <Mic className="w-2.5 h-2.5 text-cyan-300 animate-pulse" /> Direct
            </span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-slate-900/95 border-b border-slate-800 px-4 py-4 space-y-2 backdrop-blur-xl shadow-2xl"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.label}
                onClick={(e) => handleNavClick(item.path, e)}
                className={`w-full px-4 py-3 rounded-xl text-left font-medium flex items-center gap-3 transition-colors ${
                  isActive
                    ? 'bg-indigo-600/20 text-cyan-400 border border-indigo-500/30'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenGlobalAgent();
              }}
              className="w-full px-4 py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-200" />
                <span>Talk to AI Agent</span>
              </div>
              <Mic className="w-4 h-4 text-cyan-300 animate-pulse" />
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
};
