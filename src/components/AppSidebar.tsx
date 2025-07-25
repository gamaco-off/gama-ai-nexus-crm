import { Bot, Home, Users, Settings, Tag, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from '@/contexts/AuthContext';

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onProfileClick: () => void;
}

const menuItems = [
  { id: "home", label: "Dashboard", icon: Home },
  { id: "leadgen", label: "Lead Generation", icon: Users },
  { id: "emma", label: "Emma AI", icon: Bot },
  // { id: "pricing", label: "Pricing", icon: Tag },
  { id: "settings", label: "Settings", icon: Settings },
];

export function AppSidebar({ activeTab, onTabChange, onProfileClick }: AppSidebarProps) {
  const { profile } = useAuth();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold text-purple-700 flex items-center justify-between">
            Gama AI
            <button
              onClick={onProfileClick}
              className="ml-2 p-1 rounded-full hover:bg-purple-100 focus:outline-none"
              title="Profile"
              type="button"
            >
              <User className="w-5 h-5 text-purple-700" />
            </button>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.id)}
                    isActive={activeTab === item.id}
                    className="w-full justify-start"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {/* Admin Control option only for admin users */}
              {profile?.role === 'admin' && (
                <SidebarMenuItem key="admin">
                  <SidebarMenuButton
                    onClick={() => onTabChange('admin')}
                    isActive={activeTab === 'admin'}
                    className="w-full justify-start text-red-700"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Admin Control
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
