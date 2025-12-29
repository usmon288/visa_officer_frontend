import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { AudioWaveformLarge } from "./AudioWaveform";

interface AnimatedCharacterProps {
  variant: "ielts" | "job" | "visa";
  isSpeaking?: boolean;
  isListening?: boolean;
  className?: string;
}

const characterData = {
  ielts: {
    name: "Emma",
    role: "IELTS Examiner",
    gender: "female",
    gradient: "from-ielts to-ielts-dark",
    bgGradient: "from-ielts/20 to-ielts/5",
  },
  job: {
    name: "Michael",
    role: "HR Manager",
    gender: "male",
    gradient: "from-job to-job-dark",
    bgGradient: "from-job/20 to-job/5",
  },
  visa: {
    name: "Sarah",
    role: "Visa Officer",
    gender: "female",
    gradient: "from-visa to-visa-dark",
    bgGradient: "from-visa/20 to-visa/5",
  },
};

export function AnimatedCharacter({ 
  variant, 
  isSpeaking = false, 
  isListening = false,
  className 
}: AnimatedCharacterProps) {
  const character = characterData[variant];
  const [blinkState, setBlinkState] = useState(false);
  const [mouthState, setMouthState] = useState(0);

  // Blink animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkState(true);
      setTimeout(() => setBlinkState(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Mouth animation when speaking
  useEffect(() => {
    if (!isSpeaking) {
      setMouthState(0);
      return;
    }

    const mouthInterval = setInterval(() => {
      setMouthState(prev => (prev + 1) % 3);
    }, 150);

    return () => clearInterval(mouthInterval);
  }, [isSpeaking]);

  const getMouthPath = () => {
    if (!isSpeaking) {
      return "M 35 65 Q 50 70 65 65"; // Neutral/slight smile
    }
    switch (mouthState) {
      case 0:
        return "M 35 62 Q 50 75 65 62"; // Open
      case 1:
        return "M 35 65 Q 50 68 65 65"; // Semi-closed
      case 2:
        return "M 35 60 Q 50 78 65 60"; // Wide open
      default:
        return "M 35 65 Q 50 70 65 65";
    }
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Character container */}
      <div className="relative">
        {/* Glow effect when speaking */}
        {isSpeaking && (
          <div
            className={cn(
              "absolute inset-0 rounded-full bg-gradient-to-br blur-2xl opacity-60 animate-pulse",
              character.gradient
            )}
            style={{ transform: "scale(1.3)" }}
          />
        )}

        {/* Listening indicator */}
        {isListening && !isSpeaking && (
          <div className="absolute -inset-4">
            <div className="absolute inset-0 rounded-full border-4 border-success/50 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-success/30 animate-ping" style={{ animationDelay: "0.2s" }} />
          </div>
        )}

        {/* Main avatar */}
        <div
          className={cn(
            "relative h-32 w-32 rounded-full bg-gradient-to-br shadow-large overflow-hidden",
            character.gradient,
            isSpeaking ? "animate-pulse" : ""
          )}
        >
          {/* SVG Face */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Background */}
            <circle cx="50" cy="50" r="48" fill="url(#faceGradient)" />
            
            {/* Face base */}
            <ellipse cx="50" cy="52" rx="30" ry="32" fill="#FFE4C4" />
            
            {/* Eyes */}
            <g className={blinkState ? "opacity-20" : "opacity-100"} style={{ transition: "opacity 0.1s" }}>
              {/* Left eye */}
              <ellipse cx="38" cy="45" rx="6" ry={blinkState ? 1 : 5} fill="white" />
              <circle cx="38" cy="45" r={blinkState ? 0.5 : 3} fill="#4A3728" />
              <circle cx="39" cy="44" r="1" fill="white" />
              
              {/* Right eye */}
              <ellipse cx="62" cy="45" rx="6" ry={blinkState ? 1 : 5} fill="white" />
              <circle cx="62" cy="45" r={blinkState ? 0.5 : 3} fill="#4A3728" />
              <circle cx="63" cy="44" r="1" fill="white" />
            </g>
            
            {/* Eyebrows */}
            <path d="M 30 38 Q 38 35 44 38" stroke="#4A3728" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 56 38 Q 62 35 70 38" stroke="#4A3728" strokeWidth="2" fill="none" strokeLinecap="round" />
            
            {/* Nose */}
            <path d="M 50 48 L 48 55 Q 50 57 52 55 L 50 48" fill="#DEB887" opacity="0.5" />
            
            {/* Mouth */}
            <path 
              d={getMouthPath()} 
              stroke="#C44" 
              strokeWidth="2.5" 
              fill={isSpeaking ? "#C44" : "none"}
              strokeLinecap="round"
              style={{ transition: "d 0.1s" }}
            />
            
            {/* Cheeks - blush */}
            <circle cx="28" cy="55" r="5" fill="#FFB6C1" opacity="0.4" />
            <circle cx="72" cy="55" r="5" fill="#FFB6C1" opacity="0.4" />
            
            {/* Hair based on gender */}
            {character.gender === "female" ? (
              <>
                <path d="M 20 35 Q 25 15 50 12 Q 75 15 80 35 Q 82 25 78 20 Q 60 5 50 8 Q 40 5 22 20 Q 18 25 20 35" fill="#4A3728" />
                <path d="M 18 40 Q 15 50 18 65" stroke="#4A3728" strokeWidth="8" fill="none" strokeLinecap="round" />
                <path d="M 82 40 Q 85 50 82 65" stroke="#4A3728" strokeWidth="8" fill="none" strokeLinecap="round" />
              </>
            ) : (
              <path d="M 22 35 Q 25 18 50 15 Q 75 18 78 35 L 80 30 Q 75 12 50 10 Q 25 12 20 30 L 22 35" fill="#4A3728" />
            )}
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="faceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>

          {/* Professional attire indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-foreground/20 to-transparent" />
        </div>

        {/* Status indicator */}
        <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-card shadow-medium border-2 border-background">
          <div className={cn(
            "h-4 w-4 rounded-full transition-all",
            isSpeaking 
              ? "bg-accent animate-pulse" 
              : isListening 
              ? "bg-success animate-pulse" 
              : "bg-muted-foreground/30"
          )} />
        </div>
      </div>

      {/* Name and role */}
      <div className="mt-4 text-center">
        <h3 className="text-lg font-bold text-foreground">{character.name}</h3>
        <p className="text-sm text-muted-foreground">{character.role}</p>
      </div>

      {/* Audio waveform visualization */}
      <div className="mt-4">
        <AudioWaveformLarge 
          isActive={isSpeaking} 
          variant={variant}
        />
      </div>

      {/* Status text */}
      <div className="mt-2 h-5">
        {isSpeaking && (
          <p className="text-sm text-accent font-medium animate-pulse">Speaking...</p>
        )}
        {isListening && !isSpeaking && (
          <p className="text-sm text-success font-medium animate-pulse">Listening to you...</p>
        )}
      </div>
    </div>
  );
}
