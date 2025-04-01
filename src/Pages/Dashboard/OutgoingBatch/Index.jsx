import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './IndexOutgoingBatch.css';
import OutgoingBatchesList from './List/OutgoingBatchesList';
import OutgoingBatchesCreate from './Create/Create';
import OutgoingBatchesShow from './Show/Show';
import OutgoingBatchesEdit from './Edit/Edit';
import OutgoingBatchesSearch from './Search/Search';
import NotFound from '../../NotFound/NotFound';

const OutgoingBatches = () => {
  return (
    <div className="page-component">
      <Routes>
        <Route path="/" element={<OutgoingBatchesList />} />
        <Route path="/create" element={<OutgoingBatchesCreate />} />
        <Route path="/show/:id" element={<OutgoingBatchesShow />} />
        <Route path="/:id" element={<OutgoingBatchesEdit />} />
        {/* <Route path="/search" element={<OutgoingBatchesSearch />} /> */}
        <Route path="/search/:id" element={<OutgoingBatchesSearch />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default OutgoingBatches;
