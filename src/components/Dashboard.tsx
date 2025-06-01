
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
  AlertCircle
} from "lucide-react";

const stats = [
  {
    title: "Total Leads",
    value: "2,847",
    change: "+12.3%",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    title: "Active Campaigns",
    value: "24",
    change: "+5.2%",
    icon: Play,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    title: "Emails Sent",
    value: "18,492",
    change: "+28.1%",
    icon: Mail,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    title: "Replies Received",
    value: "1,247",
    change: "+15.7%",
    icon: MessageSquare,
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  }
];

const activities = [
  {
    id: 1,
    type: "lead_added",
    message: "New lead added: Sarah Johnson from TechCorp",
    time: "2 minutes ago",
    icon: Users,
    color: "text-blue-600"
  },
  {
    id: 2,
    type: "email_sent",
    message: "Email campaign sent to 150 prospects",
    time: "15 minutes ago",
    icon: Mail,
    color: "text-green-600"
  },
  {
    id: 3,
    type: "reply_received",
    message: "Reply received from Michael Chen",
    time: "1 hour ago",
    icon: MessageSquare,
    color: "text-orange-600"
  },
  {
    id: 4,
    type: "notion_sync",
    message: "Notion database synced successfully",
    time: "2 hours ago",
    icon: RefreshCw,
    color: "text-purple-600"
  },
  {
    id: 5,
    type: "campaign_completed",
    message: "Campaign 'Q4 Outreach' completed",
    time: "3 hours ago",
    icon: CheckCircle2,
    color: "text-green-600"
  }
];

export function Dashboard() {
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
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync with Notion
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
              {activities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`p-2 rounded-full bg-gray-100`}>
                      <Icon className={`w-4 h-4 ${activity.color}`} />
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
                <p className="text-2xl font-bold text-blue-600">6.7%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-purple-900">Conversion Rate</p>
                <p className="text-2xl font-bold text-purple-600">2.3%</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-purple-600" />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-orange-900">Avg. Response Time</p>
                <p className="text-2xl font-bold text-orange-600">4.2h</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
