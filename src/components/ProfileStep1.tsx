import { useState } from 'react';
import { Activity, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import logo from 'figma:asset/f80e4d54fed4d5464fb9e70ac865852663d91f1e.png';

interface ProfileStep1Props {
  onNext: (data: {
    hasDiabetesT2: boolean;
    hasHypertension: boolean;
    dietType: 'omnivore' | 'vegetarian';
    allergies: string[];
  }) => void;
}

const COMMON_ALLERGIES = [
  'Ninguna',
  'Lácteos',
  'Gluten',
  'Frutos secos',
  'Mariscos',
  'Huevo',
  'Soya',
];

export function ProfileStep1({ onNext }: ProfileStep1Props) {
  const [hasDiabetesT2, setHasDiabetesT2] = useState(true);
  const [hasHypertension, setHasHypertension] = useState(false);
  const [dietType, setDietType] = useState<'omnivore' | 'vegetarian'>('omnivore');
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);

  const handleAllergyToggle = (allergy: string) => {
    if (allergy === 'Ninguna') {
      setSelectedAllergies(['Ninguna']);
    } else {
      const filtered = selectedAllergies.filter(a => a !== 'Ninguna');
      if (selectedAllergies.includes(allergy)) {
        setSelectedAllergies(filtered.filter(a => a !== allergy));
      } else {
        setSelectedAllergies([...filtered, allergy]);
      }
    }
  };

  const handleNext = () => {
    const allergies = selectedAllergies.includes('Ninguna') ? [] : selectedAllergies;
    onNext({
      hasDiabetesT2,
      hasHypertension,
      dietType,
      allergies,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="mb-8">
          <div className="flex items-center justify-center mb-6">
            <img src={logo} alt="DiabetEX" className="h-16" />
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <Badge variant="secondary">Paso 1 de 2</Badge>
          </div>
          <h1 className="mb-2">Información clínica básica</h1>
          <p className="text-muted-foreground">
            Necesitamos algunos datos para personalizar tus recomendaciones
          </p>
        </div>

        <div className="space-y-6">
          {/* Diabetes Type 2 Confirmation */}
          <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-blue-900">
                  Esta aplicación está diseñada específicamente para personas con <strong>Diabetes Tipo 2</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Hypertension */}
          <div>
            <label className="block mb-3">
              ¿Tienes hipertensión (presión alta)?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setHasHypertension(false)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  !hasHypertension
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                No
              </button>
              <button
                onClick={() => setHasHypertension(true)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  hasHypertension
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                Sí
              </button>
            </div>
          </div>

          {/* Diet Type */}
          <div>
            <label className="block mb-3">
              ¿Qué tipo de dieta sigues?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDietType('omnivore')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  dietType === 'omnivore'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="mb-1">🍖</div>
                <div>Omnívoro</div>
                <div className="text-muted-foreground mt-1">Como de todo</div>
              </button>
              <button
                onClick={() => setDietType('vegetarian')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  dietType === 'vegetarian'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="mb-1">🥗</div>
                <div>Vegetariano</div>
                <div className="text-muted-foreground mt-1">Sin carne ni pescado</div>
              </button>
            </div>
          </div>

          {/* Allergies */}
          <div>
            <label className="block mb-3">
              ¿Tienes alguna alergia alimentaria importante?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {COMMON_ALLERGIES.map((allergy) => (
                <button
                  key={allergy}
                  onClick={() => handleAllergyToggle(allergy)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedAllergies.includes(allergy)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {allergy}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button 
          onClick={handleNext}
          className="w-full mt-8"
          size="lg"
        >
          Continuar al paso 2
        </Button>
      </Card>
    </div>
  );
}