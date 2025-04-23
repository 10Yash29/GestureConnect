import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import RegisterFace from "./pages/RegisterFace";
import CollectGesture from "./pages/CollectGesture";
import Train from "./pages/Train";
import LiveDemo from "./pages/LiveDemo";

function Router() {
  return (
    <div>
      <Navbar />
      <main className="pt-16">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/register-face" component={RegisterFace} />
          <Route path="/collect-gesture" component={CollectGesture} />
          <Route path="/train-model" component={Train} />
          <Route path="/live-demo" component={LiveDemo} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
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
