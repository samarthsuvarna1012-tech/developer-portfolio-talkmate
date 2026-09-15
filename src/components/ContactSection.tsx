import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, MapPin, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const ContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', message: '', company: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (formData.company.trim()) {
      setErrorMessage('Your message could not be processed.');
      return false;
    }

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setErrorMessage('Please complete every field before sending your message.');
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }

    if (trimmedMessage.length < 10) {
      setErrorMessage('Your message should be at least 10 characters long.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'The message could not be sent. Please try again later.');

      setSubmitted(true);
      setFormData({ name: '', email: '', message: '', company: '' });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'The message could not be sent.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  return (
    <section id="contact" className="section-anchor py-20 bg-[rgba(4,8,22,0.45)] border-t border-[var(--border-subtle)] relative z-10">
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
              <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-[var(--accent)] mb-2">Get In Touch</h2>
              <h3 className="text-3xl font-extrabold text-[var(--text-primary)]">Let's Connect & Collaborate</h3>
            </div>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed">
              I’m open to conversations about student projects, portfolio feedback, AI experiments, and collaborative web development ideas. If you’d like to connect, send a message here.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800 backdrop-blur-md">
                <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center text-cyan-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[var(--text-muted)] font-mono">Email</div>
                  <a href="mailto:samarthsuvarna1012@gmail.com" className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                    samarthsuvarna1012@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800 backdrop-blur-md">
                <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center text-cyan-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[var(--text-muted)] font-mono">Location</div>
                  <div className="text-sm font-semibold text-[var(--text-secondary)]">Remote • Open to collaboration</div>
                </div>
              </div>

              <a
                href="/samarth-resume.pdf"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-strong)] transition-colors"
              >
                <span>Download Resume</span>
              </a>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 bg-[rgba(15,23,42,0.72)] p-6 sm:p-8 rounded-2xl border border-[var(--border-subtle)] shadow-[0_24px_50px_rgba(2,6,23,0.26)] backdrop-blur-md"
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
                <h4 className="text-lg font-bold text-[var(--text-primary)] mb-4">Send a Direct Message</h4>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleFieldChange('company', e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Your Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => handleFieldChange('message', e.target.value)}
                    placeholder="Tell me about your project or query..."
                    className="w-full px-4 py-3 rounded-xl bg-[rgba(2,6,23,0.72)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[rgba(125,211,252,0.46)] transition-colors resize-none"
                  />
                </div>

                {errorMessage && (
                  <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-300" role="alert">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-[linear-gradient(135deg,rgba(125,211,252,0.14),rgba(167,139,250,0.12),rgba(15,23,42,0.9))] hover:-translate-y-0.5 border border-[rgba(125,211,252,0.22)] text-[var(--text-primary)] font-bold text-sm transition-all shadow-[0_18px_35px_rgba(2,6,23,0.22)] flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
};
