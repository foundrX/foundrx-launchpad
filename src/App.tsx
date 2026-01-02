import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Join from "./pages/Join";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Team from "./pages/Team";
import Workshop from "./pages/Workshop";
import Apply from "./pages/Apply";
import Ideas from "./pages/Ideas";
import NewIdea from "./pages/NewIdea";
import IdeaDetail from "./pages/IdeaDetail";
import Profile from "./pages/Profile";
import Collaborations from "./pages/Collaborations";
import Notifications from "./pages/Notifications";
import Terms from "./pages/Terms";
import Payment from "./pages/Payment";
import NotFound from "./pages/NotFound";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import InvestorDashboard from "./pages/dashboard/InvestorDashboard";
import MentorDashboard from "./pages/dashboard/MentorDashboard";
import SmallBusinessDashboard from "./pages/dashboard/SmallBusinessDashboard";
import ExpertDashboard from "./pages/dashboard/ExpertDashboard";
import FreelancerDashboard from "./pages/dashboard/FreelancerDashboard";

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
            <Route path="/privacy" element={<Terms />} />
            <Route path="/cookies" element={<Terms />} />
            <Route path="/ideas" element={<Ideas />} />
            <Route path="/ideas/new" element={<NewIdea />} />
            <Route path="/ideas/:id" element={<IdeaDetail />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/collaborations" element={<Collaborations />} />
            <Route path="/team" element={<Team />} />
            <Route path="/payment" element={<Payment />} />
            {/* Role-specific Dashboards */}
            <Route path="/dashboard/student/*" element={<StudentDashboard />} />
            <Route path="/dashboard/investor/*" element={<InvestorDashboard />} />
            <Route path="/dashboard/mentor/*" element={<MentorDashboard />} />
            <Route path="/dashboard/small-business/*" element={<SmallBusinessDashboard />} />
            <Route path="/dashboard/expert/*" element={<ExpertDashboard />} />
            <Route path="/dashboard/freelancer/*" element={<FreelancerDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
