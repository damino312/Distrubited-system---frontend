import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [rivers, setRivers] = useState([]);
  const [filters, setFilters] = useState({
    searchRiver: "",
    searchCountries: "",
    lengthFrom: "",
    lengthTo: "",
    sortField: "name_river",
    sortOrder: "asc",
  });
  const {
    searchRiver,
    searchCountries,
    lengthFrom,
    lengthTo,
    sortField,
    sortOrder,
  } = filters;

  useEffect(() => {
    loadRivers();
  }, []);

  const loadRivers = async () => {
    const result = await axios.get("http://localhost:8080/rivers");
    setRivers(result.data);
  };

  const deleteRiver = async (id) => {
    await axios.delete(`http://localhost:8080/river/${id}`);
    loadRivers();
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
  const filteredRivers = rivers.filter((river) => {
    // проверка поиска
    const searchByRiver = river.name_river
      .toLowerCase()
      .includes(searchRiver.toLowerCase());
    //проверка фильтрации
    const filteredByLength =
      (!lengthFrom || river.length_river >= parseInt(lengthFrom)) &&
      (!lengthTo || river.length_river <= parseInt(lengthTo));
    //проверка фильтрации
    const filteredByCountries = () => {
      if (searchCountries == "") return true;
      const countriesInField = searchCountries.split(" ");
      const countriesInLake = river.countries_river.map(
        (country) => country.name_country
      );

      return countriesInField.every((obj) =>
        countriesInLake.some((country) =>
          country.toLowerCase().includes(obj.toLowerCase())
        )
      );
    };

    //если соответствует каждому полю то будет отображаться
    return searchByRiver && filteredByLength && filteredByCountries();
  });
  // работа сортировка по столбцу

  const sortedLakes = filteredRivers.sort((a, b) => {
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
            placeholder="Поиск по названию"
            value={searchRiver}
            onChange={(e) => handleFilterChange("searchRiver", e.target.value)}
          />
        </div>
        <div className="mb-3 ">
          <label className="mr-2">Площадь:</label>
          <input
            type="text"
            className="form-control mr-2 mb-2"
            placeholder="От"
            value={lengthFrom}
            onChange={(e) => handleFilterChange("lengthFrom", e.target.value)}
          />
          <input
            type="text"
            className="form-control"
            placeholder="До"
            value={lengthTo}
            onChange={(e) => handleFilterChange("lengthTo", e.target.value)}
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
        <table className="table rounded rounded-4 overflow-hidden border shadow">
          <thead>
            <tr>
              <th scope="col" className="text-center">
                #
              </th>
              <th
                scope="col"
                className="text-center"
                onClick={() => handleSort("name_river")}
              >
                Название реки {getSortIcon("name_river")}
              </th>
              <th
                scope="col"
                className="text-center"
                onClick={() => handleSort("length_river")}
              >
                Длина, км {getSortIcon("length_river")}
              </th>
              <th scope="col" className="text-center">
                Страны с этой рекой
              </th>
              <th scope="col" className="text-center">
                Действие
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRivers.map((river, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td className="text-center">{river.name_river}</td>
                <td className="text-center">{river.length_river}</td>
                <td className="text-center">
                  {river.countries_river.map(
                    (country) => country.name_country + " "
                  )}
                </td>

                <td className="text-center">
                  <Link
                    className="btn btn-outline-primary mx-2"
                    to={`/editriver/${river.id_river}`}
                  >
                    Редактировать
                  </Link>
                  <button
                    className="btn btn-danger mx-2"
                    onClick={() => deleteRiver(river.id_river)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link className="btn btn-outline-dark" to="/addriver">
          Добавить реку
        </Link>
      </div>
    </div>
  );
}
