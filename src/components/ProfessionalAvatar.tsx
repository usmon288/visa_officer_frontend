import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

interface ProfessionalAvatarProps {
  variant: "ielts" | "job" | "visa-work" | "visa-student" | "visa-worktravel" | "visa-travel";
  isSpeaking?: boolean;
  isListening?: boolean;
  className?: string;
}

const characterData = {
  ielts: {
    name: "Dr. Emma Richardson",
    role: "IELTS Examiner",
    gender: "female",
    skinTone: "#F5D0B9",
    hairColor: "#4A3728",
    eyeColor: "#2E86AB",
    suitColor: "#1E3A5F",
    gradient: "from-ielts to-ielts-dark",
  },
  job: {
    name: "Michael Chen",
    role: "Senior HR Director",
    gender: "male",
    skinTone: "#E8C4A0",
    hairColor: "#1A1A1A",
    eyeColor: "#3D3D3D",
    suitColor: "#2D2D2D",
    gradient: "from-job to-job-dark",
  },
  "visa-work": {
    name: "Officer James Mitchell",
    role: "Work Visa Specialist",
    gender: "male",
    skinTone: "#D4A574",
    hairColor: "#3D2B1F",
    eyeColor: "#4A7C59",
    suitColor: "#1E3A5F",
    gradient: "from-visa to-visa-dark",
  },
  "visa-student": {
    name: "Officer Sarah Williams",
    role: "Student Visa Officer",
    gender: "female",
    skinTone: "#F0C8A0",
    hairColor: "#2C1810",
    eyeColor: "#6B8E23",
    suitColor: "#1E3A5F",
    gradient: "from-visa to-visa-dark",
  },
  "visa-worktravel": {
    name: "Officer David Rodriguez",
    role: "Exchange Program Officer",
    gender: "male",
    skinTone: "#C4956A",
    hairColor: "#1A1A1A",
    eyeColor: "#4E342E",
    suitColor: "#1E3A5F",
    gradient: "from-visa to-visa-dark",
  },
  "visa-travel": {
    name: "Officer Lisa Anderson",
    role: "Tourist Visa Officer",
    gender: "female",
    skinTone: "#FFDAB9",
    hairColor: "#8B4513",
    eyeColor: "#4682B4",
    suitColor: "#1E3A5F",
    gradient: "from-visa to-visa-dark",
  },
};

export function ProfessionalAvatar({ 
  variant, 
  isSpeaking = false, 
  isListening = false,
  className 
}: ProfessionalAvatarProps) {
  const character = characterData[variant] || characterData["visa-work"];
  const [blinkState, setBlinkState] = useState(false);
  const [mouthState, setMouthState] = useState(0);
  const [headTilt, setHeadTilt] = useState(0);
  const animationRef = useRef<number>(0);

  // Blink animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkState(true);
      setTimeout(() => setBlinkState(false), 120);
    }, 2500 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Natural head movement when speaking
  useEffect(() => {
    if (!isSpeaking) {
      setHeadTilt(0);
      return;
    }

    const moveHead = () => {
      setHeadTilt(Math.sin(animationRef.current * 0.05) * 2);
      animationRef.current++;
    };

    const headInterval = setInterval(moveHead, 50);
    return () => clearInterval(headInterval);
  }, [isSpeaking]);

  // Mouth animation when speaking
  useEffect(() => {
    if (!isSpeaking) {
      setMouthState(0);
      return;
    }

    const mouthInterval = setInterval(() => {
      setMouthState(prev => (prev + 1) % 4);
    }, 100);

    return () => clearInterval(mouthInterval);
  }, [isSpeaking]);

  const getMouthPath = () => {
    if (!isSpeaking) {
      return "M 40 68 Q 50 72 60 68"; // Neutral professional smile
    }
    switch (mouthState) {
      case 0:
        return "M 40 66 Q 50 76 60 66"; // Open
      case 1:
        return "M 40 68 Q 50 70 60 68"; // Almost closed
      case 2:
        return "M 40 64 Q 50 78 60 64"; // Wide
      case 3:
        return "M 40 67 Q 50 73 60 67"; // Medium
      default:
        return "M 40 68 Q 50 72 60 68";
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
              "absolute inset-0 rounded-full bg-gradient-to-br blur-3xl opacity-40",
              character.gradient
            )}
            style={{ transform: "scale(1.5)" }}
          />
        )}

        {/* Listening indicator */}
        {isListening && !isSpeaking && (
          <div className="absolute -inset-6">
            <div className="absolute inset-0 rounded-full border-4 border-success/40 animate-ping" />
          </div>
        )}

        {/* Main avatar - Larger and more detailed */}
        <div
          className={cn(
            "relative h-40 w-40 rounded-full bg-gradient-to-br shadow-large overflow-hidden border-4 border-card",
            character.gradient
          )}
          style={{ transform: `rotate(${headTilt}deg)` }}
        >
          {/* SVG Professional Face */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Background gradient */}
            <defs>
              <linearGradient id={`bg-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={character.suitColor} stopOpacity="0.9" />
                <stop offset="100%" stopColor={character.suitColor} stopOpacity="0.7" />
              </linearGradient>
              <linearGradient id={`skin-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={character.skinTone} />
                <stop offset="100%" stopColor={character.skinTone} stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Professional suit/collar */}
            <path 
              d="M 20 85 Q 25 75 50 72 Q 75 75 80 85 L 85 100 L 15 100 Z" 
              fill={`url(#bg-${variant})`} 
            />
            
            {/* White shirt collar */}
            <path 
              d="M 38 75 L 45 85 L 50 78 L 55 85 L 62 75 Q 50 72 38 75" 
              fill="#FFFFFF" 
            />
            
            {/* Neck */}
            <ellipse cx="50" cy="74" rx="10" ry="6" fill={`url(#skin-${variant})`} />
            
            {/* Face shape - more realistic oval */}
            <ellipse cx="50" cy="48" rx="28" ry="32" fill={`url(#skin-${variant})`} />
            
            {/* Subtle face shading */}
            <ellipse cx="50" cy="52" rx="26" ry="28" fill={character.skinTone} opacity="0.3" />
            
            {/* Ears */}
            <ellipse cx="22" cy="48" rx="4" ry="6" fill={character.skinTone} />
            <ellipse cx="78" cy="48" rx="4" ry="6" fill={character.skinTone} />
            
            {/* Eyes - more detailed and expressive */}
            <g style={{ transition: "all 0.1s" }}>
              {/* Eye whites */}
              <ellipse cx="38" cy="45" rx="7" ry={blinkState ? 0.5 : 5} fill="white" />
              <ellipse cx="62" cy="45" rx="7" ry={blinkState ? 0.5 : 5} fill="white" />
              
              {/* Iris */}
              <circle cx="38" cy="45" r={blinkState ? 0.3 : 3.5} fill={character.eyeColor} />
              <circle cx="62" cy="45" r={blinkState ? 0.3 : 3.5} fill={character.eyeColor} />
              
              {/* Pupils */}
              <circle cx="38" cy="45" r={blinkState ? 0.2 : 1.8} fill="#1A1A1A" />
              <circle cx="62" cy="45" r={blinkState ? 0.2 : 1.8} fill="#1A1A1A" />
              
              {/* Eye shine */}
              <circle cx="39.5" cy="43.5" r="1" fill="white" opacity={blinkState ? 0 : 0.8} />
              <circle cx="63.5" cy="43.5" r="1" fill="white" opacity={blinkState ? 0 : 0.8} />
            </g>
            
            {/* Eyebrows - professional look */}
            <path 
              d="M 29 38 Q 38 35 46 38" 
              stroke={character.hairColor} 
              strokeWidth="2.5" 
              fill="none" 
              strokeLinecap="round" 
            />
            <path 
              d="M 54 38 Q 62 35 71 38" 
              stroke={character.hairColor} 
              strokeWidth="2.5" 
              fill="none" 
              strokeLinecap="round" 
            />
            
            {/* Nose */}
            <path 
              d="M 50 48 L 48 58 Q 50 60 52 58 L 50 48" 
              fill={character.skinTone} 
              opacity="0.7" 
            />
            <path 
              d="M 46 58 Q 50 61 54 58" 
              stroke={character.skinTone} 
              strokeWidth="0.8" 
              fill="none" 
              opacity="0.5" 
            />
            
            {/* Mouth - animated */}
            <path 
              d={getMouthPath()} 
              stroke="#C44D56" 
              strokeWidth="2" 
              fill={isSpeaking ? "#B83A43" : "none"}
              strokeLinecap="round"
              style={{ transition: "d 0.08s ease-out" }}
            />
            
            {/* Professional hair */}
            {character.gender === "female" ? (
              <>
                {/* Female professional hairstyle */}
                <path 
                  d="M 22 38 Q 22 15 50 12 Q 78 15 78 38 Q 80 30 76 22 Q 60 5 50 8 Q 40 5 24 22 Q 20 30 22 38" 
                  fill={character.hairColor} 
                />
                {/* Side hair */}
                <path d="M 22 38 Q 18 50 22 62" stroke={character.hairColor} strokeWidth="10" fill="none" strokeLinecap="round" />
                <path d="M 78 38 Q 82 50 78 62" stroke={character.hairColor} strokeWidth="10" fill="none" strokeLinecap="round" />
              </>
            ) : (
              <>
                {/* Male professional hairstyle - short and neat */}
                <path 
                  d="M 24 38 Q 24 18 50 14 Q 76 18 76 38 L 78 32 Q 74 12 50 10 Q 26 12 22 32 L 24 38" 
                  fill={character.hairColor} 
                />
              </>
            )}
          </svg>
        </div>

        {/* Status indicator - larger */}
        <div className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-large border-2 border-background">
          <div className={cn(
            "h-5 w-5 rounded-full transition-all",
            isSpeaking 
              ? "bg-accent animate-pulse" 
              : isListening 
              ? "bg-success animate-pulse" 
              : "bg-muted-foreground/30"
          )} />
        </div>
      </div>

      {/* Name and role */}
      <div className="mt-5 text-center">
        <h3 className="text-xl font-bold text-foreground">{character.name}</h3>
        <p className="text-sm text-muted-foreground">{character.role}</p>
      </div>

      {/* Status text */}
      <div className="mt-3 h-6">
        {isSpeaking && (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span className="w-1.5 h-4 bg-accent rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-6 bg-accent rounded-full animate-pulse" style={{ animationDelay: "100ms" }} />
              <span className="w-1.5 h-3 bg-accent rounded-full animate-pulse" style={{ animationDelay: "200ms" }} />
              <span className="w-1.5 h-5 bg-accent rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
            </div>
            <p className="text-sm text-accent font-medium">Speaking...</p>
          </div>
        )}
        {isListening && !isSpeaking && (
          <p className="text-sm text-success font-medium animate-pulse">Listening to you...</p>
        )}
      </div>
    </div>
  );
}
