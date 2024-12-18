import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useHistory, useParams } from "react-router-dom";
import { BASE_URL } from "../App";
import { RecipeForm } from "./RecipeForm";

export function EditRecipe() {
    const { id } = useParams<{ id: string }>();
    const { push } = useHistory();
    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryKey: ["recipe", id],
        queryFn: async () => {
            const response = await fetch(`${BASE_URL}/recipe/${id}`);
            return response.json();
        },
    });

    const mutation = useMutation({
        mutationFn: async (data: { name: string; ingredients: string[] }) => {
            const response = await fetch(`${BASE_URL}/recipe/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recipe", id] });
            push("/")
        }
    });

    if (!data) return <div>Loading...</div>;

    return (
        <div>
            <h1>Edit Recipe</h1>
            <RecipeForm
                initialData={{
                    id: data.id,
                    name: data.name,
                    ingredients: data.ingredients.map((i: {
                        name: string;
                        id: string;
                    }) => i.name),
                    author_id: data.author_id,
                }}
                onSubmit={(data) => mutation.mutate(data)}
            />
        </div>
    );
}
