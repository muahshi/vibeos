'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GradientButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ReactNode;
}

const variants = {
  primary: 'from-primary to-primary-light shadow-primary/30',
  secondary: 'from-accent to-cyan-600 shadow-accent/30',
  danger: 'from-red-600 to-accent-pink shadow-red-500/30',
  success: 'from-accent-green to-emerald-600 shadow-accent-green/30',
};

const sizes = {
  sm: 'px-4 py-2 text-xs rounded-xl',
  md: 'px-5 py-3 text-sm rounded-xl',
  lg: 'px-6 py-4 text-base rounded-2xl',
};

export function GradientButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  className,
  disabled,
  ...props
}: GradientButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.01 }}
      disabled={disabled || loading}
      className={cn(
        'relative font-bold bg-gradient-to-r text-white transition-all duration-200',
        'shadow-lg active:shadow-none',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'flex items-center justify-center gap-2',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <motion.div
          className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
}
