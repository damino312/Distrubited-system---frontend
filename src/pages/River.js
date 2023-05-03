import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [rivers, setRivers] = useState([]);

  useEffect(() => {
    loadRivers();
  });

  const loadRivers = async () => {
    const result = await axios.get("http://localhost:8080/rivers");
    setRivers(result.data);
  };

  const deleteRiver = async (id) => {
    await axios.delete(`http://localhost:8080/river/${id}`);
    loadRivers();
  };

  return (
    <div className="container">
      <table className="table border shadow">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Название реки</th>
            <th scope="col">Длина, км</th>
            <th scope="col">Страны с этой рекой</th>
            <th scope="col">Действие</th>
          </tr>
        </thead>
        <tbody>
          {rivers.map((river, index) => (
            <tr>
              <th scope="row" key={index}>
                {index + 1}
              </th>
              <td>{river.name_river}</td>
              <td>{river.length_river}</td>
              <td>
                {river.countries.map((country) => country.name_country + " ")}
              </td>

              <td>
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
  );
}
