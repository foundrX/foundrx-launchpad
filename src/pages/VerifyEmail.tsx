import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error" | "resend">("loading");
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      const type = searchParams.get("type");
      const emailParam = searchParams.get("email");

      if (emailParam) {
        setEmail(emailParam);
      }

      // If no token, show resend option
      if (!token || type !== "email") {
        setStatus("resend");
        return;
      }

      try {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: "email",
        });

        if (error) {
          console.error("Verification error:", error);
          setStatus("error");
        } else {
          setStatus("success");
          toast({
            title: "Email Verified!",
            description: "Your email has been successfully verified.",
          });
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
      }
    };

    verifyEmail();
  }, [searchParams, toast]);

  const handleResendVerification = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
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
        toast({
          title: "Verification Email Sent",
          description: "Please check your inbox for the verification link.",
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full gradient-primary opacity-20 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full gradient-secondary opacity-20 blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <Card className="w-full max-w-md relative z-10 border-border bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <a href="/" className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <Rocket className="w-6 h-6 text-primary-foreground" />
            </div>
          </a>
          
          {status === "loading" && (
            <>
              <CardTitle className="text-2xl font-bold">Verifying Email</CardTitle>
              <CardDescription>Please wait while we verify your email...</CardDescription>
            </>
          )}
          
          {status === "success" && (
            <>
              <CardTitle className="text-2xl font-bold text-green-500 flex items-center justify-center gap-2">
                <CheckCircle className="w-6 h-6" />
                Email Verified!
              </CardTitle>
              <CardDescription>Your email has been successfully verified.</CardDescription>
            </>
          )}
          
          {status === "error" && (
            <>
              <CardTitle className="text-2xl font-bold text-destructive flex items-center justify-center gap-2">
                <XCircle className="w-6 h-6" />
                Verification Failed
              </CardTitle>
              <CardDescription>The verification link may have expired or is invalid.</CardDescription>
            </>
          )}

          {status === "resend" && (
            <>
              <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                <Mail className="w-6 h-6" />
                Verify Your Email
              </CardTitle>
              <CardDescription>Enter your email to receive a new verification link.</CardDescription>
            </>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {status === "loading" && (
            <div className="flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
          
          {status === "success" && (
            <Button 
              onClick={() => navigate("/auth")} 
              className="w-full gradient-primary text-primary-foreground"
            >
              Continue to Sign In
            </Button>
          )}
          
          {status === "error" && (
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button 
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full gradient-primary text-primary-foreground"
              >
                {isResending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Resend Verification Email
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/auth")} 
                className="w-full"
              >
                Back to Sign In
              </Button>
            </div>
          )}

          {status === "resend" && (
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button 
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full gradient-primary text-primary-foreground"
              >
                {isResending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Send Verification Email
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/auth")} 
                className="w-full"
              >
                Back to Sign In
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;