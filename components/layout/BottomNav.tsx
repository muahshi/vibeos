'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, BarChart2, Compass, Heart, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/my-vibe', icon: BarChart2, label: 'My Vibe' },
  { href: '/explore', icon: Compass, label: 'Explore' },
  { href: '/match-page', icon: Heart, label: 'Match' },
  { href: '/ai-twin', icon: MessageCircle, label: 'AI Twin' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-bg/80 backdrop-blur-xl border-t border-border" />

      <div className="relative flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-primary/15 rounded-xl border border-primary/20"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}

              <motion.div
                animate={{
                  y: isActive ? -1 : 0,
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ type: 'spring', bounce: 0.4, duration: 0.3 }}
              >
                <Icon
                  size={20}
                  className={cn(
                    'transition-colors duration-200',
                    isActive ? 'text-primary-light' : 'text-text-muted'
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </motion.div>

              <span
                className={cn(
                  'text-[10px] font-medium transition-colors duration-200',
                  isActive ? 'text-primary-light' : 'text-text-muted'
                )}
              >
                {item.label}
              </span>

              {isActive && (
                <motion.div
                  layoutId="nav-dot"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-light"
                  transition={{ type: 'spring', bounce: 0.4 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Safe area for mobile */}
      <div className="h-safe-area-inset-bottom bg-bg/80" />
    </nav>
  );
}
