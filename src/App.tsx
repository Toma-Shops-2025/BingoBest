
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppProvider } from "@/contexts/AppContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import AppFallback from "./components/AppFallback";
import AdminDashboard from "./components/AdminDashboard";
import AudioPlayer from "./components/AudioPlayer";

// Lazy initialization to avoid circular dependencies
let _queryClient: QueryClient | null = null;

const getQueryClient = () => {
  if (!_queryClient) {
    _queryClient = new QueryClient();
  }
  return _queryClient;
};

const App = () => (
  <ErrorBoundary>
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={getQueryClient()}>
        <AuthProvider>
          <AppProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              </BrowserRouter>
              <AudioPlayer />
            </TooltipProvider>
          </AppProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
