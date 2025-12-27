import { cn } from "@/lib/utils";

interface AICharacterProps {
  variant: "ielts" | "job" | "visa";
  isSpeaking?: boolean;
  className?: string;
}

const characterData = {
  ielts: {
    name: "Emma",
    role: "IELTS Examiner",
    emoji: "👩‍🏫",
    gradient: "from-ielts to-ielts-dark",
  },
  job: {
    name: "Michael",
    role: "HR Manager",
    emoji: "👨‍💼",
    gradient: "from-job to-job-dark",
  },
  visa: {
    name: "Sarah",
    role: "Visa Officer",
    emoji: "👩‍⚖️",
    gradient: "from-visa to-visa-dark",
  },
};

export function AICharacter({ variant, isSpeaking = false, className }: AICharacterProps) {
  const character = characterData[variant];

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Character avatar */}
      <div className="relative">
        {/* Glow effect when speaking */}
        {isSpeaking && (
          <div
            className={cn(
              "absolute inset-0 rounded-full bg-gradient-to-br animate-pulse-soft blur-xl opacity-50",
              character.gradient
            )}
          />
        )}

        {/* Avatar container */}
        <div
          className={cn(
            "relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br shadow-large",
            character.gradient,
            isSpeaking ? "animate-nod" : ""
          )}
        >
          {/* Face emoji */}
          <span className="text-5xl animate-blink">{character.emoji}</span>

          {/* Online indicator */}
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-card shadow-soft">
            <div className={cn(
              "h-3 w-3 rounded-full",
              isSpeaking ? "bg-success animate-pulse" : "bg-muted-foreground/30"
            )} />
          </div>
        </div>
      </div>

      {/* Name and role */}
      <div className="mt-3 text-center">
        <h3 className="font-bold text-foreground">{character.name}</h3>
        <p className="text-sm text-muted-foreground">{character.role}</p>
      </div>
    </div>
  );
}
