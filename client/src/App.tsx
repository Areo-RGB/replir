import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import PlayerDetails from "@/pages/PlayerDetails";
import Sidebar from "@/components/Sidebar";

function Router() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 flex-1 min-h-screen bg-gray-50">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/player/:name" component={PlayerDetails} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;