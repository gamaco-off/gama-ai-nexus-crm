
import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, MessageSquare } from "lucide-react";
import { useCredits } from "@/hooks/useCredits";
import { useToast } from "@/components/ui/use-toast";

export function Emma() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { credits, deductCredits, isLoading } = useCredits();
  const { toast } = useToast();

  useEffect(() => {
    // Initialize the n8n chat widget using the CDN
    const initializeChat = () => {
      if (!chatContainerRef.current) return;

      // Clear any existing content
      chatContainerRef.current.innerHTML = '';

      // Create the chat container
      const chatDiv = document.createElement('div');
      chatDiv.id = 'n8n-chat';
      chatDiv.style.height = '100%';
      chatDiv.style.width = '100%';
      chatContainerRef.current.appendChild(chatDiv);

      // Load the CSS
      const cssLink = document.createElement('link');
      cssLink.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
      cssLink.rel = 'stylesheet';
      document.head.appendChild(cssLink);

      // Load and initialize the chat script
      const script = document.createElement('script');
      script.type = 'module';
      script.innerHTML = `
        import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
        
        const chat = createChat({
          webhookUrl: 'https://n8n.srv792766.hstgr.cloud/webhook/6ae82887-977b-4033-9855-08a96f0cd896/chat',
          target: '#n8n-chat',
          mode: 'fullscreen',
          loadPreviousSession: true,
          chatSessionKey: 'gama-ai-chat',
          chatWindowOptions: {
            title: 'Emma - AI Assistant',
            subtitle: 'Your Notion Database Assistant',
            footer: ''
          }
        });

        // Add event listeners for message events
        chat.on('message:sent', async (message) => {
          console.log('Message sent event triggered');
          // Check if user has enough credits
          const currentCredits = ${credits?.amount ?? 0};
          console.log('Current credits before sending message:', currentCredits);
          
          if (currentCredits < 2) {
            console.log('Insufficient credits:', currentCredits);
            window.dispatchEvent(new CustomEvent('insufficient-credits'));
            return false;
          }
          
          // Deduct credits immediately when message is sent
          window.dispatchEvent(new CustomEvent('deduct-credits'));
          console.log('Sufficient credits, proceeding with message');
          return true;
        });

        chat.on('error', (error) => {
          console.error('Chat error:', error);
        });
      `;
      document.body.appendChild(script);

      // Listen for insufficient credits event
      const handleInsufficientCredits = () => {
        console.log('Handling insufficient credits event');
        toast({
          title: "Insufficient Credits",
          description: "You need at least 2 credits to send a message. Please add more credits to continue chatting.",
          variant: "destructive"
        });
      };

      // Listen for deduct credits event
      const handleDeductCredits = async () => {
        try {
          console.log('Starting credit deduction process');
          console.log('Current credits before deduction:', credits?.amount);
          
          const result = await deductCredits.mutateAsync({
            amount: 2,
            description: 'Chat message with Emma'
          });
          
          console.log('Credit deduction result:', result);
          console.log('New credit amount:', result.amount);
          
          toast({
            title: "Credits Deducted",
            description: `2 credits have been deducted. Remaining credits: ${result.amount}`,
          });
        } catch (error) {
          console.error('Error in credit deduction:', error);
          toast({
            title: "Error",
            description: "Failed to deduct credits. Please try again.",
            variant: "destructive"
          });
        }
      };

      // Add event listeners
      window.addEventListener('insufficient-credits', handleInsufficientCredits);
      window.addEventListener('deduct-credits', handleDeductCredits);

      // Cleanup function
      return () => {
        window.removeEventListener('insufficient-credits', handleInsufficientCredits);
        window.removeEventListener('deduct-credits', handleDeductCredits);
      };
    };

    // Initialize chat with a small delay
    const timer = setTimeout(initializeChat, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [credits, deductCredits, toast]);

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

        {/* Chat Container - Now embedded directly */}
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
              Chat with Emma
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <div 
              ref={chatContainerRef}
              className="h-full w-full"
              style={{ minHeight: '500px' }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
