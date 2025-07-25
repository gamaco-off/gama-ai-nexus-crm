


import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, MessageSquare, Send, Settings } from "lucide-react";
import { useCredits } from "@/hooks/useCredits";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "./ChatMessage";
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessageType {
  id: string;
  text: string;
  sender: 'user' | 'emma';
  timestamp: Date;
}

export function Emma() {
  const { profile } = useAuth();
  const webhookUrl = profile?.emma_webhook;
  const { credits, deductCredits, isLoading: creditsLoading } = useCredits();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: '1',
      text: "Hello! I'm Emma, your AI-powered assistant connected to your Notion CRM database. I can help you search leads, send emails, make calls, and much more using real-time data from your systems. How can I assist you today?",
      sender: 'emma',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!webhookUrl) {
      setShowSettings(false);
    }
  }, [webhookUrl]);

  const callEmmaWorkflow = async (message: string): Promise<string> => {
    if (!webhookUrl?.trim()) {
      throw new Error('Please contact your admin to assign your Emma AI webhook.');
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatInput: message,
          sessionId: `user-${Date.now()}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseJson = await response.json();
      return responseJson.output || "I received your message but couldn't generate a response. Please try again.";
    } catch (error) {
      throw new Error(`Failed to connect to Emma AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    if (!webhookUrl?.trim()) {
      toast({
        title: "Configuration Required",
        description: "Please contact your admin to assign your Emma AI webhook.",
        variant: "destructive"
      });
      return;
    }

    if (!credits || credits.amount < 2) {
      toast({
        title: "Insufficient Credits",
        description: "You need at least 2 credits to send a message. Please add more credits to continue chatting.",
        variant: "destructive"
      });
      return;
    }

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      await deductCredits.mutateAsync({
        amount: 2,
        description: 'Chat message with Emma AI'
      });

      const responseText = await callEmmaWorkflow(currentInput);

      const emmaMessage: ChatMessageType = {
        id: Date.now().toString() + '-emma',
        text: responseText,
        sender: 'emma',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, emmaMessage]);

      toast({
        title: "Message Sent",
        description: `2 credits deducted. Remaining: ${(credits?.amount || 0) - 2}`,
      });

    } catch (error) {
      const errorMessage: ChatMessageType = {
        id: Date.now().toString() + '-error',
        text: error instanceof Error ? error.message : "I'm having trouble processing your request right now. Please check your settings and try again.",
        sender: 'emma',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: "Processing Error",
        description: error instanceof Error ? error.message : "Unable to process your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (creditsLoading) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50">
      <div className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Emma AI</h1>
                <p className="text-gray-600">Connected to your n8n workflow & Notion CRM</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center space-x-2"
              disabled={!webhookUrl}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Button>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <Card className="mb-4 border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Emma AI Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      n8n Webhook URL
                    </label>
                    <Input
                      value={webhookUrl || ''}
                      onChange={() => {}}
                      placeholder="https://your-n8n-instance.com/webhook/6ae82887-977b-4033-9855-08a96f0cd896"
                      className="w-full"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Your n8n webhook URL is: <strong>{webhookUrl || 'Not configured'}</strong>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      If this URL is not correct, please contact your administrator to update your profile.
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button disabled className="bg-purple-600 hover:bg-purple-700">
                      Save Settings
                    </Button>
                    <Button variant="outline" onClick={() => setShowSettings(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <MessageSquare className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-purple-900 mb-1">Emma's Real-Time Capabilities</h3>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Access your Notion CRM database in real-time</li>
                    <li>• Send emails through Gmail integration</li>
                    <li>• Make calls and send SMS via Twilio</li>
                    <li>• Send WhatsApp messages</li>
                    <li>• Search the web with SerpAPI</li>
                    <li>• Powered by Azure OpenAI for intelligent responses</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Container */}
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
              Chat with Emma AI
              {webhookUrl ? (
                <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  Connected
                </span>
              ) : (
                <span className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                  Setup Required
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4" style={{ minHeight: '400px', maxHeight: '500px' }}>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.text}
                  isUser={message.sender === 'user'}
                  timestamp={message.timestamp.toISOString()}
                />
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 p-3 rounded-lg mr-12">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t bg-white p-4">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={webhookUrl ? "Ask Emma about your leads, send emails, or get insights..." : "Webhook not assigned. Contact admin."}
                  disabled={isTyping || !webhookUrl}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isTyping || !inputMessage.trim() || !webhookUrl}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Each message costs 2 credits. You have {credits?.amount || 0} credits remaining.
                {!webhookUrl && " Contact admin to assign your Emma AI webhook."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
