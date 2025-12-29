import { cn } from "@/lib/utils";

interface RealisticHumanAIProps {
  variant: "ielts" | "job" | "visa-work" | "visa-student" | "visa-worktravel" | "visa-travel";
  isSpeaking: boolean;
  isListening: boolean;
  className?: string;
}

const humanData: Record<string, { name: string; role: string; image: string }> = {
  "ielts": {
    name: "Dr. Emma Richardson",
    role: "IELTS Examiner",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face"
  },
  "job": {
    name: "Michael Chen",
    role: "HR Director",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
  },
  "visa-work": {
    name: "Officer James Mitchell",
    role: "Work Visa Officer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
  },
  "visa-student": {
    name: "Officer Sarah Williams",
    role: "Student Visa Officer",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face"
  },
  "visa-worktravel": {
    name: "Officer David Rodriguez",
    role: "J-1 Visa Specialist",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"
  },
  "visa-travel": {
    name: "Officer Lisa Anderson",
    role: "Tourist Visa Officer",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop&crop=face"
  }
};

export function RealisticHumanAI({ 
  variant, 
  isSpeaking, 
  isListening,
  className 
}: RealisticHumanAIProps) {
  const human = humanData[variant] || humanData["visa-work"];

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Main avatar container */}
      <div className="relative">
        {/* Outer glow ring */}
        <div 
          className={cn(
            "absolute -inset-3 rounded-full transition-all duration-500",
            isSpeaking 
              ? "bg-gradient-to-r from-accent/40 via-primary/40 to-accent/40 animate-pulse" 
              : isListening
              ? "bg-gradient-to-r from-success/30 to-success/20"
              : "bg-gradient-to-r from-muted/30 to-muted/20"
          )}
          style={{
            filter: isSpeaking ? "blur(20px)" : "blur(15px)"
          }}
        />
        
        {/* Speaking indicator ring */}
        <div 
          className={cn(
            "absolute -inset-1 rounded-full transition-all duration-300",
            isSpeaking 
              ? "bg-gradient-to-r from-accent to-primary opacity-80" 
              : isListening
              ? "bg-gradient-to-r from-success to-success/80 opacity-60"
              : "bg-border/50 opacity-40"
          )}
        />
        
        {/* Avatar image */}
        <div 
          className={cn(
            "relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 border-card shadow-2xl transition-transform duration-500",
            isSpeaking && "scale-[1.02]"
          )}
        >
          <img
            src={human.image}
            alt={human.name}
            className={cn(
              "w-full h-full object-cover transition-all duration-300",
              isSpeaking && "brightness-110 contrast-105"
            )}
            loading="eager"
          />
          
          {/* Speaking overlay effect */}
          {isSpeaking && (
            <div className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent animate-pulse" />
          )}
          
          {/* Listening overlay */}
          {isListening && !isSpeaking && (
            <div className="absolute inset-0 bg-gradient-to-t from-success/10 to-transparent" />
          )}
        </div>

        {/* Status indicator badge */}
        <div 
          className={cn(
            "absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg transition-all duration-300",
            isSpeaking 
              ? "bg-accent text-accent-foreground" 
              : isListening
              ? "bg-success text-success-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          {isSpeaking ? "Speaking..." : isListening ? "Listening..." : "Ready"}
        </div>
      </div>

      {/* Name and role */}
      <div className="text-center mt-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          {human.name}
        </h2>
        <p className="text-sm md:text-base text-muted-foreground">
          {human.role}
        </p>
      </div>

      {/* Speaking visualization */}
      {isSpeaking && (
        <div className="flex items-center gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-accent rounded-full animate-pulse"
              style={{
                height: `${12 + Math.random() * 16}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${0.3 + Math.random() * 0.3}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
