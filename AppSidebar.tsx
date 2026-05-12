import { Home, Map, ClipboardList, User, Database, Compass } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { seedDatabase } from '@/lib/seedData';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';

const navItems = [
  { title: 'Job Feed', url: '/dashboard', icon: Home },
  { title: 'Career Roadmap', url: '/dashboard/roadmap', icon: Map },
  { title: 'Application Tracker', url: '/dashboard/applications', icon: ClipboardList },
  { title: 'My Profile', url: '/dashboard/profile', icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { toast } = useToast();
  const [seeding, setSeeding] = useState(false);
  const collapsed = state === 'collapsed';

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      await seedDatabase();
      toast({
        title: 'Data seeded successfully!',
        description: '5 jobs and 8 courses have been added.',
      });
    } catch (error: any) {
      toast({
        title: 'Error seeding data',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Compass className="h-6 w-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-semibold text-sidebar-foreground">Career GPS</h1>
              <p className="text-xs text-sidebar-foreground/60">Navigate your future</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/dashboard'}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSeedData}
          disabled={seeding}
          className="w-full justify-start gap-2 border-sidebar-border bg-transparent text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Database className="h-4 w-4" />
          {!collapsed && (seeding ? 'Seeding...' : 'Seed Data')}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
