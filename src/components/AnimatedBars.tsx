import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const COLORS = [
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#f97316', // orange
  '#84cc16', // lime
  '#6366f1', // indigo
  '#14b8a6', // teal
];

interface Bar {
  id: number;
  x: number;
  y: number;
  width: number;
  color: string;
  delay: number;
  duration: number;
  direction: 'left' | 'right';
}

const generateBars = (count: number): Bar[] => {
  const bars: Bar[] = [];
  const rows = 20;
  const barsPerRow = Math.ceil(count / rows);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < barsPerRow; col++) {
      const id = row * barsPerRow + col;
      if (id >= count) break;

      bars.push({
        id,
        x: col * 60 + (row % 2 === 0 ? 0 : 30),
        y: row * 32,
        width: 40 + Math.random() * 30,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 3,
        direction: Math.random() > 0.5 ? 'left' : 'right',
      });
    }
  }

  return bars;
};

export function AnimatedBars() {
  const bars = useRef(generateBars(200)).current;

  return (
    <div className="absolute inset-0 overflow-hidden opacity-40">
      <div className="absolute inset-0" style={{ transform: 'rotate(-15deg) scale(1.5)', transformOrigin: 'center' }}>
        {bars.map((bar) => (
          <motion.div
            key={bar.id}
            className="absolute rounded-full"
            style={{
              left: bar.x,
              top: bar.y,
              width: bar.width,
              height: 12,
              backgroundColor: bar.color,
            }}
            initial={{ opacity: 0.3, x: bar.direction === 'left' ? -20 : 20 }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              x: bar.direction === 'left' ? [-20, 20, -20] : [20, -20, 20],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: bar.duration,
              delay: bar.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function AnimatedBarsGrid() {
  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 z-10" />
      <AnimatedBars />
    </div>
  );
}

export function FloatingBarsSphere() {
  const rows = 12;
  const barsPerRow = 16;
  const radius = 180;

  return (
    <div className="relative w-[400px] h-[400px]">
      <motion.div
        className="absolute inset-0"
        animate={{ rotateY: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      >
        {Array.from({ length: rows }).map((_, rowIndex) => {
          const rowAngle = (rowIndex / rows) * Math.PI;
          const rowRadius = Math.sin(rowAngle) * radius;
          const y = Math.cos(rowAngle) * radius;

          return Array.from({ length: barsPerRow }).map((_, barIndex) => {
            const angle = (barIndex / barsPerRow) * Math.PI * 2;
            const x = Math.cos(angle) * rowRadius;
            const z = Math.sin(angle) * rowRadius;
            const color = COLORS[(rowIndex + barIndex) % COLORS.length];

            return (
              <motion.div
                key={`${rowIndex}-${barIndex}`}
                className="absolute rounded-full"
                style={{
                  width: 24,
                  height: 8,
                  backgroundColor: color,
                  left: '50%',
                  top: '50%',
                  transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${angle}rad)`,
                  opacity: 0.8,
                }}
                animate={{
                  opacity: [0.4, 0.9, 0.4],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            );
          });
        })}
      </motion.div>
    </div>
  );
}
