import React, { useEffect, useState, useContext } from "react";

export default function ListCountries(props) {
  const [countries, setCountries] = useState([]);

  function handleChange(e) {
    const countryData = e.target.dataset.country;
    const country = JSON.parse(countryData);
    const isChecked = e.target.checked;
    if (isChecked) {
      setCountries([...countries, country]);
      props.choosemessage([...countries, country]);
    } else {
      setCountries(
        countries.filter((c) => c.id_country !== country.id_country)
      );
      props.choosemessage(
        countries.filter((c) => c.id_country !== country.id_country)
      );
    }
  }
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
            {props.countries.map((country) => (
              <div className="form-check" key={country.id_country}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={country.id_country}
                  onChange={handleChange}
                  id="id_country"
                  data-country={JSON.stringify(country)}
                ></input>

                <label
                  className="form-check-label"
                  htmlFor={country.id_country}
                >
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
