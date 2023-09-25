import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './layout.css';


const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg text-center navbar-dark bg-dark">
        <div className="container">
            <a className="navbar-brand" href="/">
                <img src="https://www.petvalu.ca/file/general/brand-logo-petvalu_dark.svg" alt="Pet Valu Logo" height="40" />
            </a>
            <div className="mobNav notMobileHidden">
            <input type="checkbox" className="mobNavToggler navbar-toggler" />
            <div className="mobNavBurger">
                <div></div>
            </div>
            <div className="mobNavMenu">
                <div>
                    <div>
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="/add_stock">Add Stock</a></li>
                            <li><a href="/dg">Remove Stock</a></li>
                            <li><a href="/expiring_soon">Expiring Soon</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
            <div className="collapse navbar-collapse mobNavMenu" id="navbarNav">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="/">Home</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/add_stock">Add Stock</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/dg">Remove Stock</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/expiring_soon">Expiring Soon</a>
                    </li>
                </ul>
            </div>
        </div>


    </nav>
  );
}

export default Header;
