import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, Mail, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EmailConfirmation = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);
  const { toast } = useToast();

  const handleResendVerification = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "No email address found. Please sign up again.",
        variant: "destructive",
      });
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setResent(true);
        toast({
          title: "Email Sent!",
          description: "A new verification email has been sent.",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to resend verification email.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-background">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full gradient-primary opacity-20 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full gradient-secondary opacity-20 blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <Card className="w-full max-w-md relative z-10 border-border bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <Link to="/" className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <Rocket className="w-6 h-6 text-primary-foreground" />
            </div>
          </Link>
          
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="w-10 h-10 text-primary" />
          </div>
          
          <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
          <CardDescription className="text-base mt-2">
            We've sent a verification link to
            {email && (
              <span className="block font-medium text-foreground mt-1">{email}</span>
            )}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm text-muted-foreground text-center">
              Click the link in the email to verify your account and complete your registration.
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Don't see it? Check your spam folder.
            </p>
          </div>

          <div className="space-y-3">
            {resent ? (
              <div className="flex items-center justify-center gap-2 text-green-600 py-2">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Verification email sent!</span>
              </div>
            ) : (
              <Button 
                onClick={handleResendVerification}
                disabled={isResending || !email}
                variant="outline"
                className="w-full"
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  "Resend Verification Email"
                )}
              </Button>
            )}
            
            <Link to="/auth" className="block">
              <Button 
                variant="ghost" 
                className="w-full text-muted-foreground hover:text-foreground"
              >
                Back to Sign In
              </Button>
            </Link>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Wrong email?{" "}
            <Link to="/join" className="text-primary hover:underline">
              Sign up again
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailConfirmation;
