import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { ConsentPage } from './components/ConsentPage';
import { ProfileStep1 } from './components/ProfileStep1';
import { ProfileStep2 } from './components/ProfileStep2';
import { DailyPlanPage } from './components/DailyPlanPage';

type AppFlow = 'login' | 'consent' | 'profile-step1' | 'profile-step2' | 'daily-plan';

interface UserProfile {
  email: string;
  hasDiabetesT2: boolean;
  hasHypertension: boolean;
  dietType: 'omnivore' | 'vegetarian';
  allergies: string[];
  weight: number;
  height: number;
  bmi: number;
  mainGoal: 'glucose' | 'weight-loss';
  dailyCarbsGoal: number;
}

export default function App() {
  const [currentStep, setCurrentStep] = useState<AppFlow>('login');
  const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user has already logged in and accepted consent
    const savedProfile = localStorage.getItem('userProfile');
    const hasConsented = localStorage.getItem('hasConsented');
    
    if (savedProfile && hasConsented === 'true') {
      setUserProfile(JSON.parse(savedProfile));
      setIsAuthenticated(true);
      setCurrentStep('daily-plan');
    } else if (hasConsented === 'true') {
      setIsAuthenticated(true);
      setCurrentStep('profile-step1');
    } else if (localStorage.getItem('userEmail')) {
      setIsAuthenticated(true);
      setCurrentStep('consent');
    }
  }, []);

  const handleLogin = (email: string) => {
    localStorage.setItem('userEmail', email);
    setUserProfile({ ...userProfile, email });
    setIsAuthenticated(true);
    setCurrentStep('consent');
  };

  const handleConsent = () => {
    localStorage.setItem('hasConsented', 'true');
    setCurrentStep('profile-step1');
  };

  const handleProfileStep1 = (data: Partial<UserProfile>) => {
    setUserProfile({ ...userProfile, ...data });
    setCurrentStep('profile-step2');
  };

  const handleProfileStep2 = (data: Partial<UserProfile>) => {
    const completeProfile = { ...userProfile, ...data } as UserProfile;
    setUserProfile(completeProfile);
    localStorage.setItem('userProfile', JSON.stringify(completeProfile));
    setCurrentStep('daily-plan');
  };

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    const updatedProfile = { ...userProfile, ...updates } as UserProfile;
    setUserProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {currentStep === 'login' && <LoginPage onLogin={handleLogin} />}
      {currentStep === 'consent' && <ConsentPage onAccept={handleConsent} />}
      {currentStep === 'profile-step1' && <ProfileStep1 onNext={handleProfileStep1} />}
      {currentStep === 'profile-step2' && (
        <ProfileStep2 
          onNext={handleProfileStep2} 
          onBack={() => setCurrentStep('profile-step1')}
        />
      )}
      {currentStep === 'daily-plan' && (
        <DailyPlanPage 
          userProfile={userProfile as UserProfile}
          onUpdateProfile={handleUpdateProfile}
        />
      )}
    </div>
  );
}
