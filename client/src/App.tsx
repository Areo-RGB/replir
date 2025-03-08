import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import PlayerDetails from "@/pages/PlayerDetails";
import WorkInProgress from "@/pages/WorkInProgress";
import Sidebar from "@/components/Sidebar";

function Router() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        {/* Fixed DFB Logo in upper right */}
        <div className="fixed top-4 right-4 z-50">
          <Link href="/analysis">
            <img 
              src="https://upload.wikimedia.org/wikipedia/de/c/c0/DFB-Logo.svg"
              alt="DFB Logo"
              className="w-10 h-10 cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>

        <Switch>
          <Route path="/" component={Home} />
          <Route path="/player/:name" component={PlayerDetails} />
          <Route path="/analysis" component={WorkInProgress} />
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