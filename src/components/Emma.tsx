
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, RefreshCw, Search, Database, CheckCircle2, Clock } from "lucide-react";

const notionLeads = [
  {
    id: 1,
    name: "Sarah Johnson",
    company: "TechCorp Inc.",
    status: "qualified",
    lastSync: "2 mins ago"
  },
  {
    id: 2,
    name: "Michael Chen",
    company: "StartupXYZ",
    status: "contacted",
    lastSync: "5 mins ago"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    company: "Enterprise Solutions",
    status: "new",
    lastSync: "10 mins ago"
  },
  {
    id: 4,
    name: "David Wilson",
    company: "Innovation Labs",
    status: "qualified",
    lastSync: "15 mins ago"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "qualified":
      return "bg-green-100 text-green-800";
    case "contacted":
      return "bg-blue-100 text-blue-800";
    case "new":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function Emma() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Emma - Notion AI Assistant</h1>
          <p className="text-gray-600 mt-1">Interact with your Notion database and manage leads intelligently.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <Card className="lg:col-span-2 h-[700px]">
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
                src="https://n8n.srv792766.hstgr.cloud/webhook/6ae82887-977b-4033-9855-08a96f0cd896/chat"
                className="w-full h-full border-0"
                title="Emma Notion Assistant"
                sandbox="allow-same-origin allow-scripts allow-forms"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notion Leads Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2 text-blue-600" />
              Synced Leads
            </CardTitle>
            <div className="flex space-x-2 mt-2">
              <Input placeholder="Search leads..." className="flex-1" />
              <Button size="sm" variant="outline">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {notionLeads.map((lead) => (
              <div key={lead.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{lead.name}</h4>
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{lead.company}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {lead.lastSync}
                </div>
              </div>
            ))}
            
            <Button className="w-full" variant="outline">
              View All Leads in Notion
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
