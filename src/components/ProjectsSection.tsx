import React, { useState } from 'react';
import { Bot, ExternalLink, Sparkles, ArrowRight, Code2, Search, Filter, Github } from 'lucide-react';
import { motion } from 'motion/react';
import { PORTFOLIO_PROJECTS } from '../data/portfolioData';
import { RoutePath, Project } from '../types';

interface ProjectsSectionProps {
  onNavigate: (path: RoutePath) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'AI', 'Full-Stack', 'Cloud'];

  const filteredProjects = PORTFOLIO_PROJECTS.filter((project: Project) => {
    const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="projects" className="py-20 bg-[#030712] border-t border-slate-900/80 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-cyan-400 mb-2">
              Featured Portfolio
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
              Selected Software Projects
            </h3>
          </div>
          <p className="text-slate-400 text-sm max-w-md">
            Including full-stack applications, developer tooling, and custom server-side AI integrations.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-900">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-cyan-400/40'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat === 'All' && <Filter className="w-3.5 h-3.5" />}
                <span>{cat}</span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects or tech tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500/80 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-slate-950/50 rounded-2xl border border-slate-800/80">
            <Code2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No projects match your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project, idx) => {
              const isTalkMate = project.id === 'talkmate-ai';

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className={`relative rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                    isTalkMate
                      ? 'bg-gradient-to-b from-indigo-950/60 via-slate-900/80 to-slate-950 border-2 border-indigo-500/50 shadow-2xl shadow-indigo-950/60 ring-1 ring-cyan-500/30'
                      : 'bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-xl'
                  }`}
                >
                  {/* Featured Badge for TalkMate AI */}
                  {isTalkMate && (
                    <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Featured AI Assistant Page</span>
                    </div>
                  )}

                  <div>
                    {/* Top Bar */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner ${
                            isTalkMate
                              ? 'bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-indigo-400/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {isTalkMate ? <Bot className="w-6 h-6 animate-pulse" /> : <Code2 className="w-6 h-6" />}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                            {project.title}
                          </h4>
                          <p className="text-xs text-indigo-400 font-mono mt-0.5">{project.stats}</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-slate-300 mb-3">{project.tagline}</p>
                    <p className="text-sm text-slate-400 leading-relaxed mb-6">{project.description}</p>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-2.5 py-1 rounded-md text-xs font-mono ${
                            isTalkMate
                              ? 'bg-indigo-950/80 border border-indigo-800/60 text-cyan-300'
                              : 'bg-slate-800/80 border border-slate-700/60 text-slate-300'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Primary Action Button */}
                  <div>
                    {isTalkMate ? (
                      <button
                        onClick={() => onNavigate('/talkmate')}
                        className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group ring-1 ring-cyan-400/30"
                      >
                        <Bot className="w-5 h-5 text-cyan-200" />
                        <span>Launch TalkMate AI Page (/talkmate)</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => alert(`This project demo is documented in Samarth's portfolio. Check out /talkmate for the live interactive AI Assistant!`)}
                          className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <span>View Project Details</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="GitHub Source"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

