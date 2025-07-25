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

export const parseN8nResponse = (textData: string): DashboardData => {
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

export const extractDataFromText = (text: string): DashboardData => {
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

export const getFallbackDashboardData = (): DashboardData => ({
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
