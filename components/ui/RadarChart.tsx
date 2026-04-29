'use client';

import { motion } from 'framer-motion';

interface RadarChartProps {
  data: {
    analytical: number;
    creative: number;
    empathetic: number;
    social: number;
    ambitious: number;
    calm: number;
  };
  size?: number;
  animated?: boolean;
}

const LABELS = [
  { key: 'analytical', label: 'Analytical', angle: -90 },
  { key: 'creative', label: 'Creative', angle: -30 },
  { key: 'empathetic', label: 'Empathetic', angle: 30 },
  { key: 'social', label: 'Social', angle: 90 },
  { key: 'ambitious', label: 'Ambitious', angle: 150 },
  { key: 'calm', label: 'Calm', angle: 210 },
];

function polarToCartesian(angle: number, radius: number, center: number) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: center + radius * Math.cos(radians),
    y: center + radius * Math.sin(radians),
  };
}

export function RadarChart({ data, size = 200, animated = true }: RadarChartProps) {
  const center = size / 2;
  const maxRadius = size * 0.38;
  const levels = [0.25, 0.5, 0.75, 1.0];

  // Build polygon path from data
  const dataPoints = LABELS.map(({ key, angle }) => {
    const value = data[key as keyof typeof data] / 100;
    const radius = value * maxRadius;
    return polarToCartesian(angle, radius, center);
  });

  const polygonPath = dataPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`)
    .join(' ') + 'Z';

  // Grid level paths
  const gridPaths = levels.map((level) => {
    const points = LABELS.map(({ angle }) => {
      const r = level * maxRadius;
      return polarToCartesian(angle, r, center);
    });
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';
  });

  // Axis lines
  const axes = LABELS.map(({ angle }) => {
    const outer = polarToCartesian(angle, maxRadius, center);
    return { x1: center, y1: center, x2: outer.x, y2: outer.y };
  });

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid levels */}
        {gridPaths.map((path, i) => (
          <path
            key={i}
            d={path}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
        ))}

        {/* Axis lines */}
        {axes.map((axis, i) => (
          <line
            key={i}
            x1={axis.x1}
            y1={axis.y1}
            x2={axis.x2}
            y2={axis.y2}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />
        ))}

        {/* Data polygon fill */}
        <motion.path
          d={polygonPath}
          fill="rgba(124, 58, 237, 0.15)"
          stroke="rgba(124, 58, 237, 0.6)"
          strokeWidth={2}
          initial={animated ? { opacity: 0, scale: 0 } : {}}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          style={{ transformOrigin: `${center}px ${center}px` }}
        />

        {/* Glow polygon */}
        <motion.path
          d={polygonPath}
          fill="none"
          stroke="rgba(124, 58, 237, 0.3)"
          strokeWidth={6}
          initial={animated ? { opacity: 0 } : {}}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{ filter: 'blur(4px)' }}
        />

        {/* Data points */}
        {dataPoints.map((point, i) => (
          <motion.circle
            key={i}
            cx={point.x}
            cy={point.y}
            r={4}
            fill="#7C3AED"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth={1.5}
            initial={animated ? { opacity: 0, scale: 0 } : {}}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.8 + i * 0.05 }}
          />
        ))}
      </svg>

      {/* Labels */}
      {LABELS.map(({ key, label, angle }) => {
        const labelRadius = maxRadius + 22;
        const pos = polarToCartesian(angle, labelRadius, center);
        const value = data[key as keyof typeof data];

        return (
          <div
            key={key}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ left: pos.x, top: pos.y }}
          >
            <div className="text-[10px] text-text-secondary font-medium whitespace-nowrap">
              {label}
            </div>
            <div className="text-[11px] font-bold text-primary-light">{value}%</div>
          </div>
        );
      })}
    </div>
  );
}
