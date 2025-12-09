import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Logo } from './Logo';
import { RefreshCw, Replace, User, Scale, Apple } from 'lucide-react';
import { MealRecommendation as MealType, MealComponent } from '../types';
import { SubstitutionModal } from './SubstitutionModal';
import { UserProfile } from '../types';

interface MealRecommendationProps {
  meal: MealType;
  profile: UserProfile;
  onRegenerate: () => void;
  onSubstitute: (type: 'protein' | 'carbohydrate' | 'vegetable', newComponent: MealComponent) => void;
  onViewProfile: () => void;
}

export function MealRecommendation({ meal, profile, onRegenerate, onSubstitute, onViewProfile }: MealRecommendationProps) {
  const [substituteModalOpen, setSubstituteModalOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<'protein' | 'carbohydrate' | 'vegetable' | null>(null);
  
  const handlePortionChange = (type: 'protein' | 'carbohydrate' | 'vegetable', multiplier: 0.5 | 0.75 | 1) => {
    const component = meal[type];
    const updated = { ...component, portionMultiplier: multiplier };
    onSubstitute(type, updated);
  };
  
  const openSubstituteModal = (type: 'protein' | 'carbohydrate' | 'vegetable') => {
    setSelectedComponent(type);
    setSubstituteModalOpen(true);
  };
  
  const handleSubstituteApply = (newComponent: MealComponent) => {
    if (selectedComponent) {
      onSubstitute(selectedComponent, newComponent);
    }
    setSubstituteModalOpen(false);
  };
  
  const getTotalCarbs = () => {
    return Math.round(
      meal.protein.carbs * meal.protein.portionMultiplier +
      meal.carbohydrate.carbs * meal.carbohydrate.portionMultiplier +
      meal.vegetable.carbs * meal.vegetable.portionMultiplier
    );
  };
  
  const getTotalCalories = () => {
    return Math.round(
      meal.protein.calories * meal.protein.portionMultiplier +
      meal.carbohydrate.calories * meal.carbohydrate.portionMultiplier +
      meal.vegetable.calories * meal.vegetable.portionMultiplier
    );
  };
  
  return (
    <>
      <div className="min-h-screen p-4 pb-20">
        {/* Header */}
        <div className="max-w-2xl mx-auto pt-4 pb-6">
          <div className="flex items-center justify-between mb-6">
            <Logo size="sm" showTagline={false} />
            <Button variant="outline" size="sm" onClick={onViewProfile}>
              <User size={18} />
              Perfil
            </Button>
          </div>
          
          <h2 className="text-center mb-2">
            Tu comida recomendada de hoy
          </h2>
          <p className="text-center text-muted-foreground">
            Basada en tu perfil y objetivos
          </p>
        </div>
        
        {/* Main Meal Card */}
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="overflow-hidden p-0">
            {/* Meal Image */}
            <div className="relative h-64 bg-gradient-to-br from-primary/10 to-green-500/10">
              <img
                src="https://images.unsplash.com/photo-1762631934518-f75e233413ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZ3JpbGxlZCUyMGNoaWNrZW4lMjBtZWFsfGVufDF8fHx8MTc2NTIyMTA1OXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Comida saludable"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <h3 className="text-white">{meal.name}</h3>
              </div>
            </div>
            
            {/* Meal Info */}
            <div className="p-6 space-y-6">
              {/* Nutritional Summary */}
              <div className="flex items-center justify-around bg-muted rounded-lg p-4">
                <div className="text-center">
                  <p className="text-2xl text-primary font-semibold">{getTotalCalories()}</p>
                  <p className="text-sm text-muted-foreground">Calorías</p>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div className="text-center">
                  <p className="text-2xl text-green-600 font-semibold">{getTotalCarbs()}g</p>
                  <p className="text-sm text-muted-foreground">Carbohidratos</p>
                </div>
              </div>
              
              {/* Reasons */}
              <div>
                <p className="text-sm mb-3 text-muted-foreground">¿Por qué esta comida?</p>
                <div className="flex flex-wrap gap-2">
                  {meal.reasons.map((reason, index) => (
                    <Badge key={index} variant={index === 0 ? 'default' : 'secondary'}>
                      {reason}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Components */}
              <div className="space-y-4">
                <MealComponentCard
                  title="Proteína"
                  component={meal.protein}
                  icon={<Scale size={20} />}
                  onPortionChange={(multiplier) => handlePortionChange('protein', multiplier)}
                  onSubstitute={() => openSubstituteModal('protein')}
                />
                
                <MealComponentCard
                  title="Carbohidrato"
                  component={meal.carbohydrate}
                  icon={<Apple size={20} />}
                  onPortionChange={(multiplier) => handlePortionChange('carbohydrate', multiplier)}
                  onSubstitute={() => openSubstituteModal('carbohydrate')}
                />
                
                <MealComponentCard
                  title="Vegetal"
                  component={meal.vegetable}
                  icon={<Apple size={20} />}
                  onPortionChange={(multiplier) => handlePortionChange('vegetable', multiplier)}
                  onSubstitute={() => openSubstituteModal('vegetable')}
                />
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button onClick={onRegenerate} className="w-full" size="lg">
                  <RefreshCw size={20} />
                  Generar otra comida
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Substitution Modal */}
      {substituteModalOpen && selectedComponent && (
        <SubstitutionModal
          component={meal[selectedComponent]}
          componentType={selectedComponent}
          profile={profile}
          onClose={() => setSubstituteModalOpen(false)}
          onApply={handleSubstituteApply}
        />
      )}
    </>
  );
}

interface MealComponentCardProps {
  title: string;
  component: MealComponent;
  icon: React.ReactNode;
  onPortionChange: (multiplier: 0.5 | 0.75 | 1) => void;
  onSubstitute: () => void;
}

function MealComponentCard({ title, component, icon, onPortionChange, onSubstitute }: MealComponentCardProps) {
  const portionOptions: Array<{ value: 0.5 | 0.75 | 1; label: string }> = [
    { value: 0.5, label: '50%' },
    { value: 0.75, label: '75%' },
    { value: 1, label: '100%' }
  ];
  
  const getAdjustedPortion = () => {
    if (component.portionMultiplier === 1) return component.portion;
    const match = component.portion.match(/^(\d+\.?\d*)\s*(.*)$/);
    if (match) {
      const amount = parseFloat(match[1]) * component.portionMultiplier;
      return `${amount}${match[2]}`;
    }
    return component.portion;
  };
  
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="text-primary">{icon}</div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <h4 className="font-medium">{component.name}</h4>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onSubstitute}>
          <Replace size={16} />
        </Button>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Porción</span>
          <span>{getAdjustedPortion()}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Carbohidratos</span>
          <span className="text-primary font-medium">
            {Math.round(component.carbs * component.portionMultiplier)}g
          </span>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground mb-2">Ajustar porción</p>
          <div className="flex gap-2">
            {portionOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onPortionChange(option.value)}
                className={`flex-1 py-2 rounded-md border-2 transition-all font-medium ${
                  component.portionMultiplier === option.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-input bg-background text-muted-foreground hover:bg-accent'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
