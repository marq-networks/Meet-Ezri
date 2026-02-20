import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  hasRole: (role: string | string[]) => boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hasRole = (role: string | string[]) => {
    if (!profile?.role) return false;
    if (Array.isArray(role)) {
      return role.includes(profile.role);
    }
    return profile.role === role;
  };

  const applyAppearanceForUser = (targetUser: User | null) => {
    try {
      if (typeof window === "undefined" || typeof document === "undefined") return;
      const root = document.documentElement;

      if (!targetUser?.id) {
        root.classList.add("dark");
        root.style.setProperty("--accent", "#ec4899");
        window.dispatchEvent(
          new CustomEvent("ezri-appearance-change", {
            detail: {
              backgroundStyle: "gradient",
              compactMode: false
            }
          })
        );
        return;
      }

      const storageKey = `ezri_appearance_settings_${targetUser.id}`;
      const saved = window.localStorage.getItem(storageKey);

      let theme: string = "dark";
      let accentKey: string = "pink";
      let backgroundStyle: string = "gradient";
      let compactMode = false;

      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.theme) theme = parsed.theme;
          if (parsed.accentColor) accentKey = parsed.accentColor;
          if (parsed.backgroundStyle) backgroundStyle = parsed.backgroundStyle;
          if (typeof parsed.compactMode === "boolean") compactMode = parsed.compactMode;
        } catch {
        }
      }

      if (theme === "auto") {
        if (typeof window !== "undefined" && window.matchMedia) {
          const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
          if (mediaQuery.matches) {
            root.classList.add("dark");
          } else {
            root.classList.remove("dark");
          }
        } else {
          root.classList.remove("dark");
        }
      } else if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }

      const accentMap: Record<string, string> = {
        blue: "#3b82f6",
        purple: "#a855f7",
        pink: "#ec4899",
        green: "#22c55e",
        orange: "#f97316",
        teal: "#14b8a6"
      };

      const accent = accentMap[accentKey] || accentMap.pink;
      root.style.setProperty("--accent", accent);

      window.dispatchEvent(
        new CustomEvent("ezri-appearance-change", {
          detail: {
            backgroundStyle,
            compactMode
          }
        })
      );
    } catch (error) {
      console.error("Failed to apply appearance settings:", error);
    }
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // User is authenticated, clear any error hash
        if (window.location.hash && window.location.hash.includes('error=')) {
          window.history.replaceState(null, '', window.location.pathname);
        }
        applyAppearanceForUser(session.user);
        fetchProfile();
      } else {
        // No session, check for errors in URL
        handleAuthErrors();
        setIsLoading(false);
      }
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        applyAppearanceForUser(session.user);
        fetchProfile();
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthErrors = () => {
    const hash = window.location.hash;
    if (hash && hash.includes('error=')) {
      const params = new URLSearchParams(hash.substring(1));
      const error = params.get('error');
      const errorCode = params.get('error_code');
      const errorDescription = params.get('error_description');

      if (error) {
        console.error('Auth Error:', error, errorDescription);
        
        if (errorCode === 'otp_expired') {
          toast.error('Email verification link has expired', {
            description: 'Please request a new verification link from the login page.',
            duration: 8000,
            action: {
              label: 'Go to Login',
              onClick: () => window.location.href = '/login'
            }
          });
        } else {
          toast.error('Authentication Error', {
            description: errorDescription?.replace(/\+/g, ' ') || 'An error occurred during authentication.',
            duration: 5000,
          });
        }
        
        // Clear the hash to prevent repeated errors
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  };

  const fetchProfile = async () => {
    try {
      const data = await api.getMe();
      setProfile(data);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      if (error.message === 'Profile not found') {
        try {
          // Attempt to initialize profile if it doesn't exist
          const newProfile = await api.initProfile();
          setProfile(newProfile);
        } catch (initError) {
          console.error('Failed to initialize profile:', initError);
          // Do not sign out here. Allow the user to proceed to onboarding
          // where the profile can be created via completeOnboarding.
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setUser(null);
    setSession(null);
  };

  const value = {
    user,
    session,
    profile,
    isLoading,
    signOut,
    hasRole,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
