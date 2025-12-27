import { useState } from "react";
import { Send, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled = false, placeholder = "Type your answer..." }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center gap-2 rounded-2xl border bg-card p-2 shadow-soft">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "flex-1 bg-transparent px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground",
            "focus:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-xl text-muted-foreground hover:text-foreground"
          disabled={disabled}
        >
          <Mic className="h-5 w-5" />
        </Button>

        <Button
          type="submit"
          size="icon"
          className="h-10 w-10 rounded-xl"
          disabled={!message.trim() || disabled}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
