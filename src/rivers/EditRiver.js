import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import ListCountries from "../components/ListCountries";

export default function EditRiver() {
  let navigate = useNavigate();

  const { id } = useParams();

  const [river, setRiver] = useState({
    name_river: "",
    length_river: "",
    countries_river: [],
  });

  const [countries, setCountries] = useState([]);

  const { name_river, length_river } = river;

  useEffect(() => {
    loadRiver(id);
  }, []);

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    const result = await axios.get("http://localhost:8080/counties");
    setCountries(result.data);
  };

  const [checkedCountries, setCheckedCountries] = useState(""); // для передачи выбранных чекбоксом стран из дочернего элемента
  function passCheckedCountries(msg) {
    setCheckedCountries(msg);
  }

  const onInputChange = (e) => {
    setRiver({ ...river, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const updatedRiver = {
      ...river,
      countries_river: checkedCountries, // обновленное значение countries_river с данными из дочернего элемента, выбранными чекбоксами
    };
    await axios.put(`http://localhost:8080/river/${id}`, updatedRiver);
    navigate("/river");
    console.log(river);
  };

  const loadRiver = async () => {
    const result = await axios.get(`http://localhost:8080/river/${id}`);
    setRiver(result.data);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Добавить реку</h2>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="mb-3">
              <label htmlFor="name_river" className="form-label">
                Название реки
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Введите название реки"
                name="name_river"
                value={name_river}
                onChange={(e) => onInputChange(e)}
              ></input>
            </div>
            <div className="mb-3">
              <label htmlFor="length_river" className="form-label">
                Длина реки
              </label>
              <input
                type={"number"}
                maxLength="8"
                className="form-control"
                placeholder="Введите длину"
                name="length_river"
                value={length_river}
                onChange={(e) => onInputChange(e)}
              ></input>
            </div>
            <div className="mb-3">
              <label htmlFor="countries" className="form-label">
                Страны
              </label>
              {countries.length && ( // чтобы ListCountries рендерилась один раз
                <ListCountries
                  countries={countries}
                  passCheckedCountries={passCheckedCountries}
                  checks={river.countries_river.map((elem) => elem.id_country)} // чтобы выставить чекбоксы при редактировании автоматически
                />
              )}
            </div>
            <button type="submit" className="btn btn-outline-primary">
              Подтвердить
            </button>
            <Link className="btn btn-outline-danger mx-2" to="/river">
              Отменить
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
