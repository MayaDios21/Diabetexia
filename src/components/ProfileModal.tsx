import { useState } from 'react';
import { X, User, Activity, Target, TrendingDown, Scale, Droplet } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import logo from 'figma:asset/f80e4d54fed4d5464fb9e70ac865852663d91f1e.png';

interface UserProfile {
  email: string;
  hasDiabetesT2: boolean;
  hasHypertension: boolean;
  dietType: 'omnivore' | 'vegetarian';
  allergies: string[];
  weight: number;
  height: number;
  bmi: number;
  mainGoal: 'glucose' | 'weight-loss';
  dailyCarbsGoal: number;
}

interface ProfileModalProps {
  userProfile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
  onClose: () => void;
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

export function ProfileModal({ userProfile, onUpdate, onClose }: ProfileModalProps) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(userProfile);

  // Current weight/glucose tracking
  const [currentWeight, setCurrentWeight] = useState(userProfile.weight.toString());
  const [currentGlucose, setCurrentGlucose] = useState('');

  const calculateBMI = (weight: number, height: number) => {
    const h = height / 100; // convert cm to m
    return (weight / (h * h)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Bajo peso', color: 'text-blue-600' };
    if (bmi < 25) return { label: 'Peso normal', color: 'text-green-600' };
    if (bmi < 30) return { label: 'Sobrepeso', color: 'text-amber-600' };
    return { label: 'Obesidad', color: 'text-red-600' };
  };

  const handleAllergyToggle = (allergy: string) => {
    if (allergy === 'Ninguna') {
      setFormData({ ...formData, allergies: [] });
    } else {
      const currentAllergies = formData.allergies || [];
      if (currentAllergies.includes(allergy)) {
        setFormData({ ...formData, allergies: currentAllergies.filter(a => a !== allergy) });
      } else {
        setFormData({ ...formData, allergies: [...currentAllergies, allergy] });
      }
    }
  };

  const handleSave = () => {
    const updatedBMI = parseFloat(calculateBMI(formData.weight, formData.height));
    onUpdate({ ...formData, bmi: updatedBMI });
    setEditMode(false);
  };

  const handleUpdateWeight = () => {
    const newWeight = parseFloat(currentWeight);
    if (newWeight && newWeight > 0) {
      const updatedBMI = parseFloat(calculateBMI(newWeight, userProfile.height));
      onUpdate({ weight: newWeight, bmi: updatedBMI });
      
      // Save to history
      const history = JSON.parse(localStorage.getItem('weightHistory') || '[]');
      history.push({
        date: new Date().toISOString(),
        weight: newWeight,
        bmi: updatedBMI,
      });
      localStorage.setItem('weightHistory', JSON.stringify(history));
    }
  };

  const handleUpdateGlucose = () => {
    const glucose = parseFloat(currentGlucose);
    if (glucose && glucose > 0) {
      // Save to history
      const history = JSON.parse(localStorage.getItem('glucoseHistory') || '[]');
      history.push({
        date: new Date().toISOString(),
        glucose: glucose,
      });
      localStorage.setItem('glucoseHistory', JSON.stringify(history));
      setCurrentGlucose('');
    }
  };

  const weightHistory = JSON.parse(localStorage.getItem('weightHistory') || '[]');
  const glucoseHistory = JSON.parse(localStorage.getItem('glucoseHistory') || '[]');

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div 
        className="w-full max-w-3xl bg-background rounded-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-white">
              <img src={logo} alt="DiabetEX" className="h-8" />
              <div>
                <h2 className="text-white mb-1">Mi Perfil</h2>
                <p className="text-white/80">{userProfile.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
              <TabsTrigger value="overview" className="rounded-none">
                Resumen
              </TabsTrigger>
              <TabsTrigger value="tracking" className="rounded-none">
                Seguimiento
              </TabsTrigger>
              <TabsTrigger value="edit" className="rounded-none">
                Editar perfil
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="p-6 space-y-6">
              {/* Clinical Info */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <h3>Información clínica</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <p className="text-muted-foreground mb-2">Condición</p>
                    <p>Diabetes Tipo 2</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-muted-foreground mb-2">Hipertensión</p>
                    <p>{userProfile.hasHypertension ? 'Sí' : 'No'}</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-muted-foreground mb-2">Tipo de dieta</p>
                    <p>{userProfile.dietType === 'omnivore' ? 'Omnívoro' : 'Vegetariano'}</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-muted-foreground mb-2">Alergias</p>
                    <p>{userProfile.allergies?.length > 0 ? userProfile.allergies.join(', ') : 'Ninguna'}</p>
                  </Card>
                </div>
              </div>

              {/* Physical Data */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Scale className="w-5 h-5 text-green-600" />
                  <h3>Datos físicos</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <p className="text-muted-foreground mb-2">Peso actual</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-primary">{userProfile.weight}</span>
                      <span className="text-muted-foreground">kg</span>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <p className="text-muted-foreground mb-2">Estatura</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-primary">{userProfile.height}</span>
                      <span className="text-muted-foreground">cm</span>
                    </div>
                  </Card>
                  <Card className="p-4 col-span-2 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
                    <p className="text-muted-foreground mb-2">Índice de Masa Corporal (IMC)</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-indigo-900">{userProfile.bmi}</span>
                      <span className={getBMICategory(userProfile.bmi).color}>
                        {getBMICategory(userProfile.bmi).label}
                      </span>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Goals */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-purple-600" />
                  <h3>Mis metas</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <p className="text-muted-foreground mb-2">Meta principal</p>
                    <div className="flex items-center gap-2">
                      {userProfile.mainGoal === 'glucose' ? (
                        <>
                          <Droplet className="w-4 h-4 text-blue-600" />
                          <span>Controlar glucosa</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-4 h-4 text-green-600" />
                          <span>Bajar de peso</span>
                        </>
                      )}
                    </div>
                  </Card>
                  <Card className="p-4">
                    <p className="text-muted-foreground mb-2">Carbohidratos diarios</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-primary">{userProfile.dailyCarbsGoal}</span>
                      <span className="text-muted-foreground">g</span>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Tracking Tab */}
            <TabsContent value="tracking" className="p-6 space-y-6">
              {/* Update Weight */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Scale className="w-5 h-5 text-green-600" />
                  <h3>Actualizar peso</h3>
                </div>
                <Card className="p-5">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder="Peso en kg"
                        value={currentWeight}
                        onChange={(e) => setCurrentWeight(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleUpdateWeight}>
                      Guardar
                    </Button>
                  </div>
                  {weightHistory.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-muted-foreground mb-3">Historial reciente</p>
                      <div className="space-y-2">
                        {weightHistory.slice(-5).reverse().map((entry: any, index: number) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {new Date(entry.date).toLocaleDateString('es-ES')}
                            </span>
                            <div className="flex items-center gap-3">
                              <span>{entry.weight} kg</span>
                              <Badge variant="outline">IMC: {entry.bmi}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </div>

              {/* Update Glucose */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Droplet className="w-5 h-5 text-red-600" />
                  <h3>Registrar glucosa</h3>
                </div>
                <Card className="p-5">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder="Glucosa en mg/dL"
                        value={currentGlucose}
                        onChange={(e) => setCurrentGlucose(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleUpdateGlucose}>
                      Registrar
                    </Button>
                  </div>
                  <p className="text-muted-foreground mt-2">
                    Normal en ayunas: 70-100 mg/dL
                  </p>
                  {glucoseHistory.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-muted-foreground mb-3">Historial reciente</p>
                      <div className="space-y-2">
                        {glucoseHistory.slice(-5).reverse().map((entry: any, index: number) => {
                          const isHigh = entry.glucose > 100;
                          const isVeryHigh = entry.glucose > 126;
                          return (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                {new Date(entry.date).toLocaleDateString('es-ES', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              <div className="flex items-center gap-3">
                                <span>{entry.glucose} mg/dL</span>
                                <Badge 
                                  variant="outline" 
                                  className={
                                    isVeryHigh ? 'bg-red-100 text-red-800 border-red-200' :
                                    isHigh ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                    'bg-green-100 text-green-800 border-green-200'
                                  }
                                >
                                  {isVeryHigh ? 'Alto' : isHigh ? 'Elevado' : 'Normal'}
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </TabsContent>

            {/* Edit Tab */}
            <TabsContent value="edit" className="p-6 space-y-6">
              <div>
                <h3 className="mb-4">Información clínica</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-3">¿Tienes hipertensión?</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setFormData({ ...formData, hasHypertension: false })}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          !formData.hasHypertension
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        No
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, hasHypertension: true })}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.hasHypertension
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        Sí
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-3">Tipo de dieta</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setFormData({ ...formData, dietType: 'omnivore' })}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.dietType === 'omnivore'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        🍖 Omnívoro
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, dietType: 'vegetarian' })}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.dietType === 'vegetarian'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        🥗 Vegetariano
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-3">Alergias alimentarias</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {COMMON_ALLERGIES.map((allergy) => (
                        <button
                          key={allergy}
                          onClick={() => handleAllergyToggle(allergy)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            (allergy === 'Ninguna' && formData.allergies?.length === 0) ||
                            formData.allergies?.includes(allergy)
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
              </div>

              <div>
                <h3 className="mb-4">Datos físicos</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-weight" className="block mb-2">
                      Peso (kg)
                    </label>
                    <Input
                      id="edit-weight"
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-height" className="block mb-2">
                      Estatura (cm)
                    </label>
                    <Input
                      id="edit-height"
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4">Metas</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-3">Meta principal</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => setFormData({ ...formData, mainGoal: 'glucose' })}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          formData.mainGoal === 'glucose'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="mb-2">🩸</div>
                        <div className="mb-1">Controlar glucosa</div>
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, mainGoal: 'weight-loss' })}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          formData.mainGoal === 'weight-loss'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="mb-2">⚖️</div>
                        <div className="mb-1">Bajar de peso</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label>Carbohidratos diarios objetivo</label>
                      <Badge variant="outline" className="text-primary">
                        {formData.dailyCarbsGoal}g
                      </Badge>
                    </div>
                    <Slider
                      value={[formData.dailyCarbsGoal]}
                      onValueChange={(value) => setFormData({ ...formData, dailyCarbsGoal: value[0] })}
                      min={100}
                      max={250}
                      step={10}
                      className="mb-2"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button onClick={handleSave} className="w-full" size="lg">
                  Guardar cambios
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}