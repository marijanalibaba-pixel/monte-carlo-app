import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Router, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/queryClient";
import { Dashboard } from "@/pages/dashboard";
import ForecastPage from "@/pages/forecast";
import NotFound from "@/pages/not-found";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground">
        <Router>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/forecast" component={ForecastPage} />
            <Route component={NotFound} />
          </Switch>
        </Router>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}