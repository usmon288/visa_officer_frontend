import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface VideoHeroProps {
  variant?: 'embassy' | 'ielts';
}

export function VideoHero({ variant = 'embassy' }: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        console.log('Video autoplay prevented');
      });
    }
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-b from-secondary/90 via-secondary/60 to-background"
          style={{ zIndex: 1 }}
        />

        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d420_1px,transparent_1px),linear-gradient(to_bottom,#06b6d420_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        </div>

        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
          style={{
            backgroundImage: variant === 'embassy'
              ? 'radial-gradient(circle at 20% 50%, rgba(6,182,212,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(6,182,212,0.03) 0%, transparent 50%)'
              : 'radial-gradient(circle at 60% 40%, rgba(6,182,212,0.04) 0%, transparent 50%), radial-gradient(circle at 40% 70%, rgba(6,182,212,0.02) 0%, transparent 50%)',
            backgroundSize: '200% 200%',
          }}
        />

        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
          animate={{
            x: ['-100%', '100%'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </motion.div>
    </div>
  );
}
