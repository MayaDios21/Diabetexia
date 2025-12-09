import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { X, Check } from 'lucide-react';
import { MealComponent, Substitute, UserProfile } from '../types';
import { generateSubstitutes } from '../utils/mealGenerator';

interface SubstitutionModalProps {
  component: MealComponent;
  componentType: 'protein' | 'carbohydrate' | 'vegetable';
  profile: UserProfile;
  onClose: () => void;
  onApply: (newComponent: MealComponent) => void;
}

export function SubstitutionModal({ component, componentType, profile, onClose, onApply }: SubstitutionModalProps) {
  const [substitutes, setSubstitutes] = useState<Substitute[]>([]);
  const [selected, setSelected] = useState<Substitute | null>(null);
  
  useEffect(() => {
    const subs = generateSubstitutes(component, profile, componentType);
    setSubstitutes(subs);
  }, [component, componentType, profile]);
  
  const handleApply = () => {
    if (selected) {
      const newComponent: MealComponent = {
        name: selected.name,
        portion: selected.portion,
        calories: selected.calories,
        carbs: selected.carbs,
        protein: selected.protein,
        fat: selected.fat,
        portionMultiplier: component.portionMultiplier
      };
      onApply(newComponent);
    }
  };
  
  const getTypeName = () => {
    switch (componentType) {
      case 'protein': return 'proteína';
      case 'carbohydrate': return 'carbohidrato';
      case 'vegetable': return 'vegetal';
    }
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Sustituir {getTypeName()}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Actual: {component.name}
          </p>
        </DialogHeader>
        
        {/* Substitutes List */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {substitutes.map((substitute, index) => (
            <SubstituteCard
              key={index}
              substitute={substitute}
              selected={selected?.name === substitute.name}
              onClick={() => setSelected(substitute)}
            />
          ))}
        </div>
        
        {/* Footer */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button 
            onClick={handleApply} 
            disabled={!selected}
            className="flex-1"
          >
            <Check size={20} />
            Aplicar sustituto
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface SubstituteCardProps {
  substitute: Substitute;
  selected: boolean;
  onClick: () => void;
}

function SubstituteCard({ substitute, selected, onClick }: SubstituteCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
        selected
          ? 'border-primary bg-primary/10'
          : 'border-input bg-card hover:bg-accent/50'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-medium">{substitute.name}</h4>
          <p className="text-sm text-muted-foreground">{substitute.portion}</p>
        </div>
        {selected && (
          <div className="bg-primary rounded-full p-1">
            <Check size={16} className="text-primary-foreground" />
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Calorías: </span>
          <span>{substitute.calories}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Carbs: </span>
          <span className="text-primary font-medium">{substitute.carbs}g</span>
        </div>
        <div>
          <span className="text-muted-foreground">Proteína: </span>
          <span className="text-green-600 font-medium">{substitute.protein}g</span>
        </div>
      </div>
      
      <div className="mt-2">
        <span className="inline-block px-2 py-1 rounded-full bg-green-500/10 text-green-700 text-xs">
          {substitute.reason}
        </span>
      </div>
    </button>
  );
}
