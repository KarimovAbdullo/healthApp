export type FoodEntry = {
  name: string;
  unit: string;
  calories: number;
  category?: string;
};

export type FilteredFood = {
  item: FoodEntry;
  originalIndex: number;
};

export type SelectedFood = {
  id: string;
  item: FoodEntry;
  originalIndex?: number;
  qty: number;
};

