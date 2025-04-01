import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './IndexShipment.css';
import ShipmentsList from './List/ShipmentsList';
import ShipmentsCreate from './Create/Create';
import ShipmentsShow from './Show/Show';
import ShipmentsEdit from './Edit/Edit';
import NotFound from '../../NotFound/NotFound';

const Shipments = () => {
  return (
    <div className="page-component">
      <Routes>
        <Route path="/" element={<ShipmentsList />} />
        <Route path="/create" element={<ShipmentsCreate />} />
        <Route path="/show/:id" element={<ShipmentsShow />} />
        <Route path="/edit/:id" element={<ShipmentsEdit />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default Shipments;
