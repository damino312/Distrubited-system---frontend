import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AddCountry from "../countries/AddCountry";
import { Modal, Button, Form } from "react-bootstrap";
import AddNationality from "../nationalities/AddNationality";
import EditNationality from "../nationalities/EditNationality";

export default function Nationality() {
  const [nationalities, setNationalities] = useState([]);
  const [filters, setFilters] = useState({
    searchNationality: "",
    sortField: "name_nationality",
    sortOrder: "asc",
  });
  const [idEdit, setIdEdit] = useState("");
  // для окна добавления
  const [showAddModal, setShowAddModal] = useState(false);
  // для окна добавления
  function handleAddModal(value) {
    setShowAddModal(value);
  }
  const [showEditModal, setEditModal] = useState(false);
  function handleEditModal(value, id) {
    setEditModal(value);
    setIdEdit(id);
  }
  // для окна добавления и редактирования
  const handleChangeNationality = () => {
    loadNationalities();
  };

  const { searchNationality, sortField, sortOrder } = filters;

  useEffect(() => {
    loadNationalities();
  }, []);

  const loadNationalities = async () => {
    const result = await axios.get("http://localhost:8080/nationalities");
    setNationalities(result.data);
  };

  const deleteNationality = async (id) => {
    await axios.delete(`http://localhost:8080/nationality/${id}`);
    loadNationalities();
  };
  // поиск
  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
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
  const filteredNationalities = nationalities.filter((nationality) => {
    // проверка поиска
    const searchByNationality = nationality.name_nationality
      .toLowerCase()
      .includes(searchNationality.toLowerCase());

    //если соответствует каждому полю то будет отображаться
    return searchByNationality;
  });
  // работа сортировка по столбцу
  const sortedNationalities = filteredNationalities.sort((a, b) => {
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
            value={searchNationality}
            onChange={(e) =>
              handleFilterChange("searchNationality", e.target.value)
            }
          />
        </div>
      </div>
      <div className="p-2">
        <table className="table rounded rounded-4 overflow-hidden border shadow ">
          <thead>
            <tr>
              <th scope="col" className="text-center">
                #
              </th>
              <th
                scope="col"
                className="text-center"
                onClick={() => handleSort("name_nationality")}
              >
                Национальность {getSortIcon("name_nationality")}
              </th>
              <th scope="col" className="text-center">
                Действие
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedNationalities.map((nationality, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td className="text-center">{nationality.name_nationality}</td>
                <td>
                  <Link
                    className="btn btn-outline-info mx-2 "
                    to={`/nationalityview/${nationality.id_nationality}`}
                  >
                    Информация
                  </Link>
                  <Button
                    onClick={() =>
                      handleEditModal(true, nationality.id_nationality)
                    }
                  >
                    Изменить
                  </Button>
                  <button
                    className="btn btn-outline-danger mx-2 "
                    onClick={() =>
                      deleteNationality(nationality.id_nationality)
                    }
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button onClick={() => handleAddModal(true)}>Добавить</Button>
        <AddNationality
          showModal={showAddModal}
          handleModal={handleAddModal}
          handleChangeNationality={handleChangeNationality}
        />
        <EditNationality
          showModal={showEditModal}
          handleModal={handleEditModal}
          handleChangeNationality={handleChangeNationality}
          idEdit={idEdit}
        />
      </div>
    </div>
  );
}
