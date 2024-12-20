import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  display: block;
  flex: 1;
`;

const Button = styled.button`
  padding: 10px;
  border-radius: 4px;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
`;

const Label = styled.label`
  display: flex;
  font-size: 1rem;
`;

const IngredientRow = styled.div`
  display: flex;
  gap: 1rem;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  font-size: 20px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  transition: scale 0.2s;

  &:hover {
    scale: 1.2;
    font-weight: bold;
  }
`;

interface RecipeFormProps {
  initialData?: {
    name: string;
    ingredients: string[];
  };
  onSubmit: (data: { name: string; ingredients: string[]}) => void;
}

export function RecipeForm({ initialData, onSubmit }: RecipeFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [ingredients, setIngredients] = useState(initialData?.ingredients || [""]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { 
      name, 
      ingredients: ingredients.filter(i => i.trim() !== ""),
    };
    onSubmit(payload);
  };

  const removeIngredient = (indexToRemove: number) => {
    setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Label htmlFor="name">Recipe Name</Label>
      <Input
        id="name"
        type="text"
        placeholder="Recipe Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      
      <Label htmlFor="ingredients">Ingredients</Label>
      {ingredients.map((ingredient, index) => (
        <IngredientRow key={index}>
          <Input
            type="text"
            placeholder="Ingredient"
            value={ingredient}
            onChange={(e) => {
              const newIngredients = [...ingredients];
              newIngredients[index] = e.target.value;
              setIngredients(newIngredients);
            }}
          />
          {ingredients.length > 1 && (
            <RemoveButton
              type="button"
              onClick={() => removeIngredient(index)}
              title="Remove ingredient"
            >
              &times;
            </RemoveButton>
          )}
        </IngredientRow>
      ))}
      <Button 
        type="button" 
        onClick={() => setIngredients([...ingredients, ""])}
      >
        Add Ingredient
      </Button>
      <Button type="submit">Save Recipe</Button>
      <Link to="/">← Back to Recipes</Link>

    </Form>
  );
}
