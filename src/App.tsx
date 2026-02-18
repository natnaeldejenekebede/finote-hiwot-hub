import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

import Index from "./pages/Index";
import About from "./pages/About";
import Education from "./pages/Education";
import Events from "./pages/Events";
import Media from "./pages/Media";
import Join from "./pages/Join";
import Give from "./pages/Give";
import SpiritualPath from "./pages/SpiritualPath";
import KidsCorner from "./pages/KidsCorner";
import FastingDashboard from "./pages/FastingDashboard";
import PrayerWall from "./pages/PrayerWall";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import CommunityQA from "./pages/CommunityQA";
import BibleTracker from "./pages/BibleTracker"; // NEW PAGE
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/education" element={<Education />} />
              <Route path="/events" element={<Events />} />
              <Route path="/media" element={<Media />} />
              <Route path="/join" element={<Join />} />
              <Route path="/give" element={<Give />} />
              <Route path="/path" element={<SpiritualPath />} />
              <Route path="/kids" element={<KidsCorner />} />
              <Route path="/fasting" element={<FastingDashboard />} />
              <Route path="/prayer" element={<PrayerWall />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/qa" element={<CommunityQA />} />
              
              {/* NEW FEATURE ROUTE */}
              <Route 
                path="/bible-tracker" 
                element={session ? <BibleTracker userId={session.user.id} /> : <Auth />} 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;