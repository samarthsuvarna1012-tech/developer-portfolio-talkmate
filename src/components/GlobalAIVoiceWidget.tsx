import React, { useState, useEffect, useRef } from 'react';
import { Bot, Mic, MicOff, Volume2, VolumeX, X, Activity, Sparkles, Square, RefreshCw } from 'lucide-react';

interface GlobalAIVoiceWidgetProps {
  isActive: boolean;
  onToggle: () => void;
}

export const GlobalAIVoiceWidget: React.FC<GlobalAIVoiceWidgetProps> = ({ isActive, onToggle }) => {
  const [status, setStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [transcript, setTranscript] = useState('');
  const [lastAnswer, setLastAnswer] = useState('');
  const [speechEnabled, setSpeechEnabled] = useState(true);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let interim = '';
          let final = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final += event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }

          const currentText = final || interim;
          if (currentText.trim()) {
            setTranscript(currentText);

            // Auto-submit on silence (1 second after speech stops)
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = setTimeout(() => {
              const queryToSend = currentText.trim();
              if (queryToSend && status !== 'thinking') {
                stopListening();
                handleQueryAndSpeak(queryToSend);
              }
            }, 1200);
          }
        };

        recognition.onerror = (err: any) => {
          console.warn('Voice recognition error:', err);
          if (status === 'listening') {
            setStatus('idle');
          }
        };

        recognition.onend = () => {
          if (status === 'listening') {
            setStatus('idle');
          }
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      window.speechSynthesis?.cancel();
    };
  }, [status]);

  // Handle widget activation state
  useEffect(() => {
    if (isActive) {
      // Speak initial greeting
      const greeting = "Hi there! I am Samarth's AI voice assistant. Ask me anything out loud!";
      setLastAnswer(greeting);
      speakText(greeting, () => {
        startListening();
      });
    } else {
      stopListening();
      window.speechSynthesis?.cancel();
      setStatus('idle');
      setTranscript('');
      setLastAnswer('');
    }
  }, [isActive]);

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        window.speechSynthesis?.cancel();
        setTranscript('');
        recognitionRef.current.start();
        setStatus('listening');
      } catch (e) {
        setStatus('listening');
      }
    } else {
      alert('Speech recognition is not supported in this browser. You can still use the /talkmate page!');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  };

  const speakText = (text: string, onComplete?: () => void) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    // Clean text for natural speech synthesis
    const cleanText = text
      .replace(/[*_#`~\[\]]/g, '')
      .replace(/https?:\/\/\S+/g, 'link')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => setStatus('speaking');
    utterance.onend = () => {
      setStatus('idle');
      if (onComplete) onComplete();
      // Resume listening after speaking if still active
      if (isActive) {
        setTimeout(() => startListening(), 500);
      }
    };
    utterance.onerror = () => setStatus('idle');

    window.speechSynthesis.speak(utterance);
  };

  const handleQueryAndSpeak = async (queryText: string) => {
    setStatus('thinking');
    setTranscript(queryText);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: queryText }],
          personaId: 'friendly-companion',
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch AI response');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.replace('data: ', ''));
                if (data.text) {
                  fullContent += data.text;
                  setLastAnswer(fullContent);
                }
              } catch (e) {}
            }
          }
        }
      }

      if (fullContent) {
        speakText(fullContent);
      } else {
        setStatus('idle');
      }
    } catch (err) {
      console.error(err);
      const errMessage = "Sorry, I couldn't connect right now. Please try asking again!";
      setLastAnswer(errMessage);
      speakText(errMessage);
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 w-auto sm:w-[calc(100%-3rem)] max-w-sm animate-in slide-in-from-bottom duration-300 pointer-events-auto">
      <div className="bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 rounded-2xl shadow-2xl p-4 text-slate-100 space-y-3 ring-1 ring-cyan-500/20">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-cyan-300" />
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div>
              <div className="font-bold text-xs text-slate-100 flex items-center gap-1.5">
                Global Voice AI
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-cyan-300">
                  Speech Mode
                </span>
              </div>
              <div className="text-[10px] font-mono text-cyan-400 capitalize flex items-center gap-1">
                <Activity className="w-3 h-3 animate-pulse" />
                {status === 'listening' && 'Listening out loud...'}
                {status === 'thinking' && 'Processing answer...'}
                {status === 'speaking' && 'Speaking out loud...'}
                {status === 'idle' && 'Voice Agent Active'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                if (status === 'speaking') {
                  window.speechSynthesis?.cancel();
                  setStatus('idle');
                } else if (status === 'listening') {
                  stopListening();
                  setStatus('idle');
                } else {
                  startListening();
                }
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title={status === 'listening' ? 'Stop Listening' : 'Start Listening'}
            >
              {status === 'listening' ? <Mic className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> : <MicOff className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Close Voice Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Voice Status Box */}
        <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800 space-y-2 text-xs">
          {status === 'listening' && (
            <div className="flex items-center gap-2 text-cyan-300 animate-pulse font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>{transcript ? `"${transcript}"` : 'Listening... Speak your question!'}</span>
            </div>
          )}

          {status === 'thinking' && (
            <div className="flex items-center gap-2 text-indigo-300 font-mono">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>Consulting the AI assistant...</span>
            </div>
          )}

          {lastAnswer && (
            <div className="text-slate-300 text-xs leading-relaxed max-h-24 overflow-y-auto pr-1">
              <p className="font-semibold text-cyan-300 text-[11px] mb-0.5">Spoken Response:</p>
              <p>{lastAnswer}</p>
            </div>
          )}
        </div>

        {/* Footer tip */}
        <p className="text-[10px] text-slate-400 text-center font-mono">
          Speak out loud — answers directly with voice speech!
        </p>

      </div>
    </div>
  );
};
