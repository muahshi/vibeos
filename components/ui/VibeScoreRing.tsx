'use client';

import { motion } from 'framer-motion';
import { getVibeColor, getVibeLabel } from '@/lib/utils';

interface VibeScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export function VibeScoreRing({
  score,
  size = 120,
  strokeWidth = 8,
  showLabel = true,
  animated = true,
  className = '',
}: VibeScoreRingProps) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getVibeColor(score);
  const label = getVibeLabel(score);
  const center = size / 2;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />

        {/* Progress circle */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: animated ? offset : offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
          style={{
            filter: `drop-shadow(0 0 8px ${color}80)`,
          }}
        />

        {/* Glow effect */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth / 2}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: animated ? offset : offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
          opacity={0.3}
          style={{
            filter: `blur(4px)`,
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center"
        >
          <div
            className="font-display font-bold leading-none"
            style={{
              fontSize: size * 0.22,
              color: color,
            }}
          >
            {score}%
          </div>
          {showLabel && (
            <div
              className="text-text-secondary font-medium leading-tight mt-1"
              style={{ fontSize: size * 0.085 }}
            >
              {label}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
