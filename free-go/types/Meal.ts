export type Ingredient = {
    ingredient: string;
    quantity: string;
};

export type Instruction = {
    step: number;
    description: string;
};

export type Meal = {
    recipeName: string;
    ingredients: Ingredient[];
    instructions: Instruction[];
};

export type Meals = Meal[];
