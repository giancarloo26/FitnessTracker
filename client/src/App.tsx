import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import MyWorkouts from "@/pages/my-workouts";
import WorkoutEditor from "@/pages/workout-editor";
import Exercises from "@/pages/exercises";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useLocation } from "wouter";

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, isLoading, setLocation]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null;
  }
  
  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/dashboard">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/my-workouts">
        {() => <ProtectedRoute component={MyWorkouts} />}
      </Route>
      <Route path="/workout-editor/:id">
        {(params) => <ProtectedRoute component={WorkoutEditor} id={params.id} />}
      </Route>
      <Route path="/exercises">
        {() => <ProtectedRoute component={Exercises} />}
      </Route>
      <Route path="/profile">
        {() => <ProtectedRoute component={Profile} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
