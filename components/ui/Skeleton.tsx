'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`skeleton rounded-lg ${className}`}
    />
  );
}

export function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-bg pb-24 px-4 space-y-4 pt-20">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-32" />
      <div className="glass rounded-2xl p-4">
        <div className="flex gap-2 justify-between">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="flex-1 h-16 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="glass rounded-2xl p-5">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-20" />
          </div>
          <Skeleton className="w-24 h-24 rounded-full" />
        </div>
      </div>
      <div className="glass rounded-2xl p-4 space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-14 h-14 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-2 w-full" />
        </div>
      </div>
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  );
}
