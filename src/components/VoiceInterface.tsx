import { useState, useCallback, useEffect, useRef } from 'react';
import { Mic, MicOff, Phone, PhoneOff, Volume2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface VoiceInterfaceProps {
  agentId: string;
  variant: 'ielts' | 'job' | 'visa';
  onSpeakingChange: (speaking: boolean) => void;
  onTranscriptUpdate: (userText: string, aiText: string) => void;
  onInterviewEnd: () => void;
  disabled?: boolean;
}

// Use the ElevenLabs React SDK approach with direct WebRTC
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
  
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const variantColors = {
    ielts: 'from-ielts to-ielts-dark',
    job: 'from-job to-job-dark',
    visa: 'from-visa to-visa-dark',
  };

  const startConversation = useCallback(async () => {
    if (disabled || isConnecting || isConnected) return;
    
    setIsConnecting(true);
    setStatus('requesting_microphone');

    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      localStreamRef.current = stream;
      setStatus('getting_token');

      // Get conversation token from edge function
      const { data, error } = await supabase.functions.invoke('elevenlabs-conversation-token', {
        body: { agentId }
      });

      if (error || !data?.token) {
        throw new Error(error?.message || 'Failed to get conversation token');
      }

      setStatus('connecting');

      // Create peer connection
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // Set up remote audio
      const audioEl = new Audio();
      audioEl.autoplay = true;
      audioRef.current = audioEl;

      pc.ontrack = (e) => {
        audioEl.srcObject = e.streams[0];
        console.log('Remote audio track received');
      };

      // Add local audio track
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      // Set up data channel for events
      const dc = pc.createDataChannel('oai-events');
      dcRef.current = dc;

      dc.onopen = () => {
        console.log('Data channel opened');
        setIsConnected(true);
        setIsConnecting(false);
        setStatus('connected');
        toast({
          title: "Connected!",
          description: "You can start speaking now. The AI examiner will respond.",
        });
      };

      dc.onclose = () => {
        console.log('Data channel closed');
        setIsConnected(false);
        setStatus('disconnected');
      };

      dc.onmessage = (e) => {
        try {
          const event = JSON.parse(e.data);
          console.log('Received event:', event.type);
          
          if (event.type === 'agent_response') {
            onSpeakingChange(true);
            if (event.agent_response_event?.agent_response) {
              onTranscriptUpdate('', event.agent_response_event.agent_response);
            }
          } else if (event.type === 'agent_response_correction') {
            if (event.agent_response_correction_event?.corrected_agent_response) {
              onTranscriptUpdate('', event.agent_response_correction_event.corrected_agent_response);
            }
          } else if (event.type === 'user_transcript') {
            if (event.user_transcription_event?.user_transcript) {
              onTranscriptUpdate(event.user_transcription_event.user_transcript, '');
            }
          } else if (event.type === 'audio' || event.type === 'response.audio.delta') {
            onSpeakingChange(true);
          } else if (event.type === 'audio_done' || event.type === 'response.audio.done') {
            onSpeakingChange(false);
          }
        } catch (err) {
          console.error('Error parsing event:', err);
        }
      };

      // Create and set local description
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Connect to ElevenLabs Realtime API
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
      console.log('WebRTC connection established');

    } catch (error) {
      console.error('Error starting conversation:', error);
      setIsConnecting(false);
      setIsConnected(false);
      setStatus('error');
      
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: error instanceof Error ? error.message : 'Failed to start voice conversation',
      });
      
      // Cleanup on error
      localStreamRef.current?.getTracks().forEach(track => track.stop());
    }
  }, [agentId, disabled, isConnecting, isConnected, toast, onSpeakingChange, onTranscriptUpdate]);

  const endConversation = useCallback(() => {
    console.log('Ending conversation...');
    
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
    
    setIsConnected(false);
    setIsConnecting(false);
    setStatus('disconnected');
    onSpeakingChange(false);
    onInterviewEnd();
    
    toast({
      title: "Interview Ended",
      description: "Your responses are being analyzed...",
    });
  }, [toast, onSpeakingChange, onInterviewEnd]);

  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
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
        return isConnected ? 'Connected - Speak now!' : 'Connected';
      case 'error':
        return 'Connection failed';
      default:
        return 'Ready to start';
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
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
          Click to start your live interview. The AI will ask you questions and evaluate your responses.
        </p>
      )}
    </div>
  );
}
