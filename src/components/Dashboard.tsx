import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Play, RefreshCw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StatsGrid } from "./dashboard/StatsGrid";
import { ActivityFeed } from "./dashboard/ActivityFeed";
import { QuickInsights } from "./dashboard/QuickInsights";
import { AddLeadModal } from "./dashboard/AddLeadModal";
import { parseN8nResponse, getFallbackDashboardData } from "@/utils/dashboardUtils";
import { useAuth } from "@/contexts/AuthContext";

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
  const { toast } = useToast();
  const { profile, loading, session, user } = useAuth();

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://n8n.gama-app.com/webhook/944ee763-6f73-4ced-b914-a6e5ffc5565f', {
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
      setDashboardData(getFallbackDashboardData());
      
      toast({
        title: "Error",
        description: "Failed to load live data. Showing sample data instead.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLeadAdded = () => {
    fetchDashboardData();
  };

  let displayName = session?.user?.user_metadata?.full_name || profile?.full_name || user?.email || '';

  if (isLoading || loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </div>
    );
  }

  console.log('Dashboard profile:', profile);

  return (
    <div className="p-6 space-y-6">
      {/* Welcome User */}
      <div className="mb-2">
        <h2 className="text-2xl font-semibold text-gray-800">
          Welcome{displayName ? `, ${displayName}` : ''}!
        </h2>
      </div>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your sales.</p>
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
      <AddLeadModal 
        isOpen={showAddLeadForm}
        onClose={() => setShowAddLeadForm(false)}
        onLeadAdded={handleLeadAdded}
      />

      {/* Stats Grid */}
      <StatsGrid stats={dashboardData?.stats || {
        totalLeads: "0",
        activeCampaigns: "0", 
        emailsSent: "0",
        repliesReceived: "0",
        totalLeadsChange: "0%",
        activeCampaignsChange: "0",
        emailsSentChange: "0%",
        repliesReceivedChange: "0%"
      }} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <ActivityFeed activities={dashboardData?.activities || []} />

        {/* Quick Stats */}
        <QuickInsights insights={dashboardData?.insights || {
          responseRate: "0%",
          conversionRate: "0%",
          avgResponseTime: "0 hours"
        }} />
      </div>
    </div>
  );
}
