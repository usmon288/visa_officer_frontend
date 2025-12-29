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
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

type Message = { role: 'user' | 'assistant'; content: string };

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
  const [isProcessing, setIsProcessing] = useState(false);
  
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const messagesRef = useRef<Message[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isListeningRef = useRef(false);

  const variantColors = {
    ielts: 'from-ielts to-ielts-dark',
    job: 'from-job to-job-dark',
    visa: 'from-visa to-visa-dark',
  };

  // Browser TTS fallback
  const speakWithBrowserTTS = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.lang = 'en-US';
      
      utterance.onstart = () => onSpeakingChange(true);
      utterance.onend = () => {
        onSpeakingChange(false);
        resolve();
      };
      utterance.onerror = () => {
        onSpeakingChange(false);
        resolve();
      };
      
      speechSynthesis.speak(utterance);
    });
  }, [onSpeakingChange]);

  // Play audio from base64
  const playAudio = useCallback(async (base64Audio: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        const audio = new Audio(`data:audio/mpeg;base64,${base64Audio}`);
        audioRef.current = audio;
        
        audio.onended = () => {
          onSpeakingChange(false);
          resolve();
        };
        
        audio.onerror = () => {
          onSpeakingChange(false);
          reject(new Error('Audio playback failed'));
        };
        
        onSpeakingChange(true);
        audio.play().catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }, [onSpeakingChange]);

  // Get AI response and speak it
  const getAIResponse = useCallback(async (userMessage: string) => {
    setIsProcessing(true);
    
    // Add user message to history
    messagesRef.current.push({ role: 'user', content: userMessage });
    onTranscriptUpdate(userMessage, '');

    try {
      // Get AI response
      const { data: chatData, error: chatError } = await supabase.functions.invoke('interview-chat', {
        body: { 
          messages: messagesRef.current,
          interviewType: variant 
        }
      });

      if (chatError || !chatData?.response) {
        throw new Error(chatError?.message || 'Failed to get AI response');
      }

      const aiResponse = chatData.response;
      messagesRef.current.push({ role: 'assistant', content: aiResponse });
      onTranscriptUpdate('', aiResponse);

      // Try ElevenLabs TTS first, fallback to browser TTS
      try {
        const ttsResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ text: aiResponse, interviewType: variant }),
          }
        );

        if (!ttsResponse.ok) {
          throw new Error('ElevenLabs TTS failed');
        }

        const ttsData = await ttsResponse.json();
        
        if (ttsData.audioContent) {
          await playAudio(ttsData.audioContent);
        } else {
          throw new Error('No audio content');
        }
      } catch (ttsError) {
        console.log('ElevenLabs TTS unavailable, using browser TTS');
        await speakWithBrowserTTS(aiResponse);
      }
    } catch (error) {
      console.error('AI response error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to get response',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [variant, onTranscriptUpdate, playAudio, speakWithBrowserTTS, toast]);

  // Start listening for user speech
  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListeningRef.current || isProcessing) return;
    
    try {
      recognitionRef.current.start();
      isListeningRef.current = true;
    } catch (error) {
      console.error('Failed to start recognition:', error);
    }
  }, [isProcessing]);

  // Start the interview
  const startConversation = useCallback(async () => {
    if (disabled || isConnecting || isConnected) return;
    
    setIsConnecting(true);
    setStatus('connecting');
    messagesRef.current = [];

    try {
      // Initialize speech recognition
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognitionAPI) {
        throw new Error('Speech recognition not supported in this browser');
      }

      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = async (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        isListeningRef.current = false;
        
        if (transcript.trim()) {
          await getAIResponse(transcript);
          // Resume listening after AI responds
          setTimeout(() => startListening(), 500);
        } else {
          startListening();
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        isListeningRef.current = false;
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          setTimeout(() => startListening(), 1000);
        }
      };

      recognition.onend = () => {
        isListeningRef.current = false;
        if (isConnected && !isProcessing) {
          setTimeout(() => startListening(), 300);
        }
      };

      recognitionRef.current = recognition;

      setIsConnected(true);
      setIsConnecting(false);
      setStatus('connected');

      toast({
        title: "Interview Started",
        description: "The interviewer will begin shortly. Speak clearly when it's your turn.",
      });

      // Get initial AI greeting
      await getAIResponse("Hello, I'm ready to start the interview.");
      
      // Start listening for user
      startListening();

    } catch (error) {
      console.error('Error starting interview:', error);
      setIsConnecting(false);
      setStatus('error');
      
      toast({
        variant: "destructive",
        title: "Failed to Start",
        description: error instanceof Error ? error.message : 'Could not start interview',
      });
    }
  }, [disabled, isConnecting, isConnected, isProcessing, toast, getAIResponse, startListening]);

  // End the interview
  const endConversation = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    isListeningRef.current = false;
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

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (isMuted) {
      startListening();
      setIsMuted(false);
    } else {
      if (recognitionRef.current && isListeningRef.current) {
        recognitionRef.current.stop();
        isListeningRef.current = false;
      }
      setIsMuted(true);
    }
  }, [isMuted, startListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const getStatusText = () => {
    if (isProcessing) return 'AI is responding...';
    switch (status) {
      case 'connecting':
        return 'Starting interview...';
      case 'connected':
        return isMuted ? 'Microphone muted' : 'Listening... Speak now!';
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
          ? isProcessing 
            ? "bg-accent/20 text-accent"
            : "bg-success/20 text-success" 
          : isConnecting 
          ? "bg-accent/20 text-accent" 
          : "bg-muted text-muted-foreground"
      )}>
        {(isConnecting || isProcessing) && <Loader2 className="h-4 w-4 animate-spin" />}
        {isConnected && !isProcessing && <Volume2 className="h-4 w-4 animate-pulse" />}
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
                Starting...
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
              disabled={isProcessing}
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
          Click to start your live AI interview with voice. The interviewer will speak and listen to your responses.
        </p>
      )}
    </div>
  );
}
