import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ListCountries from "../components/ListCountries";

export default function AddMountain() {
  let navigate = useNavigate();

  const [checkedCountries, setCheckedCountries] = useState("");

  const [countries, setCountries] = useState([]);

  const [mountain, setMountain] = useState({
    name_mountain: "",
    height_mountain: "",
    countries_mountain: [],
  });
  const { name_mountain, height_mountain } = mountain;

  useEffect(() => {
    loadCountries();
  }, []);

  function passCheckedCountries(msg) {
    // для передачи выбранных чекбоксом стран из дочернего элемента
    msg.forEach((element) => {
      // толи цикл возникает из за этого поля, толи что то другое, поэтому удаляю
      delete element.populations;
    });
    setCheckedCountries(msg);
  }

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
      countries_mountain: checkedCountries, // обновленное значение countries_river с данными из дочернего элемента, выбранными чекбоксами
    };
    await axios.post("http://localhost:8080/mountain", updatedMountain);
    navigate("/mountain");
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Добавить гору</h2>
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
                placeholder="Введите высоту, м"
                name="height_mountain"
                value={height_mountain}
                onChange={(e) => {
                  e.target.value = e.target.value.slice(0, 6);
                  onInputChange(e);
                }}
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
