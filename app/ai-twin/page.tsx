'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MoreVertical, Sparkles, Brain } from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { MOCK_USER, MOCK_VIBE_PROFILE } from '@/lib/utils';
import type { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';

const SUGGESTED_PROMPTS = [
  'How do you think I\'m feeling today?',
  'What should I focus on?',
  'Help me with a creative block',
  'What are my strengths?',
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: `Hey! I'm your AI Twin — built from your vibes, moods, and personality patterns. I understand you deeply. What's on your mind?`,
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
];

function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-primary-light"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ message, isLast }: { message: ChatMessage; isLast: boolean }) {
  const isUser = message.role === 'user';
  const time = new Date(message.timestamp).toLocaleTimeString('en', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', bounce: 0.3 }}
      className={cn('flex', isUser ? 'justify-end' : 'justify-start')}
    >
      <div className={cn('max-w-[82%]', isUser ? 'items-end' : 'items-start', 'flex flex-col gap-1')}>
        {!isUser && (
          <div className="flex items-center gap-2 px-1">
            <div className="w-6 h-6 rounded-full bg-gradient-vibe flex items-center justify-center">
              <Sparkles size={10} className="text-white" />
            </div>
            <span className="text-[10px] text-text-muted font-medium">AI Twin</span>
          </div>
        )}

        <div
          className={cn(
            'px-4 py-3 rounded-2xl text-sm leading-relaxed',
            isUser
              ? 'bg-primary text-white rounded-tr-sm shadow-lg shadow-primary/20'
              : 'glass rounded-tl-sm border border-white/8'
          )}
        >
          {message.content}
        </div>

        <span className="text-[10px] text-text-muted px-1">{time}</span>
      </div>
    </motion.div>
  );
}

export default function AITwinPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isTyping) return;

    setShowPrompts(false);
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          conversation_history: history,
          twin_name: MOCK_USER.name,
          user_profile: {
            vibe_score: MOCK_VIBE_PROFILE.vibe_score,
            vibe_label: MOCK_VIBE_PROFILE.vibe_label,
            analytical: MOCK_VIBE_PROFILE.analytical,
            creative: MOCK_VIBE_PROFILE.creative,
            empathetic: MOCK_VIBE_PROFILE.empathetic,
            social: MOCK_VIBE_PROFILE.social,
            ambitious: MOCK_VIBE_PROFILE.ambitious,
            calm: MOCK_VIBE_PROFILE.calm,
          },
        }),
      });

      let aiContent = "I'm processing your thoughts. Your energy right now suggests you're ready for a breakthrough. Trust the process.";

      if (response.ok) {
        const data = await response.json();
        aiContent = data.message;
      }

      // Simulate typing delay for realism
      await new Promise((r) => setTimeout(r, 600));

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiContent,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm reflecting on that. Your patterns show incredible resilience. What feels most urgent right now?",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 px-4 pt-12 pb-3 bg-bg/90 backdrop-blur-xl border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* AI Twin avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-vibe flex items-center justify-center shadow-lg shadow-primary/30">
                <Brain size={18} className="text-white" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-accent-green border-2 border-bg"
              />
            </div>
            <div>
              <h2 className="font-bold text-text-primary text-base leading-tight">AI Twin</h2>
              <div className="flex items-center gap-1">
                <motion.div
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-accent-green"
                />
                <span className="text-[11px] text-text-muted">Online • Understands you deeply</span>
              </div>
            </div>
          </div>

          <button className="w-9 h-9 rounded-full glass flex items-center justify-center">
            <MoreVertical size={16} className="text-text-secondary" />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-32 space-y-4">
        {/* Personality context card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-3 border border-primary/10"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={12} className="text-primary-light" />
            <span className="text-[11px] font-semibold text-primary-light">Your AI Twin is powered by your vibe</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Vibe', value: `${MOCK_VIBE_PROFILE.vibe_score}%` },
              { label: 'Creative', value: `${MOCK_VIBE_PROFILE.creative}%` },
              { label: 'Empathy', value: `${MOCK_VIBE_PROFILE.empathetic}%` },
            ].map(({ label, value }) => (
              <div key={label} className="text-center bg-surface-2 rounded-lg py-2">
                <div className="text-xs font-bold text-text-primary">{value}</div>
                <div className="text-[9px] text-text-muted">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Messages */}
        {messages.map((message, i) => (
          <MessageBubble
            key={message.id}
            message={message}
            isLast={i === messages.length - 1}
          />
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex justify-start"
            >
              <div className="glass rounded-2xl rounded-tl-sm border border-white/8">
                <TypingIndicator />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Suggested prompts */}
        <AnimatePresence>
          {showPrompts && messages.length === 1 && !isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <p className="text-xs text-text-muted text-center">Try asking...</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="glass px-3 py-2 rounded-full text-xs text-text-secondary hover:text-text-primary hover:border-primary/30 transition-all active:scale-95"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="fixed bottom-16 left-0 right-0 z-40 px-4 pb-3 pt-2 bg-bg/90 backdrop-blur-xl border-t border-border/30">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isTyping}
              className="w-full bg-surface-2 border border-border rounded-2xl px-4 py-3 pr-12 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/40 transition-colors disabled:opacity-50"
            />
          </div>
          <motion.button
            type="submit"
            disabled={!input.trim() || isTyping}
            whileTap={{ scale: 0.9 }}
            className={cn(
              'w-11 h-11 rounded-full flex items-center justify-center transition-all',
              input.trim() && !isTyping
                ? 'bg-primary shadow-lg shadow-primary/30 hover:bg-primary-light'
                : 'bg-surface-3 opacity-50'
            )}
          >
            <Send size={16} className="text-white ml-0.5" />
          </motion.button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
