import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Logo } from './Logo';
import { Target, AlertCircle, Leaf, ChevronLeft } from 'lucide-react';

interface ProfileStep2Data {
  primaryGoal: 'glucose-control' | 'weight-loss';
  allergies: string[];
  dietType: 'omnivore' | 'vegetarian';
  hasHypertension: boolean;
}

interface ProfileStep2Props {
  onComplete: (data: ProfileStep2Data) => void;
  onBack: () => void;
  initialData?: ProfileStep2Data;
}

const commonAllergies = [
  'Ninguna',
  'Mariscos',
  'Frutos secos',
  'Lácteos',
  'Gluten',
  'Soya',
  'Huevo'
];

export function ProfileStep2({ onComplete, onBack, initialData }: ProfileStep2Props) {
  const [formData, setFormData] = useState<ProfileStep2Data>(initialData || {
    primaryGoal: 'glucose-control',
    allergies: [],
    dietType: 'omnivore',
    hasHypertension: false
  });
  
  const handleAllergyToggle = (allergy: string) => {
    if (allergy === 'Ninguna') {
      setFormData({ ...formData, allergies: [] });
      return;
    }
    
    const newAllergies = formData.allergies.includes(allergy)
      ? formData.allergies.filter(a => a !== allergy)
      : [...formData.allergies, allergy];
    
    setFormData({ ...formData, allergies: newAllergies });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-8">
        <div className="mb-6 text-center">
          <Logo size="md" showTagline={false} />
          <h2 className="mt-4">Crea tu perfil</h2>
          <p className="text-muted-foreground mt-2">Paso 2 de 2: Preferencias y objetivos</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Primary Goal */}
          <div>
            <Label className="flex items-center gap-2 mb-3">
              <Target size={18} />
              Objetivo principal
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <OptionCard
                selected={formData.primaryGoal === 'glucose-control'}
                onClick={() => setFormData({ ...formData, primaryGoal: 'glucose-control' })}
                title="Control glucémico"
                description="Estabilizar niveles de azúcar"
              />
              <OptionCard
                selected={formData.primaryGoal === 'weight-loss'}
                onClick={() => setFormData({ ...formData, primaryGoal: 'weight-loss' })}
                title="Pérdida de peso"
                description="Reducir peso corporal"
              />
            </div>
          </div>
          
          {/* Diet Type */}
          <div>
            <Label className="flex items-center gap-2 mb-3">
              <Leaf size={18} />
              Tipo de dieta
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <OptionCard
                selected={formData.dietType === 'omnivore'}
                onClick={() => setFormData({ ...formData, dietType: 'omnivore' })}
                title="Omnívoro"
                description="Incluye carnes y vegetales"
              />
              <OptionCard
                selected={formData.dietType === 'vegetarian'}
                onClick={() => setFormData({ ...formData, dietType: 'vegetarian' })}
                title="Vegetariano"
                description="Solo alimentos vegetales"
              />
            </div>
          </div>
          
          {/* Hypertension */}
          <div>
            <Label className="flex items-center gap-2 mb-3">
              <AlertCircle size={18} />
              Condiciones adicionales
            </Label>
            <label className="flex items-center gap-3 p-4 rounded-lg border-2 bg-card cursor-pointer hover:bg-accent/50 transition-colors">
              <Checkbox
                checked={formData.hasHypertension}
                onCheckedChange={(checked) => setFormData({ ...formData, hasHypertension: checked as boolean })}
              />
              <div>
                <span className="font-medium">Tengo hipertensión</span>
                <p className="text-sm text-muted-foreground">Limitará sodio en recomendaciones</p>
              </div>
            </label>
          </div>
          
          {/* Allergies */}
          <div>
            <Label className="flex items-center gap-2 mb-3">
              <AlertCircle size={18} />
              Alergias alimentarias
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {commonAllergies.map((allergy) => (
                <label
                  key={allergy}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    (allergy === 'Ninguna' && formData.allergies.length === 0) || formData.allergies.includes(allergy)
                      ? 'border-primary bg-primary/10'
                      : 'border-input bg-card hover:bg-accent/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={allergy === 'Ninguna' ? formData.allergies.length === 0 : formData.allergies.includes(allergy)}
                    onChange={() => handleAllergyToggle(allergy)}
                    className="sr-only"
                  />
                  <span className="text-sm">{allergy}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
              className="flex-1"
            >
              <ChevronLeft size={20} />
              Atrás
            </Button>
            <Button type="submit" className="flex-1">
              Guardar perfil
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function OptionCard({ 
  selected, 
  onClick, 
  title, 
  description 
}: { 
  selected: boolean; 
  onClick: () => void; 
  title: string; 
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-4 rounded-lg border-2 text-left transition-all ${
        selected
          ? 'border-primary bg-primary/10'
          : 'border-input bg-card hover:bg-accent/50'
      }`}
    >
      <h4 className="font-medium">{title}</h4>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </button>
  );
}