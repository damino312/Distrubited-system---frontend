import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-body-tertiary bg-primary">
        <div className="container-fluid">
          <Link className="navbar-brand" to={`/`}>
            Full Stack Application
          </Link>

          <div class="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav right">
              <li className="nav-item">
                <Link className="nav-link" to={`/country`}>
                  Страны
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={`/country`}>
                  Национальности
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={`/country`}>
                  Реки
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={`/country`}>
                  Горы
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={`/country`}>
                  Озера
                </Link>
              </li>
            </ul>
            <Link className="btn btn-outline-light" to="/addcountry">
              Add Country
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
