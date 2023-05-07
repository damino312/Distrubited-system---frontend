import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [lakes, setLakes] = useState([]);

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

  return (
    <div className="container">
      <table className="table border shadow">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Название озера</th>
            <th scope="col">Площадь, км²</th>
            <th scope="col">Страны с этим озером</th>
            <th scope="col">Действие</th>
          </tr>
        </thead>
        <tbody>
          {lakes.map((lake, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{lake.name_lake}</td>
              <td>{lake.area_lake}</td>
              <td>
                {lake.countries_lake.map(
                  (country) => country.name_country + " "
                )}
              </td>

              <td>
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
  );
}
