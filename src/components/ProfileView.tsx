import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { X, Edit, User, Activity, Droplet, Target, Leaf, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { ProfileStep1 } from './ProfileStep1';
import { ProfileStep2 } from './ProfileStep2';

interface ProfileViewProps {
  profile: UserProfile;
  onClose: () => void;
  onUpdate: (profile: UserProfile) => void;
}

export function ProfileView({ profile, onClose, onUpdate }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editStep, setEditStep] = useState<1 | 2>(1);
  const [editData, setEditData] = useState<Partial<UserProfile>>(profile);
  
  const handleStep1Complete = (data: any) => {
    setEditData({
      ...editData,
      age: Number(data.age),
      weight: Number(data.weight),
      height: Number(data.height),
      bmi: data.height && data.weight ? Number(((Number(data.weight) / ((Number(data.height) / 100) ** 2))).toFixed(1)) : editData.bmi,
      recentGlucose: Number(data.recentGlucose),
      hba1c: Number(data.hba1c),
      season: data.season,
      experienceLevel: data.experienceLevel
    });
    setEditStep(2);
  };
  
  const handleStep2Complete = (data: any) => {
    const updatedProfile: UserProfile = {
      ...editData as UserProfile,
      primaryGoal: data.primaryGoal,
      allergies: data.allergies,
      dietType: data.dietType,
      hasHypertension: data.hasHypertension
    };
    onUpdate(updatedProfile);
    setIsEditing(false);
    setEditStep(1);
  };
  
  if (isEditing) {
    if (editStep === 1) {
      return (
        <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
          <div className="min-h-screen">
            <button
              onClick={() => {
                setIsEditing(false);
                setEditStep(1);
              }}
              className="fixed top-4 right-4 p-2 hover:bg-accent rounded-full transition-colors z-10"
            >
              <X size={24} />
            </button>
            <ProfileStep1
              onNext={handleStep1Complete}
              initialData={{
                age: profile.age,
                weight: profile.weight,
                height: profile.height,
                recentGlucose: profile.recentGlucose,
                hba1c: profile.hba1c,
                season: profile.season,
                experienceLevel: profile.experienceLevel
              }}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
          <div className="min-h-screen">
            <button
              onClick={() => {
                setIsEditing(false);
                setEditStep(1);
              }}
              className="fixed top-4 right-4 p-2 hover:bg-accent rounded-full transition-colors z-10"
            >
              <X size={24} />
            </button>
            <ProfileStep2
              onComplete={handleStep2Complete}
              onBack={() => setEditStep(1)}
              initialData={{
                primaryGoal: profile.primaryGoal,
                allergies: profile.allergies,
                dietType: profile.dietType,
                hasHypertension: profile.hasHypertension
              }}
            />
          </div>
        </div>
      );
    }
  }
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <User size={24} className="text-primary" />
            </div>
            <div>
              <DialogTitle>Tu perfil</DialogTitle>
              <p className="text-sm text-muted-foreground">Información de salud</p>
            </div>
          </div>
        </DialogHeader>
        
        {/* Content */}
        <div className="space-y-6 py-4">
          {/* Basic Info */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={20} className="text-primary" />
              <h4 className="font-medium">Información básica</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Edad" value={`${profile.age} años`} />
              <InfoItem label="Peso" value={`${profile.weight} kg`} />
              <InfoItem label="Estatura" value={`${profile.height} cm`} />
              <InfoItem label="IMC" value={profile.bmi.toString()} highlight />
            </div>
          </Card>
          
          {/* Clinical Info */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Droplet size={20} className="text-primary" />
              <h4 className="font-medium">Datos clínicos</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Glucosa reciente" value={`${profile.recentGlucose} mg/dL`} />
              <InfoItem label="HbA1c" value={`${profile.hba1c}%`} />
              <InfoItem 
                label="Temporada" 
                value={profile.season === 'winter' ? 'Invierno' : 'Otra'} 
              />
              <InfoItem 
                label="Experiencia" 
                value={
                  profile.experienceLevel === 'beginner' 
                    ? 'Principiante' 
                    : profile.experienceLevel === 'intermediate' 
                    ? 'Intermedio' 
                    : 'Avanzado'
                } 
              />
            </div>
          </Card>
          
          {/* Goals & Preferences */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target size={20} className="text-primary" />
              <h4 className="font-medium">Objetivos y preferencias</h4>
            </div>
            <div className="space-y-3">
              <InfoItem 
                label="Objetivo principal" 
                value={
                  profile.primaryGoal === 'glucose-control' 
                    ? 'Control glucémico' 
                    : 'Pérdida de peso'
                }
                fullWidth 
              />
              <InfoItem 
                label="Tipo de dieta" 
                value={profile.dietType === 'omnivore' ? 'Omnívoro' : 'Vegetariano'}
                icon={<Leaf size={16} className="text-green-600" />}
                fullWidth 
              />
              {profile.hasHypertension && (
                <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <AlertCircle size={16} className="text-orange-600" />
                  <span className="text-sm">Hipertensión (restricción de sodio)</span>
                </div>
              )}
              {profile.allergies.length > 0 && (
                <InfoItem 
                  label="Alergias" 
                  value={profile.allergies.join(', ')}
                  icon={<AlertCircle size={16} className="text-destructive" />}
                  fullWidth 
                />
              )}
            </div>
          </Card>
        </div>
        
        {/* Footer */}
        <div className="pt-4 border-t">
          <Button 
            onClick={() => setIsEditing(true)}
            className="w-full"
            size="lg"
          >
            <Edit size={20} />
            Editar perfil
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
  highlight?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

function InfoItem({ label, value, highlight, icon, fullWidth }: InfoItemProps) {
  return (
    <div className={`${fullWidth ? 'col-span-2' : ''}`}>
      <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
        {icon}
        {label}
      </p>
      <p className={`${highlight ? 'text-primary text-xl font-semibold' : ''}`}>
        {value}
      </p>
    </div>
  );
}
