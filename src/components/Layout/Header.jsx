import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg text-center navbar-dark bg-dark">
        <div className="container">
            <a className="navbar-brand" href="/">
                <img src="https://www.petvalu.ca/file/general/brand-logo-petvalu_dark.svg" alt="Pet Valu Logo" height="40" />
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="/">Home</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Add Stock</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Remove Stock</a>
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
