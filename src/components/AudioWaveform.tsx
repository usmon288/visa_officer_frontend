import { cn } from '@/lib/utils';

interface AudioWaveformProps {
  isActive: boolean;
  variant?: 'ielts' | 'job' | 'visa';
  className?: string;
  barCount?: number;
}

export function AudioWaveform({ 
  isActive, 
  variant = 'job',
  className,
  barCount = 5 
}: AudioWaveformProps) {
  const variantColors = {
    ielts: 'bg-ielts',
    job: 'bg-job',
    visa: 'bg-visa',
  };

  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-1 rounded-full transition-all duration-150",
            variantColors[variant],
            isActive ? "animate-waveform" : "h-1 opacity-30"
          )}
          style={{
            animationDelay: isActive ? `${i * 0.1}s` : '0s',
            height: isActive ? undefined : '4px',
          }}
        />
      ))}
    </div>
  );
}

// Larger version for the character display
export function AudioWaveformLarge({ 
  isActive, 
  variant = 'job',
  className 
}: Omit<AudioWaveformProps, 'barCount'>) {
  const variantColors = {
    ielts: 'bg-ielts',
    job: 'bg-job',
    visa: 'bg-visa',
  };

  const variantGlow = {
    ielts: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]',
    job: 'shadow-[0_0_20px_rgba(16,185,129,0.5)]',
    visa: 'shadow-[0_0_20px_rgba(168,85,247,0.5)]',
  };

  return (
    <div className={cn(
      "flex items-end justify-center gap-1.5 h-16 px-4 py-3 rounded-2xl",
      "bg-background/50 backdrop-blur-sm border border-border/50",
      isActive && variantGlow[variant],
      "transition-shadow duration-300",
      className
    )}>
      {Array.from({ length: 9 }).map((_, i) => {
        // Create a wave pattern - center bars are taller
        const centerDistance = Math.abs(i - 4);
        const baseHeight = isActive ? (24 - centerDistance * 4) : 6;
        
        return (
          <div
            key={i}
            className={cn(
              "w-1.5 rounded-full transition-all",
              variantColors[variant],
              isActive ? "animate-waveform-large" : "opacity-30"
            )}
            style={{
              animationDelay: isActive ? `${i * 0.08}s` : '0s',
              height: isActive ? undefined : `${baseHeight}px`,
              minHeight: '6px',
            }}
          />
        );
      })}
    </div>
  );
}
