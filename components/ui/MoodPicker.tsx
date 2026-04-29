'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { MoodOption } from '@/types';

const MOODS: MoodOption[] = [
  { label: 'Great', emoji: '😄', value: 'great', score: 5 },
  { label: 'Good', emoji: '😊', value: 'good', score: 4 },
  { label: 'Okay', emoji: '😐', value: 'okay', score: 3 },
  { label: 'Low', emoji: '😔', value: 'low', score: 2 },
  { label: 'Bad', emoji: '😞', value: 'bad', score: 1 },
];

interface MoodPickerProps {
  selected?: string;
  onSelect: (mood: MoodOption) => void;
  disabled?: boolean;
}

export function MoodPicker({ selected, onSelect, disabled }: MoodPickerProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      {MOODS.map((mood, i) => (
        <motion.button
          key={mood.value}
          onClick={() => !disabled && onSelect(mood)}
          disabled={disabled}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          whileTap={{ scale: 0.9 }}
          className={cn(
            'flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all duration-200 flex-1',
            selected === mood.value
              ? 'bg-primary/20 border border-primary/40 shadow-lg shadow-primary/20'
              : 'bg-surface-2 border border-border hover:border-border-light hover:bg-surface-3',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <motion.span
            className="text-2xl"
            animate={selected === mood.value ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            {mood.emoji}
          </motion.span>
          <span
            className={cn(
              'text-[10px] font-semibold',
              selected === mood.value ? 'text-primary-light' : 'text-text-muted'
            )}
          >
            {mood.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
