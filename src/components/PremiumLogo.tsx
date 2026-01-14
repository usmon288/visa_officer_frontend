import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PremiumLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  showText?: boolean;
}

export function PremiumLogo({ size = 'md', animated = true, showText = true }: PremiumLogoProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizes = {
    sm: { icon: 32, text: 'text-lg' },
    md: { icon: 40, text: 'text-xl' },
    lg: { icon: 56, text: 'text-2xl' },
    xl: { icon: 80, text: 'text-4xl' },
  };

  const { icon, text } = sizes[size];

  return (
    <motion.div
      className="flex items-center gap-3 cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
    >
      <motion.div
        className="relative"
        style={{ width: icon, height: icon }}
        animate={animated ? { rotateY: isHovered ? 180 : 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          style={{ filter: 'drop-shadow(0 0 20px rgba(6,182,212,0.5))' }}
        >
          <defs>
            <linearGradient id="logoGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4">
                <animate
                  attributeName="stop-color"
                  values="#06b6d4;#3b82f6;#8b5cf6;#06b6d4"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#8b5cf6">
                <animate
                  attributeName="stop-color"
                  values="#8b5cf6;#06b6d4;#3b82f6;#8b5cf6"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>

            <linearGradient id="logoGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#logoGradient1)"
            strokeWidth="2"
            strokeDasharray="283"
            animate={{ strokeDashoffset: [283, 0] }}
            transition={{ duration: 2, ease: 'easeOut', delay: 0.5 }}
          />

          <motion.circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="url(#logoGradient2)"
            strokeWidth="1"
            opacity="0.5"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '50px 50px' }}
          />

          <motion.path
            d="M50 15 L50 30 M50 70 L50 85 M15 50 L30 50 M70 50 L85 50"
            stroke="url(#logoGradient1)"
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
          />

          <motion.g filter="url(#glow)">
            <motion.path
              d="M35 35 L50 25 L65 35 L65 50 L50 60 L35 50 Z"
              fill="none"
              stroke="url(#logoGradient1)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, type: 'spring' }}
              style={{ transformOrigin: '50px 42px' }}
            />

            <motion.path
              d="M35 50 L35 65 L50 75 L65 65 L65 50"
              fill="none"
              stroke="url(#logoGradient2)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5, type: 'spring' }}
              style={{ transformOrigin: '50px 62px' }}
            />

            <motion.circle
              cx="50"
              cy="50"
              r="8"
              fill="url(#logoGradient1)"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.6, delay: 0.8 }}
            />
          </motion.g>

          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <motion.circle
              key={angle}
              cx={50 + 42 * Math.cos((angle * Math.PI) / 180)}
              cy={50 + 42 * Math.sin((angle * Math.PI) / 180)}
              r="2"
              fill="url(#logoGradient1)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: [0.3, 1, 0.3] }}
              transition={{
                scale: { duration: 0.3, delay: 1.5 + i * 0.1 },
                opacity: { duration: 2, repeat: Infinity, delay: i * 0.2 },
              }}
            />
          ))}
        </svg>

        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {showText && (
        <div className="flex flex-col">
          <motion.span
            className={`font-bold ${text} leading-none`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              AI
            </span>
            <span className="text-foreground ml-1">Interview</span>
          </motion.span>
          <motion.span
            className="text-[10px] text-muted-foreground tracking-[0.3em] uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Global Success
          </motion.span>
        </div>
      )}
    </motion.div>
  );
}
