
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  MessageSquare, 
  Clock, 
  Users,
  ExternalLink,
  RefreshCw
} from "lucide-react";

const recentConversations = [
  {
    id: 1,
    contact: "Sarah Johnson",
    company: "TechCorp Inc.",
    subject: "Partnership Opportunity",
    lastMessage: "Thanks for reaching out! I'd love to discuss this further.",
    time: "2 mins ago",
    status: "replied"
  },
  {
    id: 2,
    contact: "Michael Chen",
    company: "StartupXYZ",
    subject: "Demo Request",
    lastMessage: "Can we schedule a demo for next week?",
    time: "1 hour ago",
    status: "pending"
  },
  {
    id: 3,
    contact: "Emily Rodriguez",
    company: "Enterprise Solutions",
    subject: "Pricing Inquiry",
    lastMessage: "What are your enterprise pricing options?",
    time: "3 hours ago",
    status: "new"
  }
];

const emailTemplates = [
  "Cold Outreach Template",
  "Follow-up Sequence",
  "Meeting Request",
  "Demo Invitation",
  "Pricing Proposal",
  "Thank You Message"
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "replied":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "new":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function EmailAgent() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email AI Agent</h1>
          <p className="text-gray-600 mt-1">Automate your email outreach and manage conversations with AI assistance.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync Emails
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Full App
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Email Agent Interface */}
        <Card className="lg:col-span-3 h-[800px]">
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

        {/* Sidebar with Conversations and Templates */}
        <div className="space-y-6">
          {/* Recent Conversations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
                Recent Conversations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentConversations.map((conversation) => (
                <div key={conversation.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm text-gray-900">{conversation.contact}</h4>
                    <Badge className={getStatusColor(conversation.status)} variant="secondary">
                      {conversation.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{conversation.company}</p>
                  <p className="text-xs font-medium text-gray-700 mb-2">{conversation.subject}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">{conversation.lastMessage}</p>
                  <div className="flex items-center text-xs text-gray-400 mt-2">
                    <Clock className="w-3 h-3 mr-1" />
                    {conversation.time}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Mail className="w-5 h-5 mr-2 text-green-600" />
                Quick Templates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {emailTemplates.map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                >
                  {template}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Users className="w-5 h-5 mr-2 text-orange-600" />
                Email Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Open Rate</span>
                <span className="text-sm font-semibold">24.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Reply Rate</span>
                <span className="text-sm font-semibold">6.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Click Rate</span>
                <span className="text-sm font-semibold">3.2%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
