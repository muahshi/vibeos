'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Brain, Users, Heart, MessageCircle } from 'lucide-react';

const FEATURES = [
  {
    icon: Brain,
    color: '#7C3AED',
    title: 'Daily Vibe Tracking',
    description: 'AI reads your mood and builds your personality layer day by day.',
  },
  {
    icon: Users,
    color: '#06B6D4',
    title: 'Find Your Tribe',
    description: 'Connect with people who match your vibe. Real compatibility.',
  },
  {
    icon: Heart,
    color: '#EC4899',
    title: 'Compatibility Engine',
    description: 'Deep personality matching — not just surface-level interests.',
  },
  {
    icon: MessageCircle,
    color: '#10B981',
    title: 'Your AI Twin',
    description: 'A digital version of you that others can talk to. Viral + monetizable.',
  },
];

const STEPS = [
  {
    id: 'welcome',
    title: 'Your AI\nIdentity Layer',
    subtitle: 'VibeOS understands who you are and connects you with people who match.',
    cta: 'Get Started',
  },
  {
    id: 'features',
    title: 'Built for\nReal Humans',
    subtitle: 'Not just another social app. VibeOS evolves with you.',
    cta: 'Continue',
  },
  {
    id: 'signup',
    title: 'Join the\nVibe',
    subtitle: 'Start your journey. Free forever for the essentials.',
    cta: 'Enter VibeOS',
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const router = useRouter();

  const currentStep = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      // In production: create account, then redirect
      router.push('/home');
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full"
          style={{ background: 'radial-gradient(circle, #7C3AED, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full"
          style={{ background: 'radial-gradient(circle, #06B6D4, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] rounded-full"
          style={{ background: 'radial-gradient(circle, #EC4899, transparent 70%)' }}
        />
      </div>

      {/* Progress dots */}
      <div className="relative z-10 flex justify-center pt-16 gap-2">
        {STEPS.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: i === step ? 24 : 6,
              opacity: i <= step ? 1 : 0.3,
            }}
            transition={{ duration: 0.3 }}
            className="h-1.5 rounded-full bg-primary"
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="space-y-6"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
              className="w-16 h-16 rounded-2xl bg-gradient-vibe flex items-center justify-center shadow-2xl shadow-primary/40 mb-8"
            >
              <Sparkles size={28} className="text-white" />
            </motion.div>

            {/* Title */}
            <h1 className="font-display font-black text-5xl leading-tight text-white whitespace-pre-line">
              {currentStep.title}
            </h1>

            <p className="text-text-secondary text-lg leading-relaxed">
              {currentStep.subtitle}
            </p>

            {/* Step-specific content */}
            {step === 1 && (
              <div className="space-y-3 mt-4">
                {FEATURES.map(({ icon: Icon, color, title, description }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass rounded-2xl p-4 flex items-start gap-4"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${color}20`, border: `1px solid ${color}30` }}
                    >
                      <Icon size={18} style={{ color }} />
                    </div>
                    <div>
                      <p className="font-bold text-text-primary text-sm">{title}</p>
                      <p className="text-text-muted text-xs mt-0.5">{description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 mt-2">
                <div className="glass rounded-2xl p-4 space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-text-secondary mb-1.5 block">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="What should we call you?"
                      className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-text-secondary mb-1.5 block">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/40 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-text-muted">or</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <button className="w-full glass rounded-2xl py-3 flex items-center justify-center gap-3 text-sm font-semibold text-text-primary hover:border-border-light transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>

                <p className="text-[11px] text-text-muted text-center leading-relaxed">
                  By continuing, you agree to our Terms of Service and Privacy Policy.
                  Your data stays private and is never sold.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA Button */}
      <div className="relative z-10 px-6 pb-12 space-y-3">
        <motion.button
          onClick={handleNext}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
            boxShadow: '0 8px 30px rgba(124, 58, 237, 0.4)',
          }}
        >
          {currentStep.cta}
          <ArrowRight size={18} />
        </motion.button>

        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="w-full text-text-muted text-sm py-2"
          >
            Back
          </button>
        )}

        {step === 0 && (
          <button
            onClick={() => router.push('/home')}
            className="w-full text-text-muted text-sm py-2"
          >
            Already have an account? Sign in
          </button>
        )}
      </div>
    </div>
  );
}
