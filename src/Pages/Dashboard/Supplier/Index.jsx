import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './IndexSupplier.css';
import SupplierList from './List/SuppliersList';
import SupplierCreate from './Create/Create';
import SupplierShow from './Show/Show';
import SupplierEdit from './Edit/Edit';
import NotFound from '../../NotFound/NotFound';

const Supplier = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<SupplierList />} />
        <Route path="/create" element={<SupplierCreate />} />
        <Route path="/show/:id" element={<SupplierShow />} />
        <Route path="/edit/:id" element={<SupplierEdit />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default Supplier;
