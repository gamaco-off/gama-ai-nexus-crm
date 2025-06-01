
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, RefreshCw, CheckCircle2 } from "lucide-react";

export function Emma() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Emma - Notion AI Assistant</h1>
          <p className="text-gray-600 mt-1">Chat with Emma to manage your Notion database and leads intelligently.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync Now
          </Button>
          <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Connected</span>
          </div>
        </div>
      </div>

      {/* AI Chat Interface */}
      <Card className="h-[800px]">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="w-5 h-5 mr-2 text-purple-600" />
            Chat with Emma
          </CardTitle>
          <p className="text-gray-600">Ask Emma to help you manage your Notion leads, create entries, or analyze your data.</p>
        </CardHeader>
        <CardContent className="h-full p-6">
          <div className="w-full h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
            <iframe
              src="https://n8n.srv792766.hstgr.cloud/webhook/chat"
              className="w-full h-full border-0"
              title="Emma Notion Assistant"
              allow="microphone; camera; fullscreen"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
