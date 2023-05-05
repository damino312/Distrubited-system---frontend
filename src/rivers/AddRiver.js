import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ListCountries from "../components/ListCountries";

export default function AddRiver() {
  let navigate = useNavigate();

  const [checkedCountries, setCheckedCountries] = useState("");

  const [countries, setCountries] = useState([]);

  const [river, setRiver] = useState({
    name_river: "",
    length_river: "",
    countries_river: [],
  });
  const { name_river, length_river, countries_river } = river;

  useEffect(() => {
    loadCountries();
  }, []);

  function passCheckedCountries(msg) {
    // для передачи выбранных чекбоксом стран из дочернего элемента
    setCheckedCountries(msg);
  }

  const loadCountries = async () => {
    const result = await axios.get("http://localhost:8080/counties");
    setCountries(result.data);
  };

  const onInputChange = (e) => {
    setRiver({ ...river, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const updatedRiver = {
      ...river,
      countries_river: checkedCountries, // обновленное значение countries_river с данными из дочернего элемента, выбранными чекбоксами
    };
    console.log(updatedRiver);
    await axios.post("http://localhost:8080/river", updatedRiver);
    navigate("/river");
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
                className="form-control"
                placeholder="Введите длину"
                name="length_river"
                maxLength="8"
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
