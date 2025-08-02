import React from "react";
import logo from '../assets/logo.png';

const AuthLayout = ({ children }) => {
  return (
    <>
      <header className="flex justify-center items-center shadow-md bg-white h-25">
        <img src={logo} alt="logo" width={180} height={60} />
        
      </header>
      {children}
    </>
  );
};

export default AuthLayout;
