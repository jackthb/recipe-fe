import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useHistory } from "react-router-dom";
import { RecipeForm } from "./RecipeForm";
import { createRecipeMutation } from "../lib/recipes";

export function CreateRecipe() {
  const history = useHistory();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createRecipeMutation,
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
