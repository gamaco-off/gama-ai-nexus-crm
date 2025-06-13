import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Mail, 
  TrendingUp, 
  MessageSquare,
  Plus,
  Play,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardData {
  stats: {
    totalLeads: string;
    activeCampaigns: string;
    emailsSent: string;
    repliesReceived: string;
    totalLeadsChange: string;
    activeCampaignsChange: string;
    emailsSentChange: string;
    repliesReceivedChange: string;
  };
  activities: Array<{
    id: string;
    type: string;
    message: string;
    time: string;
  }>;
  insights: {
    responseRate: string;
    conversionRate: string;
    avgResponseTime: string;
  };
}

export function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddLeadForm, setShowAddLeadForm] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: ''
  });
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://n8n.srv792766.hstgr.cloud/webhook/944ee763-6f73-4ced-b914-a6e5ffc5565f', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get_dashboard_data',
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      console.log('Dashboard API Response:', data);
      
      // Parse the text response and convert to dashboard data structure
      const parsedData = parseN8nResponse(data);
      setDashboardData(parsedData);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      
      // Use fallback data on error
      setDashboardData({
        stats: {
          totalLeads: "1,234",
          activeCampaigns: "8",
          emailsSent: "15,678",
          repliesReceived: "2,345",
          totalLeadsChange: "+12%",
          activeCampaignsChange: "+3",
          emailsSentChange: "+23%",
          repliesReceivedChange: "+18%"
        },
        activities: [
          {
            id: "1",
            type: "lead_added",
            message: "New lead added: TechCorp Industries",
            time: "2 minutes ago"
          }
        ],
        insights: {
          responseRate: "23.5%",
          conversionRate: "8.2%",
          avgResponseTime: "2.3 hours"
        }
      });
      
      toast({
        title: "Error",
        description: "Failed to load live data. Showing sample data instead.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const parseN8nResponse = (textData: string): DashboardData => {
    try {
      // Try to parse as JSON first
      const jsonData = JSON.parse(textData);
      
      // If it's already in the correct format, return it
      if (jsonData.stats && jsonData.activities && jsonData.insights) {
        return jsonData;
      }
      
      // Otherwise, extract relevant information from the text
      return extractDataFromText(textData);
    } catch {
      // If JSON parsing fails, treat as plain text
      return extractDataFromText(textData);
    }
  };

  const extractDataFromText = (text: string): DashboardData => {
    // Extract numbers and relevant information from the text
    const numbers = text.match(/\d+/g) || [];
    const activities = [];
    
    // Create activity from the text message
    if (text && text.trim()) {
      activities.push({
        id: Date.now().toString(),
        type: "workflow_update",
        message: text.length > 100 ? text.substring(0, 100) + "..." : text,
        time: "Just now"
      });
    }

    return {
      stats: {
        totalLeads: numbers[0] || "0",
        activeCampaigns: numbers[1] || "0",
        emailsSent: numbers[2] || "0",
        repliesReceived: numbers[3] || "0",
        totalLeadsChange: "+12%",
        activeCampaignsChange: "+3",
        emailsSentChange: "+23%",
        repliesReceivedChange: "+18%"
      },
      activities,
      insights: {
        responseRate: "23.5%",
        conversionRate: "8.2%",
        avgResponseTime: "2.3 hours"
      }
    };
  };

  const handleAddLead = async () => {
    if (!leadForm.name || !leadForm.email) {
      toast({
        title: "Error",
        description: "Name and email are required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingLead(true);
    
    try {
      const response = await fetch('https://n8n.srv792766.hstgr.cloud/webhook/b4e3710b-f974-43c6-8fac-9edc0a1f72e7', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add_lead',
          data: leadForm,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      console.log('Add Lead Response:', result);

      toast({
        title: "Success",
        description: "Lead added successfully!",
      });

      // Reset form and close modal
      setLeadForm({ name: '', email: '', company: '', phone: '' });
      setShowAddLeadForm(false);
      
      // Refresh dashboard data
      fetchDashboardData();
      
    } catch (error) {
      console.error('Error adding lead:', error);
      toast({
        title: "Error",
        description: "Failed to add lead. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingLead(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getIconForActivityType = (type: string) => {
    switch (type) {
      case 'lead_added':
        return Users;
      case 'email_sent':
        return Mail;
      case 'reply_received':
        return MessageSquare;
      case 'workflow_update':
        return RefreshCw;
      case 'campaign_completed':
        return CheckCircle2;
      default:
        return AlertCircle;
    }
  };

  const getColorForActivityType = (type: string) => {
    switch (type) {
      case 'lead_added':
        return 'text-blue-600';
      case 'email_sent':
        return 'text-green-600';
      case 'reply_received':
        return 'text-orange-600';
      case 'workflow_update':
        return 'text-purple-600';
      case 'campaign_completed':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </div>
    );
  }

  // Always render dashboard since we have fallback data
  const stats = [
    {
      title: "Total Leads",
      value: dashboardData?.stats?.totalLeads || "0",
      change: dashboardData?.stats?.totalLeadsChange || "0%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Campaigns",
      value: dashboardData?.stats?.activeCampaigns || "0",
      change: dashboardData?.stats?.activeCampaignsChange || "0",
      icon: Play,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Emails Sent",
      value: dashboardData?.stats?.emailsSent || "0",
      change: dashboardData?.stats?.emailsSentChange || "0%",
      icon: Mail,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Replies Received",
      value: dashboardData?.stats?.repliesReceived || "0",
      change: dashboardData?.stats?.repliesReceivedChange || "0%",
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your sales.</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            onClick={() => setShowAddLeadForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
          <Button variant="outline">
            <Play className="w-4 h-4 mr-2" />
            Start Campaign
          </Button>
          <Button variant="outline" onClick={fetchDashboardData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Add Lead Form Modal */}
      {showAddLeadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Lead</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAddLeadForm(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <Input
                  value={leadForm.name}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter lead name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <Input
                  type="email"
                  value={leadForm.email}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <Input
                  value={leadForm.company}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Enter company name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <Input
                  value={leadForm.phone}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button 
                  onClick={handleAddLead}
                  disabled={isSubmittingLead}
                  className="flex-1"
                >
                  {isSubmittingLead ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Lead'
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddLeadForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <Badge variant="secondary" className="mt-2 text-green-700 bg-green-100">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change}
                    </Badge>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gray-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(dashboardData?.activities || []).map((activity) => {
                const Icon = getIconForActivityType(activity.type);
                const color = getColorForActivityType(activity.type);
                return (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`p-2 rounded-full bg-gray-100`}>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-blue-900">Response Rate</p>
                <p className="text-2xl font-bold text-blue-600">{dashboardData?.insights?.responseRate || "0%"}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-purple-900">Conversion Rate</p>
                <p className="text-2xl font-bold text-purple-600">{dashboardData?.insights?.conversionRate || "0%"}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-purple-600" />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-orange-900">Avg. Response Time</p>
                <p className="text-2xl font-bold text-orange-600">{dashboardData?.insights?.avgResponseTime || "0 hours"}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
