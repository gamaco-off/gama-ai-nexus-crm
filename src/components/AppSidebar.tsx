
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Users, 
  Bot, 
  Mail,
  Sparkles 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigationItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "leadgen", label: "Leadgen", icon: Users },
  { id: "emma", label: "Emma", icon: Bot },
  { id: "email", label: "Email AI Agent", icon: Mail },
];

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  return (
    <div className="w-64 h-full bg-gradient-to-b from-purple-600 via-purple-700 to-blue-800 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-8 w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-24 right-12 w-1 h-1 bg-white rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-16 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-64 right-8 w-2 h-2 bg-white rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-32 left-12 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-48 right-16 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-900"></div>
      </div>

      <div className="relative z-10 p-6 h-full flex flex-col">
        {/* Logo and branding */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">Gama AI</h1>
            <p className="text-purple-200 text-xs">Sales Intelligence</p>
          </div>
        </div>

        {/* User profile */}
        <div className="flex items-center space-x-3 mb-8 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-white text-purple-600 font-semibold">GA</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-white font-medium text-sm">Gama User</p>
            <p className="text-purple-200 text-xs">Premium Plan</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left p-3 h-auto transition-all duration-200",
                  isActive
                    ? "bg-white text-purple-700 shadow-lg hover:bg-white"
                    : "text-white hover:bg-white/20 hover:translate-x-1"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className={cn("w-5 h-5 mr-3", isActive ? "text-purple-600" : "text-purple-200")} />
                <span className="font-medium">{item.label}</span>
              </Button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-white/20">
          <p className="text-purple-200 text-xs text-center">
            © 2024 Gama AI
          </p>
        </div>
      </div>
    </div>
  );
}
