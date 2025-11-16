import { useState } from 'react';
import { Shield, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';

interface ConsentPageProps {
  onAccept: () => void;
}

export function ConsentPage({ onAccept }: ConsentPageProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="mb-2">Consentimiento de uso</h1>
          <p className="text-muted-foreground">
            Antes de comenzar, es importante que comprendas cómo funciona NutriControl
          </p>
        </div>

        <div className="space-y-6 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="mb-4 text-blue-900">¿Qué hace esta aplicación?</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-blue-900">
                  Te ayuda a planificar tus comidas diarias adaptadas a tu diabetes tipo 2
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-blue-900">
                  Utiliza información básica de tu salud (peso, estatura, hipertensión) para personalizar recomendaciones
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-blue-900">
                  Sugiere platillos con bajo índice glucémico y control de carbohidratos
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h2 className="mb-4 text-amber-900">Importante</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mx-auto mt-1.5"></div>
                </div>
                <span className="text-amber-900">
                  Esta aplicación <strong>no reemplaza</strong> el consejo médico profesional
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mx-auto mt-1.5"></div>
                </div>
                <span className="text-amber-900">
                  Consulta siempre con tu médico antes de hacer cambios significativos en tu dieta
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mx-auto mt-1.5"></div>
                </div>
                <span className="text-amber-900">
                  Los datos de salud que ingreses se guardarán de forma local en tu dispositivo
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border rounded-lg p-4 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox 
              id="consent"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked as boolean)}
              className="mt-1"
            />
            <span htmlFor="consent" className="flex-1">
              He leído y comprendo que NutriControl utiliza mis datos de salud básicos para 
              proporcionar recomendaciones nutricionales personalizadas. Entiendo que esta 
              aplicación no reemplaza el consejo médico profesional.
            </span>
          </label>
        </div>

        <Button 
          onClick={onAccept}
          disabled={!accepted}
          className="w-full"
          size="lg"
        >
          Aceptar y continuar
        </Button>
      </Card>
    </div>
  );
}
