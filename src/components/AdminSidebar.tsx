import { 
  LayoutDashboard, 
  Building2, 
  Monitor, 
  FolderOpen, 
  Tv, 
  Megaphone, 
  Users, 
  Shield, 
  Clock, 
  BarChart3, 
  HelpCircle, 
  Settings 
} from "lucide-react";
import { NavLink } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Sucursales", url: "/sucursales", icon: Building2 },
  { title: "Kioskos", url: "/kioskos", icon: Monitor },
  { title: "Categorías", url: "/categorias", icon: FolderOpen },
  { title: "Pantallas", url: "/pantallas", icon: Tv },
  { title: "Publicidad", url: "/publicidad", icon: Megaphone },
  { title: "Usuarios", url: "/usuarios", icon: Users },
  { title: "Roles", url: "/roles", icon: Shield },
  { title: "Turnos", url: "/turnos", icon: Clock },
  { title: "Reportes", url: "/reportes", icon: BarChart3 },
  { title: "Soporte", url: "/soporte", icon: HelpCircle },
  { title: "Configuración", url: "/configuracion", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b border-sidebar-border">
          <h1 className={`font-semibold text-lg text-sidebar-primary transition-opacity ${
            isCollapsed ? "opacity-0" : "opacity-100"
          }`}>
            Panel Admin
          </h1>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "opacity-0" : "opacity-100"}>
            Navegación
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                          isActive 
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}