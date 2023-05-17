import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Nationality() {
  const [nationalities, setNationalities] = useState([]);

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

  const widthContainer = {
    maxWidth: "760px",
  };

  const widthDelete = {
    width: "134px",
  };

  return (
    <div className="container w-50" style={widthContainer}>
      <table className="table border shadow ">
        <thead>
          <tr>
            <th scope="col" className="text-center">
              #
            </th>
            <th scope="col" className="text-center">
              Национальность
            </th>
            <th scope="col" className="text-center">
              Действие
            </th>
          </tr>
        </thead>
        <tbody>
          {nationalities.map((nationality, index) => (
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
                <Link
                  className="btn btn-outline-primary mx-2 "
                  to={`/editnationality/${nationality.id_nationality}`}
                >
                  Редактировать
                </Link>
                <button
                  className="btn btn-outline-danger mx-2 "
                  style={widthDelete}
                  onClick={() => deleteNationality(nationality.id_nationality)}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link className="btn btn-outline-dark" to="/addnationality">
        Добавить
      </Link>
    </div>
  );
}
