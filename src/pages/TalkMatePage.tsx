import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Send, Mic, MicOff, Paperclip, Sparkles, Trash2, Download, Copy, Check, 
  ArrowLeft, Volume2, VolumeX, Code2, CheckSquare, Lightbulb, BookOpen, 
  RotateCcw, ShieldCheck, AlertCircle, RefreshCw, X, FileText, ChevronDown, Cpu, Activity,
  MessageSquare, Plus, Edit2, Search, Briefcase, Layers, UploadCloud
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { Message, AIPersona, RoutePath, ChatSession } from '../types';
import { AI_PERSONAS, PROMPT_TEMPLATES } from '../data/portfolioData';
import { AiOrb, OrbState } from '../components/AiOrb';
import { FuturisticBackground } from '../components/FuturisticBackground';
import { WaveformVisualizer } from '../components/WaveformVisualizer';

interface TalkMatePageProps {
  onNavigate: (path: RoutePath) => void;
}

const DEFAULT_WELCOME_MSG: Message = {
  id: 'welcome-1',
  role: 'assistant',
  content: `Hello! I’m **TalkMate AI**, your portfolio assistant for Samarth’s work, experience, and projects.

### What I can help with:
- 💼 **Portfolio Questions**: Explore projects, experience, and technical background.
- 💻 **Technical Guidance**: Discuss architecture, code quality, and engineering decisions.
- 🎙️ **Voice Interaction**: Use the microphone button for hands-free conversation.
- 📁 **File Insights**: Attach files or images for quick review and discussion.

Try a prompt starter or choose a persona above to begin.`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

export const TalkMatePage: React.FC<TalkMatePageProps> = ({ onNavigate }) => {
  // Chat Sessions state stored in localStorage
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('talkmate_sessions_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed loading chat sessions:', e);
    }
    return [{
      id: 'session-default',
      title: 'Initial Workspace',
      messages: [DEFAULT_WELCOME_MSG],
      personaId: AI_PERSONAS[0].id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => sessions[0]?.id || 'session-default');
  const [sessionDrawerOpen, setSessionDrawerOpen] = useState(false);
  const [searchSessionQuery, setSearchSessionQuery] = useState('');
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitleText, setEditingTitleText] = useState('');

  // Active session helper
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const messages = activeSession ? activeSession.messages : [DEFAULT_WELCOME_MSG];

  const [inputContent, setInputContent] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<AIPersona>(() => {
    return AI_PERSONAS.find(p => p.id === activeSession?.personaId) || AI_PERSONAS[0];
  });
  const [activeModal, setActiveModal] = useState<'persona' | 'starters' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; mimeType: string; data: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<{ status: string } | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [notice, setNotice] = useState<{ type: 'info' | 'error' | 'success'; message: string } | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Sync session changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('talkmate_sessions_v1', JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed saving chat sessions:', e);
    }
  }, [sessions]);

  // Ensure window starts at top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check server health on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setServerStatus(data))
      .catch((err) => console.error('Failed health check:', err));
  }, []);

  // Keyboard shortcut listeners (Cmd/Ctrl + Enter to send, ESC to close drawer, Cmd/Ctrl + K for modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
        setSessionDrawerOpen(false);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setActiveModal((prev) => (prev ? null : 'persona'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll inner chat container to bottom when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (!notice) return;
    const timeoutId = window.setTimeout(() => setNotice(null), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  // Update messages inside active session
  const updateActiveSessionMessages = (newMessages: Message[]) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          // Auto-generate title from first user message if title is default
          let title = s.title;
          const firstUserMsg = newMessages.find(m => m.role === 'user');
          if (title === 'New Conversation' || title === 'Initial Workspace') {
            if (firstUserMsg) {
              title = firstUserMsg.content.slice(0, 32) + (firstUserMsg.content.length > 32 ? '...' : '');
            }
          }
          return { ...s, title, messages: newMessages, updatedAt: new Date().toISOString() };
        }
        return s;
      })
    );
  };

  // Create new conversation session
  const createNewSession = () => {
    const newId = 'session-' + Date.now();
    const newSession: ChatSession = {
      id: newId,
      title: 'New Conversation',
      messages: [DEFAULT_WELCOME_MSG],
      personaId: selectedPersona.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);
    setSessionDrawerOpen(false);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      // Clear messages instead of deleting last session
      updateActiveSessionMessages([DEFAULT_WELCOME_MSG]);
      return;
    }
    const filtered = sessions.filter(s => s.id !== id);
    setSessions(filtered);
    if (activeSessionId === id) {
      setActiveSessionId(filtered[0].id);
    }
  };

  const startRenameSession = (s: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(s.id);
    setEditingTitleText(s.title);
  };

  const saveRenameSession = () => {
    if (editingSessionId && editingTitleText.trim()) {
      setSessions((prev) =>
        prev.map((s) => s.id === editingSessionId ? { ...s, title: editingTitleText.trim() } : s)
      );
    }
    setEditingSessionId(null);
  };

  // Speech Recognition setup
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInputContent(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        const help: Record<string, string> = {
          'not-allowed': 'Microphone permission was denied. Enable it in your browser settings to use voice input.',
          'service-not-allowed': 'Speech recognition is unavailable right now. Please type your message instead.',
          'no-speech': 'No speech was detected. Please try again.',
          'audio-capture': 'No microphone was found or it is unavailable.',
        };
        showNotice('error', help[event.error] || 'Voice input stopped unexpectedly. Please try again.');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const showNotice = (type: 'info' | 'error' | 'success', message: string) => {
    setNotice({ type, message });
  };

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      showNotice('error', 'Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['text/plain', 'text/markdown', 'application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showNotice('error', 'Choose a TXT, Markdown, PDF, JPG, PNG, or WebP file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotice('error', 'File size exceeds the 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      setAttachedFile({
        name: file.name,
        mimeType: file.type || 'text/plain',
        data: base64String,
      });
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = () => {
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotice('error', 'File size exceeds the 5MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        setAttachedFile({
          name: file.name,
          mimeType: file.type || 'text/plain',
          data: base64String,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputContent;
    if ((!textToSend.trim() && !attachedFile) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fileData: attachedFile || undefined,
    };

    const updatedMessages = [...messages, userMessage];
    updateActiveSessionMessages(updatedMessages);
    setInputContent('');
    setAttachedFile(null);
    setIsLoading(true);

    const assistantMsgId = (Date.now() + 1).toString();
    const initialAssistantMsg: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true,
    };

    const withStreamingAssistant = [...updatedMessages, initialAssistantMsg];
    updateActiveSessionMessages(withStreamingAssistant);

    try {
      const historyForApi = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
        fileData: m.fileData,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyForApi,
          personaId: selectedPersona.id,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(errData.error || 'Server error');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.text) {
                  accumulatedText += data.text;
                  setSessions((prev) =>
                    prev.map((s) => {
                      if (s.id === activeSessionId) {
                        return {
                          ...s,
                          messages: s.messages.map((msg) =>
                            msg.id === assistantMsgId ? { ...msg, content: accumulatedText } : msg
                          ),
                        };
                      }
                      return s;
                    })
                  );
                }
              } catch (e) {
                // Ignore SSE parse frame errors
              }
            }
          }
        }
      }

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              messages: s.messages.map((msg) =>
                msg.id === assistantMsgId ? { ...msg, isStreaming: false } : msg
              ),
            };
          }
          return s;
        })
      );
    } catch (error: any) {
      console.error('Chat error:', error);
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              messages: s.messages.map((msg) =>
                msg.id === assistantMsgId
                  ? {
                      ...msg,
                      content: `⚠️ **Error**: ${error.message || 'Unable to communicate with TalkMate AI server.'}`,
                      isStreaming: false,
                    }
                  : msg
              ),
            };
          }
          return s;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Regenerate/Retry last message
  const handleRetryLastMessage = () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      // Remove last assistant response if exists
      const trimmed = messages.filter((m, idx) => !(idx === messages.length - 1 && m.role === 'assistant'));
      updateActiveSessionMessages(trimmed);
      handleSendMessage(lastUserMsg.content);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Clipboard copy failed:', error);
      showNotice('error', 'Clipboard access was blocked. Please copy the text manually.');
    }
  };

  const speakMessage = (content: string, id: string) => {
    if (!('speechSynthesis' in window)) {
      showNotice('error', 'Text-to-speech is not supported in your browser.');
      return;
    }

    if (speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const plainText = content.replace(/[*#_`~]/g, '');
    const utterance = new SpeechSynthesisUtterance(plainText);

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(id);
    window.speechSynthesis.speak(utterance);
  };

  const downloadChatHistory = (type: 'markdown' | 'json' = 'markdown') => {
    let blob: Blob;
    let extension: string;

    if (type === 'json') {
      blob = new Blob([JSON.stringify(messages, null, 2)], { type: 'application/json' });
      extension = 'json';
    } else {
      const formattedText = messages
        .map((m) => `### ${m.role === 'user' ? 'User' : 'TalkMate AI'} (${m.timestamp})\n\n${m.content}\n`)
        .join('\n---\n\n');
      blob = new Blob([formattedText], { type: 'text/markdown' });
      extension = 'md';
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `talkmate-${activeSession.title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearChat = () => {
    if (window.confirm('Clear current conversation history?')) {
      updateActiveSessionMessages([DEFAULT_WELCOME_MSG]);
      showNotice('success', 'Conversation cleared.');
    }
  };

  // Estimated total tokens count
  const estimatedTokenCount = messages.reduce((acc, m) => acc + Math.ceil(m.content.length / 4), 0);

  const orbState: OrbState = isListening 
    ? 'listening' 
    : speakingMessageId 
    ? 'speaking' 
    : isLoading 
    ? 'thinking' 
    : 'idle';

  const isListeningSupported = !!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const filteredSessions = sessions.filter(s =>
    s.title.toLowerCase().includes(searchSessionQuery.toLowerCase())
  );

  return (
    <div className="genos-shell min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.12),transparent_32%),rgba(7,21,34,0.38)] text-slate-100 pt-20 pb-12 flex flex-col justify-between relative overflow-hidden">
      {/* Dynamic Background */}
      <FuturisticBackground />

      {/* Top Header & Navigation Bar */}
      <div className="genos-topbar bg-slate-900/25 border-b border-slate-700/50 px-4 sm:px-6 py-3.5 sticky top-16 z-30 backdrop-blur-md shadow-[0_10px_30px_rgba(15,23,42,0.18)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => onNavigate('/projects')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Projects</span>
            </button>
            <div className="h-4 w-px bg-slate-800 hidden sm:block shrink-0" />
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => setSessionDrawerOpen(!sessionDrawerOpen)}
                className="p-2 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0"
                title="Manage Conversations"
              >
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span className="hidden md:inline">Chats ({sessions.length})</span>
              </button>

              <div className="min-w-0">
                <h1 className="font-extrabold text-slate-100 text-sm sm:text-base leading-none flex items-center gap-1.5 truncate">
                  <span>{activeSession.title}</span>
                  <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30 text-cyan-300 text-[9px] sm:text-[10px] font-mono font-bold whitespace-nowrap">
                    TalkMate AI
                  </span>
                </h1>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 truncate hidden xs:block">Interactive AI Workspace</p>
              </div>
            </div>
          </div>

          {/* Controls & Server Status */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950/55 border border-slate-800 text-xs font-mono">
              <span className={`w-2 h-2 rounded-full shrink-0 ${serverStatus?.status === 'ok' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-slate-400 whitespace-nowrap text-[11px] hidden sm:inline">
                {serverStatus?.status === 'ok' ? 'Server Ready' : 'Connecting'}
              </span>
            </div>

            <button
              onClick={() => downloadChatHistory('markdown')}
              title="Export as Markdown"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={clearChat}
              title="Clear Conversation"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-red-400 hover:text-red-300 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {notice && (
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-4 relative z-10">
          <div className={`rounded-xl border px-4 py-3 text-sm flex items-center gap-2 ${notice.type === 'error' ? 'border-red-500/40 bg-red-500/10 text-red-300' : notice.type === 'success' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'}`} role="status">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{notice.message}</span>
          </div>
        </div>
      )}


      {/* Main Responsive Grid Layout */}
      <div className="genos-workspace max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Centered AI Orb Showcase & Waveform Visualizer */}
          <div className="genos-core-panel lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-900/18 border border-slate-700/45 rounded-2xl backdrop-blur-md shadow-2xl space-y-5 lg:sticky lg:top-28 relative overflow-hidden group">
            
            {/* Centered Spotlight Behind Orb */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.12)_0%,rgba(124,77,255,0.06)_45%,transparent_70%)] pointer-events-none transition-opacity duration-700" />

            <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400 pb-3 border-b border-slate-800/60 relative z-10">
              <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                <Cpu className="w-4 h-4 text-cyan-400" />
                AI Core Interface
              </span>
              <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                {selectedPersona.name}
              </span>
            </div>

            {/* Centered AI Orb Component */}
            <AiOrb 
              status={orbState} 
              tone={selectedPersona.name}
              personality={selectedPersona.name}
              onMicToggle={toggleSpeechRecognition}
              isListeningSupported={isListeningSupported}
            />

            {/* Audio Waveform Equalizer Visualizer */}
            <div className="w-full pt-2">
              <WaveformVisualizer
                isActive={isListening || !!speakingMessageId}
                mode={isListening ? 'listening' : speakingMessageId ? 'speaking' : 'idle'}
              />
            </div>

            {/* Specs Row */}
            <div className="w-full grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/60">
                <div className="bg-slate-950/45 p-2.5 rounded-xl border border-slate-800/80 text-center">
                <span className="text-slate-500 block text-[9px] uppercase tracking-wider">Tokens Est.</span>
                <span className="text-cyan-300 font-bold">~{estimatedTokenCount} tokens</span>
              </div>
              <div className="bg-slate-950/45 p-2.5 rounded-xl border border-slate-800/80 text-center">
                <span className="text-slate-500 block text-[9px] uppercase tracking-wider">Response Speed</span>
                <span className="text-emerald-400 font-bold">~180ms SSE</span>
              </div>
            </div>

          </div>

          {/* Right Column: Prompt Controls & Chat Workspace */}
          <div className="genos-chat-column lg:col-span-7 flex flex-col space-y-4 min-h-0">
            
            {/* Persona Switcher & Prompt Starters */}
            <div className="genos-controlbar flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-900/20 border border-slate-700/45 rounded-2xl shadow-lg shrink-0 backdrop-blur-sm">
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
                <button
                  onClick={() => setActiveModal('persona')}
                  className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-slate-950/55 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/60 text-slate-100 text-xs font-semibold transition-all flex items-center justify-between gap-2 shadow-sm group min-w-0"
                  title="Switch Persona (⌘K or Ctrl+K)"
                >
                  <div className="flex items-center gap-2 min-w-0 truncate">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                    <span className="text-slate-400 shrink-0">Persona:</span>
                    <span className="text-cyan-300 font-bold group-hover:text-cyan-200 truncate">{selectedPersona.name}</span>
                  </div>
                  <span className="hidden md:inline-block px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono border border-slate-700">⌘K</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:translate-y-0.5 transition-transform shrink-0" />
                </button>

                <button
                  onClick={() => setActiveModal('starters')}
                  className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-900/80 via-slate-900 to-indigo-950 hover:from-indigo-800 hover:to-indigo-900 border border-indigo-600/50 text-slate-100 text-xs font-semibold transition-all flex items-center justify-between gap-2 shadow-sm group hover:border-indigo-500 whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300 group-hover:rotate-12 transition-transform shrink-0" />
                    <span>Prompt Starters</span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded bg-indigo-500/30 text-[10px] text-cyan-300 font-mono">
                    {PROMPT_TEMPLATES.length}
                  </span>
                </button>
              </div>

              {/* Quick Horizontal Prompt Starters Chips */}
              <div className="w-full flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1.5 border-t border-slate-800/60">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  Quick Prompts:
                </span>
                {PROMPT_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => handleSendMessage(tmpl.prompt)}
                    disabled={isLoading}
                    className="px-2.5 py-1 rounded-lg bg-slate-950/55 hover:bg-indigo-950/80 border border-slate-800 hover:border-indigo-500/60 text-slate-300 hover:text-cyan-300 text-[11px] font-medium transition-all whitespace-nowrap shrink-0 shadow-sm"
                  >
                    {tmpl.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Chat Stream Container with Drag & Drop */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`genos-chat-panel flex flex-col h-[520px] sm:h-[600px] bg-slate-900/20 rounded-2xl border border-slate-700/45 transition-colors overflow-hidden shadow-2xl relative flex-1 backdrop-blur-sm ${
                isDraggingFile ? 'border-cyan-400 bg-indigo-950/40 ring-2 ring-cyan-400/50' : 'border-slate-800'
              }`}
            >
              {/* Drag Drop Overlay */}
              {isDraggingFile && (
                <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 border-2 border-dashed border-cyan-400 text-center space-y-3">
                  <UploadCloud className="w-12 h-12 text-cyan-400 animate-bounce" />
                  <p className="text-lg font-bold text-slate-100">Drop your file here</p>
                  <p className="text-xs text-slate-400 max-w-xs">Supports text files, code snippets, images, and documents up to 5MB.</p>
                </div>
              )}
              
              {/* Header Bar */}
              <div className="bg-slate-950/65 px-5 py-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Persona: <strong className="text-cyan-300 font-semibold">{selectedPersona.name}</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <span>{messages.length} Messages</span>
                  <button
                    onClick={handleRetryLastMessage}
                    disabled={isLoading || messages.length <= 1}
                    className="text-indigo-400 hover:text-cyan-300 disabled:opacity-30 flex items-center gap-1 transition-colors"
                    title="Retry Last Response"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retry</span>
                  </button>
                </div>
              </div>

              {/* Message List */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-3">
                    <Bot className="w-12 h-12 text-slate-700" />
                    <p className="font-semibold text-slate-300">Conversation Cleared</p>
                    <p className="text-xs max-w-sm">Tap Prompt Starters or Select AI Persona above to start asking questions.</p>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => {
                      const isUser = msg.role === 'user';

                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 12, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.25 }}
                          className={`flex items-start gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                          {/* Avatar */}
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs shadow-md ${
                              isUser
                                ? 'bg-slate-800 border border-slate-700 text-slate-200'
                                : 'bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-indigo-600/30'
                            }`}
                          >
                            {isUser ? 'U' : <Bot className="w-5 h-5" />}
                          </div>

                          {/* Message Bubble Container */}
                          <div className={`max-w-[85%] space-y-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
                            <div className={`flex items-center gap-2 text-[11px] font-mono text-slate-400 ${isUser ? 'justify-end' : 'justify-start'}`}>
                              <span>{isUser ? 'You' : 'TalkMate AI'}</span>
                              <span>•</span>
                              <span>{msg.timestamp}</span>
                            </div>

                            {/* Attached File Preview */}
                            {msg.fileData && (
                              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-center gap-2 text-cyan-300">
                                <FileText className="w-4 h-4 text-indigo-400" />
                                <span className="font-mono truncate">{msg.fileData.name}</span>
                              </div>
                            )}

                            {/* Content */}
                            <div
                              className={`p-4 rounded-2xl text-sm leading-relaxed ${
                                isUser
                                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-md'
                                  : 'bg-slate-950/65 text-slate-200 border border-slate-800/80 rounded-tl-none shadow-lg'
                              }`}
                            >
                              {isUser ? (
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                              ) : (
                                <div className="prose prose-invert prose-sm max-w-none space-y-2" aria-live={msg.isStreaming ? 'polite' : undefined} aria-atomic="false">
                                  <ReactMarkdown
                                    components={{
                                      code({ node, inline, className, children, ...props }: any) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        const codeString = String(children).replace(/\n$/, '');
                                        if (!inline && (match || codeString.includes('\n'))) {
                                          const lang = match ? match[1] : 'code';
                                          return (
                                            <div className="relative my-3 rounded-xl border border-slate-800 bg-slate-950/70 overflow-hidden font-mono text-xs">
                                              <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900/70 border-b border-slate-800 text-[11px] text-slate-400">
                                                <span className="text-cyan-400 font-semibold uppercase">{lang}</span>
                                                <button
                                                  onClick={() => copyToClipboard(codeString, `code-${Math.random()}`)}
                                                  className="hover:text-slate-200 flex items-center gap-1 transition-colors px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-[10px]"
                                                >
                                                  <Copy className="w-3 h-3 text-cyan-300" />
                                                  <span>Copy Code</span>
                                                </button>
                                              </div>
                                              <pre className="p-3.5 overflow-x-auto text-slate-200 leading-relaxed font-mono">
                                                <code>{children}</code>
                                              </pre>
                                            </div>
                                          );
                                        }
                                        return (
                                          <code className={`${className} bg-slate-800/80 text-cyan-300 px-1.5 py-0.5 rounded text-xs font-mono`} {...props}>
                                            {children}
                                          </code>
                                        );
                                      }
                                    }}
                                  >
                                    {msg.content}
                                  </ReactMarkdown>
                                  {msg.isStreaming && (
                                    <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-1 align-middle" />
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Utility Toolbar */}
                            <div className={`flex items-center gap-2 pt-1 text-xs text-slate-500 ${isUser ? 'justify-end' : 'justify-start'}`}>
                              {isUser ? (
                                <button
                                  onClick={() => setInputContent(msg.content)}
                                  className="hover:text-slate-300 flex items-center gap-1 transition-colors px-2 py-0.5 rounded hover:bg-slate-800 text-[11px]"
                                  title="Edit Prompt"
                                >
                                  <Edit2 className="w-3 h-3 text-indigo-400" />
                                  <span>Edit Prompt</span>
                                </button>
                              ) : (
                                msg.content && (
                                  <>
                                    <button
                                      onClick={() => copyToClipboard(msg.content, msg.id)}
                                      className="hover:text-slate-300 flex items-center gap-1 transition-colors px-2 py-0.5 rounded hover:bg-slate-800"
                                    >
                                      {copiedId === msg.id ? (
                                        <>
                                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                                          <span className="text-emerald-400">Copied</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3.5 h-3.5" />
                                          <span>Copy</span>
                                        </>
                                      )}
                                    </button>

                                    <button
                                      onClick={() => speakMessage(msg.content, msg.id)}
                                      className={`hover:text-slate-300 flex items-center gap-1 transition-colors px-2 py-0.5 rounded hover:bg-slate-800 ${
                                        speakingMessageId === msg.id ? 'text-cyan-400 font-semibold' : ''
                                      }`}
                                    >
                                      {speakingMessageId === msg.id ? (
                                        <>
                                          <VolumeX className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                                          <span className="text-cyan-400">Stop Voice</span>
                                        </>
                                      ) : (
                                        <>
                                          <Volume2 className="w-3.5 h-3.5" />
                                          <span>Listen</span>
                                        </>
                                      )}
                                    </button>
                                  </>
                                )
                              )}
                            </div>

                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>

              {/* Attached File Banner */}
              {attachedFile && (
                <div className="px-4 py-2 bg-indigo-950/60 border-t border-indigo-800/40 flex items-center justify-between text-xs text-cyan-300">
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span className="font-mono">Attached: {attachedFile.name}</span>
                  </div>
                  <button onClick={() => setAttachedFile(null)} className="hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 bg-slate-950/65 border-t border-slate-800">
                <div className="flex items-end gap-2 bg-slate-900/65 p-2.5 rounded-xl border border-slate-800 focus-within:border-cyan-500/60 transition-colors">
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp,text/plain,text/markdown,application/pdf,.md,.txt,.pdf"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    title="Attach Image or Text File"
                    className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <button
                    onClick={toggleSpeechRecognition}
                    title={isListening ? 'Stop Recording' : 'Voice Input'}
                    className={`p-2.5 rounded-lg transition-colors ${
                      isListening
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <textarea
                    value={inputContent}
                    onChange={(e) => setInputContent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={isListening ? 'Listening to speech...' : 'Type your prompt here... (Shift+Enter for newline)'}
                    rows={2}
                    className="flex-1 bg-transparent border-0 text-slate-100 text-sm focus:outline-none resize-none placeholder-slate-500 px-2 py-1"
                  />

                  <button
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || (!inputContent.trim() && !attachedFile)}
                    className="p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white disabled:opacity-40 transition-all shadow-md shadow-indigo-600/20"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>

                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="genos-architecture max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 relative z-10"
      >
        <div className="rounded-[1.45rem] border border-slate-700/80 bg-slate-900/45 p-6 sm:p-8 shadow-[0_24px_70px_rgba(2,6,23,0.38)] backdrop-blur-md">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-7">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-semibold uppercase tracking-[0.24em] mb-4">
                <Cpu className="w-3.5 h-3.5" />
                TalkMate architecture
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">A simple, teachable AI workflow built for learning and experimentation</h2>
              <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
                This project is more than a polished chat demo. It connects a React client, a Vercel serverless API, and Gemini streaming so the experience feels interactive while keeping the AI integration understandable.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/45 px-4 py-3 text-sm text-slate-300 max-w-sm">
              <div className="font-semibold text-slate-100 mb-2">What this teaches</div>
              <ul className="space-y-1.5 text-slate-400">
                <li>• Streaming UIs with SSE</li>
                <li>• Server-side AI requests</li>
                <li>• File handling and validation</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/45 p-5">
              <div className="flex items-center gap-2 text-cyan-300 text-sm font-semibold mb-4">
                <Sparkles className="w-4 h-4" />
                Flow overview
              </div>
              <div className="grid gap-3 sm:grid-cols-4 text-center text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                <div className="rounded-xl border border-slate-800 bg-slate-900/55 p-3">React client</div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/55 p-3">Serverless API</div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/55 p-3">Gemini API</div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/55 p-3">Streamed reply</div>
              </div>
              <div className="mt-4 rounded-2xl border border-slate-800/70 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-cyan-950/40 p-4 text-sm text-slate-300">
                <p className="mb-2 text-slate-200 font-semibold">Request path</p>
                <p className="leading-relaxed">
                  The React interface sends chat messages and optional files to a Vercel serverless function. The function validates the request, forwards it to Gemini, and streams the response back to the browser as the assistant answers.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/45 p-5">
                <div className="flex items-center gap-2 text-cyan-300 text-sm font-semibold mb-3">
                  <Activity className="w-4 h-4" />
                  Why SSE?
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Server-Sent Events let the app stream tokens incrementally so the chat feels responsive and more like a live conversation than a delayed full-page update.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/45 p-5">
                <div className="flex items-center gap-2 text-cyan-300 text-sm font-semibold mb-3">
                  <ShieldCheck className="w-4 h-4" />
                  Why server-side AI calls?
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  The API key stays on the server, which keeps the browser from exposing credentials and makes the app easier to reason about in a portfolio setting.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/45 p-5">
                <div className="flex items-center gap-2 text-cyan-300 text-sm font-semibold mb-3">
                  <UploadCloud className="w-4 h-4" />
                  File handling
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Files are accepted up to a modest size limit, validated by MIME type and size, and passed into the AI request with clear error feedback when something is unsupported.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-800/80 bg-slate-950/45 p-5">
            <div className="flex items-center gap-2 text-cyan-300 text-sm font-semibold mb-3">
              <BookOpen className="w-4 h-4" />
              What I learned
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm text-slate-400">
              <div className="rounded-xl border border-slate-800 bg-slate-900/55 p-3">Connecting a frontend to LLM APIs</div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/55 p-3">Designing a streaming conversational UI</div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/55 p-3">Managing async state and error cases</div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/55 p-3">Thinking about security and validation</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Conversations Drawer Side Modal */}
      {sessionDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-start bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xs sm:max-w-sm bg-slate-900 border-r border-slate-800 h-full p-6 flex flex-col justify-between shadow-2xl space-y-4">
            
            <div className="space-y-4 flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-slate-100 text-base">Conversations</h3>
                </div>
                <button
                  onClick={() => setSessionDrawerOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <button
                onClick={createNewSession}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>New Conversation</span>
              </button>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchSessionQuery}
                  onChange={(e) => setSearchSessionQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80"
                />
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                {filteredSessions.map((s) => {
                  const isActive = s.id === activeSessionId;
                  const isEditing = editingSessionId === s.id;

                  return (
                    <div
                      key={s.id}
                      onClick={() => {
                        setActiveSessionId(s.id);
                        setSessionDrawerOpen(false);
                      }}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-2 group ${
                        isActive
                          ? 'bg-indigo-950/80 border-indigo-500 text-slate-100 ring-1 ring-cyan-500/30'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingTitleText}
                            onChange={(e) => setEditingTitleText(e.target.value)}
                            onBlur={saveRenameSession}
                            onKeyDown={(e) => e.key === 'Enter' && saveRenameSession()}
                            autoFocus
                            className="bg-slate-900 border border-cyan-500 px-1.5 py-0.5 rounded text-xs text-slate-100 w-full focus:outline-none"
                          />
                        ) : (
                          <span className="font-medium truncate">{s.title}</span>
                        )}
                      </div>

                      {!isEditing && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => startRenameSession(s, e)}
                            className="p-1 hover:text-cyan-300"
                            title="Rename"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => deleteSession(s.id, e)}
                            className="p-1 hover:text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 text-center font-mono">
              TalkMate AI Session Storage
            </div>

          </div>
        </div>
      )}

      {/* Select AI Persona Modal */}
      {activeModal === 'persona' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-base">Select AI Persona</h3>
                  <p className="text-xs text-slate-400">Tailor responses to your specific needs</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {AI_PERSONAS.map((persona) => {
                const isSelected = selectedPersona.id === persona.id;
                return (
                  <button
                    key={persona.id}
                    onClick={() => {
                      setSelectedPersona(persona);
                      setActiveModal(null);
                    }}
                    className={`w-full p-4 rounded-xl text-left transition-all border flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-indigo-950/80 border-indigo-500 ring-1 ring-cyan-500/40 text-slate-100 shadow-lg'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-100">{persona.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                          {persona.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {persona.description}
                      </p>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-cyan-400 shrink-0 mt-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Prompt Starters Modal */}
      {activeModal === 'starters' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-base">Prompt Starters</h3>
                  <p className="text-xs text-slate-400">Select a prompt template to start chatting</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {PROMPT_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    setActiveModal(null);
                    handleSendMessage(tmpl.prompt);
                  }}
                  disabled={isLoading}
                  className="p-4 rounded-xl bg-slate-950/80 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-600/80 text-left transition-all group flex flex-col justify-between gap-2 shadow-sm"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-slate-200 group-hover:text-cyan-300 text-sm transition-colors">
                      {tmpl.title}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                      {tmpl.category}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
                    {tmpl.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
