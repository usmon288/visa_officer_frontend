import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

interface VideoStyleAvatarProps {
  variant: "ielts" | "job" | "visa-work" | "visa-student" | "visa-worktravel" | "visa-travel";
  isSpeaking: boolean;
  isListening: boolean;
  className?: string;
}

const avatarData: Record<string, { 
  name: string; 
  role: string; 
  image: string;
  bgGradient: string;
}> = {
  "ielts": {
    name: "Dr. Emma Richardson",
    role: "IELTS Senior Examiner • Cambridge University",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=800&fit=crop&crop=face&q=90",
    bgGradient: "from-slate-900 via-slate-800 to-slate-900"
  },
  "job": {
    name: "Michael Chen",
    role: "HR Director • Fortune 500 Company",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=800&fit=crop&crop=face&q=90",
    bgGradient: "from-zinc-900 via-zinc-800 to-zinc-900"
  },
  "visa-work": {
    name: "Officer James Mitchell",
    role: "Senior Visa Officer • U.S. Embassy",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&crop=face&q=90",
    bgGradient: "from-blue-950 via-slate-900 to-blue-950"
  },
  "visa-student": {
    name: "Officer Sarah Williams",
    role: "Student Visa Specialist • U.S. Consulate",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&h=800&fit=crop&crop=face&q=90",
    bgGradient: "from-indigo-950 via-slate-900 to-indigo-950"
  },
  "visa-worktravel": {
    name: "Officer David Rodriguez",
    role: "J-1 Program Officer • Department of State",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=800&fit=crop&crop=face&q=90",
    bgGradient: "from-emerald-950 via-slate-900 to-emerald-950"
  },
  "visa-travel": {
    name: "Officer Lisa Anderson",
    role: "Tourist Visa Officer • U.S. Embassy",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=800&h=800&fit=crop&crop=face&q=90",
    bgGradient: "from-amber-950 via-slate-900 to-amber-950"
  }
};

export function VideoStyleAvatar({ 
  variant, 
  isSpeaking, 
  isListening,
  className 
}: VideoStyleAvatarProps) {
  const avatar = avatarData[variant] || avatarData["visa-work"];
  const [mouthOpen, setMouthOpen] = useState(0);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  // Simulate natural mouth movement when speaking
  useEffect(() => {
    if (isSpeaking) {
      const animate = () => {
        setMouthOpen(Math.random() * 0.8 + 0.2);
        animationRef.current = requestAnimationFrame(() => {
          setTimeout(animate, 80 + Math.random() * 80);
        });
      };
      animate();
    } else {
      setMouthOpen(0);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSpeaking]);

  // Simulate natural eye movement
  useEffect(() => {
    const moveEyes = () => {
      if (!isSpeaking) {
        setEyePosition({
          x: (Math.random() - 0.5) * 8,
          y: (Math.random() - 0.5) * 4
        });
      } else {
        // Look at user when speaking
        setEyePosition({ x: 0, y: 0 });
      }
    };

    const interval = setInterval(moveEyes, 2000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [isSpeaking]);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Video call style container */}
      <div className={cn(
        "relative rounded-2xl overflow-hidden shadow-2xl",
        "w-full max-w-md aspect-[4/5]",
        "bg-gradient-to-b",
        avatar.bgGradient
      )}>
        {/* Live indicator */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <div className={cn(
            "w-3 h-3 rounded-full animate-pulse",
            isSpeaking ? "bg-red-500" : isListening ? "bg-green-500" : "bg-gray-500"
          )} />
          <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
            {isSpeaking ? "Speaking" : isListening ? "Live" : "Ready"}
          </span>
        </div>

        {/* Audio waveform overlay when speaking */}
        {isSpeaking && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-red-400 rounded-full transition-all duration-75"
                style={{
                  height: `${8 + mouthOpen * 20 * (1 + Math.sin(i * 0.8))}px`,
                  opacity: 0.8
                }}
              />
            ))}
          </div>
        )}

        {/* Main avatar image with effects */}
        <div className="relative w-full h-full">
          <img
            src={avatar.image}
            alt={avatar.name}
            className={cn(
              "w-full h-full object-cover object-top transition-all duration-200",
              isSpeaking && "scale-[1.02] brightness-110"
            )}
            style={{
              transform: isSpeaking 
                ? `scale(1.02) translateY(${mouthOpen * -2}px)` 
                : `translateX(${eyePosition.x * 0.1}px)`
            }}
          />
          
          {/* Subtle face animation overlay */}
          {isSpeaking && (
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 40% 15% at 50% 75%, rgba(0,0,0,${mouthOpen * 0.15}) 0%, transparent 100%)`
              }}
            />
          )}

          {/* Gradient overlays for professional look */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          
          {/* Speaking glow effect */}
          {isSpeaking && (
            <div className="absolute inset-0 animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-accent/10 to-transparent" />
            </div>
          )}

          {/* Listening indicator ring */}
          {isListening && !isSpeaking && (
            <div className="absolute inset-0 border-4 border-green-400/50 animate-pulse rounded-2xl" />
          )}
        </div>

        {/* Name plate - video call style */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center gap-3">
            {/* Avatar indicator */}
            <div className={cn(
              "w-2 h-2 rounded-full",
              isSpeaking ? "bg-red-500 animate-pulse" : "bg-green-500"
            )} />
            
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-semibold text-lg truncate">
                {avatar.name}
              </h2>
              <p className="text-white/60 text-sm truncate">
                {avatar.role}
              </p>
            </div>

            {/* Mute indicator for AI */}
            {!isListening && !isSpeaking && (
              <div className="bg-white/10 rounded-full p-2">
                <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Speaking visualization bar */}
      {isSpeaking && (
        <div className="mt-4 flex items-end justify-center gap-1 h-8">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 bg-gradient-to-t from-accent to-accent/50 rounded-full transition-all duration-75"
              style={{
                height: `${4 + Math.abs(Math.sin((Date.now() / 100) + i * 0.5)) * mouthOpen * 28}px`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
