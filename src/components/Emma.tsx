
import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

export function Emma() {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add the CSS for n8n chat
    const link = document.createElement('link');
    link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Load and initialize the n8n chat
    const loadChat = async () => {
      try {
        const { createChat } = await import('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js');
        
        if (chatContainerRef.current) {
          createChat({
            webhookUrl: 'https://n8n.srv792766.hstgr.cloud/webhook/6ae82887-977b-4033-9855-08a96f0cd896/chat',
            target: chatContainerRef.current,
            mode: 'fullscreen',
            loadPreviousSession: true,
            chatInputPlaceholder: 'Ask Emma about your leads and sales data...',
            chatSessionKey: 'emma-session',
            defaultHeight: 600,
            defaultWidth: '100%',
            showWelcomeScreen: false,
            initialMessages: [
              "Hi! I'm Emma, your Notion AI assistant. I can help you manage your leads, search for information, and provide insights about your sales pipeline. What would you like to know?"
            ]
          });
        }
      } catch (error) {
        console.error('Error loading n8n chat:', error);
        if (chatContainerRef.current) {
          chatContainerRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full">
              <div class="text-center">
                <div class="text-red-500 mb-4">
                  <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Chat Unavailable</h3>
                <p class="text-gray-600">Unable to load the chat interface. Please try refreshing the page.</p>
              </div>
            </div>
          `;
        }
      }
    };

    loadChat();

    // Cleanup function
    return () => {
      const existingLink = document.querySelector('link[href="https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css"]');
      if (existingLink) {
        document.head.removeChild(existingLink);
      }
    };
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Emma - Notion AI Assistant</h1>
          <p className="text-gray-600 mt-1">Chat with Emma to manage your Notion database and leads intelligently.</p>
        </div>
      </div>

      {/* Chat Interface */}
      <Card className="h-[700px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="w-5 h-5 mr-2 text-purple-600" />
            Chat with Emma
          </CardTitle>
          <p className="text-gray-600">Ask Emma to help you manage your Notion leads, create entries, or analyze your data.</p>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <div 
            ref={chatContainerRef}
            className="w-full h-full min-h-[600px]"
            style={{ minHeight: '600px' }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
