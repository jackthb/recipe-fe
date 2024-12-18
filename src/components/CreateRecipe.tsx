import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useHistory } from "react-router-dom";
import { RecipeForm } from "./RecipeForm";
import { BASE_URL } from "../App";

// Hardcoded -- this would presumably be the logged-in user's ID
const AUTHOR_ID = "851bcf04-bcbe-45fc-8376-e984e0f010cd"

export function CreateRecipe() {
  const history = useHistory();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: { name: string; ingredients: string[] }) => {
      const response = await fetch(`${BASE_URL}/recipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...data, author_id: AUTHOR_ID}),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      history.push("/");
    },
  });

  return (
    <div>
      <h1>Create New Recipe</h1>
      <RecipeForm onSubmit={(data) => mutation.mutate(data)} />
    </div>
  );
}
