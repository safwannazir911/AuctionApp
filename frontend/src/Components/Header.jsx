import React, { useState } from 'react';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import  Home  from './Home';
import CreateListing from "./CreateListing"
import MyListings from "./MyListings"
import Entry from "./Entry"

export const Header = () => {
  const [isNavOpen, setNavOpen] = useState(false);

  const toggleNav = () => {
    setNavOpen(!isNavOpen);
  };

  return (
    <BrowserRouter>
      <div>
        <nav className="navbar navbar-expand-lg nav ">
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              onClick={toggleNav}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav">
                <Link to="/home" className="nav-link active" aria-current="page">Home</Link>
                <Link to="/createlisting" className="nav-link" >Create Listing </Link>
                <Link to="/mylistings" className="nav-link" >My Listings </Link>       
                <Link to="/entry" className="nav-link" >Login/Register</Link>
            </div>
            </div>
          </div>
        </nav>

        <div className={`offcanvas offcanvas-start ${isNavOpen ? 'show' : ''}`} id="offcanvas" tabIndex="-1" aria-labelledby="offcanvasLabel">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasLabel">Menu</h5>
              <button
                type="button"
                className="btn-close text-reset"
                onClick={toggleNav}
              ></button>
            </div>
            <div className="offcanvas-body">
              <ul className="nav flex-column position-relative">
                <li className="nav-item">
                  <Link to="/home" className="nav-link active" onClick={toggleNav}>
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/createlisting" className="nav-link" onClick={toggleNav}>
                    Create Listing
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/mylistings" className="nav-link" onClick={toggleNav}>
                  My Listings
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/entry" className="nav-link" onClick={toggleNav}>
                  Login/Register
                  </Link>
                </li>
              </ul>
        
          </div>

        </div>

      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/createlisting" element={<CreateListing />} />
          <Route path="/mylistings" element={<MyListings />} />
          <Route path="/entry" element={<Entry />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};
