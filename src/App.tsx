import React from 'react'
import './App.css'

import {
  Switch,
  Route,
} from "react-router-dom";
import { Home } from './components/Home';
import { RecipeDetail } from './components/RecipeDetail';
import { EditRecipe } from './components/EditRecipe';
import { CreateRecipe } from './components/CreateRecipe';

const App: React.FC = () => {

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/recipe/new">
        <CreateRecipe />
      </Route>
      <Route path="/recipe/:id/edit">
        <EditRecipe />
      </Route>
      <Route path="/recipe/:id">
        <RecipeDetail />
      </Route>
    </Switch>
  );
};


export default App
