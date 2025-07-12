import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Dashboard } from "@/components/Dashboard";
import { Emma } from "@/components/Emma";
import { LeadGeneration } from "@/components/LeadGeneration";
import { PricingPage } from "@/components/Pricing";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { CreditsDisplay } from "@/components/CreditsDisplay";
import { LogOut } from "lucide-react";
import { ProfileSheet } from "@/components/ProfileSheet";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Dashboard />;
      case "leadgen":
        return <LeadGeneration />;
      case "emma":
        return <Emma />;
      case "pricing":
        return <PricingPage />;
      default:
        return <Dashboard />;
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-50">
        <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} onProfileClick={() => setProfileOpen(true)} />
        <main className="flex-1 overflow-auto">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 capitalize">
                {activeTab === "emma" ? "Emma AI" : activeTab}
              </h2>
              <div className="flex items-center space-x-4">
                <CreditsDisplay />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </div>
          </div>
          <div className="p-0">
            {renderContent()}
          </div>
        </main>
        <ProfileSheet open={profileOpen} onOpenChange={setProfileOpen} />
      </div>
    </SidebarProvider>
  );
};

export default Index;
