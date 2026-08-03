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
    <section id="home" className="section-anchor relative pt-28 pb-24 sm:pt-32 sm:pb-28 md:pt-40 md:pb-32 overflow-hidden bg-[#030712]">
      {/* Background Radial Spotlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] bg-indigo-600/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-8 sm:right-16 w-[360px] h-[360px] bg-cyan-500/10 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#030712] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Main Hero Copy */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-cyan-400 text-xs font-mono font-medium shadow-[0_0_0_1px_rgba(34,211,238,0.08)]">
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Computer Science Student • Web & AI Projects</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight leading-[1.05]">
              Building web apps and{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
                AI-powered experiences
              </span>
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed max-w-2xl text-pretty">
              I’m a student developer exploring React, TypeScript, Vercel Functions, and AI integrations through hands-on projects like TalkMate AI and this portfolio.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2 sm:pt-3">
              <button
                onClick={() => onNavigate('/projects')}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 hover:shadow-cyan-500/30 hover:-translate-y-0.5 transition-all flex items-center gap-2 group ring-1 ring-cyan-400/30"
              >
                <Code2 className="w-4 h-4 text-cyan-200" />
                <span>View Projects</span>
              </button>

              <button
                onClick={() => onNavigate('/talkmate')}
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm transition-all hover:border-slate-700 flex items-center gap-2 group"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Try TalkMate</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="https://github.com/samarthsuvarna1012-tech/developer-portfolio-talkmate"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-xl border border-slate-700 bg-slate-900/70 text-slate-200 font-semibold text-sm transition-all hover:border-cyan-500/50 hover:text-cyan-300"
              >
                GitHub
              </a>
            </div>

            <div className="pt-8 border-t border-slate-900/80 flex flex-wrap gap-4 text-sm text-slate-400">
              <a href="/samarth-resume.pdf" className="font-semibold text-cyan-300 hover:text-cyan-200 transition-colors">
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
            <div className="relative rounded-[1.35rem] bg-gradient-to-b from-slate-900/95 via-slate-950 to-slate-950 p-6 border border-slate-800/80 shadow-[0_0_0_1px_rgba(15,23,42,0.65),0_28px_80px_rgba(2,12,27,0.65)] backdrop-blur-md space-y-5">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/70">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                    <Terminal className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-base">Full-Stack System Architecture</h3>
                    <p className="text-xs text-cyan-400 font-mono">portfolio-v2.0.0</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  System Operational
                </span>
              </div>

              {/* Code Snippet */}
              <div className="space-y-2 bg-slate-950/90 p-4 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300 overflow-x-auto shadow-inner shadow-slate-950/80">
                <div className="flex items-center gap-1.5 text-slate-500 pb-1 border-b border-slate-800/60 text-[10px]">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 text-slate-400">samarth-stack.ts</span>
                </div>
                <p><span className="text-purple-400">const</span> engineer = &#123;</p>
                <p className="pl-4"><span className="text-indigo-300">name</span>: <span className="text-emerald-300">'Samarth Suvarna'</span>,</p>
                <p className="pl-4"><span className="text-indigo-300">stack</span>: [<span className="text-emerald-300">'React 19'</span>, <span className="text-emerald-300">'TypeScript'</span>, <span className="text-emerald-300">'Node.js'</span>],</p>
                <p className="pl-4"><span className="text-indigo-300">aiIntegration</span>: <span className="text-emerald-300">'TalkMate AI'</span>,</p>
                <p className="pl-4"><span className="text-indigo-300">architecture</span>: <span className="text-emerald-300">'Secure Server-Side Proxies'</span>,</p>
                <p>&#125;;</p>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
                  <Cpu className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Intelligent Assistant</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
                  <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Serverless & SSE Backend</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Secure API Proxies</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
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
