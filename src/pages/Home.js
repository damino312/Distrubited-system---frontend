import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    loadCountries();
  });

  const loadCountries = async () => {
    const result = await axios.get("http://localhost:8080/counties");
    setCountries(result.data);
  };

  const deleteCountry = async (id) => {
    await axios.delete(`http://localhost:8080/country/${id}`);
    loadCountries();
  };

  return (
    <div className="container">
      <table class="table border shadow">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Название страны</th>
            <th scope="col">Столица</th>
            <th scope="col">Площадь, кв.км.</th>
            <th scope="col">Население</th>
            <th scope="col">Действие</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((country, index) => (
            <tr>
              <th scope="row" key={index}>
                {index + 1}
              </th>
              <td>{country.name}</td>
              <td>{country.capital}</td>
              <td>{country.area}</td>
              <td>{country.population}</td>
              <td>
                <Link
                  className="btn btn-outline-primary mx-2"
                  to={`/editcountry/${country.id}`}
                >
                  Редактировать
                </Link>
                <button
                  className="btn btn-danger mx-2"
                  onClick={() => deleteCountry(country.id)}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
