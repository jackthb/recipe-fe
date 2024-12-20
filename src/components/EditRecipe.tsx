import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useHistory, useParams } from "react-router-dom";
import { BASE_URL } from "../App";
import { RecipeForm } from "./RecipeForm";
import { AUTHOR_ID } from "./CreateRecipe";
import { Card } from "./RecipeDetail";
import { Header } from "./Home";
import styled from "styled-components";

export const Title = styled.h2`
  color: #333;
  margin: 0;
`;

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
                body: JSON.stringify({ ...data, author_id: AUTHOR_ID }),
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
