import React, { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { ProfileStep1 } from './components/ProfileStep1';
import { ProfileStep2 } from './components/ProfileStep2';
import { MealRecommendation } from './components/MealRecommendation';
import { ProfileView } from './components/ProfileView';
import { UserProfile, MealRecommendation as MealType, MealComponent } from './types';
import { generateMealRecommendation } from './utils/mealGenerator';

type Screen = 'onboarding' | 'profile-step1' | 'profile-step2' | 'meal';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileStep1Data, setProfileStep1Data] = useState<any>(null);
  const [currentMeal, setCurrentMeal] = useState<MealType | null>(null);
  const [showProfileView, setShowProfileView] = useState(false);
  
  // Load profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('diabetex-profile');
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setProfile(parsedProfile);
      setCurrentScreen('meal');
      
      // Generate initial meal
      const meal = generateMealRecommendation(parsedProfile);
      setCurrentMeal(meal);
    }
  }, []);
  
  // Save profile to localStorage whenever it changes
  useEffect(() => {
    if (profile) {
      localStorage.setItem('diabetex-profile', JSON.stringify(profile));
    }
  }, [profile]);
  
  const handleOnboardingStart = () => {
    setCurrentScreen('profile-step1');
  };
  
  const handleProfileStep1Next = (data: any) => {
    setProfileStep1Data(data);
    setCurrentScreen('profile-step2');
  };
  
  const handleProfileStep2Complete = (data: any) => {
    const completeProfile: UserProfile = {
      age: Number(profileStep1Data.age),
      weight: Number(profileStep1Data.weight),
      height: Number(profileStep1Data.height),
      bmi: Number(((Number(profileStep1Data.weight) / ((Number(profileStep1Data.height) / 100) ** 2))).toFixed(1)),
      recentGlucose: Number(profileStep1Data.recentGlucose),
      hba1c: Number(profileStep1Data.hba1c),
      season: profileStep1Data.season,
      experienceLevel: profileStep1Data.experienceLevel,
      primaryGoal: data.primaryGoal,
      allergies: data.allergies,
      dietType: data.dietType,
      hasHypertension: data.hasHypertension
    };
    
    setProfile(completeProfile);
    
    // Generate first meal
    const meal = generateMealRecommendation(completeProfile);
    setCurrentMeal(meal);
    
    setCurrentScreen('meal');
  };
  
  const handleRegenerateMeal = () => {
    if (profile) {
      const meal = generateMealRecommendation(profile);
      setCurrentMeal(meal);
    }
  };
  
  const handleSubstitute = (type: 'protein' | 'carbohydrate' | 'vegetable', newComponent: MealComponent) => {
    if (currentMeal) {
      const updatedMeal = {
        ...currentMeal,
        [type]: newComponent
      };
      
      // Recalculate totals
      updatedMeal.totalCarbs = Math.round(
        updatedMeal.protein.carbs * updatedMeal.protein.portionMultiplier +
        updatedMeal.carbohydrate.carbs * updatedMeal.carbohydrate.portionMultiplier +
        updatedMeal.vegetable.carbs * updatedMeal.vegetable.portionMultiplier
      );
      
      updatedMeal.totalCalories = Math.round(
        updatedMeal.protein.calories * updatedMeal.protein.portionMultiplier +
        updatedMeal.carbohydrate.calories * updatedMeal.carbohydrate.portionMultiplier +
        updatedMeal.vegetable.calories * updatedMeal.vegetable.portionMultiplier
      );
      
      setCurrentMeal(updatedMeal);
    }
  };
  
  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    
    // Regenerate meal with updated profile
    const meal = generateMealRecommendation(updatedProfile);
    setCurrentMeal(meal);
    
    setShowProfileView(false);
  };
  
  return (
    <div className="min-h-screen">
      {currentScreen === 'onboarding' && (
        <Onboarding onStart={handleOnboardingStart} />
      )}
      
      {currentScreen === 'profile-step1' && (
        <ProfileStep1 onNext={handleProfileStep1Next} />
      )}
      
      {currentScreen === 'profile-step2' && (
        <ProfileStep2
          onComplete={handleProfileStep2Complete}
          onBack={() => setCurrentScreen('profile-step1')}
        />
      )}
      
      {currentScreen === 'meal' && profile && currentMeal && (
        <>
          <MealRecommendation
            meal={currentMeal}
            profile={profile}
            onRegenerate={handleRegenerateMeal}
            onSubstitute={handleSubstitute}
            onViewProfile={() => setShowProfileView(true)}
          />
          
          {showProfileView && (
            <ProfileView
              profile={profile}
              onClose={() => setShowProfileView(false)}
              onUpdate={handleProfileUpdate}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
