import React, { createContext, useContext, useState } from 'react';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface OnboardingData {
  firstName: string;
  lastName: string;
  pronouns: string;
  role: 'user' | 'therapist';
  age?: string;
  timezone?: string;
  currentMood?: string;
  selectedGoals?: string[];
  inTherapy?: string;
  onMedication?: string;
  selectedTriggers?: string[];
  selectedAvatar?: string;
  selectedEnvironment?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  permissions?: Record<string, any>;
  notificationPreferences?: Record<string, any>;
  [key: string]: any;
}

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  completeOnboarding: (redirectPath?: string) => Promise<void>;
  isLoading: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const STORAGE_KEY = 'ezri_onboarding_data';

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [data, setData] = useState<OnboardingData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load onboarding data:', error);
    }
    return {
      firstName: '',
      lastName: '',
      pronouns: '',
      role: 'user',
    };
  });
  const [isLoading, setIsLoading] = useState(false);

  // Save to localStorage whenever data changes
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
    }
  }, [data]);

  const updateData = (newData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const completeOnboarding = async (redirectPath = '/app/dashboard') => {
    setIsLoading(true);
    try {
      await api.completeOnboarding({
        full_name: `${data.firstName} ${data.lastName}`.trim(),
        role: data.role,
        pronouns: data.pronouns,
        age: data.age,
        timezone: data.timezone,
        current_mood: data.currentMood,
        selected_goals: data.selectedGoals,
        in_therapy: data.inTherapy,
        on_medication: data.onMedication,
        selected_triggers: data.selectedTriggers,
        selected_avatar: data.selectedAvatar,
        selected_environment: data.selectedEnvironment,
        avatar_url: data.avatar_url,
        emergency_contact_name: data.emergencyContactName,
        emergency_contact_phone: data.emergencyContactPhone,
        emergency_contact_relationship: data.emergencyContactRelationship,
        permissions: data.permissions,
        notification_preferences: data.notificationPreferences,
      });
      
      // Clear storage on success
      localStorage.removeItem(STORAGE_KEY);
      
      toast.success("Onboarding completed!");
      // Force reload to ensure AuthContext fetches the new profile
      window.location.href = redirectPath;
    } catch (error: any) {
      toast.error(error.message || "Failed to complete onboarding");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OnboardingContext.Provider value={{ data, updateData, completeOnboarding, isLoading }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
