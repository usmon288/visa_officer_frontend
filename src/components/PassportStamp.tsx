import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function PassportStamp() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-20 right-20 opacity-10 pointer-events-none">
      <motion.div
        style={{ rotate: rotation }}
        className="relative w-32 h-32"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <radialGradient id="stamp-gradient">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
            </radialGradient>
          </defs>

          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="url(#stamp-gradient)"
            strokeWidth="3"
            className="text-primary"
          />

          <circle
            cx="100"
            cy="100"
            r="75"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="text-primary/60"
          />

          <text
            x="100"
            y="85"
            textAnchor="middle"
            className="text-xs font-bold fill-current text-primary"
            style={{ fontSize: '14px', letterSpacing: '2px' }}
          >
            APPROVED
          </text>

          <text
            x="100"
            y="105"
            textAnchor="middle"
            className="text-[8px] fill-current text-primary/70"
            style={{ letterSpacing: '1px' }}
          >
            AI INTERVIEW
          </text>

          <text
            x="100"
            y="120"
            textAnchor="middle"
            className="text-[10px] font-mono fill-current text-primary/50"
          >
            2024
          </text>

          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 100 + Math.cos(angle) * 88;
            const y1 = 100 + Math.sin(angle) * 88;
            const x2 = 100 + Math.cos(angle) * 78;
            const y2 = 100 + Math.sin(angle) * 78;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary/40"
              />
            );
          })}
        </svg>

        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </div>
  );
}
