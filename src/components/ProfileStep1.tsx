import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import { Logo } from './Logo';
import { User, Activity, Droplet } from 'lucide-react';
import { calculateBMI } from '../utils/mealGenerator';

interface ProfileStep1Data {
  age: number | '';
  weight: number | '';
  height: number | '';
  recentGlucose: number | '';
  hba1c: number | '';
  season: 'winter' | 'non-winter';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
}

interface ProfileStep1Props {
  onNext: (data: ProfileStep1Data) => void;
  initialData?: ProfileStep1Data;
}

export function ProfileStep1({ onNext, initialData }: ProfileStep1Props) {
  const [formData, setFormData] = useState<ProfileStep1Data>(initialData || {
    age: '',
    weight: '',
    height: '',
    recentGlucose: '',
    hba1c: '',
    season: 'non-winter',
    experienceLevel: 'beginner'
  });
  
  const [bmi, setBmi] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (formData.weight && formData.height) {
      const calculatedBmi = calculateBMI(Number(formData.weight), Number(formData.height));
      setBmi(calculatedBmi);
    } else {
      setBmi(null);
    }
  }, [formData.weight, formData.height]);
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.age || formData.age < 18 || formData.age > 100) {
      newErrors.age = 'Ingresa una edad válida (18-100)';
    }
    
    if (!formData.weight || formData.weight < 30 || formData.weight > 300) {
      newErrors.weight = 'Ingresa un peso válido (30-300 kg)';
    }
    
    if (!formData.height || formData.height < 100 || formData.height > 250) {
      newErrors.height = 'Ingresa una estatura válida (100-250 cm)';
    }
    
    if (!formData.recentGlucose || formData.recentGlucose < 50 || formData.recentGlucose > 500) {
      newErrors.recentGlucose = 'Ingresa un valor válido (50-500 mg/dL)';
    }
    
    if (!formData.hba1c || formData.hba1c < 4 || formData.hba1c > 15) {
      newErrors.hba1c = 'Ingresa un valor válido (4-15%)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext(formData);
    }
  };
  
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Bajo peso', color: 'text-orange-600' };
    if (bmi < 25) return { text: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { text: 'Sobrepeso', color: 'text-orange-600' };
    return { text: 'Obesidad', color: 'text-red-600' };
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-8">
        <div className="mb-6 text-center">
          <Logo size="md" showTagline={false} />
          <h2 className="mt-4">Crea tu perfil</h2>
          <p className="text-muted-foreground mt-2">Paso 1 de 2: Información clínica básica</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Age */}
          <div>
            <Label htmlFor="age">Edad</Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value ? parseInt(e.target.value) : '' })}
              placeholder="Ej: 45"
            />
            {errors.age && <p className="text-sm text-destructive mt-1">{errors.age}</p>}
          </div>
          
          {/* Weight */}
          <div>
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value ? parseFloat(e.target.value) : '' })}
              placeholder="Ej: 75.5"
            />
            {errors.weight && <p className="text-sm text-destructive mt-1">{errors.weight}</p>}
          </div>
          
          {/* Height */}
          <div>
            <Label htmlFor="height">Estatura (cm)</Label>
            <Input
              id="height"
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value ? parseInt(e.target.value) : '' })}
              placeholder="Ej: 170"
            />
            {errors.height && <p className="text-sm text-destructive mt-1">{errors.height}</p>}
          </div>
          
          {/* BMI Display */}
          {bmi && (
            <div className="bg-primary/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Índice de Masa Corporal (IMC)</span>
                <div className="text-right">
                  <span className={`text-xl font-semibold ${getBMICategory(bmi).color}`}>{bmi}</span>
                  <p className={`text-sm ${getBMICategory(bmi).color}`}>{getBMICategory(bmi).text}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Recent Glucose */}
          <div>
            <Label htmlFor="glucose">Glucosa reciente (mg/dL)</Label>
            <Input
              id="glucose"
              type="number"
              value={formData.recentGlucose}
              onChange={(e) => setFormData({ ...formData, recentGlucose: e.target.value ? parseFloat(e.target.value) : '' })}
              placeholder="Ej: 120"
            />
            <p className="text-sm text-muted-foreground mt-1">Medición en ayunas</p>
            {errors.recentGlucose && <p className="text-sm text-destructive mt-1">{errors.recentGlucose}</p>}
          </div>
          
          {/* HbA1c */}
          <div>
            <Label htmlFor="hba1c">HbA1c (%)</Label>
            <Input
              id="hba1c"
              type="number"
              step="0.1"
              value={formData.hba1c}
              onChange={(e) => setFormData({ ...formData, hba1c: e.target.value ? parseFloat(e.target.value) : '' })}
              placeholder="Ej: 7.2"
            />
            <p className="text-sm text-muted-foreground mt-1">Hemoglobina glicosilada</p>
            {errors.hba1c && <p className="text-sm text-destructive mt-1">{errors.hba1c}</p>}
          </div>
          
          {/* Season */}
          <div>
            <Label htmlFor="season">Temporada actual</Label>
            <Select 
              value={formData.season} 
              onValueChange={(value) => setFormData({ ...formData, season: value as 'winter' | 'non-winter' })}
            >
              <SelectTrigger id="season">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="non-winter">Primavera/Verano/Otoño</SelectItem>
                <SelectItem value="winter">Invierno</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Experience Level */}
          <div>
            <Label htmlFor="experience">Nivel de experiencia con diabetes</Label>
            <Select 
              value={formData.experienceLevel} 
              onValueChange={(value) => setFormData({ ...formData, experienceLevel: value as 'beginner' | 'intermediate' | 'advanced' })}
            >
              <SelectTrigger id="experience">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Principiante (recién diagnosticado)</SelectItem>
                <SelectItem value="intermediate">Intermedio (1-5 años)</SelectItem>
                <SelectItem value="advanced">Avanzado ({'>'}5 años)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" className="w-full" size="lg">
            Continuar al paso 2
          </Button>
        </form>
      </Card>
    </div>
  );
}