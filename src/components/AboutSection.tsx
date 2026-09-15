import React from 'react';
import { Code2, Server, Cpu, Database, Layers, Sparkles, Terminal, Globe, Briefcase, Calendar, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { WORK_EXPERIENCE } from '../data/portfolioData';

export const AboutSection: React.FC = () => {
  const skills = [
    { name: 'TypeScript / JavaScript', category: 'Languages', level: 'Expert', icon: Code2 },
    { name: 'React 19 & Next.js', category: 'Frontend', level: 'Expert', icon: Layers },
    { name: 'Node.js & Vercel Functions', category: 'Backend', level: 'Advanced', icon: Server },
    { name: 'AI Assistant & LLMs', category: 'AI Integration', level: 'Advanced', icon: Cpu },
    { name: 'Tailwind CSS & Motion', category: 'Styling', level: 'Expert', icon: Sparkles },
    { name: 'REST & WebSockets', category: 'Networking', level: 'Advanced', icon: Globe },
    { name: 'Cloud & Docker', category: 'DevOps', level: 'Proficient', icon: Terminal },
    { name: 'Databases & ORMs', category: 'Storage', level: 'Proficient', icon: Database },
  ];

  return (
    <section id="about" className="section-anchor py-20 bg-[rgba(11,18,32,0.22)] border-t border-[var(--border-subtle)] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-[var(--accent)]">About Me</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">
            A student developer building practical web apps and AI experiences
          </h3>
          <p className="text-[var(--text-muted)] text-base leading-relaxed">
            I’m learning by building. My work centers on React, TypeScript, Vercel Functions, and AI integrations, with a focus on clear interfaces, thoughtful architecture, and projects that explain what I learned along the way.
          </p>
        </motion.div>

        {/* Technical Capabilities Grid */}
        <div className="mb-20">
          <h4 className="text-xl font-bold text-[var(--text-secondary)] mb-6 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[var(--accent)]" />
            <span>What I’ve Been Building</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {skills.map((skill, idx) => {
              const Icon = skill.icon;
              return (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className="p-5 rounded-2xl bg-[rgba(2,6,23,0.68)] border border-[var(--border-subtle)] hover:border-[rgba(125,211,252,0.28)] transition-all hover:-translate-y-1 group backdrop-blur-md shadow-[0_18px_45px_rgba(2,6,23,0.2)]"
                >
                  <div className="w-10 h-10 rounded-xl bg-[rgba(125,211,252,0.08)] border border-[rgba(125,211,252,0.18)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-[var(--accent)] group-hover:text-[var(--accent-strong)] transition-colors" />
                  </div>
                  <div className="text-xs text-[var(--text-muted)] font-mono mb-1">{skill.category}</div>
                  <div className="font-bold text-[var(--text-primary)] text-base mb-2">{skill.name}</div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[rgba(15,23,42,0.7)] text-[var(--accent)] border border-[var(--border-subtle)]">
                    {skill.level}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Career & Work Experience Timeline */}
        <div>
          <h4 className="text-xl font-bold text-[var(--text-secondary)] mb-8 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[var(--accent-alt)]" />
            <span>Learning Timeline</span>
          </h4>

          <div className="relative border-l-2 border-[var(--border-subtle)] ml-4 pl-6 sm:pl-8 space-y-10">
            {WORK_EXPERIENCE.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[rgba(4,8,22,1)] border-2 border-[rgba(125,211,252,0.7)] shadow-[0_0_10px_rgba(125,211,252,0.35)] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                </div>

                <div className="p-6 rounded-2xl bg-[rgba(2,6,23,0.75)] border border-[var(--border-subtle)] backdrop-blur-md shadow-[0_24px_60px_rgba(2,6,23,0.18)] hover:border-[rgba(125,211,252,0.18)] transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h5 className="text-lg font-bold text-[var(--text-primary)]">{exp.role}</h5>
                      <span className="text-sm font-medium text-[var(--accent)]">{exp.company}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(15,23,42,0.7)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-muted)] w-fit">
                      <Calendar className="w-3.5 h-3.5 text-[var(--accent-alt)]" />
                      <span>{exp.period}</span>
                    </div>
                  </div>

                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">{exp.description}</p>

                  <div className="space-y-2 mb-4">
                    {exp.achievements.map((ach, aIdx) => (
                      <div key={aIdx} className="flex items-start gap-2 text-xs text-slate-400">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <span>{ach}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-900">
                    {exp.technologies.map((tech) => (
                      <span key={tech} className="px-2.5 py-0.5 rounded-md bg-indigo-950/60 border border-indigo-800/40 text-[11px] font-mono text-slate-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
