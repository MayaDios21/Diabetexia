import { useState } from 'react';
import { Info, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { SubstitutionSheet } from './SubstitutionSheet';
import { Meal } from '../utils/mealGenerator';

interface UserProfile {
  hasHypertension: boolean;
  dietType: 'omnivore' | 'vegetarian';
  allergies: string[];
  mainGoal: 'glucose' | 'weight-loss';
  dailyCarbsGoal: number;
}

interface MealCardProps {
  meal: Meal;
  userProfile: UserProfile;
  onUpdate: (meal: Meal) => void;
}

export function MealCard({ meal, userProfile, onUpdate }: MealCardProps) {
  const [showReasons, setShowReasons] = useState(false);
  const [showSubstitution, setShowSubstitution] = useState(false);

  const getMealIcon = (type: string) => {
    switch (type) {
      case 'breakfast':
        return '🌅';
      case 'lunch':
        return '☀️';
      case 'dinner':
        return '🌙';
      default:
        return '🍽️';
    }
  };

  const getMealName = (type: string) => {
    switch (type) {
      case 'breakfast':
        return 'Desayuno';
      case 'lunch':
        return 'Comida';
      case 'dinner':
        return 'Cena';
      default:
        return 'Comida';
    }
  };

  const handlePortionChange = (newPortion: number) => {
    const multiplier = newPortion / 100;
    const updatedMeal: Meal = {
      ...meal,
      portion: newPortion,
      carbs: Math.round(meal.baseCarbs * multiplier),
    };
    onUpdate(updatedMeal);
  };

  const handleSubstitute = (newMeal: Meal) => {
    onUpdate(newMeal);
    setShowSubstitution(false);
  };

  return (
    <>
      <Card className="overflow-hidden">
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">{getMealIcon(meal.type)}</span>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">{getMealName(meal.type)}</p>
                <h3>{meal.name}</h3>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSubstitution(true)}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Sustituir
            </Button>
          </div>

          {/* Portions & Carbs */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-muted-foreground mb-1">Porción</p>
              <p>{meal.portions}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-muted-foreground mb-1">Carbohidratos</p>
              <div className="flex items-baseline gap-1">
                <span className="text-primary">{meal.carbs}g</span>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {meal.lowGlycemic && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                Bajo índice glucémico
              </Badge>
            )}
            {meal.lowSodium && userProfile.hasHypertension && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                Bajo en sodio
              </Badge>
            )}
            {meal.highFiber && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
                Alto en fibra
              </Badge>
            )}
          </div>

          {/* Portion Adjuster */}
          <div className="border-t pt-4 mb-4">
            <p className="mb-3 text-muted-foreground">Ajustar porción</p>
            <div className="grid grid-cols-3 gap-2">
              {[50, 75, 100].map((portion) => (
                <button
                  key={portion}
                  onClick={() => handlePortionChange(portion)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    meal.portion === portion
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="mb-1">{portion}%</div>
                  <div className="text-muted-foreground">
                    {Math.round(meal.baseCarbs * (portion / 100))}g
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Reasons */}
          <button
            onClick={() => setShowReasons(!showReasons)}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              <span>¿Por qué este platillo?</span>
            </div>
            {showReasons ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          {showReasons && (
            <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <ul className="space-y-2">
                {meal.reasons.map((reason, index) => (
                  <li key={index} className="flex items-start gap-2 text-blue-900">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>

      {showSubstitution && (
        <SubstitutionSheet
          meal={meal}
          userProfile={userProfile}
          onSubstitute={handleSubstitute}
          onClose={() => setShowSubstitution(false)}
        />
      )}
    </>
  );
}
