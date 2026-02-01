import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

// Providers
import { DataProvider } from '@/features/data';
import { TooltipProvider } from '@/components/ui/tooltip';

// Visual Edits
import VisualEditsMessenger from "@/visual-edits/VisualEditsMessenger";

// Lazy load pages for code splitting
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const TasksPage = lazy(() => import('@/pages/TasksPage'));
const AgendaPage = lazy(() => import('@/pages/AgendaPage'));
const HabitsPage = lazy(() => import('@/pages/HabitsPage'));
const OKRPage = lazy(() => import('@/pages/OKRPage'));
const StatisticsPage = lazy(() => import('@/pages/StatisticsPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const PremiumPage = lazy(() => import('@/pages/PremiumPage'));
const MessagingPage = lazy(() => import('@/pages/MessagingPage'));

// Lazy load Layout
const Layout = lazy(() => import('@/components/Layout'));

// Query client config optimized
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,    // 5 minutes
      gcTime: 1000 * 60 * 30,      // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="text-slate-400 text-sm">Chargement...</p>
    </div>
  </div>
);

// Page loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Route wrapper for Layout
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Layout>
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </Layout>
  </Suspense>
);

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    
    <Route path="/dashboard" element={<LayoutWrapper><DashboardPage /></LayoutWrapper>} />
    <Route path="/tasks" element={<LayoutWrapper><TasksPage /></LayoutWrapper>} />
    <Route path="/agenda" element={<LayoutWrapper><AgendaPage /></LayoutWrapper>} />
    <Route path="/habits" element={<LayoutWrapper><HabitsPage /></LayoutWrapper>} />
    <Route path="/okr" element={<LayoutWrapper><OKRPage /></LayoutWrapper>} />
    <Route path="/statistics" element={<LayoutWrapper><StatisticsPage /></LayoutWrapper>} />
    <Route path="/settings" element={<LayoutWrapper><SettingsPage /></LayoutWrapper>} />
    <Route path="/premium" element={<LayoutWrapper><PremiumPage /></LayoutWrapper>} />
    <Route path="/messages" element={<LayoutWrapper><MessagingPage /></LayoutWrapper>} />
    
    {/* Fallback */}
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DataProvider>
          <Toaster 
            position="top-right" 
            richColors 
            closeButton
            theme="dark"
            toastOptions={{
              duration: 3000,
            }}
          />
          <VisualEditsMessenger />
          <AppRoutes />
        </DataProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
