import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ListCountries from "../components/ListCountries";

export default function AddLake() {
  let navigate = useNavigate();

  const [checkedCountries, setCheckedCountries] = useState("");

  const [countries, setCountries] = useState([]);

  const [lake, setLake] = useState({
    name_lake: "",
    area_lake: "",
    countries_lake: [],
  });
  const { name_lake, area_lake } = lake;

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
    setLake({ ...lake, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const updatedLake = {
      ...lake,
      countries_lake: checkedCountries, // обновленное значение countries_lake с данными из дочернего элемента, выбранными чекбоксами
    };
    console.log(updatedLake);
    await axios.post("http://localhost:8080/lake", updatedLake);
    navigate("/lake");
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Добавить озеро</h2>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="mb-3">
              <label htmlFor="name_lake" className="form-label">
                Название озера
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Введите название озера"
                name="name_lake"
                value={name_lake}
                onChange={(e) => onInputChange(e)}
              ></input>
            </div>
            <div className="mb-3">
              <label htmlFor="area_lake" className="form-label">
                Площадь озера
              </label>
              <input
                type={"number"}
                className="form-control"
                placeholder="Введите площадь"
                name="area_lake"
                value={area_lake}
                onChange={(e) => {
                  e.target.value = e.target.value.slice(0, 7);
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
            <Link className="btn btn-outline-danger mx-2" to="/lake">
              Отменить
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
