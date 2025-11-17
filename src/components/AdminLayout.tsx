import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-admin-content">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 bg-admin-header border-b border-admin-border-light flex items-center px-4">
            <SidebarTrigger className="text-admin-text-secondary hover:text-admin-text-primary" />
            <div className="ml-4">
              <h2 className="text-sm font-medium text-admin-text-secondary">
                Sistema Turnero - Administración
              </h2>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}