import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
