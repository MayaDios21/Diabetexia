import { useState, useEffect } from 'react';
import { Calendar, User, TrendingDown, TrendingUp, Printer } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { MealCard } from './MealCard';
import { ProfileModal } from './ProfileModal';
import { generateDailyMeals, Meal } from '../utils/mealGenerator';
import logo from 'figma:asset/f80e4d54fed4d5464fb9e70ac865852663d91f1e.png';

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

  const handlePrint = () => {
    // Create a printable version of the meal plan
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Plan Alimenticio - ${formatDate(selectedDate)}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px 20px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 2px solid #4F46E5;
              padding-bottom: 20px;
            }
            h1 {
              color: #4F46E5;
              margin: 10px 0;
              font-size: 28px;
            }
            .date {
              color: #666;
              font-size: 16px;
              text-transform: capitalize;
            }
            .summary {
              background: #F0F9FF;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
              border: 1px solid #BAE6FD;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
            }
            .summary-label {
              color: #666;
            }
            .summary-value {
              font-weight: 600;
              color: #4F46E5;
            }
            .meal {
              margin-bottom: 30px;
              page-break-inside: avoid;
              border: 1px solid #E5E7EB;
              border-radius: 8px;
              padding: 20px;
            }
            .meal-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 15px;
              border-bottom: 1px solid #E5E7EB;
              padding-bottom: 10px;
            }
            .meal-type {
              font-size: 20px;
              font-weight: 600;
              color: #1F2937;
            }
            .meal-carbs {
              background: #4F46E5;
              color: white;
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 14px;
            }
            .meal-name {
              font-size: 18px;
              color: #4F46E5;
              margin-bottom: 10px;
              font-weight: 500;
            }
            .meal-reason {
              color: #666;
              line-height: 1.6;
              margin-bottom: 15px;
            }
            .meal-foods {
              margin-top: 10px;
            }
            .meal-foods-title {
              font-weight: 600;
              margin-bottom: 8px;
              color: #374151;
            }
            .meal-foods ul {
              margin: 0;
              padding-left: 20px;
              color: #666;
            }
            .meal-foods li {
              margin-bottom: 4px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #E5E7EB;
              text-align: center;
              color: #666;
              font-size: 14px;
            }
            @media print {
              body {
                padding: 20px;
              }
              .meal {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Plan Alimenticio DiabetEX</h1>
            <p class="date">${formatDate(selectedDate)}</p>
          </div>

          <div class="summary">
            <div class="summary-row">
              <span class="summary-label">Carbohidratos totales del día:</span>
              <span class="summary-value">${Math.round(totalCarbs)}g / ${userProfile.dailyCarbsGoal}g</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Meta principal:</span>
              <span class="summary-value">${userProfile.mainGoal === 'glucose' ? 'Controlar glucosa' : 'Bajar de peso'}</span>
            </div>
            ${userProfile.hasHypertension ? `
            <div class="summary-row">
              <span class="summary-label">Consideraciones:</span>
              <span class="summary-value">Plan bajo en sodio (hipertensión)</span>
            </div>
            ` : ''}
            ${userProfile.allergies.length > 0 ? `
            <div class="summary-row">
              <span class="summary-label">Alergias:</span>
              <span class="summary-value">${userProfile.allergies.join(', ')}</span>
            </div>
            ` : ''}
          </div>

          ${meals.map(meal => `
            <div class="meal">
              <div class="meal-header">
                <span class="meal-type">${meal.type}</span>
                <span class="meal-carbs">${meal.carbs}g carbohidratos</span>
              </div>
              <div class="meal-name">${meal.name}</div>
              <div class="meal-reason">${meal.reason}</div>
              <div class="meal-foods">
                <div class="meal-foods-title">Alimentos incluidos:</div>
                <ul>
                  ${meal.foods.map(food => `<li>${food}</li>`).join('')}
                </ul>
              </div>
            </div>
          `).join('')}

          <div class="footer">
            <p><strong>DiabetEX</strong> - Apoyo para Diabetes Tipo 2</p>
            <p style="margin-top: 10px; font-size: 12px;">Este plan es informativo. Consulta con tu médico antes de hacer cambios en tu dieta.</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <img src={logo} alt="DiabetEX" className="h-10" />
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm"
                className="gap-2"
                onClick={handlePrint}
              >
                <Printer className="w-4 h-4" />
                Imprimir
              </Button>
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