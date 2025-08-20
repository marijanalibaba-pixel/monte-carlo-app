import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdvancedDashboard } from "@/pages/advanced-dashboard";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={AdvancedDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Force light mode by ensuring the HTML element never has "dark" class
  useEffect(() => {
    // Remove dark class if it exists
    document.documentElement.classList.remove('dark');
    
    // Override any system dark mode preferences
    const style = document.createElement('style');
    style.textContent = `
      /* Force light mode colors */
      html, body, #root {
        color-scheme: light !important;
      }
      
      /* Override any dark mode media queries */
      @media (prefers-color-scheme: dark) {
        html, body, #root {
          color-scheme: light !important;
          background-color: white !important;
          color: black !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Observer to prevent dark class from being added
    const observer = new MutationObserver(() => {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
      }
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => {
      observer.disconnect();
      document.head.removeChild(style);
    };
  }, []);

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
