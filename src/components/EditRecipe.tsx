import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useHistory, useParams } from "react-router-dom";
import { RecipeForm } from "./RecipeForm";
import styled from "styled-components";
import { editRecipeMutation, EditRecipeProps, RecipeProps, recipeQuery } from "../lib/recipes";
import { Card, Header } from "./Primitives/Containers";

export const Title = styled.h2`
  color: #333;
  margin: 0;
`;

export function EditRecipe() {
    const { id } = useParams<{ id: string }>();
    const { push } = useHistory();
    const queryClient = useQueryClient();

    const { data } = useQuery<RecipeProps>({
        queryKey: ["recipe", id],
        queryFn: () => recipeQuery(id)
    });

    const mutation = useMutation({
        mutationFn: (data: EditRecipeProps) => editRecipeMutation(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recipe", id] });
            push("/")
        }
    });

    if (!data) return <div>Loading...</div>;

    return (
        <Card>
            <Header>
                <Title>Edit Recipe</Title>
            </Header>
            <RecipeForm
                initialData={{
                    name: data.name,
                    ingredients: data.ingredients.map((i: {
                        name: string;
                        id: string;
                    }) => i.name),
                }}
                onSubmit={(data) => mutation.mutate(data)}
            />
        </Card>
    );
}
