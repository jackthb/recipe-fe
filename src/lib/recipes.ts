// Hardcoded -- this would presumably be the logged-in user's ID
export const AUTHOR_ID = "851bcf04-bcbe-45fc-8376-e984e0f010cd"

// Probably should live in an .env file
export const BASE_URL = 'http://localhost:8000'

export interface Recipe {
  id: string;
  name: string;
  author_id: string;
}

export interface RecipeProps extends Recipe {
  author_name: string;
  ingredients: {
    id: string;
    name: string;
  }[];
}

export interface EditRecipeProps {
  name: string;
  ingredients: string[];
}

export interface RecipesQueryProps {
  recipes: Recipe[];
}


// createRecipeMutation and editRecipeMutation are very similar could be combined in a real app
export async function createRecipeMutation(data: { name: string; ingredients: string[] }) {
  const response = await fetch(`${BASE_URL}/recipe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data, author_id: AUTHOR_ID }),
  });

  // Basic, naive error handling for each request
  if (!response.ok) {
    throw new Error('Failed to delete recipe');
  }

  return response.json();
}

export async function editRecipeMutation(id: string, data: EditRecipeProps) {
  const response = await fetch(`${BASE_URL}/recipe/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data, author_id: AUTHOR_ID }),
  });

  if (!response.ok) {
    throw new Error('Failed to delete recipe');
  }

  return response.json();
}

export async function deleteRecipeMutation(id: string) {
  const response = await fetch(`${BASE_URL}/recipe/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error('Failed to delete recipe');
  }
}

export async function recipeQuery(id: string) {
  const response = await fetch(`${BASE_URL}/recipe/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch recipes");
  }

  return response.json();
}
export async function recipesQuery() {
  const response = await fetch(`${BASE_URL}/recipes`);

  if (!response.ok) {
    throw new Error("Failed to fetch recipes");
  }

  return response.json();
}