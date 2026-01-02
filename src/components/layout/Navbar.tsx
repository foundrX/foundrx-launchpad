import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Menu, X, Rocket, LogOut, User, Lightbulb, Bell, Users, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    if (!user) return;
    const { count } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
    setUnreadCount(count || 0);
  };

  const navLinks = [
    { href: "/ideas", label: "Ideas" },
    { href: "/#workshops", label: "Workshops" },
    { href: "/about", label: "About" },
    { href: "/team", label: "Team" },
    { href: "/terms", label: "Terms" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Rocket className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-display">FoundrX</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.href.startsWith("/") && !link.href.includes("#") ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary active:text-primary active:drop-shadow-[0_0_8px_hsl(210,100%,55%)] transition-all duration-200"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary active:text-primary active:drop-shadow-[0_0_8px_hsl(210,100%,55%)] transition-all duration-200"
                >
                  {link.label}
                </a>
              )
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Button 
                  variant="ghost"
                  onClick={() => navigate("/notifications")}
                  className="font-medium hover:text-primary active:shadow-[0_0_15px_hsl(210,100%,55%,0.5)] transition-all relative"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs gradient-primary">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => navigate("/collaborations")}
                  className="font-medium hover:text-primary active:shadow-[0_0_15px_hsl(210,100%,55%,0.5)] transition-all"
                >
                  <Users className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => navigate("/messages")}
                  className="font-medium hover:text-primary active:shadow-[0_0_15px_hsl(210,100%,55%,0.5)] transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => navigate("/profile")}
                  className="font-medium hover:text-primary active:shadow-[0_0_15px_hsl(210,100%,55%,0.5)] transition-all"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button 
                  onClick={() => navigate("/apply")}
                  className="gradient-primary text-primary-foreground border-0 rounded-full px-6 active:shadow-[0_0_20px_hsl(210,100%,55%,0.6)] transition-all"
                >
                  Apply Now
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={signOut}
                  className="font-medium hover:text-primary active:shadow-[0_0_15px_hsl(210,100%,55%,0.5)] transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/auth")}
                  className="font-medium hover:text-primary active:shadow-[0_0_15px_hsl(210,100%,55%,0.5)] transition-all"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate("/join")}
                  className="gradient-primary text-primary-foreground border-0 rounded-full px-6 active:shadow-[0_0_20px_hsl(210,100%,55%,0.6)] transition-all"
                >
                  Join FoundrX
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                link.href.startsWith("/") && !link.href.includes("#") ? (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-sm font-medium text-muted-foreground hover:text-primary active:text-primary active:drop-shadow-[0_0_8px_hsl(210,100%,55%)] transition-all py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground hover:text-primary active:text-primary active:drop-shadow-[0_0_8px_hsl(210,100%,55%)] transition-all py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </a>
                )
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {user ? (
                  <>
                    <Button variant="ghost" onClick={() => { navigate("/notifications"); setIsOpen(false); }} className="justify-start relative">
                      <Bell className="w-4 h-4 mr-2" />
                      Notifications
                      {unreadCount > 0 && (
                        <Badge className="ml-2 gradient-primary">{unreadCount}</Badge>
                      )}
                    </Button>
                    <Button variant="ghost" onClick={() => { navigate("/collaborations"); setIsOpen(false); }} className="justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      Collaborations
                    </Button>
                    <Button variant="ghost" onClick={() => { navigate("/messages"); setIsOpen(false); }} className="justify-start">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Messages
                    </Button>
                    <Button variant="ghost" onClick={() => { navigate("/profile"); setIsOpen(false); }} className="justify-start">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                    <Button onClick={() => { navigate("/apply"); setIsOpen(false); }} className="gradient-primary text-primary-foreground border-0 rounded-full">
                      Apply Now
                    </Button>
                    <Button variant="ghost" onClick={signOut} className="justify-start">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" onClick={() => { navigate("/auth"); setIsOpen(false); }} className="justify-start">
                      Sign In
                    </Button>
                    <Button onClick={() => { navigate("/join"); setIsOpen(false); }} className="gradient-primary text-primary-foreground border-0 rounded-full">
                      Join FoundrX
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
