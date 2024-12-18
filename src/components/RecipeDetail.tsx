import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useHistory } from "react-router-dom";
import { BASE_URL } from "../App";
import styled from "styled-components";

interface RecipeDetail {
    id: number;
    name: string;
    author_id: string;
    author_name: string;
    ingredients: {
        id: string;
        name: string;
    }[];
}

const Card = styled.div`
    background: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 20px auto;
    text-align: left;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

const Button = styled.button`
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 10px;
    background: #007bff;
    color: white;
    border: none;

    &:hover {
        background: #0056b3;
    }
`;

const IngredientList = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const IngredientItem = styled.li`
    padding: 8px 0;
    border-bottom: 1px solid #eee;
    &:last-child {
        border-bottom: none;
    }
`;

const AuthorInfo = styled.p`
    color: #666;
    font-style: italic;
`;

export function RecipeDetail() {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();

    const { data, isLoading, error } = useQuery<RecipeDetail>({
        queryKey: ['recipe', id],
        queryFn: async () => {
            const response = await fetch(`${BASE_URL}/recipe/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch recipe');
            }
            return response.json();
        },
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading recipe</div>;
    if (!data) return <div>No recipe found</div>;

    return (
        <Card>
            <Header>
                <Link to="/">← Back to Recipes</Link>
                <div>
                    <Button onClick={() => history.push(`/recipe/${id}/edit`)}>
                        Edit Recipe
                    </Button>
                </div>
            </Header>

            <h1>{data.name}</h1>
            <AuthorInfo>Created by {data.author_name}</AuthorInfo>

            <h3>Ingredients:</h3>
            <IngredientList>
                {data.ingredients.map(ingredient => (
                    <IngredientItem key={ingredient.id}>
                        {ingredient.name}
                    </IngredientItem>
                ))}
            </IngredientList>
        </Card>
    );
}
