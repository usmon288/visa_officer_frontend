import { useState, useCallback, useEffect, useRef } from 'react';
import { Mic, MicOff, Phone, PhoneOff, Volume2, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { DemoInterviewer, DemoInterviewType } from '@/lib/demo-interview';

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

interface VoiceInterfaceProps {
  agentId: string;
  variant: 'ielts' | 'job' | 'visa';
  onSpeakingChange: (speaking: boolean) => void;
  onTranscriptUpdate: (userText: string, aiText: string) => void;
  onInterviewEnd: () => void;
  disabled?: boolean;
}

export function VoiceInterface({
  agentId,
  variant,
  onSpeakingChange,
  onTranscriptUpdate,
  onInterviewEnd,
  disabled = false,
}: VoiceInterfaceProps) {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [status, setStatus] = useState<string>('disconnected');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const demoInterviewerRef = useRef<DemoInterviewer | null>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  const variantColors = {
    ielts: 'from-ielts to-ielts-dark',
    job: 'from-job to-job-dark',
    visa: 'from-visa to-visa-dark',
  };

  // Demo mode - simulated interview
  const startDemoMode = useCallback(async () => {
    setIsConnecting(true);
    setStatus('connecting');

    try {
      // Initialize speech recognition for demo mode
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognitionAPI) {
        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          const transcript = event.results[event.results.length - 1][0].transcript;
          onTranscriptUpdate(transcript, '');
          
          // Let demo interviewer respond
          if (demoInterviewerRef.current) {
            demoInterviewerRef.current.handleUserInput(transcript);
          }
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          if (event.error !== 'no-speech') {
            toast({
              variant: "destructive",
              title: "Microphone Error",
              description: "Could not recognize speech. Please try again.",
            });
          }
        };

        recognitionRef.current = recognition;
      }

      // Create demo interviewer
      demoInterviewerRef.current = new DemoInterviewer(
        variant as DemoInterviewType,
        (text) => onTranscriptUpdate('', text),
        onSpeakingChange
      );

      // Start demo
      setTimeout(() => {
        setIsConnected(true);
        setIsConnecting(false);
        setIsDemoMode(true);
        setStatus('connected');
        
        toast({
          title: "Demo Mode Active",
          description: "This is a simulated interview for demonstration purposes.",
        });

        // Start the interview
        demoInterviewerRef.current?.start();
        
        // Start listening
        if (recognitionRef.current) {
          recognitionRef.current.start();
          setIsRecording(true);
        }
      }, 1500);

    } catch (error) {
      console.error('Error starting demo mode:', error);
      setIsConnecting(false);
      setStatus('error');
      toast({
        variant: "destructive",
        title: "Demo Error",
        description: "Failed to start demo mode.",
      });
    }
  }, [variant, toast, onSpeakingChange, onTranscriptUpdate]);

  // Real ElevenLabs connection
  const startRealConversation = useCallback(async () => {
    setIsConnecting(true);
    setStatus('requesting_microphone');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      localStreamRef.current = stream;
      setStatus('getting_token');

      const { data, error } = await supabase.functions.invoke('elevenlabs-conversation-token', {
        body: { agentId }
      });

      if (error || !data?.token) {
        throw new Error(error?.message || 'Failed to get conversation token');
      }

      setStatus('connecting');

      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      const audioEl = new Audio();
      audioEl.autoplay = true;
      audioRef.current = audioEl;

      pc.ontrack = (e) => {
        audioEl.srcObject = e.streams[0];
      };

      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      const dc = pc.createDataChannel('oai-events');
      dcRef.current = dc;

      dc.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        setStatus('connected');
        toast({
          title: "Connected!",
          description: "You can start speaking now.",
        });
      };

      dc.onclose = () => {
        setIsConnected(false);
        setStatus('disconnected');
      };

      dc.onmessage = (e) => {
        try {
          const event = JSON.parse(e.data);
          
          if (event.type === 'agent_response') {
            onSpeakingChange(true);
            if (event.agent_response_event?.agent_response) {
              onTranscriptUpdate('', event.agent_response_event.agent_response);
            }
          } else if (event.type === 'user_transcript') {
            if (event.user_transcription_event?.user_transcript) {
              onTranscriptUpdate(event.user_transcription_event.user_transcript, '');
            }
          } else if (event.type === 'audio_done' || event.type === 'response.audio.done') {
            onSpeakingChange(false);
          }
        } catch (err) {
          console.error('Error parsing event:', err);
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const baseUrl = 'https://api.elevenlabs.io/v1/convai/conversation';
      const response = await fetch(`${baseUrl}?agent_id=${agentId}`, {
        method: 'POST',
        body: offer.sdp,
        headers: {
          'Authorization': `Bearer ${data.token}`,
          'Content-Type': 'application/sdp',
        },
      });

      if (!response.ok) {
        throw new Error(`WebRTC connection failed: ${response.status}`);
      }

      const answer: RTCSessionDescriptionInit = {
        type: 'answer',
        sdp: await response.text(),
      };

      await pc.setRemoteDescription(answer);

    } catch (error) {
      console.error('Error starting conversation:', error);
      setIsConnecting(false);
      setIsConnected(false);
      setStatus('error');
      
      // Fall back to demo mode
      toast({
        title: "Switching to Demo Mode",
        description: "Live AI unavailable. Starting simulated interview instead.",
      });
      
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      startDemoMode();
    }
  }, [agentId, toast, onSpeakingChange, onTranscriptUpdate, startDemoMode]);

  const startConversation = useCallback(async () => {
    if (disabled || isConnecting || isConnected) return;
    
    // Start demo mode directly since ElevenLabs agents are not configured
    // To use real agents, replace the agent IDs in src/lib/elevenlabs-agents.ts
    await startDemoMode();
  }, [disabled, isConnecting, isConnected, startDemoMode]);

  const endConversation = useCallback(() => {
    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    
    // Clean up WebRTC
    dcRef.current?.close();
    pcRef.current?.close();
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    
    if (audioRef.current) {
      audioRef.current.srcObject = null;
    }
    
    dcRef.current = null;
    pcRef.current = null;
    localStreamRef.current = null;
    audioRef.current = null;
    demoInterviewerRef.current = null;
    
    setIsConnected(false);
    setIsConnecting(false);
    setIsDemoMode(false);
    setIsRecording(false);
    setStatus('disconnected');
    onSpeakingChange(false);
    onInterviewEnd();
    
    toast({
      title: "Interview Ended",
      description: "Your responses are being analyzed...",
    });
  }, [toast, onSpeakingChange, onInterviewEnd]);

  const toggleMute = useCallback(() => {
    if (isDemoMode) {
      if (isRecording && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsRecording(false);
        setIsMuted(true);
      } else if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsRecording(true);
        setIsMuted(false);
      }
    } else if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }, [isDemoMode, isRecording]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      dcRef.current?.close();
      pcRef.current?.close();
      localStreamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const getStatusText = () => {
    switch (status) {
      case 'requesting_microphone':
        return 'Requesting microphone access...';
      case 'getting_token':
        return 'Preparing connection...';
      case 'connecting':
        return 'Connecting to AI interviewer...';
      case 'connected':
        return isDemoMode ? 'Demo Mode - Speak now!' : 'Connected - Speak now!';
      case 'error':
        return 'Connection failed';
      default:
        return 'Ready to start';
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Demo mode indicator */}
      {isDemoMode && isConnected && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-600 text-xs font-medium">
          <AlertCircle className="h-3 w-3" />
          Demo Mode - Simulated Interview
        </div>
      )}

      {/* Status indicator */}
      <div className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
        isConnected 
          ? "bg-success/20 text-success" 
          : isConnecting 
          ? "bg-accent/20 text-accent" 
          : "bg-muted text-muted-foreground"
      )}>
        {isConnecting && <Loader2 className="h-4 w-4 animate-spin" />}
        {isConnected && <Volume2 className="h-4 w-4 animate-pulse" />}
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
          Click to start your interview practice. Speak clearly and the AI will respond.
        </p>
      )}
    </div>
  );
}
