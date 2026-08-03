import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RoutePath } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeSection } from './components/HomeSection';
import { AboutSection } from './components/AboutSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ContactSection } from './components/ContactSection';

const TalkMatePage = lazy(() => import('./pages/TalkMatePage').then((module) => ({ default: module.TalkMatePage })));
const GlobalAIVoiceWidget = lazy(() => import('./components/GlobalAIVoiceWidget').then((module) => ({ default: module.GlobalAIVoiceWidget })));

export default function App() {
  const [isVoiceAgentActive, setIsVoiceAgentActive] = useState(false);
  const isNavigatingRef = useRef(false);
  const [currentPath, setCurrentPath] = useState<RoutePath>(() => {
    const path = window.location.pathname;
    if (path.startsWith('/talkmate')) return '/talkmate';
    if (path.startsWith('/about')) return '/about';
    if (path.startsWith('/projects')) return '/projects';
    if (path.startsWith('/contact')) return '/contact';
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/talkmate')) {
        setCurrentPath('/talkmate');
      } else if (path.startsWith('/about')) {
        setCurrentPath('/about');
      } else if (path.startsWith('/projects')) {
        setCurrentPath('/projects');
      } else if (path.startsWith('/contact')) {
        setCurrentPath('/contact');
      } else {
        setCurrentPath('/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Scroll spy to update active location in header and URL as user scrolls
  useEffect(() => {
    if (currentPath === '/talkmate') return;

    const sections: { id: string; path: RoutePath }[] = [
      { id: 'home', path: '/' },
      { id: 'about', path: '/about' },
      { id: 'projects', path: '/projects' },
      { id: 'contact', path: '/contact' },
    ];

    const handleScroll = () => {
      if (isNavigatingRef.current) return;

      const scrollPosition = window.scrollY + 200; // offset for fixed navbar
      let activePath: RoutePath = '/';

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            activePath = section.path;
            break;
          }
        }
      }

      // Bottom of page check (contact)
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
        activePath = '/contact';
      }

      setCurrentPath((prev) => {
        if (prev !== '/talkmate' && prev !== activePath) {
          window.history.replaceState({}, '', activePath);
          return activePath;
        }
        return prev;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPath]);

  const navigateTo = (path: RoutePath) => {
    isNavigatingRef.current = true;
    setCurrentPath(path);
    window.history.pushState({}, '', path);

    if (path === '/talkmate') {
      window.scrollTo(0, 0);
      setTimeout(() => { isNavigatingRef.current = false; }, 400);
    } else {
      const sectionId = path.replace('/', '') || 'home';
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setTimeout(() => { isNavigatingRef.current = false; }, 800);
      }, 50);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-cyan-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-950 focus:outline-none focus:ring-2 focus:ring-cyan-300"
      >
        Skip to main content
      </a>
      <Navbar 
        currentPath={currentPath} 
        onNavigate={navigateTo} 
        onOpenGlobalAgent={() => setIsVoiceAgentActive(!isVoiceAgentActive)} 
      />

      <main id="main-content" className="flex-1">
        <AnimatePresence mode="wait">
          {currentPath === '/talkmate' ? (
            <motion.div
              key="talkmate-page"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Suspense fallback={null}>
                <TalkMatePage onNavigate={navigateTo} />
              </Suspense>
            </motion.div>
          ) : (
            <motion.div
              key="main-portfolio-pages"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <HomeSection 
                onNavigate={navigateTo} 
                onOpenGlobalAgent={() => setIsVoiceAgentActive(!isVoiceAgentActive)} 
              />
              <AboutSection />
              <ProjectsSection onNavigate={navigateTo} />
              <ContactSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer onNavigate={navigateTo} />

      <Suspense fallback={null}>
        <GlobalAIVoiceWidget 
          isActive={isVoiceAgentActive} 
          onToggle={() => setIsVoiceAgentActive(!isVoiceAgentActive)} 
        />
      </Suspense>
    </div>
  );
}
