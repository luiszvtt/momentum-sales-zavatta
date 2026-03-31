import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/contexts/AppContext";
import BottomNav from "@/components/BottomNav";
import Dashboard from "@/pages/Dashboard";
import AddActivity from "@/pages/AddActivity";
import GoalsPage from "@/pages/GoalsPage";
import Statistics from "@/pages/Statistics";
import FinancialSettings from "@/pages/FinancialSettings";
import Profile from "@/pages/Profile";
import RemindersPage from "@/pages/RemindersPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<AddActivity />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/financial" element={<FinancialSettings />} />
              <Route path="/reminders" element={<RemindersPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </div>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
