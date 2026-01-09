import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare, Info, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoStyleAvatar } from "@/components/VideoStyleAvatar";
import { TranscriptDisplay } from "@/components/TranscriptDisplay";
import { RealtimeVoiceInterface } from "@/components/RealtimeVoiceInterface";
import { InterviewType } from "@/lib/elevenlabs-agents";
import { getAgentId } from "@/lib/elevenlabs-agents";
import { subscriptionsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
    subtitle: "Live Session with Dr. Emma Richardson",
    gradient: "from-slate-900/50 to-background",
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
    subtitle: "Live Session with Michael Chen",
    gradient: "from-zinc-900/50 to-background",
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
    subtitle: "Live Session with Officer Mitchell",
    gradient: "from-blue-950/30 to-background",
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
    subtitle: "Live Session with Officer Williams",
    gradient: "from-indigo-950/30 to-background",
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
    title: "Work & Travel Interview",
    subtitle: "Live Session with Officer Rodriguez",
    gradient: "from-emerald-950/30 to-background",
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
    subtitle: "Live Session with Officer Anderson",
    gradient: "from-amber-950/30 to-background",
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
    subtitle: "Live Session with a Visa Officer",
    gradient: "from-slate-900/50 to-background",
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

  const [messages, setMessages] = useState<Message[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [usageCheck, setUsageCheck] = useState<{ canStart: boolean; message: string } | null>(null);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const { toast } = useToast();

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
    } else {
      setIsListening(true);
    }
  }, []);

  // Check usage limits on mount
  useEffect(() => {
    const checkUsage = async () => {
      try {
        const usage = await subscriptionsAPI.getUsage();
        setUsageCheck({
          canStart: usage.can_start_interview,
          message: usage.remaining === 'unlimited' 
            ? 'Unlimited interviews available'
            : `${usage.remaining} interview(s) remaining this month`,
        });
        
        if (!usage.can_start_interview) {
          setShowLimitDialog(true);
        }
      } catch (error) {
        console.error('Failed to check usage:', error);
      }
    };
    checkUsage();
  }, []);

  const handleInterviewEnd = useCallback(() => {
    setInterviewEnded(true);
    setIsListening(false);
  }, []);

  const handleViewResults = useCallback(() => {
    const transcript = messages.map(m => 
      `${m.isUser ? 'Candidate' : 'Interviewer'}: ${m.text}`
    ).join('\n\n');
    
    navigate(`/result/${chatType}`, { 
      state: { transcript, messages, interviewId } 
    });
  }, [messages, chatType, navigate, interviewId]);

  return (
    <div className={cn(
      "flex min-h-screen flex-col bg-gradient-to-b",
      config.gradient
    )}>
      {/* Minimal header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2 text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Exit
          </Button>

          <div className="text-center">
            <h1 className="font-semibold text-white/90">{config.title}</h1>
            <p className="text-xs text-white/50">{config.subtitle}</p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowTips(!showTips)}
            className="h-9 w-9 text-white/70 hover:text-white hover:bg-white/10"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main content - video call layout */}
      <main className="flex flex-1 flex-col lg:flex-row">
        {/* Left side - Avatar (main focus) */}
        <div className="flex-1 flex items-center justify-center p-8 pt-20">
          <VideoStyleAvatar 
            variant={config.avatarVariant} 
            isSpeaking={isSpeaking}
            isListening={isListening}
          />
        </div>

        {/* Right side - Transcript and controls */}
        <div className="lg:w-96 flex flex-col bg-card/50 backdrop-blur-sm border-l border-border/30">
          {/* Tips panel */}
          {showTips && messages.length === 0 && (
            <div className="p-4 border-b border-border/30 animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20">
                  <MessageSquare className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2 text-sm">Tips:</h3>
                  <ul className="space-y-1">
                    {config.tips.map((tip, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-accent" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Transcript section */}
          <div className="flex-1 overflow-hidden">
            <TranscriptDisplay 
              messages={messages} 
              variant={config.transcriptVariant}
              className="h-full"
            />
          </div>

          {/* Voice interface */}
          <div className="border-t border-border/30 bg-card/80 backdrop-blur-xl p-6">
            {usageCheck && !usageCheck.canStart ? (
              <div className="text-center space-y-4">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Interview Limit Reached</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You've used all your interviews for this month. Upgrade your plan to continue practicing.
                  </p>
                  <Button onClick={() => navigate('/subscription')} className="w-full">
                    View Plans
                  </Button>
                </div>
              </div>
            ) : (
              <RealtimeVoiceInterface
                agentId={getAgentId(chatType) || ""}
                interviewType={chatType}
                variant={config.voiceVariant}
                onSpeakingChange={handleSpeakingChange}
                onListeningChange={setIsListening}
                onTranscriptUpdate={handleTranscriptUpdate}
                onInterviewEnd={() => {
                  handleInterviewEnd();
                }}
                onInterviewIdReceived={setInterviewId}
                disabled={interviewEnded || (usageCheck && !usageCheck.canStart)}
              />
            )}
          </div>
        </div>
      </main>

      {/* Interview Ended Overlay */}
      {interviewEnded && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-card border border-border rounded-lg p-8 max-w-md mx-4 text-center space-y-6 animate-scale-in">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center">
                <FileText className="h-8 w-8 text-accent" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">
                Interview Complete
              </h2>
              <p className="text-muted-foreground">
                Thank you for your time. Our officer is now reviewing your interview and preparing your detailed evaluation. This should only take a moment.
              </p>
            </div>

            <div className="pt-2">
              <Button 
                onClick={handleViewResults}
                size="lg"
                className="w-full"
              >
                View Your Results
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Limit Reached Dialog */}
      <AlertDialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Interview Limit Reached</AlertDialogTitle>
            <AlertDialogDescription>
              You've used all your interviews for this month. Upgrade your plan to continue practicing with unlimited interviews.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate('/subscription')}>
              View Plans
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ChatPage;
