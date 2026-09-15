import React from 'react';
import { Code2, Sparkles, Terminal, Cpu, CheckCircle2, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { RoutePath } from '../types';

interface HomeSectionProps {
  onNavigate: (path: RoutePath) => void;
  onOpenGlobalAgent?: () => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({ onNavigate, onOpenGlobalAgent }) => {
  return (
    <section id="home" className="section-anchor relative pt-28 pb-24 sm:pt-32 sm:pb-28 md:pt-40 md:pb-32 overflow-hidden bg-[rgba(4,8,22,0.48)]">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] bg-[rgba(125,211,252,0.08)] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-8 sm:right-16 w-[360px] h-[360px] bg-[rgba(167,139,250,0.08)] rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--bg-canvas)] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Main Hero Copy */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(125,211,252,0.06)] border border-[rgba(125,211,252,0.18)] text-[var(--accent)] text-xs font-mono font-medium shadow-[0_0_0_1px_rgba(125,211,252,0.08)]">
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Computer Science Student • Building with code</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[var(--text-primary)] tracking-tight leading-[1.05]">
              I build projects, ideas, and{' '}
              <span className="bg-gradient-to-r from-[rgba(147,197,253,0.98)] via-[var(--accent)] to-[rgba(125,211,252,0.8)] bg-clip-text text-transparent">
                web experiences
              </span>
            </h1>

            <p className="text-lg text-[var(--text-muted)] leading-relaxed max-w-2xl text-pretty">
              I’m a student developer learning by shipping projects, improving interfaces, and turning ideas into working software with React, TypeScript, and practical product thinking.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2 sm:pt-3">
              <button
                onClick={() => onNavigate('/projects')}
                className="px-6 py-3.5 rounded-xl bg-[linear-gradient(135deg,rgba(125,211,252,0.16),rgba(167,139,250,0.12),rgba(15,23,42,0.9))] hover:-translate-y-0.5 border border-[rgba(125,211,252,0.22)] text-[var(--text-primary)] font-semibold text-sm shadow-[0_18px_35px_rgba(2,6,23,0.2)] transition-all flex items-center gap-2 group"
              >
                <Code2 className="w-4 h-4 text-[var(--accent)]" />
                <span>View Projects</span>
              </button>

              <button
                onClick={() => onNavigate('/talkmate')}
                className="px-6 py-3.5 rounded-xl bg-[rgba(15,23,42,0.72)] hover:bg-[rgba(15,23,42,0.88)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-semibold text-sm transition-all hover:border-[rgba(125,211,252,0.28)] flex items-center gap-2 group"
              >
                <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                <span>Try TalkMate</span>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="https://github.com/samarthsuvarna1012-tech/developer-portfolio-talkmate"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-xl border border-[var(--border-subtle)] bg-[rgba(15,23,42,0.68)] text-[var(--text-primary)] font-semibold text-sm transition-all hover:border-[rgba(125,211,252,0.28)] hover:text-[var(--accent)]"
              >
                GitHub
              </a>
            </div>

            <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-wrap gap-4 text-sm text-[var(--text-muted)]">
              <a href="/samarth-resume.pdf" className="font-semibold text-[var(--accent)] hover:text-[var(--accent-strong)] transition-colors">
                Download Resume
              </a>
              <span>React • TypeScript • Vercel Functions • AI APIs</span>
            </div>
          </motion.div>

          {/* Engineering Capabilities Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-[1.35rem] bg-[linear-gradient(180deg,rgba(15,23,42,0.82),rgba(4,8,22,0.8))] p-6 border border-[var(--border-strong)] shadow-[0_30px_80px_rgba(2,12,27,0.42)] backdrop-blur-md space-y-5">
              
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(125,211,252,0.08)] border border-[rgba(125,211,252,0.2)] flex items-center justify-center">
                    <Terminal className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-primary)] text-base">Current Stack</h3>
                    <p className="text-xs text-[var(--accent)] font-mono">frontend + experiments</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-[rgba(52,211,153,0.08)] border border-[rgba(52,211,153,0.18)] text-[var(--success)] text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
                  Active
                </span>
              </div>

              <div className="space-y-2 bg-[rgba(2,6,23,0.72)] p-4 rounded-xl border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-secondary)] overflow-x-auto shadow-inner shadow-[rgba(2,6,23,0.48)]">
                <div className="flex items-center gap-1.5 text-[var(--text-muted)] pb-1 border-b border-[var(--border-subtle)] text-[10px]">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 text-[var(--text-muted)]">stack.ts</span>
                </div>
                <p><span className="text-violet-300">const</span> profile = &#123;</p>
                <p className="pl-4"><span className="text-sky-300">name</span>: <span className="text-emerald-300">'Samarth Suvarna'</span>,</p>
                <p className="pl-4"><span className="text-sky-300">tools</span>: [<span className="text-emerald-300">'React'</span>, <span className="text-emerald-300">'TypeScript'</span>, <span className="text-emerald-300">'Node.js'</span>],</p>
                <p className="pl-4"><span className="text-sky-300">focus</span>: <span className="text-emerald-300">'Build, learn, repeat'</span>,</p>
                <p>&#125;;</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-[var(--text-secondary)]">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[rgba(15,23,42,0.72)] border border-[var(--border-subtle)]">
                  <Cpu className="w-4 h-4 text-[var(--accent-alt)] shrink-0" />
                  <span>Intelligent Assistant</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[rgba(15,23,42,0.72)] border border-[var(--border-subtle)]">
                  <Terminal className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <span>Serverless & SSE Backend</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[rgba(15,23,42,0.72)] border border-[var(--border-subtle)]">
                  <ShieldCheck className="w-4 h-4 text-[var(--success)] shrink-0" />
                  <span>Secure API Proxies</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[rgba(15,23,42,0.72)] border border-[var(--border-subtle)]">
                  <CheckCircle2 className="w-4 h-4 text-violet-300 shrink-0" />
                  <span>Voice Speech Agent</span>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
