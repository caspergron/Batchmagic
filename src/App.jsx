import { RouterProvider } from 'react-router-dom';
import './App.css';
import router from './Routes/Routes/Routes';
import * as Sentry from '@sentry/react';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';

function App() {
  return (
    <div className="App">
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default Sentry.withProfiler(App);
