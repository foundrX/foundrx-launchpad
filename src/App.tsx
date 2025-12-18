import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Apply from "./pages/Apply";
import About from "./pages/About";
import Workshop from "./pages/Workshop";
import Join from "./pages/Join";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import Ideas from "./pages/Ideas";
import IdeaDetail from "./pages/IdeaDetail";
import NewIdea from "./pages/NewIdea";
import Notifications from "./pages/Notifications";
import Collaborations from "./pages/Collaborations";
import Team from "./pages/Team";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/about" element={<About />} />
            <Route path="/workshop/:id" element={<Workshop />} />
            <Route path="/join" element={<Join />} />
            <Route path="/signup/:role" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/ideas" element={<Ideas />} />
            <Route path="/ideas/new" element={<NewIdea />} />
            <Route path="/ideas/:id" element={<IdeaDetail />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/collaborations" element={<Collaborations />} />
            <Route path="/team" element={<Team />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
