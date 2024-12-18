import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../App";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

interface Recipe {
  id: number;
  name: string;
  author_id: string;
}

const PageContainer = styled.div`
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 3rem;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #333;
  margin: 0;
`;

const CreateButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    background: #218838;
  }
`;

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

const Button = styled.button<{ variant?: 'primary' | 'danger' }>`
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  background: ${props => 
    props.variant === 'danger' 
      ? '#dc3545' 
      : props.variant === 'primary' 
        ? '#007bff' 
        : '#6c757d'};
  color: white;
  
  &:hover {
    background: ${props => 
      props.variant === 'danger' 
        ? '#c82333' 
        : props.variant === 'primary' 
          ? '#0056b3' 
          : '#5a6268'};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

export function Home() {
  const history = useHistory();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["recipes"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/recipes`);
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${BASE_URL}/recipe/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
  });

  if (isLoading) return <EmptyState>Loading recipes...</EmptyState>;
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
