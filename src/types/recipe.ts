export interface Recipe {
  title: string;
  ingredients: string[];
  steps: string[];
}

export interface RecipeResponse {
  recipe: Recipe;
}
