import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './IndexProduct.css';
import ProductCreate from './Create/Create';
import ProductShow from './Show/Show';
import NotFound from '../../../Pages/NotFound/NotFound';
import ProductList from './List/ProductsList';
import ProductEdit from './Edit/Edit';
import StockList from './Stock/List/StocksList';
import StockCreate from './Stock/Create/Create';
import StockShow from './Stock/Show/Show';
import StockEdit from './Stock/Edit/Edit';

const Products = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/create" element={<ProductCreate />} />
        <Route path="/show/:id" element={<ProductShow />} />
        <Route path="/edit/:id" element={<ProductEdit />} />
        <Route path="/stock" element={<StockList />} />
        <Route path="/stock/create" element={<StockCreate />} />
        <Route path="/stock/show/:id" element={<StockShow />} />
        <Route path="/stock/edit/:id" element={<StockEdit />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default Products;
