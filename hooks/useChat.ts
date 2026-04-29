'use client';

import { useState, useCallback } from 'react';
import type { ChatMessage } from '@/types';

interface UseChatReturn {
  messages: ChatMessage[];
  isTyping: boolean;
  sendMessage: (content: string, twinName: string, userProfile?: Record<string, unknown>) => Promise<void>;
  clearMessages: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'init-1',
    role: 'assistant',
    content: "Hey! I'm your AI Twin — built from your vibes, moods, and personality patterns. I understand you deeply. What's on your mind?",
    timestamp: new Date().toISOString(),
  },
];

const FALLBACK_RESPONSES = [
  "That's a really interesting perspective. Your patterns show you process things deeply before acting — that's actually a superpower.",
  "I can feel the complexity behind that. What part feels most uncertain right now?",
  "Your creative side is clearly activating here. Trust that instinct — it rarely steers you wrong.",
  "You're more resilient than you realize. This moment is building something important in you.",
  "The fact you're asking this tells me you already sense the answer. What does your gut say?",
];

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(async (
    content: string,
    twinName: string,
    userProfile: Record<string, unknown> = {}
  ) => {
    if (!content.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          conversation_history: history,
          twin_name: twinName,
          user_profile: userProfile,
        }),
      });

      // Add realistic typing delay
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

      let aiContent: string;
      if (response.ok) {
        const data = await response.json();
        aiContent = data.message;
      } else {
        const idx = Math.floor(Math.random() * FALLBACK_RESPONSES.length);
        aiContent = FALLBACK_RESPONSES[idx];
      }

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: aiContent,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      await new Promise((r) => setTimeout(r, 600));
      const idx = Math.floor(Math.random() * FALLBACK_RESPONSES.length);
      const fallback: ChatMessage = {
        id: `ai-fallback-${Date.now()}`,
        role: 'assistant',
        content: FALLBACK_RESPONSES[idx],
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallback]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, isTyping]);

  const clearMessages = useCallback(() => {
    setMessages(INITIAL_MESSAGES);
  }, []);

  return { messages, isTyping, sendMessage, clearMessages };
}
