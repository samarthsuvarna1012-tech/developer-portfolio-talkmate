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
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#030712]">
      {/* Background Radial Spotlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Copy */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-cyan-400 text-xs font-mono font-medium shadow-sm">
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Full-Stack & AI Systems Engineer</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight leading-[1.1]">
              Crafting Scalable Web Applications &{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
                Intelligent AI Experiences
              </span>
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
              Welcome to my portfolio! I build high-performance web systems, intuitive user interfaces, and server-side AI integrations using React, Node.js, and Gemini 3.6 Flash.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('/projects')}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 hover:shadow-cyan-500/30 hover:-translate-y-0.5 transition-all flex items-center gap-2 group ring-1 ring-cyan-400/30"
              >
                <Code2 className="w-4 h-4 text-cyan-200" />
                <span>Explore Projects</span>
              </button>

              <button
                onClick={() => onNavigate('/contact')}
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm transition-all hover:border-slate-700 flex items-center gap-2 group"
              >
                <Mail className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                <span>Get In Touch</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="pt-8 border-t border-slate-900 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <div className="text-2xl font-bold text-slate-100">5+</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Years Experience</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400">100%</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Server-Side AI</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-400">20+</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Production Apps</div>
              </div>
            </div>
          </motion.div>

          {/* Engineering Capabilities Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 p-6 border border-slate-800/80 shadow-2xl shadow-indigo-950/50 backdrop-blur-md space-y-5">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
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
              <div className="space-y-2 bg-slate-950/90 p-4 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300 overflow-x-auto">
                <div className="flex items-center gap-1.5 text-slate-500 pb-1 border-b border-slate-800/60 text-[10px]">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 text-slate-400">samarth-stack.ts</span>
                </div>
                <p><span className="text-purple-400">const</span> engineer = &#123;</p>
                <p className="pl-4"><span className="text-indigo-300">name</span>: <span className="text-emerald-300">'Samarth Suvarna'</span>,</p>
                <p className="pl-4"><span className="text-indigo-300">stack</span>: [<span className="text-emerald-300">'React 19'</span>, <span className="text-emerald-300">'TypeScript'</span>, <span className="text-emerald-300">'Node.js'</span>],</p>
                <p className="pl-4"><span className="text-indigo-300">aiIntegration</span>: <span className="text-emerald-300">'Gemini 3.6 Flash'</span>,</p>
                <p className="pl-4"><span className="text-indigo-300">architecture</span>: <span className="text-emerald-300">'Secure Server-Side Proxies'</span>,</p>
                <p>&#125;;</p>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
                  <Cpu className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Gemini 3.6 Flash</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
                  <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Express & SSE Backend</span>
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
