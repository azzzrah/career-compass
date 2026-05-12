import { LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function AppHeader() {
  const { signOut } = useAuth();
  const { data: profile } = useProfile();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="lg:hidden">
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
        <div>
          <h2 className="text-lg font-semibold">
            Welcome back, {profile?.full_name || 'User'}
          </h2>
          <p className="text-sm text-muted-foreground">
            Let's find your perfect career path
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={signOut}
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </header>
  );
}
