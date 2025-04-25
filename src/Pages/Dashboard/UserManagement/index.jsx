import React from 'react';
import { Route, Routes } from 'react-router-dom';

import UserList from './Users/List/UserList';
import Create from './Users/Create/Create';
import Update from './Users/Update/Update';
import Show from './Users/Show/Show';
import NotFound from '../../NotFound/NotFound';
import RoleList from './Roles/RoleList';
import PermissionList from './Permissions/PermissionList';


const Users = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/create" element={<Create />} />
        <Route path="/show/:id" element={<Show />} />
        <Route path="/edit/:id" element={<Update />} />
        <Route path="/roles" element={<RoleList />} />
        <Route path='/permissions' element={<PermissionList />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default Users;
