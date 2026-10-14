import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Bot,
  User,
  Lightbulb,
  MessageSquare,
  Compass,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  tip?: string;
  timestamp: string;
}

const SCENARIOS = [
  {
    id: 'casual_connection',
    title: 'Daily Conversational Warm-up',
    description: 'Casual chats about daily routines, hobbies, films, and weekend plans.',
    starterPrompt: "Hi there! I'm Bloom, your speaking coach. How has your day been treating you so far?",
  },
  {
    id: 'executive_interview',
    title: 'Job Interview Simulation',
    description: 'Practice high-impact professional replies to challenging behavioral questions.',
    starterPrompt: "Welcome to our conversation. To begin, could you introduce your core strengths and tell me about a project you are particularly proud of?",
  },
  {
    id: 'travel_airport',
    title: 'Travel & Real-World Situations',
    description: 'Navigate travel hiccups, order at restaurants, and negotiate situations smoothly.',
    starterPrompt: "Welcome to the Grand Horizon Hotel front desk. How can I assist you with your booking today?",
  },
  {
    id: 'spontaneous_debate',
    title: 'Impromptu Thought Provocation',
    description: 'Take a stand on thought-provoking questions with quick justifications.',
    starterPrompt: "Let's test spontaneous thinking! Do you believe remote work enhances or weakens company culture in the long run?",
  },
];

export const AICoachInteractive: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-start',
      role: 'assistant',
      content: SCENARIOS[0].starterPrompt,
      tip: "Try answering in 2-3 complete sentences rather than a short 'good'. Mention a specific detail!",
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSpeechEnabled, setVoiceSpeechEnabled] = useState(true);
  const [isCoachThinking, setIsCoachThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Web Speech Recognition if available
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isCoachThinking]);

  // Voice speech synthesis
  const speakText = (text: string) => {
    if (!voiceSpeechEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.95; // Natural measured pace
    window.speechSynthesis.speak(utterance);
  };

  const handleSelectScenario = (scenario: typeof SCENARIOS[0]) => {
    setSelectedScenario(scenario);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: scenario.starterPrompt,
        tip: 'Speak naturally, elaborate on your feelings or reasons, and do not rush.',
        timestamp: 'Just now',
      },
    ]);
  };

  // Toggle browser speech recognition for hands-free speaking
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputValue(transcript);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const sendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isCoachThinking) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsCoachThinking(true);

    try {
      const conversationHistory = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      conversationHistory.push({ role: 'user', content: text });

      const response = await fetch('/api/coach-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationHistory,
          scenario: selectedScenario.title,
          level: 'Intermediate',
        }),
      });

      if (!response.ok) throw new Error('Coach service error');
      const data = await response.json();
      const reply = data.reply || "That's very interesting! Can you give me an example?";

      const assistantMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        role: 'assistant',
        content: reply,
        tip: "Notice the follow-up question. Try linking with: 'For instance...', 'From my standpoint...'",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      speakText(reply);
    } catch {
      const fallbackReply = "That's a thoughtful point. Could you tell me a little more about what led you to that conclusion?";
      const assistantMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        role: 'assistant',
        content: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      speakText(fallbackReply);
    } finally {
      setIsCoachThinking(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[750px]">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-black/5 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#7957E8] text-white flex items-center justify-center shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#1D1D1F] dark:text-white">Bloom AI Speaking Coach</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
              Interactive conversational drill & feedback partner
            </p>
          </div>
        </div>

        {/* Audio Output & Reset controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setVoiceSpeechEnabled(!voiceSpeechEnabled)}
            className={`p-2.5 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              voiceSpeechEnabled
                ? 'bg-[#7957E8]/10 text-[#7957E8] border-[#7957E8]/20'
                : 'bg-black/5 dark:bg-white/5 text-[#6E6E73] border-transparent'
            }`}
            title="Read coach responses aloud"
          >
            {voiceSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{voiceSpeechEnabled ? 'Voice On' : 'Voice Off'}</span>
          </button>
          <button
            onClick={() => handleSelectScenario(selectedScenario)}
            className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 text-[#6E6E73] hover:text-[#1D1D1F] dark:hover:text-white transition-colors cursor-pointer"
            title="Restart conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scenario Selector Pills */}
      <div className="px-5 sm:px-6 py-3 bg-[#F5F5F7] dark:bg-[#2C2C2E] border-b border-black/5 dark:border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-semibold text-[#6E6E73] dark:text-[#98989D] uppercase shrink-0 flex items-center gap-1">
          <Compass className="w-3.5 h-3.5" /> Scenario:
        </span>
        {SCENARIOS.map((sc) => (
          <button
            key={sc.id}
            onClick={() => handleSelectScenario(sc)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedScenario.id === sc.id
                ? 'bg-[#7957E8] text-white shadow-sm'
                : 'bg-white dark:bg-[#3A3A3C] text-[#6E6E73] dark:text-[#D1D1D6] hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            {sc.title}
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-start gap-2.5 max-w-[85%] sm:max-w-[75%]">
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-[#7957E8]/10 text-[#7957E8] dark:bg-[#7957E8]/20 dark:text-[#A78BFA] flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#7957E8] text-white rounded-br-sm'
                      : 'bg-[#F5F5F7] dark:bg-[#2C2C2E] text-[#1D1D1F] dark:text-white rounded-bl-sm border border-black/5 dark:border-white/5'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Optional Speaking Tip below coach message */}
                {msg.tip && (
                  <div className="mt-1.5 p-2 rounded-xl bg-[#7957E8]/5 dark:bg-[#7957E8]/10 text-[11px] text-[#7957E8] dark:text-[#A78BFA] flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                    <span>{msg.tip}</span>
                  </div>
                )}
                <span className="text-[10px] text-[#6E6E73] dark:text-[#8E8E93] mt-1 block px-1">
                  {msg.timestamp}
                </span>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-black/5 dark:bg-white/10 text-[#1D1D1F] dark:text-white flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
        ))}

        {isCoachThinking && (
          <div className="flex items-center gap-2 text-xs text-[#6E6E73] dark:text-[#98989D] p-2">
            <div className="w-2 h-2 rounded-full bg-[#7957E8] animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-[#7957E8] animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 rounded-full bg-[#7957E8] animate-bounce [animation-delay:0.4s]" />
            <span>Bloom is listening and formulating feedback...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Tray */}
      <div className="p-4 sm:p-5 border-t border-black/5 dark:border-white/10 bg-white dark:bg-[#1C1C1E]">
        <div className="flex items-center gap-2">
          {/* Live speech input button */}
          <button
            onClick={toggleSpeechRecognition}
            className={`p-3 rounded-2xl transition-all cursor-pointer ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-[#7957E8]/10 text-[#7957E8] hover:bg-[#7957E8]/20 dark:bg-[#7957E8]/20 dark:text-[#A78BFA]'
            }`}
            title={isRecording ? 'Listening... click to stop' : 'Tap to speak your answer'}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={isRecording ? 'Listening to your voice...' : 'Speak or type your answer to Bloom...'}
            className="flex-1 px-4 py-3 rounded-2xl bg-[#F5F5F7] dark:bg-[#2C2C2E] text-xs sm:text-sm text-[#1D1D1F] dark:text-white border border-transparent focus:border-[#7957E8] focus:outline-none"
          />

          <button
            onClick={() => sendMessage()}
            disabled={!inputValue.trim() || isCoachThinking}
            className="p-3 rounded-2xl bg-[#7957E8] hover:bg-[#6C47E0] disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all cursor-pointer shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-2 text-center text-[11px] text-[#6E6E73] dark:text-[#8E8E93]">
          Tip: Tap the purple microphone to practice spontaneous speech directly!
        </div>
      </div>
    </div>
  );
};
