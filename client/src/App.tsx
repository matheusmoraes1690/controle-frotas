import { Switch, Route, Link, useLocation } from "wouter";
import { Suspense, lazy } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { 
  LayoutDashboard, History, Shield, Bell, BarChart3, Truck, LogOut, Search, Car
} from "lucide-react";
import { cn } from "@/lib/utils";

import { AuthProvider } from "@/components/auth-provider";
import { AuthGuard, PublicOnly } from "@/components/auth-guard";
import { useAuth } from "@/hooks/use-auth";

const Dashboard = lazy(() => import("@/pages/dashboard"));
const HistoryPage = lazy(() => import("@/pages/history"));
const GeofencesPage = lazy(() => import("@/pages/geofences"));
const AlertsPage = lazy(() => import("@/pages/alerts"));
const ReportsPage = lazy(() => import("@/pages/reports"));
const VehiclesPage = lazy(() => import("@/pages/vehicles"));
const LoginPage = lazy(() => import("@/pages/login"));
const ForgotPasswordPage = lazy(() => import("@/pages/forgot-password"));
const ResetPasswordPage = lazy(() => import("@/pages/reset-password"));
const NotFound = lazy(() => import("@/pages/not-found"));

import type { Alert } from "@shared/schema";

function Navigation() {
  const [location] = useLocation();
  
  const { data: alerts = [] } = useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
    refetchInterval: 10000,
  });
  
  const unreadAlerts = alerts.filter(a => !a.read).length;

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/vehicles", label: "Veículos", icon: Car },
    { path: "/history", label: "Histórico", icon: History },
    { path: "/geofences", label: "Geofences", icon: Shield },
    { path: "/alerts", label: "Alertas", icon: Bell, badge: unreadAlerts > 0 ? unreadAlerts : undefined },
    { path: "/reports", label: "Relatórios", icon: BarChart3 },
  ];

  return (
    <header className="h-20 bg-card border-b border-border sticky top-0 z-50">
      <div className="h-full px-6 flex items-center justify-between max-w-[1920px] mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <Truck className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden md:block">FleetTrack</span>
        </Link>
        
        {/* Navigation - Airbnb style pill navigation */}
        <nav className="hidden lg:flex items-center">
          <div className="flex items-center bg-muted/50 rounded-full p-1.5 gap-1">
            {navItems.map(item => {
              const isActive = location === item.path || 
                (item.path !== "/" && location.startsWith(item.path));
              
              return (
                <Link key={item.path} href={item.path}>
                  <button
                    className={cn(
                      "relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200",
                      isActive 
                        ? "bg-card text-foreground shadow-md" 
                        : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                    )}
                    data-testid={`nav-${item.path.replace("/", "") || "dashboard"}`}
                  >
                    <span className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    {item.badge !== undefined && (
                      <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1.5 flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-bold rounded-full">
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    )}
                  </button>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Mobile Navigation */}
        <nav className="flex lg:hidden items-center gap-1">
          {navItems.map(item => {
            const isActive = location === item.path || 
              (item.path !== "/" && location.startsWith(item.path));
            
            return (
              <Link key={item.path} href={item.path}>
                <button
                  className={cn(
                    "relative p-2.5 rounded-full transition-all duration-200",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-muted"
                  )}
                  data-testid={`nav-mobile-${item.path.replace("/", "") || "dashboard"}`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.badge !== undefined && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 flex items-center justify-center bg-primary text-primary-foreground text-[9px] font-bold rounded-full border-2 border-card">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </button>
              </Link>
            );
          })}
        </nav>
        
        {/* Right side controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

function UserMenu() {
  const { user, signOut, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return null;
  
  return (
    <div className="flex items-center gap-3 pl-3 border-l border-border">
      <div className="hidden md:block text-right">
        <p className="text-sm font-semibold text-foreground">
          {user?.username || user?.email?.split('@')[0]}
        </p>
        <p className="text-xs text-muted-foreground">
          Administrador
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => signOut()}
        title="Sair"
        className="rounded-full hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}

function ProtectedRoutes() {
  return (
    <AuthGuard>
      <div className="flex flex-col h-screen bg-background">
        <Navigation />
        <main className="flex-1 overflow-hidden">
          <Suspense fallback={<div className="p-6">Carregando...</div>}>
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/vehicles" component={VehiclesPage} />
              <Route path="/history" component={HistoryPage} />
              <Route path="/geofences" component={GeofencesPage} />
              <Route path="/alerts" component={AlertsPage} />
              <Route path="/reports" component={ReportsPage} />
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </main>
      </div>
    </AuthGuard>
  );
}

function Router() {
  return (
    <Suspense fallback={<div className="p-6">Carregando...</div>}>
      <Switch>
        <Route path="/forgot-password">
          <ForgotPasswordPage />
        </Route>
        <Route path="/reset-password">
          <ResetPasswordPage />
        </Route>
        <Route path="/login">
          <PublicOnly>
            <LoginPage />
          </PublicOnly>
        </Route>
        <Route>
          <ProtectedRoutes />
        </Route>
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Router />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
