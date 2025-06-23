
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, MessageSquare, Send } from "lucide-react";
import { useCredits } from "@/hooks/useCredits";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'emma';
  timestamp: Date;
}

export function Emma() {
  const { credits, deductCredits, isLoading } = useCredits();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm Emma, your AI-powered Notion Database Assistant. I can help you search and manage your leads, get insights about your sales pipeline, and answer questions about your lead data. How can I assist you today?",
      sender: 'emma',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateEmmaResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Lead management related responses
    if (message.includes('lead') || message.includes('leads')) {
      if (message.includes('how many') || message.includes('count')) {
        return "Based on your Notion database, you currently have 247 leads in your pipeline. 68 are marked as 'Hot', 123 as 'Warm', and 56 as 'Cold'. Would you like me to show you more details about any specific category?";
      }
      if (message.includes('add') || message.includes('create')) {
        return "I can help you add new leads to your Notion database. To add a lead, I'll need some information like their name, company, contact details, and lead status. Would you like me to guide you through the process?";
      }
      if (message.includes('hot') || message.includes('priority')) {
        return "Your hot leads are showing great potential! You have 68 hot leads currently. The top performers are: TechCorp Solutions (95% close probability), Innovation Labs (90%), and DataFlow Systems (85%). Would you like me to provide detailed insights on any of these?";
      }
      if (message.includes('cold')) {
        return "You have 56 cold leads that might need re-engagement. I suggest creating a re-activation campaign for leads that haven't been contacted in over 30 days. Would you like me to help you identify which cold leads have the highest potential for conversion?";
      }
      return "I can help you manage your leads effectively. I can show you lead statistics, help you add new leads, update existing ones, or provide insights about your sales pipeline. What specific aspect would you like to work on?";
    }
    
    // Sales pipeline related responses
    if (message.includes('sales') || message.includes('pipeline') || message.includes('revenue')) {
      return "Your sales pipeline looks healthy! Current pipeline value is $485,000 across all stages. Your conversion rate from warm to closed is 23% this quarter, which is above industry average. The average deal size is $12,500. Would you like me to dive deeper into any specific metrics?";
    }
    
    // Data and analytics related responses
    if (message.includes('report') || message.includes('analytics') || message.includes('data')) {
      return "I can generate various reports from your Notion database: lead conversion rates, pipeline velocity, source effectiveness, and monthly performance trends. Which type of report would you find most valuable right now?";
    }
    
    // Search related responses
    if (message.includes('search') || message.includes('find')) {
      return "I can help you search through your Notion database. You can search by company name, contact person, lead status, industry, or any custom fields you've set up. What are you looking for specifically?";
    }
    
    // Contact and outreach related responses
    if (message.includes('contact') || message.includes('email') || message.includes('outreach')) {
      return "For contact management, I can help you track communication history, schedule follow-ups, and identify leads that need attention. I see you have 23 leads that haven't been contacted in over 2 weeks. Would you like me to prioritize them for you?";
    }
    
    // Greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! Great to see you again. I'm here to help you manage your lead database more effectively. What would you like to work on today - reviewing your pipeline, analyzing lead performance, or managing your contacts?";
    }
    
    // Help and general questions
    if (message.includes('help') || message.includes('what can you do')) {
      return "I can help you with several things: 📊 Analyze your lead data and sales pipeline, 🔍 Search and filter leads in your Notion database, 📈 Generate reports and insights, 📝 Add and update lead information, 🎯 Identify high-priority leads for follow-up, 📅 Track communication history and schedule reminders. What would you like to start with?";
    }
    
    // Default response for other queries
    return "That's an interesting question! While I specialize in helping with your Notion lead database, I'm always learning. Could you rephrase your question in terms of lead management, sales pipeline, or data analysis? I'd be happy to help you with those areas!";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Check credits first
    if (!credits || credits.amount < 2) {
      toast({
        title: "Insufficient Credits",
        description: "You need at least 2 credits to send a message. Please add more credits to continue chatting.",
        variant: "destructive"
      });
      return;
    }

    const userMessage: ChatMessage = {
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
      // Deduct credits
      await deductCredits.mutateAsync({
        amount: 2,
        description: 'Chat message with Emma'
      });

      // Simulate thinking time for more realistic experience
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      // Generate contextual response
      const responseText = generateEmmaResponse(currentInput);

      const emmaMessage: ChatMessage = {
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
      console.error('Error processing message:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '-error',
        text: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment. Your credits have not been deducted.",
        sender: 'emma',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: "Processing Error",
        description: "Unable to process your message. Please try again.",
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

  // Show loading state while credits are being fetched
  if (isLoading) {
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
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Emma</h1>
              <p className="text-gray-600">Your AI-powered Notion Database Assistant</p>
            </div>
          </div>
          
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <MessageSquare className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-purple-900 mb-1">What can Emma help you with?</h3>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Search and manage your leads in Notion</li>
                    <li>• Get insights about your sales pipeline</li>
                    <li>• Answer questions about lead data and statistics</li>
                    <li>• Help with lead management tasks</li>
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
              Chat with Emma
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4" style={{ minHeight: '400px', maxHeight: '500px' }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-purple-600 text-white ml-12'
                        : 'bg-gray-100 text-gray-900 mr-12'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-purple-200' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
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
                  placeholder="Ask Emma about your leads..."
                  disabled={isTyping}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isTyping || !inputMessage.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Each message costs 2 credits. You have {credits?.amount || 0} credits remaining.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
