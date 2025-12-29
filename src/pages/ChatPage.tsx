import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfessionalAvatar } from "@/components/ProfessionalAvatar";
import { TranscriptDisplay } from "@/components/TranscriptDisplay";
import { VoiceInterface } from "@/components/VoiceInterface";
import { AGENT_IDS, InterviewType } from "@/lib/elevenlabs-agents";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

type AvatarVariant = "ielts" | "job" | "visa-work" | "visa-student" | "visa-worktravel" | "visa-travel";
type TranscriptVariant = "ielts" | "job" | "visa";
type VoiceVariant = "ielts" | "job" | "visa";

const pageConfig: Record<string, {
  title: string;
  subtitle: string;
  gradient: string;
  tips: string[];
  avatarVariant: AvatarVariant;
  transcriptVariant: TranscriptVariant;
  voiceVariant: VoiceVariant;
}> = {
  ielts: {
    title: "IELTS Speaking Test",
    subtitle: "Practice with Dr. Emma Richardson",
    gradient: "from-ielts/20 to-ielts/5",
    tips: [
      "Speak clearly and at a natural pace",
      "Provide detailed answers with examples",
      "Don't worry about minor mistakes",
    ],
    avatarVariant: "ielts",
    transcriptVariant: "ielts",
    voiceVariant: "ielts",
  },
  job: {
    title: "Job Interview",
    subtitle: "Practice with Michael Chen, HR Director",
    gradient: "from-job/20 to-job/5",
    tips: [
      "Be confident and professional",
      "Share specific examples from your experience",
      "Show enthusiasm for the role",
    ],
    avatarVariant: "job",
    transcriptVariant: "job",
    voiceVariant: "job",
  },
  "visa-work": {
    title: "Work Visa Interview",
    subtitle: "Practice with Officer James Mitchell",
    gradient: "from-visa/20 to-visa/5",
    tips: [
      "Know your job details and salary",
      "Explain your specialized skills",
      "Show intent to return home after work",
    ],
    avatarVariant: "visa-work",
    transcriptVariant: "visa",
    voiceVariant: "visa",
  },
  "visa-student": {
    title: "Student Visa Interview",
    subtitle: "Practice with Officer Sarah Williams",
    gradient: "from-visa/20 to-visa/5",
    tips: [
      "Know your university and program details",
      "Be clear about funding sources",
      "Show strong ties to your home country",
    ],
    avatarVariant: "visa-student",
    transcriptVariant: "visa",
    voiceVariant: "visa",
  },
  "visa-worktravel": {
    title: "Work & Travel Visa Interview",
    subtitle: "Practice with Officer David Rodriguez",
    gradient: "from-visa/20 to-visa/5",
    tips: [
      "Know your program and employer details",
      "Show you're a current student",
      "Explain your return plans after summer",
    ],
    avatarVariant: "visa-worktravel",
    transcriptVariant: "visa",
    voiceVariant: "visa",
  },
  "visa-travel": {
    title: "Tourist Visa Interview",
    subtitle: "Practice with Officer Lisa Anderson",
    gradient: "from-visa/20 to-visa/5",
    tips: [
      "Know your travel itinerary",
      "Show proof of financial support",
      "Demonstrate strong ties to home",
    ],
    avatarVariant: "visa-travel",
    transcriptVariant: "visa",
    voiceVariant: "visa",
  },
  visa: {
    title: "Visa Interview",
    subtitle: "Practice with a Visa Officer",
    gradient: "from-visa/20 to-visa/5",
    tips: [
      "Be honest and consistent in your answers",
      "Explain your travel purpose clearly",
      "Demonstrate ties to your home country",
    ],
    avatarVariant: "visa-work",
    transcriptVariant: "visa",
    voiceVariant: "visa",
  },
};

const ChatPage = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const chatType = (type as InterviewType) || "ielts";
  const config = pageConfig[chatType] || pageConfig.ielts;
  const agentId = AGENT_IDS[chatType];

  const [messages, setMessages] = useState<Message[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [interviewEnded, setInterviewEnded] = useState(false);

  const handleTranscriptUpdate = useCallback((userText: string, aiText: string) => {
    if (userText) {
      setMessages(prev => [...prev, {
        id: `user-${Date.now()}`,
        text: userText,
        isUser: true,
        timestamp: new Date(),
      }]);
      setIsListening(true);
    }
    if (aiText) {
      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        text: aiText,
        isUser: false,
        timestamp: new Date(),
      }]);
      setIsListening(false);
    }
  }, []);

  const handleSpeakingChange = useCallback((speaking: boolean) => {
    setIsSpeaking(speaking);
    if (speaking) {
      setShowTips(false);
      setIsListening(false);
    }
  }, []);

  const handleInterviewEnd = useCallback(() => {
    setInterviewEnded(true);
    // Build transcript from messages
    const transcript = messages.map(m => 
      `${m.isUser ? 'Candidate' : 'Interviewer'}: ${m.text}`
    ).join('\n\n');
    
    // Navigate to result with transcript
    setTimeout(() => {
      navigate(`/result/${chatType}`, { 
        state: { transcript, messages } 
      });
    }, 1500);
  }, [messages, chatType, navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="text-center">
            <h1 className="font-bold text-foreground">{config.title}</h1>
            <p className="text-xs text-muted-foreground">{config.subtitle}</p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowTips(!showTips)}
            className="h-9 w-9"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col">
        {/* Character section */}
        <div className={cn(
          "border-b py-8 bg-gradient-to-b",
          config.gradient
        )}>
          <div className="mx-auto max-w-4xl px-4">
            <ProfessionalAvatar 
              variant={config.avatarVariant} 
              isSpeaking={isSpeaking}
              isListening={isListening}
              className="mx-auto"
            />
          </div>
        </div>

        {/* Tips panel */}
        {showTips && messages.length === 0 && (
          <div className="border-b bg-muted/30 py-4 animate-fade-in">
            <div className="mx-auto max-w-4xl px-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20">
                  <MessageSquare className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Tips for success:</h3>
                  <ul className="space-y-1">
                    {config.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transcript section */}
        <div className="flex-1 overflow-hidden">
          <div className="mx-auto max-w-4xl h-full">
            <TranscriptDisplay 
              messages={messages} 
              variant={config.transcriptVariant}
              className="h-[300px]"
            />
          </div>
        </div>

        {/* Voice interface */}
        <div className="sticky bottom-0 border-t bg-card/90 backdrop-blur-xl p-6">
          <div className="mx-auto max-w-4xl">
            <VoiceInterface
              agentId={agentId}
              variant={config.voiceVariant}
              onSpeakingChange={handleSpeakingChange}
              onTranscriptUpdate={handleTranscriptUpdate}
              onInterviewEnd={handleInterviewEnd}
              disabled={interviewEnded}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
