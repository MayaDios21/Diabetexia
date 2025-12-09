import { UserProfile, MealRecommendation, MealComponent, Substitute } from '../types';

// Base de datos de alimentos
const proteins = {
  omnivore: [
    { name: 'Pechuga de pollo a la plancha', portion: '120g', calories: 165, carbs: 0, protein: 31, fat: 3.6, gi: 'low', season: 'all' },
    { name: 'Filete de pescado blanco', portion: '150g', calories: 135, carbs: 0, protein: 28, fat: 2, gi: 'low', season: 'all' },
    { name: 'Huevo cocido', portion: '2 piezas', calories: 140, carbs: 1, protein: 12, fat: 10, gi: 'low', season: 'all' },
    { name: 'Pavo en rebanadas', portion: '100g', calories: 135, carbs: 2, protein: 25, fat: 2, gi: 'low', season: 'all' },
    { name: 'Salmón al horno', portion: '120g', calories: 206, carbs: 0, protein: 25, fat: 11, gi: 'low', season: 'winter' },
  ],
  vegetarian: [
    { name: 'Tofu firme salteado', portion: '150g', calories: 144, carbs: 3, protein: 15, fat: 8, gi: 'low', season: 'all' },
    { name: 'Lentejas cocidas', portion: '1 taza', calories: 230, carbs: 40, protein: 18, fat: 1, gi: 'low', season: 'winter' },
    { name: 'Garbanzos al horno', portion: '3/4 taza', calories: 210, carbs: 35, protein: 11, fat: 3, gi: 'low', season: 'all' },
    { name: 'Queso panela', portion: '100g', calories: 239, carbs: 3, protein: 23, fat: 15, gi: 'low', season: 'all' },
    { name: 'Huevo revuelto', portion: '2 piezas', calories: 160, carbs: 2, protein: 13, fat: 11, gi: 'low', season: 'all' },
  ]
};

const carbohydrates = [
  { name: 'Arroz integral cocido', portion: '1/2 taza', calories: 108, carbs: 22, protein: 2.5, fat: 0.9, gi: 'low', season: 'all', goal: 'all' },
  { name: 'Camote al horno', portion: '1/2 pieza mediana', calories: 90, carbs: 21, protein: 2, fat: 0, gi: 'low', season: 'winter', goal: 'all' },
  { name: 'Quinoa cocida', portion: '1/2 taza', calories: 111, carbs: 20, protein: 4, fat: 1.8, gi: 'low', season: 'all', goal: 'weight-loss' },
  { name: 'Avena cocida', portion: '1/2 taza', calories: 83, carbs: 14, protein: 3, fat: 1.8, gi: 'low', season: 'winter', goal: 'all' },
  { name: 'Pan integral', portion: '1 rebanada', calories: 80, carbs: 15, protein: 4, fat: 1, gi: 'low', season: 'all', goal: 'all' },
  { name: 'Pasta integral cocida', portion: '1/2 taza', calories: 87, carbs: 18, protein: 3.7, fat: 0.5, gi: 'medium', season: 'all', goal: 'glucose-control' },
];

const vegetables = [
  { name: 'Brócoli al vapor', portion: '1 taza', calories: 55, carbs: 11, protein: 4, fat: 0.6, gi: 'low', season: 'winter' },
  { name: 'Espinacas salteadas', portion: '1.5 tazas', calories: 41, carbs: 7, protein: 5, fat: 0.5, gi: 'low', season: 'all' },
  { name: 'Calabacita asada', portion: '1 taza', calories: 27, carbs: 7, protein: 2, fat: 0, gi: 'low', season: 'all' },
  { name: 'Ensalada mixta', portion: '2 tazas', calories: 33, carbs: 7, protein: 3, fat: 0, gi: 'low', season: 'non-winter' },
  { name: 'Ejotes cocidos', portion: '1 taza', calories: 44, carbs: 10, protein: 2, fat: 0, gi: 'low', season: 'all' },
  { name: 'Coliflor asada', portion: '1 taza', calories: 40, carbs: 8, protein: 3, fat: 0.5, gi: 'low', season: 'winter' },
  { name: 'Pimientos salteados', portion: '1 taza', calories: 39, carbs: 9, protein: 1.5, fat: 0, gi: 'low', season: 'non-winter' },
];

function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100;
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
}

function filterByProfile(items: any[], profile: UserProfile) {
  return items.filter(item => {
    // Filtrar por temporada
    if (item.season !== 'all' && item.season !== profile.season) return false;
    
    // Filtrar por objetivo si el campo existe
    if (item.goal && item.goal !== 'all' && item.goal !== profile.primaryGoal) return false;
    
    return true;
  });
}

function selectRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function generateReasons(profile: UserProfile, protein: any, carb: any, veggie: any): string[] {
  const reasons: string[] = [];
  
  // Razón por IG bajo
  if (carb.gi === 'low') {
    reasons.push('IG Bajo - Control gradual de glucosa');
  }
  
  // Razón por temporada
  if (profile.season === 'winter' && carb.season === 'winter') {
    reasons.push('Adecuado para temporada invernal');
  }
  
  // Razón por nivel de experiencia
  const experienceLabels = {
    beginner: 'Para principiantes',
    intermediate: 'Nivel intermedio',
    advanced: 'Nivel avanzado'
  };
  reasons.push(experienceLabels[profile.experienceLevel]);
  
  // Razón por objetivo
  if (profile.primaryGoal === 'glucose-control') {
    reasons.push('Control de glucosa óptimo');
  } else {
    reasons.push('Favorece pérdida de peso');
  }
  
  // Razón por tipo de dieta
  if (profile.dietType === 'vegetarian') {
    reasons.push('Opción vegetariana');
  }
  
  // Razón por contenido de fibra
  if (veggie.protein >= 3) {
    reasons.push('Alto contenido de fibra');
  }
  
  return reasons.slice(0, 4); // Máximo 4 razones
}

export function generateMealRecommendation(profile: UserProfile, mealType: 'breakfast' | 'lunch' | 'dinner' = 'lunch'): MealRecommendation {
  // Seleccionar proteína según tipo de dieta
  const proteinOptions = filterByProfile(proteins[profile.dietType], profile);
  const selectedProtein = selectRandomItem(proteinOptions);
  
  // Seleccionar carbohidrato
  const carbOptions = filterByProfile(carbohydrates, profile);
  const selectedCarb = selectRandomItem(carbOptions);
  
  // Seleccionar vegetal
  const veggieOptions = filterByProfile(vegetables, profile);
  const selectedVeggie = selectRandomItem(veggieOptions);
  
  // Generar razones
  const reasons = generateReasons(profile, selectedProtein, selectedCarb, selectedVeggie);
  
  // Crear componentes de comida con multiplicador inicial de 1
  const proteinComponent: MealComponent = {
    ...selectedProtein,
    portionMultiplier: 1
  };
  
  const carbComponent: MealComponent = {
    ...selectedCarb,
    portionMultiplier: 1
  };
  
  const veggieComponent: MealComponent = {
    ...selectedVeggie,
    portionMultiplier: 1
  };
  
  const totalCarbs = carbComponent.carbs + veggieComponent.carbs + proteinComponent.carbs;
  const totalCalories = proteinComponent.calories + carbComponent.calories + veggieComponent.calories;
  
  // Generar nombre de platillo
  const mealName = `${selectedProtein.name} con ${selectedCarb.name.toLowerCase()} y ${selectedVeggie.name.toLowerCase()}`;
  
  return {
    id: Date.now().toString(),
    name: mealName,
    imageQuery: `healthy meal ${selectedProtein.name}`,
    protein: proteinComponent,
    carbohydrate: carbComponent,
    vegetable: veggieComponent,
    reasons,
    totalCarbs,
    totalCalories,
    mealType
  };
}

export function generateSubstitutes(component: MealComponent, profile: UserProfile, type: 'protein' | 'carbohydrate' | 'vegetable'): Substitute[] {
  let options: any[] = [];
  
  if (type === 'protein') {
    options = proteins[profile.dietType].filter(p => p.name !== component.name);
  } else if (type === 'carbohydrate') {
    options = carbohydrates.filter(c => c.name !== component.name);
  } else if (type === 'vegetable') {
    options = vegetables.filter(v => v.name !== component.name);
  }
  
  // Filtrar por perfil
  options = filterByProfile(options, profile);
  
  // Seleccionar 3 opciones aleatorias
  const shuffled = options.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);
  
  return selected.map(item => ({
    name: item.name,
    portion: item.portion,
    calories: item.calories,
    carbs: item.carbs,
    protein: item.protein,
    fat: item.fat,
    reason: item.gi === 'low' ? 'Bajo IG' : 'Opción saludable'
  }));
}

export { calculateBMI };
