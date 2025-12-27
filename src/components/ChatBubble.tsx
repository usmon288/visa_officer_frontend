import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  variant: "ielts" | "job" | "visa";
  isTyping?: boolean;
  delay?: number;
}

const variantStyles = {
  ielts: "bg-gradient-to-br from-ielts/10 to-ielts/5 border-ielts/20",
  job: "bg-gradient-to-br from-job/10 to-job/5 border-job/20",
  visa: "bg-gradient-to-br from-visa/10 to-visa/5 border-visa/20",
};

export function ChatBubble({ message, isUser, variant, isTyping = false, delay = 0 }: ChatBubbleProps) {
  return (
    <div
      className={cn(
        "flex w-full animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "backwards" }}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 shadow-soft",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : cn("border text-foreground rounded-bl-md", variantStyles[variant])
        )}
      >
        {isTyping ? (
          <div className="flex items-center gap-1.5 py-1 px-2">
            <div className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-typing" />
            <div className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-typing-delay-1" />
            <div className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-typing-delay-2" />
          </div>
        ) : (
          <p className="text-sm leading-relaxed">{message}</p>
        )}
      </div>
    </div>
  );
}
