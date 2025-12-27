import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AICharacter } from "@/components/AICharacter";
import { ChatBubble } from "@/components/ChatBubble";
import { ChatInput } from "@/components/ChatInput";

type ChatType = "ielts" | "job" | "visa";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

const initialQuestions: Record<ChatType, string[]> = {
  ielts: [
    "Hello! I'm Emma, your IELTS examiner today. Let's begin with Part 1. Can you tell me about your hometown?",
    "That's interesting! What do you like most about living there?",
    "Thank you. Now, let's move to Part 2. I'd like you to describe a memorable trip you have taken.",
    "Excellent description! For Part 3, do you think travel is important for personal development? Why?",
    "Great insights! That concludes our speaking test. Thank you for your responses.",
  ],
  job: [
    "Good morning! I'm Michael from HR. Welcome to your interview. Could you start by telling me about yourself?",
    "Thank you for sharing that. What interests you about this position?",
    "I see. Can you describe a challenging situation you faced at work and how you handled it?",
    "That's a good example. Where do you see yourself in five years?",
    "Wonderful! Do you have any questions for me about the role or the company?",
  ],
  visa: [
    "Hello, I'm Officer Sarah. I'll be conducting your visa interview today. What is the purpose of your visit?",
    "I understand. How long do you plan to stay, and where will you be staying?",
    "Thank you. What do you do for a living in your home country?",
    "I see. Can you tell me about your ties to your home country that would ensure your return?",
    "Thank you for your answers. Your application will be processed shortly.",
  ],
};

const ChatPage = () => {
  const { type } = useParams<{ type: ChatType }>();
  const navigate = useNavigate();
  const chatType = (type as ChatType) || "ielts";

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const questions = initialQuestions[chatType];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initial AI message
  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => {
      setMessages([
        {
          id: "1",
          text: questions[0],
          isUser: false,
        },
      ]);
      setIsTyping(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [chatType]);

  const handleSendMessage = (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Check if interview is complete
    if (currentQuestionIndex >= questions.length - 1) {
      setIsComplete(true);
      setTimeout(() => {
        navigate(`/result/${chatType}`);
      }, 1500);
      return;
    }

    // AI response
    setIsTyping(true);
    const nextIndex = currentQuestionIndex + 1;
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: questions[nextIndex],
        isUser: false,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setCurrentQuestionIndex(nextIndex);
      setIsTyping(false);
    }, 2000);
  };

  const handleRestart = () => {
    setMessages([]);
    setCurrentQuestionIndex(0);
    setIsComplete(false);
    setIsTyping(true);
    setTimeout(() => {
      setMessages([
        {
          id: "1",
          text: questions[0],
          isUser: false,
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const pageTitle = {
    ielts: "IELTS Speaking Test",
    job: "Job Interview",
    visa: "Visa Interview",
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <h1 className="font-semibold text-foreground">{pageTitle[chatType]}</h1>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleRestart}
            className="h-9 w-9"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* AI Character */}
      <div className="border-b bg-card/50 py-6">
        <AICharacter variant={chatType} isSpeaking={isTyping} className="mx-auto" />
      </div>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.map((message, index) => (
            <ChatBubble
              key={message.id}
              message={message.text}
              isUser={message.isUser}
              variant={chatType}
              delay={index === messages.length - 1 ? 0 : 0}
            />
          ))}

          {isTyping && (
            <ChatBubble
              message=""
              isUser={false}
              variant={chatType}
              isTyping
            />
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <div className="sticky bottom-0 border-t bg-card/80 p-4 backdrop-blur-xl">
        <div className="mx-auto max-w-2xl">
          <ChatInput
            onSend={handleSendMessage}
            disabled={isTyping || isComplete}
            placeholder={isComplete ? "Interview complete!" : "Type your answer..."}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
