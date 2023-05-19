import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [mountains, setMountains] = useState([]);
  const [filters, setFilters] = useState({
    searchMountain: "",
    searchCountries: "",
    heightFrom: "",
    heightTo: "",
    sortField: "name_mountain",
    sortOrder: "asc",
  });
  const {
    searchMountain,
    searchCountries,
    heightFrom,
    heightTo,
    sortField,
    sortOrder,
  } = filters;

  useEffect(() => {
    loadMountains();
  }, []);

  const loadMountains = async () => {
    const result = await axios.get("http://localhost:8080/mountains");
    setMountains(result.data);
  };

  const deleteMountain = async (id) => {
    await axios.delete(`http://localhost:8080/mountain/${id}`);
    loadMountains();
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
  const filteredMountains = mountains.filter((mountain) => {
    // проверка поиска
    const searchByMountain = mountain.name_mountain
      .toLowerCase()
      .includes(searchMountain.toLowerCase());
    //проверка фильтрации
    const filteredByHeight =
      (!heightFrom || mountain.height_mountain >= parseInt(heightFrom)) &&
      (!heightTo || mountain.height_mountain <= parseInt(heightTo));
    //проверка фильтрации
    const filteredByCountries = () => {
      if (searchCountries == "") return true;
      const countriesInField = searchCountries.split(" ");
      const countriesInMountain = mountain.countries_mountain.map(
        (country) => country.name_country
      );
      console.log(mountain);

      return countriesInField.every((obj) =>
        countriesInMountain.some((country) =>
          country.toLowerCase().includes(obj.toLowerCase())
        )
      );
    };

    //если соответствует каждому полю то будет отображаться
    return searchByMountain && filteredByHeight && filteredByCountries();
  });
  const sortedMountains = filteredMountains.sort((a, b) => {
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
            value={searchMountain}
            onChange={(e) =>
              handleFilterChange("searchMountain", e.target.value)
            }
          />
        </div>
        <div className="mb-3 ">
          <label className="mr-2">Высота:</label>
          <input
            type="text"
            className="form-control mr-2 mb-2"
            placeholder="От"
            value={heightFrom}
            onChange={(e) => handleFilterChange("heightFrom", e.target.value)}
          />
          <input
            type="text"
            className="form-control"
            placeholder="До"
            value={heightTo}
            onChange={(e) => handleFilterChange("heightTo", e.target.value)}
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
                onClick={() => handleSort("name_mountain")}
              >
                Название горы {getSortIcon("name_mountain")}
              </th>
              <th
                scope="col"
                className="text-center"
                onClick={() => handleSort("name_height")}
              >
                Высота, м {getSortIcon("name_height")}
              </th>
              <th scope="col" className="text-center">
                Страны с этой горой
              </th>
              <th scope="col" className="text-center">
                Действие
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedMountains.map((mountain, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td className="text-center">{mountain.name_mountain}</td>
                <td className="text-center">{mountain.height_mountain}</td>
                <td className="text-center">
                  {mountain.countries_mountain.map(
                    (country) => country.name_country + " "
                  )}
                </td>

                <td className="text-center">
                  <Link
                    className="btn btn-outline-primary mx-2"
                    to={`/editmountain/${mountain.id_mountain}`}
                  >
                    Редактировать
                  </Link>
                  <button
                    className="btn btn-danger mx-2"
                    onClick={() => deleteMountain(mountain.id_mountain)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link className="btn btn-outline-dark" to="/addmountain">
          Добавить гору
        </Link>
      </div>
    </div>
  );
}
