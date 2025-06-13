
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, CheckCircle2, Clock } from "lucide-react";

interface InsightsData {
  responseRate: string;
  conversionRate: string;
  avgResponseTime: string;
}

interface QuickInsightsProps {
  insights: InsightsData;
}

export function QuickInsights({ insights }: QuickInsightsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-blue-900">Response Rate</p>
            <p className="text-2xl font-bold text-blue-600">{insights?.responseRate || "0%"}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-blue-600" />
        </div>
        
        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-purple-900">Conversion Rate</p>
            <p className="text-2xl font-bold text-purple-600">{insights?.conversionRate || "0%"}</p>
          </div>
          <CheckCircle2 className="w-8 h-8 text-purple-600" />
        </div>
        
        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-orange-900">Avg. Response Time</p>
            <p className="text-2xl font-bold text-orange-600">{insights?.avgResponseTime || "0 hours"}</p>
          </div>
          <Clock className="w-8 h-8 text-orange-600" />
        </div>
      </CardContent>
    </Card>
  );
}
