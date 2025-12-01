export interface Recipe {
  title: string;
  ingredients: string[];
  steps: string[];
}
export type Errors<T extends string> = {
  [K in T]: string;
};
