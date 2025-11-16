import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Meal, generateSubstitutions } from '../utils/mealGenerator';

interface UserProfile {
  hasHypertension: boolean;
  dietType: 'omnivore' | 'vegetarian';
  allergies: string[];
  mainGoal: 'glucose' | 'weight-loss';
  dailyCarbsGoal: number;
}

interface SubstitutionSheetProps {
  meal: Meal;
  userProfile: UserProfile;
  onSubstitute: (meal: Meal) => void;
  onClose: () => void;
}

export function SubstitutionSheet({ meal, userProfile, onSubstitute, onClose }: SubstitutionSheetProps) {
  const substitutions = generateSubstitutions(meal, userProfile);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center sm:justify-center">
      <div 
        className="w-full sm:max-w-2xl bg-background rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="mb-1">Opciones de sustitución</h2>
            <p className="text-muted-foreground">
              Elige una alternativa compatible con tu perfil
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {substitutions.map((substitution, index) => (
              <Card 
                key={index}
                className="p-5 hover:border-primary transition-colors cursor-pointer"
                onClick={() => onSubstitute(substitution)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="mb-1">{substitution.name}</h3>
                    <p className="text-muted-foreground">{substitution.portions}</p>
                  </div>
                  <Badge variant="outline" className="text-primary">
                    {substitution.carbs}g carbs
                  </Badge>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {substitution.lowGlycemic && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                      Bajo índice glucémico
                    </Badge>
                  )}
                  {substitution.lowSodium && userProfile.hasHypertension && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                      Bajo en sodio
                    </Badge>
                  )}
                  {substitution.highFiber && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
                      Alto en fibra
                    </Badge>
                  )}
                </div>

                {/* Reasons */}
                <div className="bg-secondary/30 rounded-lg p-3">
                  <p className="text-muted-foreground mb-2">Por qué esta opción:</p>
                  <ul className="space-y-1">
                    {substitution.reasons.slice(0, 2).map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t">
          <Button variant="outline" onClick={onClose} className="w-full">
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
