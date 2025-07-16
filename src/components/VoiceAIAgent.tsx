import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, MicOff, Volume2, VolumeX, Settings, MessageSquare, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCredits } from '@/hooks/useCredits';

interface ConversationMessage {
  id: string;
  type: 'user' | 'ai';
  text: string;
  timestamp: Date;
  audioUrl?: string;
}

interface VoiceSettings {
  volume: number;
  speechRate: number;
  voice: string;
}

export function VoiceAIAgent() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTranscription, setCurrentTranscription] = useState('');
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    volume: 80,
    speechRate: 1.0,
    voice: 'en-US-JennyNeural'
  });
  const [showSettings, setShowSettings] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const { credits, deductCredits } = useCredits();
  const { toast } = useToast();
  
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Azure Speech Services configuration
  const AZURE_SPEECH_KEY = 'EgKp6CByGjOyfr40iSz0U1RG0fnoSnC1QQidi4wq6X3SQigsSMTLJQQJ99BGACYeBjFXJ3w3AAAYACOGkEPO';
  const AZURE_REGION = 'eastus';
  const WEBHOOK_URL = 'https://n8n.gama-app.com/webhook/invoke-n8n-agent';

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCurrentTranscription(transcript);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          processVoiceInput();
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: 'Speech Recognition Error',
          description: `Error: ${event.error}`,
          variant: 'destructive'
        });
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const startListening = async () => {
    if (!credits || credits.amount < 3) {
      toast({
        title: 'Insufficient Credits',
        description: 'You need at least 3 credits for voice interaction.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsListening(true);
      setCurrentTranscription('');
      
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }

      // Also start recording for backup
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: 'Microphone Access Error',
        description: 'Please allow microphone access to use voice features.',
        variant: 'destructive'
      });
    }
  };

  const stopListening = () => {
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const processVoiceInput = async () => {
    if (!currentTranscription.trim()) return;

    setIsProcessing(true);
    
    try {
      // Deduct credits for voice interaction
      await deductCredits.mutateAsync({
        amount: 3,
        description: 'Voice AI interaction'
      });

      // Add user message to conversation
      const userMessage: ConversationMessage = {
        id: Date.now().toString(),
        type: 'user',
        text: currentTranscription,
        timestamp: new Date()
      };
      setConversation(prev => [...prev, userMessage]);

      // Send to n8n webhook
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: currentTranscription,
          sessionId: `voice-${Date.now()}`,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.text();
      let aiResponseText = responseData;

      // Try to parse JSON response if possible
      try {
        const jsonData = JSON.parse(responseData);
        aiResponseText = jsonData.output || jsonData.response || responseData;
      } catch {
        // Use raw text if not JSON
      }

      // Convert AI response to speech
      const audioUrl = await textToSpeech(aiResponseText);

      // Add AI message to conversation
      const aiMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text: aiResponseText,
        timestamp: new Date(),
        audioUrl
      };
      setConversation(prev => [...prev, aiMessage]);

      // Play the audio response
      if (audioUrl) {
        playAudio(audioUrl);
      }

      toast({
        title: 'Voice Interaction Complete',
        description: `3 credits deducted. Remaining: ${(credits?.amount || 0) - 3}`
      });

    } catch (error) {
      console.error('Error processing voice input:', error);
      toast({
        title: 'Processing Error',
        description: error instanceof Error ? error.message : 'Failed to process voice input',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
      setCurrentTranscription('');
    }
  };

  const textToSpeech = async (text: string): Promise<string | null> => {
    try {
      const response = await fetch(`https://${AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': AZURE_SPEECH_KEY,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3'
        },
        body: `
          <speak version='1.0' xml:lang='en-US'>
            <voice xml:lang='en-US' xml:gender='Female' name='${voiceSettings.voice}'>
              <prosody rate='${voiceSettings.speechRate}'>
                ${text}
              </prosody>
            </voice>
          </speak>
        `
      });

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error('Text-to-speech error:', error);
      toast({
        title: 'Text-to-Speech Error',
        description: 'Failed to generate speech audio',
        variant: 'destructive'
      });
      return null;
    }
  };

  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.volume = voiceSettings.volume / 100;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const togglePlayback = (audioUrl?: string) => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else if (audioUrl) {
        playAudio(audioUrl);
      }
    }
  };

  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Voice AI Agent</h1>
              <p className="text-gray-600">Speak naturally with your AI assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-green-700 border-green-300">
              Credits: {credits?.amount || 0}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg">Voice Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volume: {voiceSettings.volume}%
                </label>
                <Slider
                  value={[voiceSettings.volume]}
                  onValueChange={(value) => setVoiceSettings(prev => ({ ...prev, volume: value[0] }))}
                  max={100}
                  step={10}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speech Rate: {voiceSettings.speechRate}x
                </label>
                <Slider
                  value={[voiceSettings.speechRate]}
                  onValueChange={(value) => setVoiceSettings(prev => ({ ...prev, speechRate: value[0] }))}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Voice Controls */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mic className="w-5 h-5 mr-2 text-green-600" />
                Voice Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Microphone Button */}
              <div className="text-center">
                <Button
                  size="lg"
                  onClick={isListening ? stopListening : startListening}
                  disabled={isProcessing}
                  className={`w-24 h-24 rounded-full ${
                    isListening 
                      ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isProcessing ? (
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                  ) : isListening ? (
                    <MicOff className="w-8 h-8 text-white" />
                  ) : (
                    <Mic className="w-8 h-8 text-white" />
                  )}
                </Button>
                <p className="text-sm text-gray-600 mt-2">
                  {isProcessing ? 'Processing...' : isListening ? 'Listening...' : 'Click to speak'}
                </p>
              </div>

              {/* Current Transcription */}
              {currentTranscription && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-1">You're saying:</p>
                  <p className="text-blue-700">{currentTranscription}</p>
                </div>
              )}

              {/* Audio Controls */}
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => togglePlayback()}
                  disabled={!conversation.find(m => m.type === 'ai' && m.audioUrl)}
                >
                  {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                <span className="text-sm text-gray-600">
                  Volume: {voiceSettings.volume}%
                </span>
              </div>

              {/* Usage Info */}
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs text-yellow-800">
                  Each voice interaction costs 3 credits
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Conversation History */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                Conversation History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {conversation.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className={`text-xs ${
                            message.type === 'user' ? 'text-green-200' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                          {message.type === 'ai' && message.audioUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => togglePlayback(message.audioUrl)}
                              className="h-6 w-6 p-0"
                            >
                              <Volume2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          onEnded={() => setIsPlaying(false)}
          onError={() => {
            setIsPlaying(false);
            toast({
              title: 'Audio Playback Error',
              description: 'Failed to play audio response',
              variant: 'destructive'
            });
          }}
        />
      </div>
    </div>
  );
}