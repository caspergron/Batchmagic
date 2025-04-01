import React from 'react';
import batchMagic from '../../../assets/Logo/BatchMagic.svg';
import Login from '../Login/Login';
import './Banner.css';
const Banner = () => {
  return (
    <div className="batch">
      <img className="batchmagic" src={batchMagic} alt="" />
      <Login />
    </div>
  );
};

export default Banner;
