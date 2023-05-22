import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: "",
    areaFrom: "",
    areaTo: "",
    populationFrom: "",
    populationTo: "",
    sortField: "name_country",
    sortOrder: "asc",
  });
  const { sortField, sortOrder } = filters;

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
  //сортировка по столбцу
  const handleSort = (field) => {
    setFilters((prevFilters) => {
      if (prevFilters.sortField === field) {
        return {
          ...prevFilters,
          sortOrder: prevFilters.sortOrder === "asc" ? "desc" : "asc",
        };
      } else {
        return {
          ...prevFilters,
          sortField: field,
          sortOrder: "asc",
        };
      }
    });
  };
  //фильтрация по полям "от" и "до"
  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };
  //выставляем иконку
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
  //обрабатываем все филтры для каждой записи в таблице, если соответсвует каждому фильтру, то запись будет отображена
  const filteredCountries = countries.filter((country) => {
    const { searchTerm, areaFrom, areaTo, populationFrom, populationTo } =
      filters;
    // проверка поиска
    const filteredBySearch = country.name_country
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    //проверка фильтрации
    const filteredByArea =
      (!areaFrom || country.area_country >= parseInt(areaFrom)) &&
      (!areaTo || country.area_country <= parseInt(areaTo));
    //проверка фильтрации
    const filteredByPopulation =
      (!populationFrom ||
        country.population_country >= parseInt(populationFrom)) &&
      (!populationTo || country.population_country <= parseInt(populationTo));
    //если соответствует каждому полю то будет отображаться
    return filteredBySearch && filteredByArea && filteredByPopulation;
  });
  // работа сортировка по столбцу
  const sortedCountries = filteredCountries.sort((a, b) => {
    if (sortOrder === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

  return (
    <div className="container d-flex ">
      <div className="p-2">
        <div className="mb-3">
          <label className="mr-2">Поиск:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Поиск по названию"
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
          />
        </div>
        <div className="mb-3 ">
          <label className="mr-2">Площадь:</label>
          <input
            type="text"
            className="form-control mr-2 mb-2"
            placeholder="От"
            value={filters.areaFrom}
            onChange={(e) => handleFilterChange("areaFrom", e.target.value)}
          />
          <input
            type="text"
            className="form-control"
            placeholder="До"
            value={filters.areaTo}
            onChange={(e) => handleFilterChange("areaTo", e.target.value)}
          />
        </div>
        <div className="mb-3 ">
          <label className="mr-2">Население:</label>
          <input
            type="text"
            className="form-control mr-2 mb-2"
            placeholder="От"
            value={filters.populationFrom}
            onChange={(e) =>
              handleFilterChange("populationFrom", e.target.value)
            }
          />
          <input
            type="text"
            className="form-control"
            placeholder="До"
            value={filters.populationTo}
            onChange={(e) => handleFilterChange("populationTo", e.target.value)}
          />
        </div>
      </div>
      <div className="p-2">
        <table className="table border shadow rounded rounded-4 overflow-hidden">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th
                scope="col"
                className="text-center"
                onClick={() => handleSort("name_country")}
              >
                Название страны {getSortIcon("name_country")}
              </th>
              <th
                scope="col"
                className="text-center"
                onClick={() => handleSort("capital_country")}
              >
                Столица {getSortIcon("capital_country")}
              </th>
              <th
                scope="col"
                className="text-center"
                onClick={() => handleSort("area_country")}
              >
                Площадь, км² {getSortIcon("area_country")}
              </th>
              <th
                scope="col"
                className="text-center"
                onClick={() => handleSort("population_country")}
              >
                Население, тыс. ч {getSortIcon("population_country")}
              </th>
              <th scope="col" className="text-center">
                Действие
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedCountries.map((country, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td className="text-center">{country.name_country}</td>
                <td className="text-center">{country.capital_country}</td>
                <td className="text-center">{country.area_country}</td>
                <td className="text-center">{country.population_country}</td>
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
