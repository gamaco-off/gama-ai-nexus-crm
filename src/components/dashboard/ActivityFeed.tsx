
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, Mail, MessageSquare, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

interface Activity {
  id: string;
  type: string;
  message: string;
  time: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

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

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
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
  );
}
