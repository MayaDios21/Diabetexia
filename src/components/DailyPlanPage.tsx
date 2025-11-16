import { useState, useEffect } from 'react';
import { Calendar, User, TrendingDown, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { MealCard } from './MealCard';
import { ProfileModal } from './ProfileModal';
import { generateDailyMeals, Meal } from '../utils/mealGenerator';

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

interface DailyPlanPageProps {
  userProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export function DailyPlanPage({ userProfile, onUpdateProfile }: DailyPlanPageProps) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    // Load meals from localStorage or generate new ones
    const savedMeals = localStorage.getItem('dailyMeals');
    const savedDate = localStorage.getItem('dailyMealsDate');
    const today = new Date().toDateString();

    if (savedMeals && savedDate === today) {
      setMeals(JSON.parse(savedMeals));
    } else {
      const generatedMeals = generateDailyMeals(userProfile);
      setMeals(generatedMeals);
      localStorage.setItem('dailyMeals', JSON.stringify(generatedMeals));
      localStorage.setItem('dailyMealsDate', today);
    }
  }, [userProfile]);

  const handleMealUpdate = (mealId: string, updatedMeal: Meal) => {
    const updatedMeals = meals.map(m => m.id === mealId ? updatedMeal : m);
    setMeals(updatedMeals);
    localStorage.setItem('dailyMeals', JSON.stringify(updatedMeals));
  };

  const handleProfileUpdate = (updates: Partial<UserProfile>) => {
    onUpdateProfile(updates);
    // Regenerate meals if diet preferences changed
    if (updates.dietType || updates.hasHypertension !== undefined || updates.dailyCarbsGoal) {
      const newProfile = { ...userProfile, ...updates };
      const generatedMeals = generateDailyMeals(newProfile as UserProfile);
      setMeals(generatedMeals);
      localStorage.setItem('dailyMeals', JSON.stringify(generatedMeals));
    }
  };

  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const carbsPercentage = (totalCarbs / userProfile.dailyCarbsGoal) * 100;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-white">NutriControl</h1>
            <Button 
              variant="secondary" 
              size="sm"
              className="gap-2"
              onClick={() => setShowProfile(true)}
            >
              <User className="w-4 h-4" />
              Perfil
            </Button>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <Calendar className="w-5 h-5" />
            <span className="capitalize">{formatDate(selectedDate)}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-4">
        {/* Daily Summary Card */}
        <Card className="p-6 mb-6 shadow-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground mb-1">Carbohidratos del día</p>
              <div className="flex items-baseline gap-2">
                <span className="text-primary">{Math.round(totalCarbs)}g</span>
                <span className="text-muted-foreground">/ {userProfile.dailyCarbsGoal}g</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    carbsPercentage > 100 ? 'bg-red-500' : 'bg-primary'
                  }`}
                  style={{ width: `${Math.min(carbsPercentage, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Meta principal</p>
              <div className="flex items-center gap-2">
                {userProfile.mainGoal === 'glucose' ? (
                  <>
                    <TrendingDown className="w-5 h-5 text-blue-600" />
                    <span>Controlar glucosa</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span>Bajar de peso</span>
                  </>
                )}
              </div>
              {userProfile.hasHypertension && (
                <Badge variant="outline" className="mt-2">
                  Con hipertensión
                </Badge>
              )}
            </div>
          </div>
        </Card>

        {/* Meals */}
        <div className="space-y-6">
          <div>
            <h2 className="mb-4">Tus comidas de hoy</h2>
            <div className="space-y-4">
              {meals.map((meal) => (
                <MealCard 
                  key={meal.id}
                  meal={meal}
                  userProfile={userProfile}
                  onUpdate={(updatedMeal) => handleMealUpdate(meal.id, updatedMeal)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Tips */}
        <Card className="p-6 mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <h3 className="mb-3 text-blue-900">💡 Consejo del día</h3>
          <p className="text-blue-800">
            {userProfile.hasHypertension 
              ? 'Recuerda que tus platillos están seleccionados con bajo sodio para cuidar tu presión arterial.'
              : 'Mantén un horario regular de comidas para ayudar a estabilizar tus niveles de glucosa.'}
          </p>
        </Card>
      </div>

      {showProfile && (
        <ProfileModal
          userProfile={userProfile}
          onUpdate={handleProfileUpdate}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
}