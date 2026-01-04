import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, LogOut, User, Bell, Users, MessageCircle, LayoutDashboard, Settings, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import foundrxLogo from "@/assets/foundrx-logo.jpeg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profile, setProfile] = useState<{ full_name: string | null; avatar_url: string | null } | null>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      fetchProfile();
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

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("user_id", user.id)
      .maybeSingle();
    setProfile(data);
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const navLinks = [
    { href: "/ideas", label: "Ideas" },
    { href: "/#workshops", label: "Workshops" },
    { href: "/about", label: "About" },
    { href: "/team", label: "Team" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img 
              src={foundrxLogo} 
              alt="FoundrX Logo" 
              className="w-10 h-10 rounded-lg object-cover"
            />
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
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Button 
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/notifications")}
                  className="relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs gradient-primary">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
                <Button 
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/messages")}
                >
                  <MessageCircle className="w-5 h-5" />
                </Button>
                
                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={profile?.avatar_url || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{profile?.full_name || "User"}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/collaborations")}>
                      <Users className="w-4 h-4 mr-2" />
                      Collaborations
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/apply")}>
                      <Settings className="w-4 h-4 mr-2" />
                      Apply Now
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/auth")}
                  className="font-medium hover:text-primary"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate("/join")}
                  className="gradient-primary text-primary-foreground border-0 rounded-full px-6"
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
                    className="text-sm font-medium text-muted-foreground hover:text-primary py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground hover:text-primary py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </a>
                )
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-2 py-2 mb-2">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={profile?.avatar_url || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{profile?.full_name || "User"}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Button variant="ghost" onClick={() => { navigate("/dashboard"); setIsOpen(false); }} className="justify-start">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
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
                    <Button variant="ghost" onClick={signOut} className="justify-start text-destructive hover:text-destructive">
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