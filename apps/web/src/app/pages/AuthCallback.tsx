import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export function AuthCallback() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (error) {
        console.error('Auth error:', error, errorDescription);
        toast.error(errorDescription || 'Authentication failed');
        navigate('/login');
        return;
      }

      if (code) {
        try {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
          // Session established, AuthContext will update via onAuthStateChange
        } catch (err: any) {
          console.error('Code exchange error:', err);
          toast.error(err.message || 'Failed to verify email');
          navigate('/login');
          return;
        }
      }

      // Allow some time for the session to propagate if we just exchanged code
      // or if Supabase is processing the hash
      setTimeout(() => {
        setIsProcessing(false);
      }, 1000);
    };

    handleCallback();
  }, [location, navigate]);

  useEffect(() => {
    if (!isProcessing && !isAuthLoading) {
      if (user) {
        // User is verified and logged in
        navigate("/onboarding/welcome");
      } else {
        // If we've finished processing and checking auth, and still no user
        // But double check we aren't just waiting for the state update
        navigate("/login");
      }
    }
  }, [user, isProcessing, isAuthLoading, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-purple-50/30 to-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <h2 className="text-xl font-semibold text-gray-700">Verifying your email...</h2>
        <p className="text-muted-foreground">Please wait while we log you in.</p>
      </div>
    </div>
  );
}
