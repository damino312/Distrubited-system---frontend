import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [mountains, setMountains] = useState([]);

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

  return (
    <div className="container">
      <table className="table border shadow">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Название горы</th>
            <th scope="col">Высота, м</th>
            <th scope="col">Страны с этой горой</th>
            <th scope="col">Действие</th>
          </tr>
        </thead>
        <tbody>
          {mountains.map((mountain, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{mountain.name_mountain}</td>
              <td>{mountain.height_mountain}</td>
              <td>
                {mountain.countries_mountain.map(
                  (country) => country.name_country + " "
                )}
              </td>

              <td>
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
  );
}
