import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, MapPin, Github, Linkedin, Twitter } from 'lucide-react';
import { motion } from 'motion/react';

export const ContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <section id="contact" className="py-20 bg-[#030712] border-t border-slate-900/80 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Info Side */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-6"
          >
            <div>
              <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-cyan-400 mb-2">Get In Touch</h2>
              <h3 className="text-3xl font-extrabold text-slate-100">Let's Connect & Collaborate</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Have a project in mind, an opportunity to discuss, or questions about my full-stack and AI architecture work? Send a message directly.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800 backdrop-blur-md">
                <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center text-cyan-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-mono">Email</div>
                  <a href="mailto:samarthsuvarna1012@gmail.com" className="text-sm font-semibold text-slate-200 hover:text-cyan-400 transition-colors">
                    samarthsuvarna1012@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800 backdrop-blur-md">
                <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center text-cyan-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-mono">Location</div>
                  <div className="text-sm font-semibold text-slate-200">San Francisco Bay Area / Remote</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 bg-slate-900/60 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-md"
          >
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-xl font-bold text-slate-100">Message Received!</h4>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Thank you for reaching out. I'll review your message and respond as soon as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h4 className="text-lg font-bold text-slate-100 mb-4">Send a Direct Message</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Your Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your project or query..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
};
