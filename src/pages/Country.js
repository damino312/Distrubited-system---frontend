import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [sortField, setSortField] = useState("name_country");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const [areaFrom, setAreaFrom] = useState("");
  const [areaTo, setAreaTo] = useState("");

  const [populationFrom, setPopulationFrom] = useState("");
  const [populationTo, setPopulationTo] = useState("");

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    const result = await axios.get("http://localhost:8080/counties");
    setCountries(result.data);
  };

  const deleteCountry = async (id) => {
    await axios.delete(`http://localhost:8080/country/${id}`);
    loadCountries();
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleAreaFromChange = (e) => {
    setAreaFrom(e.target.value);
  };

  const handleAreaToChange = (e) => {
    setAreaTo(e.target.value);
  };

  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortOrder === "asc" ? (
        <i className="bi bi-arrow-up"></i>
      ) : (
        <i className="bi bi-arrow-down"></i>
      );
    }
    return <span style={{ width: "16px", display: "inline-block" }}></span>;
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // сортировка по столбцам
  const sortedCountries = countries.sort((a, b) => {
    if (sortOrder === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

  //поиск по имени
  const filteredCountries = sortedCountries.filter((country) =>
    country.name_country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //фильтрация
  const filteredByArea = filteredCountries.filter((country) => {
    if (areaFrom && areaTo) {
      return (
        country.area_country >= parseInt(areaFrom) &&
        country.area_country <= parseInt(areaTo)
      );
    } else if (areaFrom) {
      return country.area_country >= parseInt(areaFrom);
    } else if (areaTo) {
      return country.area_country <= parseInt(areaTo);
    }
    return true;
  });

  return (
    <div className="container d-flex ">
      <div className="p-2">
        <div className="mb-3">
          <label className="mr-2">Поиск:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Поиск по стране"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="mb-3 ">
          <label className="mr-2">Площадь:</label>

          <input
            type="text"
            className="form-control mr-2 mb-2"
            placeholder="От"
            value={areaFrom}
            onChange={handleAreaFromChange}
          />
          <input
            type="text"
            className="form-control"
            placeholder="До"
            value={areaTo}
            onChange={handleAreaToChange}
          />
        </div>
      </div>
      <div className="p-2">
        <table className="table border shadow rounded rounded-4 overflow-hidden">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col" onClick={() => handleSort("name_country")}>
                Название страны {getSortIcon("name_country")}
              </th>
              <th scope="col" onClick={() => handleSort("capital_country")}>
                Столица {getSortIcon("capital_country")}
              </th>
              <th scope="col" onClick={() => handleSort("area_country")}>
                Площадь, кв.км. {getSortIcon("area_country")}
              </th>
              <th scope="col" onClick={() => handleSort("population_country")}>
                Население {getSortIcon("population_country")}
              </th>
              <th scope="col" className="text-center">
                Действие
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredByArea.map((country, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{country.name_country}</td>
                <td>{country.capital_country}</td>
                <td>{country.area_country}</td>
                <td>{country.population_country}</td>
                <td>
                  <Link
                    className="btn btn-outline-info mx-2"
                    to={`/countryview/${country.id_country}`}
                  >
                    Информация
                  </Link>
                  <Link
                    className="btn btn-outline-primary mx-2"
                    to={`/editcountry/${country.id_country}`}
                  >
                    Редактировать
                  </Link>
                  <button
                    className="btn btn-danger mx-2"
                    onClick={() => deleteCountry(country.id_country)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link className="btn btn-outline-dark" to="/addcountry">
          Add Country
        </Link>
      </div>
    </div>
  );
}
