
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, TrendingUp, MessageSquare, Play } from "lucide-react";

interface StatsData {
  totalLeads: string;
  activeCampaigns: string;
  emailsSent: string;
  repliesReceived: string;
  totalLeadsChange: string;
  activeCampaignsChange: string;
  emailsSentChange: string;
  repliesReceivedChange: string;
}

interface StatsGridProps {
  stats: StatsData;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const statsConfig = [
    {
      title: "Total Leads",
      value: stats?.totalLeads || "0",
      change: stats?.totalLeadsChange || "0%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Campaigns",
      value: stats?.activeCampaigns || "0",
      change: stats?.activeCampaignsChange || "0",
      icon: Play,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Emails Sent",
      value: stats?.emailsSent || "0",
      change: stats?.emailsSentChange || "0%",
      icon: Mail,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Replies Received",
      value: stats?.repliesReceived || "0",
      change: stats?.repliesReceivedChange || "0%",
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsConfig.map((stat) => {
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
  );
}
