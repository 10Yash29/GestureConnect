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
import AuthPage from "./pages/auth-page";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <div>
      <Navbar />
      <main className="pt-16">
        <Switch>
          <Route path="/" component={Home} />
          <ProtectedRoute 
            path="/register-face" 
            requireAdmin={true} 
            component={RegisterFace} 
          />
          <ProtectedRoute 
            path="/collect-gesture" 
            requireAdmin={true} 
            component={CollectGesture} 
          />
          <ProtectedRoute 
            path="/train-model" 
            requireAdmin={true} 
            component={Train} 
          />
          <Route path="/live-demo" component={LiveDemo} />
          <Route path="/auth" component={AuthPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
