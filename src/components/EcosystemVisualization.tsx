import React from 'react';
import { motion } from 'motion/react';
import { Bot, Code2, Cpu, Shield, ArrowDown, Sparkles } from 'lucide-react';

interface EcosystemVisualizationProps {
  className?: string;
}

export const EcosystemVisualization: React.FC<EcosystemVisualizationProps> = ({ className = '' }) => {
  const projects = [
    {
      id: 'talkmate',
      name: 'TalkMate AI',
      tagline: 'Conversational Interface',
      icon: Bot,
      color: 'from-indigo-500 to-cyan-400',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
      status: 'Live',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      description: 'Voice-friendly AI assistant with streaming responses, multiple personas, and file handling.',
    },
    {
      id: 'codemaker',
      name: 'CodeMaker AI',
      tagline: 'Engineering Workspace',
      icon: Code2,
      color: 'from-purple-500 to-pink-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
      status: 'In Development',
      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      description: 'Autonomous software engineering platform with repository intelligence and coding agents.',
    },
    {
      id: 'devos',
      name: 'DevOS',
      tagline: 'AI Developer Operating System',
      icon: Cpu,
      color: 'from-cyan-500 to-teal-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/20',
      status: 'In Development',
      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      description: 'Modular 30-module autonomous architecture: cognitive memory, planning, code intelligence, execution, knowledge graphs, learning, evolution.',
    },
    {
      id: 'evolvex',
      name: 'EVOLVEX',
      tagline: 'Cyber Defense Laboratory',
      icon: Shield,
      color: 'from-rose-500 to-red-400',
      bgColor: 'bg-rose-500/10 border-rose-500/20',
      status: 'Pre-Release',
      statusColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      description: 'Evolutionary cyber-defense laboratory for autonomous agent simulation and adversarial testing.',
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className={`relative ${className}`}
      aria-labelledby="ecosystem-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold uppercase tracking-[0.24em] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Project Experiments
          </div>
          <h2 id="ecosystem-heading" className="text-3xl sm:text-4xl font-extrabold text-slate-100 mb-4">
            A few ideas I have been exploring
          </h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
            These are different projects I have built or explored while learning frontend work, product thinking, and practical AI ideas. They are all separate experiments, but they share the same goal: learning by shipping.
          </p>
        </div>

        {/* Visual Flow Diagram */}
        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800 -translate-x-1/2 hidden md:block" />
          
          <div className="space-y-8 md:space-y-12">
            {projects.map((project, index) => {
              const isLast = index === projects.length - 1;
              const IconComponent = project.icon;
              
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative flex flex-col md:flex-row items-center gap-6"
                >
                  {/* Arrow connector (mobile) */}
                  <div className="md:hidden flex items-center justify-center w-full">
                    <ArrowDown className="w-6 h-6 text-slate-600" />
                  </div>

                  {/* Project Card */}
                  <div className={`relative w-full md:w-5/12 flex ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                    <div className={`flex-1 ${index % 2 === 1 ? 'md:pr-8' : 'md:pl-8'} relative`}>
                      <div className={`rounded-[1.2rem] p-5 sm:p-6 border transition-all duration-300 hover:shadow-[0_20px_50px_rgba(2,6,23,0.35)] ${project.bgColor}`}>
                        <div className="flex items-start gap-4">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${project.color} text-white shadow-lg shadow-[0_8px_24px_rgba(0,0,0,0.3)]`}>
                            <IconComponent className="w-7 h-7" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg sm:text-xl font-bold text-slate-100">{project.name}</h3>
                              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${project.statusColor}`}>
                                {project.status}
                              </span>
                            </div>
                            <p className="text-sm text-slate-400 font-mono mb-2">{project.tagline}</p>
                            <p className="text-sm text-slate-300 leading-relaxed">{project.description}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Connection dot on the line */}
                      <div className="hidden md:block absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-br border-4 border-slate-900 z-10 shadow-lg"
                        style={{ 
                          left: index % 2 === 0 ? 'calc(50% + 2rem)' : 'calc(50% - 2rem)',
                          marginLeft: index % 2 === 0 ? '0' : '-4px',
                          marginRight: index % 2 === 0 ? '0' : '0',
                        }}
                      >
                        <div className={`w-full h-full rounded-full bg-gradient-to-br ${project.color}`} />
                      </div>
                    </div>

                    {/* Arrow pointing to center line (desktop) */}
                    <div className="hidden md:block md:w-2/12 flex items-center justify-center">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${project.color} flex items-center justify-center shadow-lg transform transition-transform hover:scale-110`}>
                        <ArrowDown className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="text-xs text-slate-500 uppercase tracking-wider font-mono">
              Independent Projects • Different Ideas • Same Learning Goal
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};