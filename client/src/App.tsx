import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdvancedDashboard } from "@/pages/advanced-dashboard";
import NotFound from "@/pages/not-found";
import { TestComponent } from "./test-component";

function Router() {
  return (
    <Switch>
      <Route path="/test" component={TestComponent} />
      <Route path="/" component={AdvancedDashboard} />
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
