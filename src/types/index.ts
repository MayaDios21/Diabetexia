export interface UserProfile {
  // Step 1
  age: number;
  weight: number;
  height: number;
  bmi: number;
  recentGlucose: number;
  hba1c: number;
  season: 'winter' | 'non-winter';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  
  // Step 2
  primaryGoal: 'glucose-control' | 'weight-loss';
  allergies: string[];
  dietType: 'omnivore' | 'vegetarian';
  hasHypertension?: boolean;
}

export interface MealComponent {
  name: string;
  portion: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  portionMultiplier: 0.5 | 0.75 | 1;
}

export interface MealRecommendation {
  id: string;
  name: string;
  imageQuery: string;
  protein: MealComponent;
  carbohydrate: MealComponent;
  vegetable: MealComponent;
  reasons: string[];
  totalCarbs: number;
  totalCalories: number;
  mealType: 'breakfast' | 'lunch' | 'dinner';
}

export interface Substitute {
  name: string;
  portion: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  reason: string;
}
