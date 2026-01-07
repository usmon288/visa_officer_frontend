import { useState, useCallback, useEffect } from 'react';
import { useConversation } from '@elevenlabs/react';
import { Mic, MicOff, Phone, PhoneOff, Loader2, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { interviewsAPI } from '@/lib/api';
import { cn } from '@/lib/utils';

interface RealtimeVoiceInterfaceProps {
  agentId: string;
  interviewType: string; // e.g., 'visa-work', 'visa-student', etc.
  variant: 'ielts' | 'job' | 'visa';
  onSpeakingChange: (speaking: boolean) => void;
  onListeningChange: (listening: boolean) => void;
  onTranscriptUpdate: (userText: string, aiText: string) => void;
  onInterviewEnd: () => void;
  onInterviewIdReceived?: (interviewId: string) => void;
  disabled?: boolean;
}

export function RealtimeVoiceInterface({
  agentId,
  interviewType,
  variant,
  onSpeakingChange,
  onListeningChange,
  onTranscriptUpdate,
  onInterviewEnd,
  onInterviewIdReceived,
  disabled = false,
}: RealtimeVoiceInterfaceProps) {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const variantColors = {
    ielts: 'from-ielts to-ielts-dark',
    job: 'from-job to-job-dark',
    visa: 'from-visa to-visa-dark',
  };

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs agent');
      setIsConnecting(false);
    },
    onDisconnect: () => {
      console.log('Disconnected from agent');
      onSpeakingChange(false);
      onListeningChange(false);
    },
    onMessage: (message: unknown) => {
      console.log('Message received:', message);
      
      const msg = message as Record<string, unknown>;
      
      if (msg.type === 'user_transcript') {
        const event = msg.user_transcription_event as Record<string, unknown> | undefined;
        const userTranscript = event?.user_transcript as string | undefined;
        if (userTranscript) {
          onTranscriptUpdate(userTranscript, '');
        }
      }
      
      if (msg.type === 'agent_response') {
        const event = msg.agent_response_event as Record<string, unknown> | undefined;
        const agentResponse = event?.agent_response as string | undefined;
        if (agentResponse) {
          onTranscriptUpdate('', agentResponse);
        }
      }
    },
    onError: (error) => {
      console.error('Conversation error:', error);
      setIsConnecting(false);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Failed to connect. Please try again.",
      });
    },
  });

  // Track speaking state
  useEffect(() => {
    onSpeakingChange(conversation.isSpeaking);
    if (conversation.isSpeaking) {
      onListeningChange(false);
    }
  }, [conversation.isSpeaking, onSpeakingChange, onListeningChange]);

  // Track listening state (when connected and not speaking)
  useEffect(() => {
    if (conversation.status === 'connected' && !conversation.isSpeaking && !isMuted) {
      onListeningChange(true);
    } else if (conversation.isSpeaking || conversation.status !== 'connected') {
      onListeningChange(false);
    }
  }, [conversation.status, conversation.isSpeaking, isMuted, onListeningChange]);

  const startConversation = useCallback(async () => {
    if (disabled || isConnecting || conversation.status === 'connected') return;

    setIsConnecting(true);

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Get token from Django backend
      const data = await interviewsAPI.getConversationToken(agentId, interviewType);

      if (!data?.token) {
        throw new Error('Failed to get conversation token');
      }

      // Store interview ID if provided
      if (data.interview_id && onInterviewIdReceived) {
        onInterviewIdReceived(data.interview_id);
      }

      // Start the conversation with WebRTC for lowest latency
      await conversation.startSession({
        conversationToken: data.token,
        connectionType: 'webrtc',
      });

      toast({
        title: "Interview Started",
        description: "Speak naturally - the interviewer will respond instantly.",
      });

    } catch (error) {
      console.error('Failed to start conversation:', error);
      setIsConnecting(false);
      toast({
        variant: "destructive",
        title: "Failed to Start",
        description: error instanceof Error ? error.message : 'Could not start interview',
      });
    }
  }, [agentId, interviewType, disabled, isConnecting, conversation, toast]);

  const endConversation = useCallback(async () => {
    await conversation.endSession();
    onInterviewEnd();
    toast({
      title: "Interview Ended",
      description: "Your responses are being analyzed...",
    });
  }, [conversation, onInterviewEnd, toast]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      onListeningChange(!newMuted && conversation.status === 'connected' && !conversation.isSpeaking);
      return newMuted;
    });
  }, [conversation.status, conversation.isSpeaking, onListeningChange]);

  const isConnected = conversation.status === 'connected';

  const getStatusText = () => {
    if (isConnecting) return 'Connecting...';
    if (!isConnected) return 'Ready to start';
    if (conversation.isSpeaking) return 'Speaking...';
    if (isMuted) return 'Microphone muted';
    return 'Listening...';
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Status indicator */}
      <div className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
        isConnected 
          ? conversation.isSpeaking 
            ? "bg-accent/20 text-accent"
            : "bg-success/20 text-success" 
          : isConnecting 
          ? "bg-accent/20 text-accent" 
          : "bg-muted text-muted-foreground"
      )}>
        {isConnecting && <Loader2 className="h-4 w-4 animate-spin" />}
        {isConnected && conversation.isSpeaking && <Volume2 className="h-4 w-4 animate-pulse" />}
        {isConnected && !conversation.isSpeaking && !isMuted && (
          <div className="flex gap-0.5">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="w-1 h-3 bg-success rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}
        <span>{getStatusText()}</span>
      </div>

      {/* Control buttons */}
      <div className="flex items-center gap-3">
        {!isConnected ? (
          <Button
            onClick={startConversation}
            disabled={disabled || isConnecting}
            size="lg"
            className={cn(
              "gap-2 px-8 py-6 text-lg rounded-full shadow-large transition-all",
              "bg-gradient-to-br",
              variantColors[variant],
              "hover:scale-105 hover:shadow-glow"
            )}
          >
            {isConnecting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Phone className="h-5 w-5" />
                Start Interview
              </>
            )}
          </Button>
        ) : (
          <>
            <Button
              onClick={toggleMute}
              variant="secondary"
              size="icon"
              className="h-14 w-14 rounded-full shadow-medium"
            >
              {isMuted ? (
                <MicOff className="h-6 w-6 text-destructive" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>

            <Button
              onClick={endConversation}
              variant="destructive"
              size="lg"
              className="gap-2 px-8 py-6 text-lg rounded-full shadow-large"
            >
              <PhoneOff className="h-5 w-5" />
              End Interview
            </Button>
          </>
        )}
      </div>

      {/* Instructions */}
      {!isConnected && !isConnecting && (
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          Real-time AI interview with instant responses. Click to begin.
        </p>
      )}
    </div>
  );
}
