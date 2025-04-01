import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './IndexCustomer.css';
import CustomerList from './List/CustomerList';
import CustomersCreate from './Create/Create';
import CustomersShow from './Show/Show';
import CustomersEdit from './Edit/Edit';
import NotFound from '../../NotFound/NotFound';
import PriceList from './PriceList/PriceList';

const Customers = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<CustomerList />} />
        <Route path="/pricelist/:id" element={<PriceList />} />
        <Route path="/create" element={<CustomersCreate />} />
        <Route path="/show/:id" element={<CustomersShow />} />
        <Route path="/edit/:id" element={<CustomersEdit />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default Customers;
