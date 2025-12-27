import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface TranscriptDisplayProps {
  messages: Message[];
  variant: "ielts" | "job" | "visa";
  className?: string;
}

const variantStyles = {
  ielts: "border-ielts/20 bg-gradient-to-br from-ielts/5 to-transparent",
  job: "border-job/20 bg-gradient-to-br from-job/5 to-transparent",
  visa: "border-visa/20 bg-gradient-to-br from-visa/5 to-transparent",
};

export function TranscriptDisplay({ messages, variant, className }: TranscriptDisplayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className={cn(
        "flex items-center justify-center h-full text-muted-foreground text-sm",
        className
      )}>
        <p>Conversation will appear here...</p>
      </div>
    );
  }

  return (
    <div 
      ref={scrollRef}
      className={cn("flex flex-col gap-3 overflow-y-auto p-4", className)}
    >
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={cn(
            "flex w-full animate-fade-in",
            message.isUser ? "justify-end" : "justify-start"
          )}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div
            className={cn(
              "max-w-[85%] rounded-2xl px-4 py-3 shadow-soft",
              message.isUser
                ? "bg-primary text-primary-foreground rounded-br-md"
                : cn("border rounded-bl-md", variantStyles[variant])
            )}
          >
            <p className="text-sm leading-relaxed">{message.text}</p>
            <p className={cn(
              "text-xs mt-1 opacity-60",
              message.isUser ? "text-right" : "text-left"
            )}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
