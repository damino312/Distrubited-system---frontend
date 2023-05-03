import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ListCountries() {
  return (
    <div className="accordion" id="accordionExample">
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button
            className="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="true"
            aria-controls="collapseOne"
          >
            Выберите страну
          </button>
        </h2>
        <div
          id="collapseOne"
          className="accordion-collapse collapse show"
          data-bs-parent="#accordionExample"
        >
          <div className="accordion-body">
            {countries.map((country) => (
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={country}
                  id="flexCheckDefault"
                ></input>

                <label className="form-check-label" htmlFor="flexCheckDefault">
                  {country.name_country}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
