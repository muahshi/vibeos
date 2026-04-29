'use client';

import { motion } from 'framer-motion';

interface TraitBarProps {
  label: string;
  value: number;
  color?: string;
  delay?: number;
  animated?: boolean;
}

const defaultColors: Record<string, string> = {
  Openness: '#7C3AED',
  Conscientiousness: '#06B6D4',
  Extraversion: '#10B981',
  Agreeableness: '#F97316',
  Neuroticism: '#EC4899',
  Analytical: '#7C3AED',
  Creative: '#EC4899',
  Empathetic: '#10B981',
  Social: '#06B6D4',
  Ambitious: '#F97316',
  Calm: '#8B5CF6',
};

export function TraitBar({ label, value, color, delay = 0, animated = true }: TraitBarProps) {
  const barColor = color || defaultColors[label] || '#7C3AED';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-secondary font-medium">{label}</span>
        <span className="text-sm font-bold" style={{ color: barColor }}>
          {value}%
        </span>
      </div>
      <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${barColor}88, ${barColor})`,
            boxShadow: `0 0 8px ${barColor}60`,
          }}
          initial={animated ? { width: 0 } : { width: `${value}%` }}
          animate={{ width: `${value}%` }}
          transition={{
            duration: 1.2,
            delay: animated ? delay : 0,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        />
      </div>
    </div>
  );
}
