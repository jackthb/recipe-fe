import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { Button, CreateButton } from "./Primitives/Button";
import { Recipe, RecipesQueryProps, deleteRecipeMutation, recipesQuery } from "../lib/recipes";
import { Title } from "./EditRecipe";
import { PageContainer, Header } from "./Primitives/Containers";

const RecipeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const RecipeCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: left;
`;

const RecipeName = styled.h3`
  margin: 0 0 15px 0;
  color: #333;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;


const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

export function Home() {
  const history = useHistory();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<RecipesQueryProps>({
    queryKey: ["recipes"],
    queryFn: recipesQuery
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRecipeMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
  });

  if (isLoading) return (<EmptyState>Loading recipes...</EmptyState>);
  if (error) return <EmptyState>Error loading recipes</EmptyState>;

  if (!data?.recipes?.length) {
    return (
      <PageContainer>
        <Header>
          <Title>Recipes</Title>
          <CreateButton onClick={() => history.push('/recipe/new')}>
            Create Recipe
          </CreateButton>
        </Header>
        <EmptyState>
          <p>No recipes found. Create your first recipe!</p>
        </EmptyState>
      </PageContainer>
    );
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete recipe:', error);
      }
    }
  };

  return (
    <PageContainer>
      <Header>
        <Title>Recipes</Title>
        <CreateButton onClick={() => history.push('/recipe/new')}>
          Create Recipe
        </CreateButton>
      </Header>

      <RecipeGrid>
        {data.recipes.map((recipe: Recipe) => (
          <RecipeCard key={recipe.id}>
            <RecipeName>{recipe.name}</RecipeName>
            <ButtonGroup>
              <Button 
                variant="primary"
                onClick={() => history.push(`/recipe/${recipe.id}`)}
              >
                View
              </Button>
              <Button 
                onClick={() => history.push(`/recipe/${recipe.id}/edit`)}
              >
                Edit
              </Button>
              <Button 
                variant="danger"
                onClick={() => handleDelete(recipe.id)}
              >
                Delete
              </Button>
            </ButtonGroup>
          </RecipeCard>
        ))}
      </RecipeGrid>
    </PageContainer>
  );
}
