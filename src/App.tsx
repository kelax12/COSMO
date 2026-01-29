import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import AgendaPage from './pages/AgendaPage';
import OKRPage from './pages/OKRPage';
import HabitsPage from './pages/HabitsPage';
import StatisticsPage from './pages/StatisticsPage';
import MessagingPage from './pages/MessagingPage';
import PremiumPage from './pages/PremiumPage';
import SettingsPage from './pages/SettingsPage';
import { TaskProvider, useTasks } from './context/TaskContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import HoverReceiver from "@/visual-edits/VisualEditsMessenger";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 0,
    },
  },
});

function AppContent() {
  const { user, loading } = useTasks();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-400 font-medium animate-pulse">Chargement de votre univers...</p>
        </div>
      </div>
    );
  }

    return (
    <Routes>
      <Route path="/welcome" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {!user ? (
        <Route path="*" element={<LandingPage />} />
      ) : (
        <Route path="/" element={<Layout />}>

          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="agenda" element={<AgendaPage />} />
          <Route path="okr" element={<OKRPage />} />
          <Route path="habits" element={<HabitsPage />} />
          <Route path="statistics" element={<StatisticsPage />} />
          <Route path="messaging" element={<MessagingPage />} />
          <Route path="premium" element={<PremiumPage />} />
          <Route path="settings" element={<SettingsPage />} />
          {/* Redirection vers le dashboard pour les routes inconnues quand connecté */}
          <Route path="*" element={<DashboardPage />} />
        </Route>
      )}
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <TaskProvider>
        <Toaster />
        <HoverReceiver />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TaskProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
