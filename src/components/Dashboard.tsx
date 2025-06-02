
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Loader2
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
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://n8n.srv792766.hstgr.cloud/webhook/dashboard-update', {
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

      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
      case 'notion_sync':
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
      case 'notion_sync':
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

  if (error || !dashboardData) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Dashboard</h3>
            <p className="text-gray-600 mb-4">Unable to fetch dashboard data from the server.</p>
            <Button onClick={fetchDashboardData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Leads",
      value: dashboardData.stats.totalLeads,
      change: dashboardData.stats.totalLeadsChange,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Campaigns",
      value: dashboardData.stats.activeCampaigns,
      change: dashboardData.stats.activeCampaignsChange,
      icon: Play,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Emails Sent",
      value: dashboardData.stats.emailsSent,
      change: dashboardData.stats.emailsSentChange,
      icon: Mail,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Replies Received",
      value: dashboardData.stats.repliesReceived,
      change: dashboardData.stats.repliesReceivedChange,
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
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
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
              {dashboardData.activities.map((activity) => {
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
                <p className="text-2xl font-bold text-blue-600">{dashboardData.insights.responseRate}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-purple-900">Conversion Rate</p>
                <p className="text-2xl font-bold text-purple-600">{dashboardData.insights.conversionRate}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-purple-600" />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-orange-900">Avg. Response Time</p>
                <p className="text-2xl font-bold text-orange-600">{dashboardData.insights.avgResponseTime}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
