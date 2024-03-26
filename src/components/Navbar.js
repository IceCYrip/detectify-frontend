import React, { useState } from "react";
import "../css/Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Index = () => {
  const menus = [
    { label: "Home", url: "/" },
    // { label: 'Manufacturer', url: '/manufacturer' },
    // { label: 'Buyer', url: '/buyer' },
    // { label: "About Us", url: "/about-us" },
    // { label: "Support", url: "/support" },
  ];

  const routeTo = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { auth, setAuth } = useAuth();

  const logout = () => {
    setAuth({});
    routeTo("/login");
  };

  return (
    <div className="wrapper">
      {/* <b>
        <Link to="/">Detectify</Link>
      </b> */}
      <Link to="/">
        <img src="/detectifyLogo.png" alt="logo" width={165} />
      </Link>
      <div className="navMenus">
        {/* {menus?.map((obj, i) => (
          <Link key={i} to={obj.url}>
            {obj.label}
          </Link>
        ))} */}
        {currentPath !== "/" && <Link to={"/"}>Home</Link>}
        {/* {isLoggedIn && (
          <img
            // src='/Logout.svg'
            src="/logout1.svg"
            alt="logout"
            className="logoutImg"
            onClick={() => logout()}
          />
        )} */}
        {auth.role && (
          <span className="logoutButton" onClick={logout}>
            Logout
          </span>
        )}
      </div>
    </div>
  );
};

export default Index;
