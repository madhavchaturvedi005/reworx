import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Integration from "./pages/Integration";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import OTPVerification from "./pages/OTPVerification";
import NotFound from "./pages/NotFound";
import GmailIntegration from '@/components/GmailIntegration';
import GmailCallback from '@/components/GmailCallback';
import OrderHistoryPage from '@/pages/OrderHistoryPage';

const queryClient = new QueryClient();

// Loading Component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

// Auth check component using context
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading state while auth is initializing
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Redirect authenticated users from landing to home
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading state while auth is initializing
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isLoading } = useAuth();
  
  // Show global loading state if auth is still initializing
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <Routes>
      <Route path="/" element={
        <PublicRoute>
          <Index />
        </PublicRoute>
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/otp-verification" element={<OTPVerification />} />
      <Route path="/auth/callback" element={<Navigate to="/dashboard" replace />} />
      <Route path="/home" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/integration" element={
        <ProtectedRoute>
          <Integration />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/integration/gmail" element={<GmailIntegration />} />
      <Route path="/auth/gmail/callback" element={<GmailCallback />} />
      <Route path="/orders" element={
        <ProtectedRoute>
          <OrderHistoryPage />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
