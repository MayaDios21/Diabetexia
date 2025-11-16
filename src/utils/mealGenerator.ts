export interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner';
  name: string;
  portions: string;
  carbs: number;
  baseCarbs: number;
  portion: number;
  lowGlycemic: boolean;
  lowSodium: boolean;
  highFiber: boolean;
  reasons: string[];
}

interface UserProfile {
  hasHypertension: boolean;
  dietType: 'omnivore' | 'vegetarian';
  allergies: string[];
  mainGoal: 'glucose' | 'weight-loss';
  dailyCarbsGoal: number;
}

// Meal database with nutritional information
const mealDatabase = {
  breakfast: {
    omnivore: [
      {
        name: 'Avena con almendras y frutos rojos',
        portions: '1 taza de avena + 10 almendras + ½ taza frutos rojos',
        carbs: 45,
        lowGlycemic: true,
        lowSodium: true,
        highFiber: true,
      },
      {
        name: 'Huevos revueltos con espinacas y pan integral',
        portions: '2 huevos + 1 taza espinacas + 1 rebanada pan integral',
        carbs: 30,
        lowGlycemic: true,
        lowSodium: true,
        highFiber: true,
      },
      {
        name: 'Yogurt griego con nueces y semillas de chía',
        portions: '1 taza yogurt + 8 nueces + 1 cda chía',
        carbs: 25,
        lowGlycemic: true,
        lowSodium: true,
        highFiber: true,
      },
      {
        name: 'Licuado verde con proteína',
        portions: '1 taza espinacas + ½ plátano + 1 scoop proteína',
        carbs: 28,
        lowGlycemic: true,
        lowSodium: true,
        highFiber: true,
      },
    ],
    vegetarian: [
      {
        name: 'Avena con almendras y frutos rojos',
        portions: '1 taza de avena + 10 almendras + ½ taza frutos rojos',
        carbs: 45,
        lowGlycemic: true,
        lowSodium: true,
        highFiber: true,
      },
      {
        name: 'Tostada de aguacate con tomate',
        portions: '1 rebanada pan integral + ½ aguacate + tomate',
        carbs: 32,
        lowGlycemic: true,
        lowSodium: true,
        highFiber: true,
      },
      {
        name: 'Yogurt griego con nueces y semillas de chía',
        portions: '1 taza yogurt + 8 nueces + 1 cda chía',
        carbs: 25,
        lowGlycemic: true,
        lowSodium: true,
        highFiber: true,
      },
    ],
  },
  lunch: {
    omnivore: [
      {
        name: 'Pechuga de pollo a la plancha con quinoa y verduras',
        portions: '150g pollo + ½ taza quinoa + 2 tazas verduras',
        carbs: 42,
        lowGlycemic: true,
        lowSodium: true,
        highFiber: true,
      },
      {
        name: 'Salmón al horno con camote y brócoli',
        portions: '150g salmón + 1 camote mediano + 1 taza brócoli',
        carbs: 48,
        lowGlycemic: true,
        lowSodium: true,
        highFiber: true,
      },
      {
        name: 'Tacos de pescado con tortillas de maíz',
        portions: '2 tortillas maíz + 120g pescado + ensalada',
        carbs: 40,
        lowGlycemic: true,
        lowSodium: true,
        highFiber: true,
      },
      {
        name: 'Ensalada de pollo con garbanzos',
        portions: '100g pollo + ½ taza garbanzos + verduras mixtas',
        carbs: 38,
        lowGlycemic: true,
        lowSodium: true,
        highFiber: true,
      },
    ],
    vegetarian: [
      {
        name: 'Lentejas guisadas con arroz integral y ensalada',
        portions: '1 taza lentejas + ½ taza arroz + ensalada',
        carbs: 52,
        lowGlycemic: true,
        lowSodium: true,
        highFiber: true,
      },
      {
        name: 'Bowl de quinoa con garbanzos y vegetales asados',
        portions: '½ taza quinoa + ½ taza garbanzos + verduras',
        carbs: 45,
        lowGlycemic: true,
        lowSodium: true,
        highFiber: true,
      },
      {
        name: 'Tacos de frijoles con aguacate',
        portions: '2 tortillas maíz + ¾ taza frijoles + ¼ aguacate',
        carbs: 48,
        lowGlycemic: true,
        lowSodium: true,
        highFiber: true,
      },
      {
        name: 'Ensalada mediterránea con tofu',
        portions: '150g tofu + verduras mixtas + ½ taza quinoa',
        carbs: 35,
        lowGlycemic: true,
        lowSodium: true,
        highFiber: true,
      },
    ],
  },
  dinner: {
    omnivore: [
      {
        name: 'Pechuga de pavo con puré de coliflor',
        portions: '150g pavo + 1 taza puré coliflor + ensalada',
        carbs: 22,
        lowGlycemic: true,
        lowSodium: true,
        highFiber: true,
      },
      {
        name: 'Sopa de verduras con pollo',
        portions: '2 tazas sopa + 100g pollo + 1 tortilla maíz',
        carbs: 35,
        lowGlycemic: true,
        lowSodium: true,
        highFiber: true,
      },
      {
        name: 'Pescado al vapor con espárragos',
        portions: '150g pescado + 1 taza espárragos + ¼ taza arroz',
        carbs: 28,
        lowGlycemic: true,
        lowSodium: true,
        highFiber: true,
      },
      {
        name: 'Pollo con champiñones y zucchini',
        portions: '150g pollo + champiñones + zucchini + ¼ taza quinoa',
        carbs: 30,
        lowGlycemic: true,
        lowSodium: true,
        highFiber: true,
      },
    ],
    vegetarian: [
      {
        name: 'Tofu salteado con vegetales',
        portions: '150g tofu + verduras mixtas + ¼ taza arroz integral',
        carbs: 32,
        lowGlycemic: true,
        lowSodium: true,
        highFiber: true,
      },
      {
        name: 'Sopa de lentejas con verduras',
        portions: '1.5 tazas sopa + ensalada verde',
        carbs: 38,
        lowGlycemic: true,
        lowSodium: true,
        highFiber: true,
      },
      {
        name: 'Berenjena rellena de quinoa',
        portions: '1 berenjena + ½ taza quinoa + vegetales',
        carbs: 35,
        lowGlycemic: true,
        lowSodium: true,
        highFiber: true,
      },
      {
        name: 'Bowl de vegetales con hummus',
        portions: 'Vegetales asados + ½ taza hummus + ¼ pan pita',
        carbs: 28,
        lowGlycemic: true,
        lowSodium: true,
        highFiber: true,
      },
    ],
  },
};

function generateReasons(meal: any, userProfile: UserProfile): string[] {
  const reasons: string[] = [];

  if (meal.lowGlycemic) {
    reasons.push('Bajo índice glucémico para control de glucosa');
  }

  if (meal.lowSodium && userProfile.hasHypertension) {
    reasons.push('Bajo en sodio, ideal para hipertensión');
  }

  if (meal.highFiber) {
    reasons.push('Alto contenido de fibra para mejor digestión');
  }

  if (userProfile.mainGoal === 'weight-loss' && meal.carbs < 40) {
    reasons.push('Moderado en calorías para pérdida de peso');
  }

  if (userProfile.mainGoal === 'glucose') {
    reasons.push('Carbohidratos de absorción lenta');
  }

  return reasons;
}

export function generateDailyMeals(userProfile: UserProfile): Meal[] {
  const dietType = userProfile.dietType;
  const targetCarbsPerMeal = userProfile.dailyCarbsGoal / 3;

  // Select one meal from each category
  const breakfastOptions = mealDatabase.breakfast[dietType];
  const lunchOptions = mealDatabase.lunch[dietType];
  const dinnerOptions = mealDatabase.dinner[dietType];

  const selectedBreakfast = breakfastOptions[Math.floor(Math.random() * breakfastOptions.length)];
  const selectedLunch = lunchOptions[Math.floor(Math.random() * lunchOptions.length)];
  const selectedDinner = dinnerOptions[Math.floor(Math.random() * dinnerOptions.length)];

  return [
    {
      id: 'breakfast',
      type: 'breakfast',
      ...selectedBreakfast,
      baseCarbs: selectedBreakfast.carbs,
      portion: 100,
      reasons: generateReasons(selectedBreakfast, userProfile),
    },
    {
      id: 'lunch',
      type: 'lunch',
      ...selectedLunch,
      baseCarbs: selectedLunch.carbs,
      portion: 100,
      reasons: generateReasons(selectedLunch, userProfile),
    },
    {
      id: 'dinner',
      type: 'dinner',
      ...selectedDinner,
      baseCarbs: selectedDinner.carbs,
      portion: 100,
      reasons: generateReasons(selectedDinner, userProfile),
    },
  ];
}

export function generateSubstitutions(currentMeal: Meal, userProfile: UserProfile): Meal[] {
  const dietType = userProfile.dietType;
  const mealType = currentMeal.type;
  
  // Get all options for this meal type and diet
  const allOptions = mealDatabase[mealType][dietType];
  
  // Filter out the current meal and get 2-3 alternatives
  const alternatives = allOptions
    .filter(meal => meal.name !== currentMeal.name)
    .slice(0, 3)
    .map((meal, index) => ({
      id: `${mealType}-sub-${index}`,
      type: mealType,
      ...meal,
      baseCarbs: meal.carbs,
      portion: 100,
      reasons: generateReasons(meal, userProfile),
    }));

  return alternatives;
}
