import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark  bg-primary">
        <div className="container-fluid">
          <Link className="navbar-brand" to={`/`}>
            Full Stack Application
          </Link>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav right">
              <li className="nav-item">
                <Link className="nav-link" to={`/country`}>
                  Страны
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={`/nationality`}>
                  Национальности
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={`/river`}>
                  Реки
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={`/mountain`}>
                  Горы
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={`/lake`}>
                  Озера
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
