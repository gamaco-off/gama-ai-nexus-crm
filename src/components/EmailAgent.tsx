
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

export function EmailAgent() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Email AI Agent</h1>
        <p className="text-gray-600 mt-1">Automate your email outreach and manage conversations with AI assistance.</p>
      </div>

      {/* Email Agent Interface */}
      <Card className="h-[800px]">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="w-5 h-5 mr-2 text-blue-600" />
            AI Email Dashboard
          </CardTitle>
          <p className="text-gray-600">Manage your email campaigns and conversations with AI-powered automation.</p>
        </CardHeader>
        <CardContent className="h-full p-6">
          <div className="w-full h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
            <iframe
              src="https://gorgeous-snickerdoodle-0eca78.netlify.app"
              className="w-full h-full border-0"
              title="Email AI Agent"
              sandbox="allow-same-origin allow-scripts allow-forms"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
