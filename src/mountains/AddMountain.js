import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ListCountries from "../components/ListCountries";

export default function AddMountain() {
  let navigate = useNavigate();

  const [checkedCountries, setCheckedCountries] = useState("");
  function passCheckedCountries(msg) {
    setCheckedCountries(msg);
  }

  const [countries, setCountries] = useState([]);

  const [mountain, setMountain] = useState({
    name_mountain: "",
    height_mountain: "",
    countries_mountain: [],
  });
  const { name_mountain, height_mountain, countries_mountain } = mountain;

  useEffect(() => {
    loadCountries();
  });

  const loadCountries = async () => {
    const result = await axios.get("http://localhost:8080/counties");
    setCountries(result.data);
  };

  const onInputChange = (e) => {
    setMountain({ ...mountain, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const updatedMountain = {
      ...mountain,
      countries_mountain: checkedCountries, // обновленное значение countries_mountain, все что выбрано чекбоксом идем в countries_mountain
    };
    console.log(updatedMountain);
    await axios.post("http://localhost:8080/mountain", updatedMountain);
    navigate("/mountain");
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Добавить Гору</h2>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="mb-3">
              <label htmlFor="name_mountain" className="form-label">
                Название горы
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Введите название горы"
                name="name_mountain"
                value={name_mountain}
                onChange={(e) => onInputChange(e)}
              ></input>
            </div>
            <div className="mb-3">
              <label htmlFor="height_mountain" className="form-label">
                Высота горы
              </label>
              <input
                type={"number"}
                className="form-control"
                placeholder="Введите высоту"
                name="height_mountain"
                value={height_mountain}
                onChange={(e) => onInputChange(e)}
              ></input>
            </div>
            <div className="mb-3">
              <label htmlFor="countries" className="form-label">
                Страны
              </label>

              <ListCountries
                countries={countries}
                passCheckedCountries={passCheckedCountries}
              />
            </div>
            <button type="submit" className="btn btn-outline-primary">
              Подтвердить
            </button>
            <Link className="btn btn-outline-danger mx-2" to="/mountain">
              Отменить
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
