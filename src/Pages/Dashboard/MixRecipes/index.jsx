import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './IndexMixRecipes.css';
import './mix-recipes.css';
import MixRecipeList from './List/MixRecipesList';
import MixRecipesCreate from './Create/Create';
import MixRecipesShow from './Show/Show';
import MixRecipesEdit from './Edit/Edit';
import MixRecipesDuplicate from './Duplicate/Duplicate';
import NotFound from '../../NotFound/NotFound';
import ExpenseList from './ExpenseList/ExpenseList';

const MixRecipes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<MixRecipeList />} />
        <Route path="/expenselist/:id" element={<ExpenseList />} />
        <Route path="/create" element={<MixRecipesCreate />} />
        <Route path="/show/:id" element={<MixRecipesShow />} />
        <Route path="/edit/:id" element={<MixRecipesEdit />} />
        <Route path="/duplicate/:id" element={<MixRecipesDuplicate />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default MixRecipes;
