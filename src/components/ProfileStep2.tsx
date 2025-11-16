import { useState } from 'react';
import { Target, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';

interface ProfileStep2Props {
  onNext: (data: {
    weight: number;
    height: number;
    bmi: number;
    mainGoal: 'glucose' | 'weight-loss';
    dailyCarbsGoal: number;
  }) => void;
  onBack: () => void;
}

export function ProfileStep2({ onNext, onBack }: ProfileStep2Props) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [mainGoal, setMainGoal] = useState<'glucose' | 'weight-loss'>('glucose');
  const [dailyCarbsGoal, setDailyCarbsGoal] = useState(150);

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // convert cm to m
    if (w && h) {
      return (w / (h * h)).toFixed(1);
    }
    return null;
  };

  const bmi = calculateBMI();

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Bajo peso', color: 'text-blue-600' };
    if (bmi < 25) return { label: 'Peso normal', color: 'text-green-600' };
    if (bmi < 30) return { label: 'Sobrepeso', color: 'text-amber-600' };
    return { label: 'Obesidad', color: 'text-red-600' };
  };

  const handleNext = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const calculatedBMI = parseFloat(calculateBMI() || '0');
    
    if (w && h && calculatedBMI) {
      onNext({
        weight: w,
        height: h,
        bmi: calculatedBMI,
        mainGoal,
        dailyCarbsGoal,
      });
    }
  };

  const isValid = weight && height && parseFloat(weight) > 0 && parseFloat(height) > 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="w-12 h-12 rounded-xl border border-border hover:bg-accent flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Badge variant="secondary">Paso 2 de 2</Badge>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="mb-2">Datos físicos y metas</h1>
          <p className="text-muted-foreground">
            Últimos datos para calcular tu plan personalizado
          </p>
        </div>

        <div className="space-y-6">
          {/* Weight and Height */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="weight" className="block mb-2">
                Peso (kg)
              </label>
              <Input
                id="weight"
                type="number"
                placeholder="70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="30"
                max="300"
              />
            </div>
            <div>
              <label htmlFor="height" className="block mb-2">
                Estatura (cm)
              </label>
              <Input
                id="height"
                type="number"
                placeholder="170"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                min="100"
                max="250"
              />
            </div>
          </div>

          {/* BMI Display */}
          {bmi && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Tu Índice de Masa Corporal (IMC)</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-indigo-900">{bmi}</span>
                    <span className={getBMICategory(parseFloat(bmi)).color}>
                      {getBMICategory(parseFloat(bmi)).label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Goal */}
          <div>
            <label className="block mb-3">
              ¿Cuál es tu meta principal?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setMainGoal('glucose')}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  mainGoal === 'glucose'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="mb-2">🩸</div>
                <div className="mb-1">Controlar glucosa</div>
                <div className="text-muted-foreground">
                  Mantener niveles estables de azúcar en sangre
                </div>
              </button>
              <button
                onClick={() => setMainGoal('weight-loss')}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  mainGoal === 'weight-loss'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="mb-2">⚖️</div>
                <div className="mb-1">Bajar de peso</div>
                <div className="text-muted-foreground">
                  Reducir peso mientras controlo la diabetes
                </div>
              </button>
            </div>
          </div>

          {/* Daily Carbs Goal */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label>
                Carbohidratos diarios objetivo
              </label>
              <Badge variant="outline" className="text-primary">
                {dailyCarbsGoal}g
              </Badge>
            </div>
            <Slider
              value={[dailyCarbsGoal]}
              onValueChange={(value) => setDailyCarbsGoal(value[0])}
              min={100}
              max={250}
              step={10}
              className="mb-2"
            />
            <div className="flex justify-between text-muted-foreground">
              <span>100g</span>
              <span className="text-center">
                {dailyCarbsGoal < 130 && 'Bajo'}
                {dailyCarbsGoal >= 130 && dailyCarbsGoal <= 180 && 'Moderado'}
                {dailyCarbsGoal > 180 && 'Alto'}
              </span>
              <span>250g</span>
            </div>
            <p className="text-muted-foreground mt-2">
              Recomendado para diabetes tipo 2: 130-180g al día
            </p>
          </div>
        </div>

        <Button 
          onClick={handleNext}
          className="w-full mt-8"
          size="lg"
          disabled={!isValid}
        >
          Crear mi plan alimenticio
        </Button>
      </Card>
    </div>
  );
}
