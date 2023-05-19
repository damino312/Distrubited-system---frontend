import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [lakes, setLakes] = useState([]);
  const [filters, setFilters] = useState({
    searchLake: "",
    searchCountries: "",
    areaFrom: "",
    areaTo: "",
    sortField: "name_lake",
    sortOrder: "asc",
  });
  const {
    searchLake,
    searchCountries,
    areaFrom,
    areaTo,
    sortField,
    sortOrder,
  } = filters;

  useEffect(() => {
    loadLakes();
  }, []);

  const loadLakes = async () => {
    const result = await axios.get("http://localhost:8080/lakes");
    setLakes(result.data);
  };

  const deleteLake = async (id) => {
    await axios.delete(`http://localhost:8080/lake/${id}`);
    loadLakes();
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
  const filteredLakes = lakes.filter((lake) => {
    // проверка поиска
    const searchByLake = lake.name_lake
      .toLowerCase()
      .includes(searchLake.toLowerCase());
    //проверка фильтрации
    const filteredByArea =
      (!areaFrom || lake.area_lake >= parseInt(areaFrom)) &&
      (!areaTo || lake.area_lake <= parseInt(areaTo));
    //проверка фильтрации
    const filteredByCountries = () => {
      if (searchCountries == "") return true;
      const countriesInField = searchCountries.split(" ");
      const countriesInLake = lake.countries_lake.map(
        (country) => country.name_country
      );

      return countriesInField.every((obj) =>
        countriesInLake.some((country) =>
          country.toLowerCase().includes(obj.toLowerCase())
        )
      );
    };

    //если соответствует каждому полю то будет отображаться
    return searchByLake && filteredByArea && filteredByCountries();
  });
  // работа сортировка по столбцу

  const sortedLakes = filteredLakes.sort((a, b) => {
    if (sortOrder === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

  return (
    <div className="container d-flex">
      <div className="p-2">
        <div className="mb-3">
          <label className="mr-2">Поиск:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Поиск по озерам"
            value={searchLake}
            onChange={(e) => handleFilterChange("searchLake", e.target.value)}
          />
        </div>
        <div className="mb-3 ">
          <label className="mr-2">Площадь:</label>
          <input
            type="text"
            className="form-control mr-2 mb-2"
            placeholder="От"
            value={areaFrom}
            onChange={(e) => handleFilterChange("areaFrom", e.target.value)}
          />
          <input
            type="text"
            className="form-control"
            placeholder="До"
            value={areaTo}
            onChange={(e) => handleFilterChange("areaTo", e.target.value)}
          />
        </div>
        <div className="mb-3 ">
          <label className="mr-2">Включает страны:</label>
          <input
            type="text"
            className="form-control mr-2 mb-2"
            placeholder="Страны"
            value={searchCountries}
            onChange={(e) =>
              handleFilterChange("searchCountries", e.target.value)
            }
          />
        </div>
      </div>
      <div className="p-2">
        <table className="table border shadow">
          <thead>
            <tr>
              <th scope="col" className="text-center">
                #
              </th>
              <th
                scope="col"
                className="text-center"
                onClick={() => handleSort("name_lake")}
              >
                Название озера {getSortIcon("name_lake")}
              </th>
              <th
                scope="col"
                className="text-center"
                onClick={() => handleSort("area_lake")}
              >
                Площадь, км² {getSortIcon("area_lake")}
              </th>
              <th scope="col" className="text-center">
                Страны с этим озером
              </th>
              <th scope="col" className="text-center">
                Действие
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedLakes.map((lake, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td className="text-center">{lake.name_lake}</td>
                <td className="text-center">{lake.area_lake}</td>
                <td className="text-center">
                  {lake.countries_lake.map(
                    (country) => country.name_country + " "
                  )}
                </td>

                <td className="text-center">
                  <Link
                    className="btn btn-outline-primary mx-2"
                    to={`/editlake/${lake.id_lake}`}
                  >
                    Редактировать
                  </Link>
                  <button
                    className="btn btn-danger mx-2"
                    onClick={() => deleteLake(lake.id_lake)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link className="btn btn-outline-dark" to="/addlake">
          Добавить озеро
        </Link>
      </div>
    </div>
  );
}
