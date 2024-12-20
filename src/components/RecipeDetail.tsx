import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useHistory } from "react-router-dom";
import styled from "styled-components";
import { RecipeProps, recipeQuery } from "../lib/recipes";
import { Card } from "./Primitives/Containers";
import { Button } from "./Primitives/Button";

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
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

const Title = styled.h2`
  color: #333;
  margin: 0;
`;

export function RecipeDetail() {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();

    const { data, isLoading, error } = useQuery<RecipeProps>({
        queryKey: ['recipe', id],
        queryFn: () => recipeQuery(id),
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
            <Title>{data.name}</Title>
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
