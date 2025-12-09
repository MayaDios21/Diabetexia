import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Logo } from './Logo';
import { Sparkles, Heart, Apple } from 'lucide-react';

interface OnboardingProps {
  onStart: () => void;
}

export function Onboarding({ onStart }: OnboardingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center space-y-6">
          {/* Logo */}
          <div className="mb-6">
            <Logo size="lg" showTagline={true} />
          </div>
          
          {/* Welcome Message */}
          <div className="space-y-3">
            <h2>
              Bienvenido a tu asistente nutricional personalizado
            </h2>
            <p className="text-muted-foreground">
              Esta app genera comidas personalizadas basadas en tu perfil de salud, 
              ayudándote a mantener un mejor control de tu diabetes tipo 2.
            </p>
          </div>
          
          {/* Features */}
          <div className="space-y-4 pt-4">
            <FeatureItem 
              icon={<Sparkles size={20} className="text-primary" />}
              title="Personalización inteligente"
              description="Basado en tu edad, peso, glucosa y objetivos"
            />
            <FeatureItem 
              icon={<Apple size={20} className="text-green-600" />}
              title="Recomendaciones saludables"
              description="Alimentos con índice glucémico bajo"
            />
            <FeatureItem 
              icon={<Heart size={20} className="text-primary" />}
              title="Control efectivo"
              description="Adaptado a tus necesidades específicas"
            />
          </div>
          
          {/* CTA Button */}
          <Button 
            onClick={onStart}
            className="w-full mt-6"
            size="lg"
          >
            Comenzar
          </Button>
        </div>
      </Card>
    </div>
  );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 text-left">
      <div className="mt-1">{icon}</div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}